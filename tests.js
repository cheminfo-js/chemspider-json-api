'use strict';
const chemspider = require('.');

describe('test queries', function () {
    it('Simple request that returns a rid', function () {
        return chemspider.query('SimpleSearch', {searchOptions: {QueryText: 'CCC'}}).then(function(data) {
            // We expect a rid
            data.length.should.equal(36);
        });
    });

    it('Request that pings chemspider until rid has a value', function () {
        return chemspider.simpleSearchCompounds({
            searchOptions:{
                QueryText: 'Aspirin'
            }
        }).then(console.log);
    });
});