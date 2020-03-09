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
    if (options.fields) {
        aggregation = aggregation.concat( fieldsAggregate(options.fields) );
    }
    
    return aggregation;
}

function optionAggregate(label, content) {
    return [{
        [`$${label}`]: content
    }];
}

function fieldsAggregate(fields) {
    let $project = {};

    fields.forEach(field => {
        $project = Object.assign($project, {[field]: 1});
    });

    return [{$project}];
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