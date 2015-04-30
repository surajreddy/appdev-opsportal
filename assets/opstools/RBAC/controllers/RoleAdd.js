
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'opstools/RBAC/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//opstools/RBAC/views/RoleAdd/RoleAdd.ejs',
function(){

    //
    // RoleAdd 
    // 
    // This is the interface for managing the form for adding a new Role
    //
    //

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.RBAC.RoleAdd', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/RBAC/views/RoleAdd/RoleAdd.ejs'
                    eventCancel:'cancel',
                    eventRoleAdded: 'role.added'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

            //// Create a Form for our Add Role
            this.form = new AD.op.Form(this.element);
            this.form.bind( AD.Model.get('opstools.RBAC.PermissionRole'));
            this.form.addField('actions', 'array', {});
            this.form.attach();

        },



        show:function() {
            this._super();
            this.form.clear(true);
        },



        // they click on the [cancel] button
        '.rbac-roles-addrole-cancel click': function ($el, ev) {

            // emit the RoleAdd event:
            this.element.trigger( this.options.eventCancel );
            ev.preventDefault();
        },



        // they click on the [create] button
        '.rbac-roles-addrole-create click': function ($el, ev) {
            var _this = this;


            if (this.form.isValid()) {

                var obj = this.form.values();

                // repackage into server side format:
                var data = {};

                data.translations = [
                    { 
                        language_code: AD.lang.currentLanguage,
                        role_label:obj.role_label, 
                        role_description:obj.role_description
                    }
                ]
                var Role = AD.Model.get('opstools.RBAC.PermissionRole');
                Role.create(data)
                .fail(function(err){
                    if (!_this.form.errorHandle(err)) {
//// TODO: handle unknown Error event:
console.error('... unknown error! (Role Add Create) :', err);
                    }
                })
                .then(function(newRole){

                    // ok, the newRole doesn't have the embedded translations
                    // and associated role info.  So, perform a .findOne to get
                    // all that data filled out:

                    Role.findOne({id:newRole.id})
                    .then(function(fullRole) {

                        fullRole.translate();   // translate it!

                        // now it should look like all the others

                        console.log('*** new Role:', fullRole);
                        // emit the RoleAdd event:
                        _this.element.trigger( _this.options.eventRoleAdded, fullRole );

                    })


                })

            }
            
            ev.preventDefault();
        }


    });


});