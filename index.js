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
            return this.getCollection(dbName, collectionName).aggregate( this.makeAggregation(where, options) ).toArray();
        } else {
            return Error("Can't connect to database.");
        }
    }

    find(dbName, collectionName, where = {}, options = {}) {
        return this.queryDatabase(dbName, collectionName, where, options);
    }

    makeAggregation(where, options) {
        let aggregation = [];

        if (where) {
            aggregation = this.optionAggregate('match', where);
        }
        if (options.include) {
            aggregation = aggregation.concat( this.includeAggregate(options.include) );
        }
        if (options.limit) {
            aggregation = aggregation.concat( this.optionAggregate('limit', options.limit) );
        }
        if (options.skip) {
            aggregation = aggregation.concat( this.optionAggregate('skip', options.skip) );
        }
        if (options.sort) {
            aggregation = aggregation.concat( this.optionAggregate('sort', options.sort) );
        }
        
        return aggregation;
    }

    optionAggregate(label, content) {
        return [{
            [`$${label}`]: content
        }];
    }

    includeAggregate(include) {
        return include.map(relation => {
            return { 
                $lookup: {
                  from: relation.model,
                  localField: relation.foreignKey,
                  foreignField: '_id',
                  as: relation.field
                }
            }
        });
    }
}