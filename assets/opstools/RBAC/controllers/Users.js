
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/RBAC/models/SiteUser.js',
        'opstools/RBAC/models/Permission.js',
        'opstools/RBAC/models/PermissionRole.js',
        'opstools/RBAC/models/PermissionScope.js',

        'OpsWebixDataCollection.js',
        'OpsWebixSearch.js',

//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//opstools/RBAC/views/Users/Users.ejs',
function(){

    //
    // Users 
    // 
    // This is the interface for managing the Users Tab 
    //
    // Here we load the list of users, roles and scopes, 
    // 
    //

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.RBAC.Users', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/RBAC/views/Users/Users.ejs'
                    eventAssignmentAdd : 'assign.add',
                    eventPermissionList: 'perm.list'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dom = {};      // hold all our DOM widgets:
            this.data = {};     // hold any data we are working with.
            this.data.permissions = [];  // all permission fields
            this.data.roles = [];   // all the roles in the system
            this.data.scopes = [];  // all the scopes in the db


            this.initDOM();
            this.loadData();
        },



        initDOM: function () {
            var _this = this;

            // // this.element.html(can.view(this.options.templateDOM, {} ));


            // //// 
            // //// Create a template for our User List:
            // //// 

            // // register template as :  'FCFActivities_ActivityReport_ActivityTaggedPeople'
            // //  NOTE:  DON'T USE '.' as seperators here!!!  -> can.ejs thinks they are file names then... doh!
            // var templateUserList =  this.domToTemplate(this.element.find('#userList>tbody'));
            // can.view.ejs('RBAC_User_UserList', templateUserList);

            // // remove the template from the DOM
            // this.dom.listUsers = this.element.find('#userList');
            // this.dom.listUsersTbody = this.dom.listUsers.find('tbody');
            // // this.dom.listUsersTbody.html(' ');



            // this.dom.listAssignments = this.element.find('.rbac-user-table-assignments');
            // this.dom.listAssignmentsTbody = this.dom.listAssignments.find('tbody');
            // var templateAssignmentList = this.domToTemplate(this.dom.listAssignmentsTbody);
            // can.view.ejs('RBAC_User_AssignmentList', templateAssignmentList);
            // this.quickviewClear();



            // // attach the FilteredBootstrapTable Controller
            // var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
            // this.Filter = new Filter(this.element, {
            //     tagFilter: '.autocomplete-filter',
            //     tagBootstrapTable: '#userList',
            //     scrollToSelect:true,

            //     cssSelected:'orange',

            //     tableOptions:{

            //         pagination: true,

            //         columns: [
            //             { title:'# Assignments', formatter: '.numAssignments' },  // function(value, row, index){ return row.numAssignments(); }
            //             { title:'Username',      field:'username'             },
            //             { title:'Options',       formatter:'.options'         },
            //             { title:'Status',        formatter:'.status'          }
            //         ]
            //     },

            //     // filterTable:true,

            //     rowClicked:function(data) {

            //         if (data) {
            //             console.log('... clicked user:', data);
            //             // self.selectedActivity = data;
            //             // self.nextEnable();
            //         }

            //     },
            //     rowDblClicked: function(data) {
            //         // if they dbl-click a row,
            //         // just continue on as if they clicked [next]
            //         _this.element.trigger(_this.options.eventPermissionList, data);
            //     },
            //     termSelected:function(data) {
            //         _this.element.trigger(_this.options.eventPermissionList, data);
            //     },
            //     dataToTerm: function(data) {  
            //         if (data) {
            //             return data.username;
            //         } else {
            //             return '';
            //         }
            //     }
            // });


// this.dom.listUsersTbody.html(' ');

            this.dom.userPanel = this.element.find('.rbac-user-display');
            this.dom.userPanel.hide();

            this.dom.userRoleScope = this.element.find('.rbac-user-roleScope');
            this.dom.userRoleScope.hide();


            webix.ready(function(){


                ////
                //// Setup the User Search Bar:    
                ////              
                _this.dom.userSearch = AD.op.WebixSearch({
                    id:"searchuser",
                    container:"search1",
                    view:"search",
                    placeholder:"Search ...",
                    width:220
                });
                _this.dom.userSearch.AD.filter(function(value){

                    _this.dom.userGrid.filter(function(obj){ //here it filters data!
                        return obj.username.toLowerCase().indexOf(value)>=0;
                    })
                });
                        
                                            
                                            

                ////
                //// Setup the User List
                ////
                _this.dom.userGrid = webix.ui({
                    id:"usertable",
                    container:"userlist-tbl",
                    view:"datatable",


                    columns:[
                        { id:"numPermissions",  header:"#",    template:function(obj){ 
                            return obj.permission.length; 
                        },   width:50,   css:"rank",    sort:"int" },
                        { id:"username",  header:"User ID", width:200,  sort:"string", fillspace:true },
                        { id:"status",  header:"Status" , width:80,  template:function(obj){ 
                            if ( obj.permission.length == 0) {
                                return "<div class='img-thumbnail stats-red'></div>";
                            } else {
                                return "<div class='img-thumbnail stats-green'></div>";
                            }
                        }, css:{ "text-align":"center" } },
                    ],


                    select:"row",
                    yCount:8, 
                    scrollY:false,
                    scrollX:false,
                    navigation:"true",      


                    pager:{
                      container:"paging_here",
                      size:8,
                      group:5
                    },  


                    on:{
                        onItemClick:function(id){

                            // this datatable is synced with our usersCollection
                            // and so is our selected form, so we need to make sure
                            // the userCollection's cursor is set to the selected
                            // id:
                            _this.selectUser(id);

                        }
                    }
                });  



                ////
                //// setup the Selected User Name Form
                ////
                var lblNoUserSelected = AD.lang.label.getLabel('rbac.user.noUserSelected')
                if (!lblNoUserSelected) { lblNoUserSelected = 'no user selected' };
                _this.dom.userName = webix.ui({
                    id:"username",
                    container:"userdisplay",
                    view:"form",
//                       hidden: true,
                    elements:[

                        { view: "text", name:"username", value:lblNoUserSelected}

                    ],
                    borderless: true,
                    paddingY: 8,
                    paddingX: 0,
                    margin: 0,
width:185
                    
                }); 



                //// 
                //// Setup the Permission List
                ////

                _this.dom.userPermissions = webix.ui({
                    container:"rolesNscopes",
                    view:"datatable",
                    id:"assignments",
                    columns:[
                        { id:"role",   header:"Roles", css:"rank", width:80, template:function(obj){
                            var role = _this.roleForID(obj.role.id);
                            return obj.role.role_label; // role.role_label || role.translations[0].role_label;
                        }},
                        { id:"scope",  header:"Scopes", width:200, fillspace:true, template:function(obj){
                            var scopes = [];
                            obj.scope.forEach(function(s){
                                scopes.push(s.label);
                            });
                            return scopes.join(', ');
                        }},
                        { id:"enabled", header:"Enabled" , width:80, css:{"text-align":"center"}, template:"{common.checkbox()}"},
                        { id:"trash", header:"" , width:40, css:{"text-align":"center"}, template:"<span class='trash'>{common.trashIcon()}</span>"},                        
                    ],
                    select:"row",

                    yCount:8, 
                    scrollY:true, 
                    scrollX:false,

                    navigation:"true",
                    onClick:{

                        trash:function(e, id){
                            
                            var perm = this.getItem(id);
                            var text = AD.lang.label.getLabel('rbac.user.confirmRemoveRole', [perm.role.role_label]);

                            webix.confirm({

                                text:text, 
                                          
                                callback:function(result){

                                    if (result) {

                                        if(!id){
                                            webix.message("No item is selected!");
                                            return;
                                        }

                                        _this.permissionRemove(perm)
                                        .fail(function(err){
                                            // .removePermission() already handles error messages ...
                                            // AD.error.log('Problem removing permission.', { error:err, perm:perm } );
                                            webix.message("There was a problem trying to remove this permission.");
                                        })
                                        .then(function(){
                                            // remove from list
                                            _this.dom.userPermissions.remove(id);

                                            // update user's display
                                            var currUserID = _this.data.usersCollection.getCursor();
                                            _this.selectUser(currUserID);
                                        })
                                        
                                        return false;
                                    }
                                }
                            });
                           
                        }

                    }
                
                }); 
                _this.dom.userPermissions.attachEvent("onCheck", function(row, column, state){
                    
                    // get the permission object:
                    var perm = _this.dom.userPermissions.getItem(row);
                    if (state) {
                        _this.permissionEnable(perm);
                    } else {
                        _this.permissionDisable(perm);
                    }

                });
                          
            });





        },



        loadData: function( id ) {
            var _this = this;

//             var User = AD.Model.get('opstools.RBAC.SiteUser');
//             User.findAll()
//             .fail(function(err){
// //// TODO: handle Error properly!
//             })
//             .then(function(list){
//                 _this.dom.listUsersTbody.html(' ');
//                 _this.dom.listUsersTbody.append(can.view('RBAC_User_UserList', {users: list }));
//             })


//             var Roles = AD.Model.get('opstools.RBAC.PermissionRole');
//             Roles.findAll()
//             .fail(function(err){
// //// TODO: handle Error properly!
//             })
//             .then(function(list){
//                 // make sure they are all translated.
//                 list.forEach(function(l){
//                     l.translate();
//                 })
//                 _this.data.roles = list;    // all the 
//             })


//             var Scopes = AD.Model.get('opstools.RBAC.PermissionScope');
//             Scopes.findAll()
//             .fail(function(err){
// //// TODO: handle Error properly!
//             })
//             .then(function(list){
//                 // // make sure they are all translated.
//                 // list.forEach(function(l){
//                 //     l.translate();
//                 // })
//                 _this.data.scopes = list;    // all the 
//             })

//             var Permissions = AD.Model.get('opstools.RBAC.Permission');

//             // if an id is provided, then we are loading a new entry and 
//             // adding it to our current list.
//             if (id) {

//                 Permissions.findOne({ id: id })
//                 .fail(function(err){
// //// TODO: handle Error properly!
//                 })
//                 .then(function(entry){
//                     _this.data.permissions.push( entry );
//                 })

//             } else {

//                 // else we are loading the initial list!
//                 Permissions.findAll()
//                 .fail(function(err){
// //// TODO: handle Error properly!
//                 })
//                 .then(function(list){
//                     _this.data.permissions = list;
//                 })

//             }
            
            

        },



        loadPermissions: function(list) {
            this.data.permissions = list;
        },



        /** 
         * @function loadRoles
         *
         * load the given list of roles.
         * @param {array/can.List} list  the current list of roles.
         */
        loadRoles: function(list) {
            this.data.roles = list;
        },



        /** 
         * @function loadScopes
         *
         * load the given list of scopes.
         * @param {array/can.List} list  the current list of scopes.
         */
        loadScopes: function(list) {
            this.data.scopes = list;
        },



        /** 
         * @function loadUsers
         *
         * load the given list of users.
         * @param {array/can.List} list  the current list of users.
         */
        loadUsers: function(list) {
            this.data.usersList = list;
            this.data.usersCollection = AD.op.WebixDataCollection(list);
            if (this.dom.userGrid) {
                this.dom.userGrid.data.sync(this.data.usersCollection);
                this.dom.userName.bind(this.data.usersCollection);
                // this.dom.userGrid.parse(this.data.usersCollection);
            }
            this.refresh();
        },

        permissionInstance: function(perm) {

            var Permission = AD.Model.get('opstools.RBAC.Permission');
            return Permission.findOne({id:perm.id}).fail(function(err){
                AD.error.log('Error finding permission:', {error:err, id:perm.id, perm:perm });
            });
            
        },


        /**
         * @function permissionDisable
         *
         */
        permissionDisable: function(perm) {
            return this.permissionUpdate(perm, { 'enabled': false });
        },


        /**
         * @function permissionEnable
         *
         */
        permissionEnable: function(perm) {
            return this.permissionUpdate(perm, { 'enabled': true });
        },



        /**
         * @function permissionRemove
         *
         */
        permissionRemove: function(perm) {
            var dfd = AD.sal.Deferred();

            this.permissionInstance(perm)
            .fail(function(err){ dfd.reject(err); })
            .then(function(permission){

                permission.destroy()
                .fail(function(err){
                    AD.error.log('Error removing permission:', {error:err, perm:permission });
                    dfd.reject(err);
                })
                .then(function(){

                    dfd.resolve();
                })
            })

            return dfd;
        },


        permissionUpdate:function(perm, values) {
            var dfd = AD.sal.Deferred();

            this.permissionInstance(perm)
            .fail(function(err){ dfd.reject(err); })
            .done(function(permission){

                for(v in values) {
                    permission.attr(v, values[v]);
                }
                
                permission.save()
                .fail(function(err){
                    AD.error.log('Error updating permission:', {error:err, perm:permission, values:values });
                    dfd.reject(err);
                })
                .done(function(){
                    dfd.resolve();
                })
            })

            return dfd;
        },



        /** 
         * @function refresh
         *
         * Redraw the list of users
         */
        refresh: function() {
 
            this.dom.userGrid.adjust();
            // this.dom.listUsersTbody.html(' ');
            // this.dom.listUsersTbody.append(can.view('RBAC_User_UserList', {users: this.data.users }));
        },



        /**
         * @function resize
         *
         * this is called when the Role controller is displayed and the window is
         * resized.  
         */
        resize: function() {

            this.dom.userGrid.adjust(); 
            var pager = this.dom.userGrid.getPager();
            pager.define('width', this.dom.userGrid.$width);

            this.dom.userSearch.define('width', this.dom.userGrid.$width);


            // the userPermissions table:
            this.dom.userPermissions.adjust();

            // resize everything now:
            pager.resize();
            this.dom.userSearch.resize();

        },


        /**
         * @function selectUser
         * 
         * called when a user is selected in our User Datatable.
         *
         * @param {} id  The id of the data element selected
         */
        selectUser:function(id) {

            var _this = this;

            // this datatable is synced with our usersCollection
            // and so is our selected form, so we need to make sure
            // the userCollection's cursor is set to the selected
            // id:
            this.data.usersCollection.setCursor(id);

            this.dom.userPanel.show();

            var user = this.data.usersCollection.getItem(id);

            // show loading message on PermissionGrid
            var Permission = AD.Model.get('opstools.RBAC.Permission');
            Permission.findAll({user:user.id})
            .fail(function(err){

            })
            .then(function(list){

//// LEFT OFF HERE: 
//// + clicking on checkbox -> updates permission to not active
//// + clicking on trashbox -> removed permission 
//// + clicking on [add] -> shows new permission form


/*
                list.forEach(function(perm){
                    var newPerm = perm.attr();

                    _this.data.roles.forEach(function(r){
                        if (r.id == perm.role.id) {
                            r.translate();
                            newPerm.role = r;
                        }
                    })

                    newList.push(newPerm);
                })
*/

                // convert each basic perm.role into the more detailed role info:
                list.forEach(function(perm){
                    _this.data.roles.forEach(function(r){
                        if (r.id == perm.role.id) {
                            perm.attr('role', r);
                        }
                    })
                })

                // convert to DataCollection
                var permissionDC = AD.op.WebixDataCollection(list);
console.log('... list:', list);
console.log('... permissionDC:', permissionDC);
                // load into PermissionGrid
                _this.dom.userPermissions.parse(permissionDC);

                // remove loading overlay

            })

        },



        show:function() {
            this._super();
            this.resize();
        },


        roleForID: function(id){
            var role = null;
            this.data.roles.forEach(function(r){
                if (r.id == id) {
                    role = r;
                }
            })

            return role;
        },


        // quickviewClear: function() {
        //     this.dom.listAssignmentsTbody.html('');
        // },


        // quickviewShow: function(permissions) {
        //     this.quickviewClear();
        //     this.dom.listAssignmentsTbody.append(can.view('RBAC_User_AssignmentList', { list:permissions, listPermissions:this.data.permissions, listRoles:this.data.roles, listScopes:this.data.scopes }));
        //     // this.assignmentsLoad(permissions);

        // },



        // userForID: function(id) {
        //     var found = null;
        //     for (var i=0; i<this.data.users.length; i++) {

        //         if (this.data.users[i].id == id) {
        //             return this.data.users[i];
        //         }
        //     }
        //     return null;
        // },



        // // when the user clicks on the [quickview] icon:
        // '.rbac-user-perm-quickview click': function($el, ev) {

        //     // var user = $el.data('user');
        //     var id = parseInt($el.attr('user-id'));
        //     var user = this.userForID(id);
        //     this.quickviewShow(user.permission);

        // },



        // // when the user clicks on the [add] icon:
        // '.rbac-user-perm-add click': function($el, ev) {

        //     var id = parseInt($el.attr('user-id'));
        //     var user = this.userForID(id);
            
        //     // emit the AssignmentAdd event:
        //     this.element.trigger(this.options.eventAssignmentAdd, user );

        //     ev.preventDefault();

        // },



        // '.ad-item-add click': function ($el, ev) {

        //     ev.preventDefault();
        // }


    });


});