'use strict';
const chemspider = require('..');

describe('test queries', function () {
    it('Simple request that returns a rid', function () {
        return chemspider.query('SimpleSearch', {searchOptions: {QueryText: 'CCC'}}).then(function(data) {
            // We expect a rid
            data.length.should.equal(36);
        });
    });

    it('Search compounds (SimpleSearch)', function () {
        return chemspider.search({
            searchMethod: 'SimpleSearch',
            searchOptions: {
                searchOptions: {
                    QueryText: 'CCCCC'
                }
            }
        });
    });

    it('Should use a valid default search and result method', function () {
        return chemspider.search({
            searchOptions: {
                searchOptions: {
                    QueryText: 'CCCCC'
                }
            }
        });
    });


    it('Invalid search method should fail', function () {
        return chemspider.search({searchMethod: 'InvalidSearchMethod'}).should.be.rejectedWith(/Invalid search method/);
    });

    it('Invalid result method should fail', function () {
        return chemspider.search({resultMethod: 'InvalidResultMethod'}).should.be.rejectedWith(/Invalid result method/);
    });
});