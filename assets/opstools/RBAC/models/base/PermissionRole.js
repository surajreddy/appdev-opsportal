steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.RBAC.PermissionRole", {
        findAll: 'GET /appdev-core/permissionrole',
        findOne: 'GET /appdev-core/permissionrole/{id}',
        create:  'POST /appdev-core/permissionrole',
        update:  'PUT /appdev-core/permissionrole/{id}',
        destroy: 'DELETE /appdev-core/permissionrole/{id}',
        describe: function() {
            return {
                role_label : 'string'
            };
        },
        fieldId:'id',
        fieldLabel:'role_label'
    },{
        model: function() {
            return AD.Model.get('opstools.RBAC.PermissionRole'); //AD.models.opstool.RBAC.PermissionRole;
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        }
    });


});