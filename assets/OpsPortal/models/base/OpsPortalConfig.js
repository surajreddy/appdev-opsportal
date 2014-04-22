steal(
        'appdev'
).then( function(){


    AD.models_base.OpsPortalConfig = can.Model.extend({
        findAll: 'GET /opsportal/config',
        findOne: 'GET /opsportal/config',
//        create:  'POST /opsportalconfig/create',
//        update:  'PUT /opsportalconfig/update/{id}',
//        destroy: 'DELETE /opsportalconfig/destroy/{id}.json',
        describe: function() {
            return {
          "areas": "String",
          "tools": "String"
};
        },
        fieldId:'id',
        fieldLabel:'areas'
    },{
        model: function() {
            return AD.models.OpsPortalConfig;
        },
        getID: function() {
            return this.attr(AD.models.OpsPortalConfig.fieldId) || 'unknown id field';
        },
        getLabel: function() {
            return this.attr(AD.models.OpsPortalConfig.fieldLabel) || 'unknown label field';
        }
    });


});