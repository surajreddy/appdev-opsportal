steal(
        'appdev',
        'OpsPortal/models/base/OpsPortalConfig.js'
).then( function(){


    AD.models.OpsPortalConfig = AD.models_base.OpsPortalConfig.extend({
/*
         findAll: 'GET /opsportalconfig',
        findOne: 'GET /opsportalconfig/{id}',
        create:  'POST /opsportalconfig/create',
        update:  'PUT /opsportalconfig/update/{id}',
        destroy: 'DELETE /opsportalconfig/destroy/{id}.json',
        describe: function() {},   // returns an object describing the Model definition
        fieldId: 'fieldName',       // which field is the ID
        fieldLabel:'fieldName'      // which field is considered the Label
*/
    },{
/*
        // Already Defined:
        model: function() {},   // returns the Model Class for an instance
        getID: function() {},   // returns the unique ID of this row
        getLabel: function() {} // returns the defined label value
*/
    });


});