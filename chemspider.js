'use strict';

const superagent = require('superagent');
const constants = require('./constants');


exports = module.exports = {
    query: function (operation, options) {
        if (!operation) throw new Error('Operation paramater is mandatory');
        options = Object.assign({}, options);
        var queryUrl = constructUrl(operation, options);
        return superagent.get(queryUrl).then(res => res.text);
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

    search: function(options) {
        options = options || {};
        var searchMethod = options.searchMethod || 'SimpleSearch';
        var resultMethod = options.resultMethod || 'GetSearchResultAsCompounds';
        var searchOptions = options.searchOptions || {};
        var resultOptions = options.resultOptions || {};

        // We expect a search searchMethod that returns a cid
        if(!constants.searchMethods.includes(searchMethod)) {
            return Promise.reject(new Error('Invalid search method'));
        }

        if(!constants.resultMethods.includes(resultMethod)) {
            return Promise.reject(new Error('Invalid result method'));
        }

        return exports.query(searchMethod, searchOptions).then(rid => {
            return exports.queryWithRid(resultMethod, Object.assign({}, resultOptions, {
                rid: rid
            }));
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

function constructUrl(operation, options, url) {
    var root = false;
    if (!url) {
        root = true;
        url = constants.chemspiderUrl + `?op=${operation}`;
    }
    var type = getType(options);
    if (type === 'Object') {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            if (root) {
                url = constructUrl(keys[i], options[keys[i]], url);
            } else {
                url = constructUrl(`${operation}.${keys[i]}`, options[keys[i]], url);
            }

        }
    } else if (type === 'Array') {
        for (var i = 0; i < options.length; i++) {
            url = url + `&${operation}[${i}]=${options[i]}`;
        }
    } else {
        url = url + `&${operation}=${options}`
    }
    return url;
}



