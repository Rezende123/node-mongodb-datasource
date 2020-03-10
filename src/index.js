"use strict";
const makeAggregation = require('./aggregation');

module.exports = class Datasource {

    constructor(url) {
        this.MongoClient = require('mongodb').MongoClient;
        this.database = null;
        this.connectToDatabase();

        this.connectionUrl = url;
    }

    set connectionUrl(url) {
        this.urlConnection = url;
    }
    get connectionUrl() {
        return this.urlConnection;
    } 

    getCollection(dbName, collectionName) {
        return this.database.db(dbName).collection(collectionName);
    }

    connectToDatabase (uri = this.connectionUrl) {
        if (this.database) {
            return Promise.resolve(this.database);
        }

        return this.MongoClient.connect(uri, { useUnifiedTopology: true })
            .then(db => {
                this.database = db;
                return this.database;
            })
            .catch(err => Error(err));
    }

    queryDatabase (dbName, collectionName, where = {}, options = {}) {
        if (this.database) {
            return this.getCollection(dbName, collectionName).aggregate( makeAggregation(where, options) ).toArray();
        } else {
            return Error("Can't connect to database.");
        }
    }

    find(dbName, collectionName, where = {}, options = {}) {
        return this.queryDatabase(dbName, collectionName, where, options);
    }

    updateById(dbName, collectionName, data, $unset) {
        const _id = data._id;
        delete data._id;
        delete data.id;

        let options = {$set: data};

        if ($unset) {
            options = Object.assign(options, {$unset});
        }
        
        return this.getCollection(dbName, collectionName).updateOne({_id}, options);
    }

    deleteById(dbName, collectionName, _id) {
        return this.getCollection(dbName, collectionName).deleteOne({_id});
    }
}