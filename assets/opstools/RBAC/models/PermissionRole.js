steal(
        'appdev',
        'opstools/RBAC/models/base/PermissionRole.js'
).then( function(){

    // Namespacing conventions:
    // AD.Model.extend('[application].[Model]', {static}, {instance} );  --> Object
    AD.Model.extend('opstools.RBAC.PermissionRole', {
/*
        findAll: 'GET /permissionrole',
        findOne: 'GET /permissionrole/{id}',
        create:  'POST /permissionrole',
        update:  'PUT /permissionrole/{id}',
        destroy: 'DELETE /permissionrole/{id}',
        describe: function() {},   // returns an object describing the Model definition
        fieldId: 'id',             // which field is the ID
        fieldLabel:'null'      // which field is considered the Label
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