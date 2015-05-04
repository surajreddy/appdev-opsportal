steal(
        'appdev'
).then( function(){

    // Namespacing conventions:
    // AD.Model.Base.extend("[application].[Model]" , { static }, {instance} );  --> Object
    AD.Model.Base.extend("opstools.RBAC.PermissionAction", {
        findAll: 'GET /appdev-core/permissionaction',
        findOne: 'GET /appdev-core/permissionaction/{id}',
        create:  'POST /appdev-core/permissionaction',
        update:  'PUT /appdev-core/permissionaction/{id}',
        destroy: 'DELETE /appdev-core/permissionaction/{id}',
        describe: function() {
            return {
                action_key:'string',
                action_description: 'text'
            };
        },
        validations: {
            "action_key" : [ 'notEmpty' ],
            "action_description" : [ 'notEmpty' ]
        },
        fieldId:'id',
        fieldLabel:'null'
    },{
        model: function() {
            return AD.Model.get('opstools.RBAC.PermissionAction');
        },
        getID: function() {
            return this.attr(this.model().fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(this.model().fieldLabel) || 'unknown label field';
        },
        translate:function( lang_code ) {
            var _this = this;
            lang_code = lang_code || AD.lang.currentLanguage;
            var fields = ['action_description'];
            if (this.translations) {
                this.translations.forEach(function(trans){ 
                    if (trans.language_code == lang_code) {
                        fields.forEach(function(f){
                            _this[f] = trans[f];
                        })
                    }
                });
            }
        }
    });


});