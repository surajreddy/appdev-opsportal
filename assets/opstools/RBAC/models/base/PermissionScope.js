steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.RBAC.PermissionScope", {
        findAll: 'GET /appdev-core/permissionscope',
        findOne: 'GET /appdev-core/permissionscope/{id}',
        create:  'POST /appdev-core/permissionscope',
        update:  'PUT /appdev-core/permissionscope/{id}',
        destroy: 'DELETE /permissionscope/{id}',
        describe: function() {
            return {
                "label": "string"
            };
        },
        fieldId:'id',
        fieldLabel:'label'
    },{
        model: function() {
            return AD.Model.get('opstools.RBAC.PermissionScope'); //AD.models.opstools.RBAC.PermissionScope;
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        }
    });


});