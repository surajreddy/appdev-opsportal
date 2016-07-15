var assert = require('chai').assert;


var AD = require('ad-utils');
var _  = require('lodash');
var request = null; 


var oldLog = null;


describe('OPSPortal.NavBar.ToolDefinition.create', function() {

    before(function(done) {
        
        oldLog = ADCore.error.log;
        ADCore.error.log = function() {};  // suppress error logs.

        // request = AD.test.request(function(err){
        //     done(err);
        // });
        done();

    });

    after(function(done){
        ADCore.error.log = oldLog;
        done();
    })

    // it should 
    it('should return true for our defined test area : ', function(done) {

        var numCalled = 0;
        function onDone (){
            numCalled++;
            if (numCalled >= 2) {
                done();
            }
        }

        // OPSPortal.NavBar.Area.exists('test-area', function(err, isThere){

        //     assert.isNull(err, ' should not have returned an error.');
        //     assert.isBoolean(isThere, ' should have returned a bool ');
        //     assert.ok(isThere, ' should have found our entry.');
        //     onDone();
        // })
        // .fail(function(err){
        //     assert.ok(false, ' should not have gotten here.');
        //     onDone();
        // })
        // .then(function(isThere){
        //     assert.isBoolean(isThere, ' should have returned a bool ');
        //     assert.ok(isThere, ' should have found our entry.');
        //     onDone();
        // });

    });


});



describe('OPSPortal.NavBar.ToolDefinition.exists', function() {

    before(function(done) {

        oldLog = ADCore.error.log;
        ADCore.error.log = function() {};  // suppress error logs.

        done();
    });

    after(function(done){
        ADCore.error.log = oldLog;
        done();
    })



});



describe('OPSPortal.NavBar.ToolDefinition.setup', function() {

    before(function(done) {

        oldLog = ADCore.error.log;
        ADCore.error.log = function() {};  // suppress error logs.

        done();
    });

    after(function(done){
        ADCore.error.log = oldLog;
        done();
    })



});



describe('OPSPortal.NavBar.ToolDefinition.setupPath', function() {

    before(function(done) {

        oldLog = ADCore.error.log;
        ADCore.error.log = function() {};  // suppress error logs.

        done();
    });

    after(function(done){
        ADCore.error.log = oldLog;
        done();
    })



});



describe('OPSPortal.NavBar.ToolDefinition.update', function() {

    before(function(done) {

        oldLog = ADCore.error.log;
        ADCore.error.log = function() {};  // suppress error logs.

        done();
    });

    after(function(done){
        ADCore.error.log = oldLog;
        done();
    })



});



//////
////// Some Utility fn()
//////
