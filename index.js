"use strict";

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
            return this.getCollection(dbName, collectionName).find(where, options).toArray();
        } else {
            return Error("Can't connect to database.")
        }
    }

    find(dbName, collectionName, where = {}, options = {}) {
        return this.queryDatabase(dbName, collectionName, where, options);
    }
}