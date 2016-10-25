'use strict';

const superagent = require('superagent');
const chemspiderUrl = `https://www.cheminfo.org/chemspider/JSON.ashx`;

exports = module.exports = {
    query: function (operation, options) {
        if (!operation) throw new Error('Operation paramater is mandatory');
        options = options || {};
        var queryUrl = chemspiderUrl + `?op=${operation}`;
        return superagent.post(queryUrl).send(options).then(res => res.text);
    },

    queryWithRid: function (operation, options) {
        var interval = 100;
        var rep = 0;
        var maxRep = 10;
        return exports.queryJSON(operation, options).then(null, handleError);

        function handleError(err) {
            rep++;
            if (rep === maxRep) return Promise.reject(err);
            return wait(interval)
                .then(() => exports.queryJSON(operation, options))
                .then(null, handleError);
        }
    },

    queryJSON: function (operation, options) {
        return exports.query(operation, options).then(text => JSON.parse(text));
    },

    simpleSearchCompounds: function (options) {
        return exports.query('SimpleSearch', options).then(rid => {
            return exports.queryWithRid('GetSearchResult', {
                rid: rid
            });
        }).then(csids => {
            return exports.query('GetRecordsAsCompounds', {
                csids: csids
            });
        });
    }
};

function wait(ms, val) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(val);
        }, ms);
    });
}

function getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
}





