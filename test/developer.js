var assert = require('assert');
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var config = require('./configure.js');
var apigeeEdge = require('../');

var client = new apigeeEdge.client({
  'orgName'  : config.apigeeEdgeCredentials.orgName,
  'userName' : config.apigeeEdgeCredentials.userName,
  'password' : config.apigeeEdgeCredentials.password
});

var developer = new apigeeEdge.developer({ client: client });

describe('Developer', function() {

  describe('Load All Developers from Org', function() {
    it('Get All Developers : should return error null & ..', function(done) {
      developer.getOrgDevelopersList(function(error, data) {
        expect(error).equal(null);
        done();
      });
    })
  });

  describe('Developer CRUD Operations', function() {
    this.timeout(10000);
    function randomText() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for( var i=0; i < 10; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    var createDeveloperData = {
      "email" : randomText() + "@" + randomText() + ".com",
      "firstName" : randomText(),
      "lastName" :  randomText(),
      "userName" :  randomText(),
      "attributes" : [
        {
          "name" : randomText(),
          "value" : randomText()
        },
        {
          "name" : randomText(),
          "value" : randomText()
        }
      ]
    };

    var updateDeveloperData = {
      "email" : createDeveloperData.email,
      "firstName" : randomText(),
      "lastName" :  randomText(),
      "userName" :  randomText(),
      "attributes" : [
        {
          "name" : randomText(),
          "value" : randomText()
        },
        {
          "name" : randomText(),
          "value" : randomText()
        }
      ]
    };


    it('Create Developer : should return error null & same email used for create developer call.', function(done) {
      developer.createDeveloper(createDeveloperData, function(error, data) {
        createDeveloperData.developerId = data.developerId;
        expect(createDeveloperData.developerId).not.equal(null);
        expect(error).equal(null);
        expect(data.email).equal(createDeveloperData.email);
        done();
      });
    });

    it('Get Developer Details : should return error null & ..', function(done) {
      developer.getDeveloper(createDeveloperData.email, function(error, data) {
        expect(error).equal(null);
        expect(data.email).equal(createDeveloperData.email);
        done();
      });
    });

    it('Set Developer Status to Inactive : should return error null & ..', function(done) {
      developer.setDeveloperStatus(createDeveloperData.email, 'inactive', function(error, data) {
        expect(error).equal(null);
        done();
      });
    });

    it('Set Developer Status to Active : should return error null & ..', function(done) {
      developer.setDeveloperStatus(createDeveloperData.email, 'active', function(error, data) {
        expect(error).equal(null);
        done();
      });
    });

    // Developer Attribute CRUD Tests
    it('Get Developer Attribute : should return error null & attribute value should match original.', function(done) {
      developer.getDeveloperAttribute(createDeveloperData.email, createDeveloperData.attributes[0].name, function(error, data) {
        expect(error).equal(null);
        expect(data.value).equal(createDeveloperData.attributes[0].value);
        done();
      });
    });

    it('Get All Developer Attributes : should return error null.', function(done) {
      developer.getAllDeveloperAttributes(createDeveloperData.email, function(error, data) {
        expect(error).equal(null);
        done();
      });
    });

    it('Update Developer Attribute : should return error null & value should match updated value.', function(done) {
      developer.updateDeveloperAttribute(createDeveloperData.email, createDeveloperData.attributes[0].name, 'updatedValue', function(error, data) {
        expect(error).equal(null);
        expect(data.value).equal('updatedValue');
        done();
      });
    });

    it('Delete Developer Attribute : should return error null & response should match with deleting developer attribute value.', function(done) {
      developer.deleteDeveloperAttribute(createDeveloperData.email, createDeveloperData.attributes[0].name, function(error, data) {
        expect(error).equal(null);
        expect(data.value).equal('updatedValue');
        done();
      });
    });

    it('Update All Developer Attributes : should return error null', function(done) {
      developer.updateAllDeveloperAttributes(createDeveloperData.email, createDeveloperData.attributes, function(error, data) {
        expect(error).equal(null);
        done();
      });
    });

    it('Update Developer Details : should return error null & update firstname', function(done) {
      developer.updateDeveloper(updateDeveloperData, function(error, data) {
        expect(error).equal(null);
        expect(data.firstName).equal(updateDeveloperData.firstName);
        done();
      });
    });

    it('Update Developer Details : should return error null & update email', function(done) {
        updateDeveloperData.developerId = createDeveloperData.developerId;
        updateDeveloperData.email = randomText()+"@"+randomText()+".com";
        developer.updateDeveloper(updateDeveloperData, function(error, data) {
            expect(error).equal(null);
            expect(data.email).equal(updateDeveloperData.email);
            done();
        });
    });

    it('Update Developer Details : should return error null when calling without developerId field', function(done) {
        delete updateDeveloperData.developerId;
        developer.updateDeveloper(updateDeveloperData, function(error, data) {
            expect(error).equal(null);
            done();
        });
    });

    it('Delete Developer : should return error null & response should match with deleting developer email address.', function(done) {
      developer.deleteDeveloper(updateDeveloperData.email, function(error, data) {
        expect(error).equal(null);
        expect(data.email).equal(updateDeveloperData.email);
        done();
      });
    });
  });
});
