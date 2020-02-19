module.exports = function makeAggregation(where, options) {
    let aggregation = [];

    if (where) {
        aggregation = optionAggregate('match', where);
    }
    if (options.include) {
        aggregation = aggregation.concat( includeAggregate(options.include) );
    }
    if (options.limit) {
        aggregation = aggregation.concat( optionAggregate('limit', options.limit) );
    }
    if (options.skip) {
        aggregation = aggregation.concat( optionAggregate('skip', options.skip) );
    }
    if (options.sort) {
        aggregation = aggregation.concat( optionAggregate('sort', options.sort) );
    }
    
    return aggregation;
}

function optionAggregate(label, content) {
    return [{
        [`$${label}`]: content
    }];
}

function includeAggregate(include) {
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