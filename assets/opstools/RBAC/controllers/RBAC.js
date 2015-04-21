
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'opstools/RBAC/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        'opstools/RBAC/controllers/Users.js',
        'opstools/RBAC/controllers/Roles.js',
        '//opstools/RBAC/views/RBAC/RBAC.ejs',
function(){


    //
    // RBAC 
    // 
    // This is the OpsPortal Roles Based Access Control interface.
    //
    // This RBAC Controller is responsible for setting up the Application's
    // subcontrollers and managing the interactions between them.
    //

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.OpsTool.extend('RBAC', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/RBAC/views/RBAC/RBAC.ejs'
            }, options);
            this.options = options;

            // Call parent init
            // AD.classes.UIController.prototype.init.apply(this, arguments);
            this._super(element, options);

            this.portals = {};  // a hash of portals managed by RBAC:

            this.initDOM();


            // default to User portal:
            this.portalShow('users');
        },



        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));


            // attach the Users Controller
            var Users = AD.Control.get('opstools.RBAC.Users');
            this.portals.Users = new Users(this.element.find('.rbac-users'));

            // attach the Roles Controller
            var Roles = AD.Control.get('opstools.RBAC.Roles');
            this.portals.Roles = new Roles(this.element.find('.rbac-roles'));

        },



        portalShow: function(portalKey) {

            for (var p in this.portals) {
                if (p.toLowerCase() == portalKey.toLowerCase()) {

                    this.portals[p].show();
                } else {
                    this.portals[p].hide();
                }
            }

        },



        '.rbac-menu click': function ($el, ev) {

            var portal = $el.attr('portal');
            this.portalShow(portal);

            ev.preventDefault();
        }


    });


});