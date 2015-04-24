
steal(
        // List your Controller's dependencies here:
        'appdev',

        'opstools/RBAC/models/SiteUser.js',
        // 'opstools/RBAC/models/Permission.js',
        'opstools/RBAC/models/PermissionRole.js',
        'opstools/RBAC/models/PermissionScope.js',

        'opstools/RBAC/controllers/Users.js',
        'opstools/RBAC/controllers/UserAssignmentAdd.js',
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


        CONST: {
            ASSIGNMENTADD   : 'Assignment.Add',
            ASSIGNMENTADDED : 'Assignment.Added'
        }, 


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

            this.data = {};     // hold any data we are working with.
            this.data.permissions = [];  // all permission fields
            this.data.roles = [];   // all the roles in the system
            this.data.scopes = [];  // all the scopes in the db


            this.initDOM();
            this.initEvents();

            this.loadData();

            // default to User portal:
            this.portalShow('users');
        },



        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));


            // attach the Users Controller
            var Users = AD.Control.get('opstools.RBAC.Users');
            this.portals.Users = new Users(this.element.find('.rbac-users'), { eventAssignmentAdd:this.CONST.ASSIGNMENTADD });

            var UserAssignmentAdd = AD.Control.get('opstools.RBAC.UserAssignmentAdd');
            this.portals.UserAssignmentAdd = new UserAssignmentAdd(this.element.find('.rbac-addassignments'), { eventAssignmentAdded:this.CONST.ASSIGNMENTADDED });

            // attach the Roles Controller
            var Roles = AD.Control.get('opstools.RBAC.Roles');
            this.portals.Roles = new Roles(this.element.find('.rbac-roles'));

        },



        initEvents: function () {
            var _this = this;

            // The Users Controller will publish a AssignmentAdd 
            // event when that [+] icon is pressed.
            this.portals.Users.element.on(this.CONST.ASSIGNMENTADD, function(event, user) {

                console.log(' ... User Assignment Add : ', user);
                _this.portals.UserAssignmentAdd.loadUser(user);
                _this.portals.UserAssignmentAdd.__from = 'Users';  // mark the portal/controller we came from

//// LEFT OFF:
//// update display for given user,

                _this.portalShow('UserAssignmentAdd');
            })


            // The UserAssignmentAdd Controller will publish a AssignmentAdded 
            // event either [Save] or [Cancel] is processed.
            this.portals.UserAssignmentAdd.element.on(this.CONST.ASSIGNMENTADDED, function(event, permission) {

                console.log(' ... User Assignment Add Return ');

                // if a permission was created, then
                if (permission) {

                    // load the new permission
                    _this.portals.Users.loadData( permission.id ); // load the new permission
                    _this.portals.Users.refresh();                  

                }

                // return us to the controller we came from
                _this.portalShow(_this.portals.UserAssignmentAdd.__from);
            })

        },



        loadData: function() {
            var _this = this;

            var User = AD.Model.get('opstools.RBAC.SiteUser');
            User.findAll()
            .fail(function(err){
//// TODO: handle Error properly!
            })
            .then(function(list){
                _this.portals.Users.loadUsers(list);
            })


            var Roles = AD.Model.get('opstools.RBAC.PermissionRole');
            Roles.findAll()
            .fail(function(err){
//// TODO: handle Error properly!
            })
            .then(function(list){
                // make sure they are all translated.
                list.forEach(function(l){
                    l.translate();
                })
                _this.portals.Users.loadRoles(list);
                _this.portals.UserAssignmentAdd.loadRoles(list);
                _this.data.roles = list;    
            })


            var Scopes = AD.Model.get('opstools.RBAC.PermissionScope');
            Scopes.findAll()
            .fail(function(err){
//// TODO: handle Error properly!
            })
            .then(function(list){
                // // make sure they are all translated.
                // list.forEach(function(l){
                //     l.translate();
                // })
                _this.portals.Users.loadScopes(list);
                _this.portals.UserAssignmentAdd.loadScopes(list);
                _this.data.scopes = list;    // all the 
            })


//             var Permissions = AD.Model.get('opstools.RBAC.Permission');
//             Permissions.findAll()
//             .fail(function(err){
// //// TODO: handle Error properly!
//             })
//             .then(function(list){
//                 _this.data.permissions = list;
//             })

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