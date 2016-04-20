
steal(

// List your Controller's dependencies here:
    'opstools/RBAC/models/PermissionAction.js',
    'opstools/RBAC/models/PermissionRole.js',
    'opstools/RBAC/models/PermissionScopeObject.js',
    'OpsWebixDataCollection.js',
    'OpsWebixSearch.js',
    //        'opstools/RBAC/models/Projects.js',
    //        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
    // '//opstools/RBAC/views/Roles/Roles.ejs',
    function () {
        System.import('appdev').then(function () {
            steal.import(
                'can/construct/construct',
                'appdev/ad',
                'appdev/control/control').then(function () {
                    //
                    // Scopes 
                    // 
                    // This is the interface for managing the list of Scopes and their 
                    // various editing options.
                    //


                    // Namespacing conventions:
                    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
                    AD.Control.extend('opstools.RBAC.Scopes', {  


                        init: function ScopesInit(element, options) {
                            var self = this;
                            options = AD.defaults({
                                    // templateDOM: '//opstools/RBAC/views/Roles/Roles.ejs'
                            }, options);
                            this.options = options;

                            // Call parent init
                            this._super(element, options);

                            this.dom = {};

                            this.data = {}; 
                            this.data.roles = [];

                            
                            this.initDOM();

                            this.loadObjects();


                        },



                        initDOM: function () {

                            var _this = this;


                            //
                            // roleForm
                            // the area to .show() or .hide() for the Role Form.
                            //
                            // this.dom.roleForm = this.element.find('.rbac-roles-form');
                            // this.dom.roleForm.hide();


                            webix.ready(function(){


                                ////
                                //// Setup the Scope Search Bar:    
                                ////  
                                var lblPlaceholderSearch = AD.lang.label.getLabel('rbac.scopes.search') || 'Search *';           
                                _this.dom.scopeSearch = AD.op.WebixSearch({
                                    id:"searchscopes",
                                    container:"searchScopes",
                                    view:"search",
                                    placeholder:lblPlaceholderSearch,
                                    width:300
                                });
                                _this.dom.scopeSearch.AD.filter(function(value){

                                    _this.dom.scopeGrid.filter(function(obj){ 
                                        return obj.label.indexOf(value)>=0;
                                    });
                                });


                                ////
                                //// Setup the Scope List
                                ////             
                                var lblHeaderName = AD.lang.label.getLabel('rbac.scopes.name') || 'Name*';
                                var lblHeaderObject = AD.lang.label.getLabel('rbac.scopes.object') || 'Object*';
                                _this.dom.scopeGrid = webix.ui({
  
                                      id : "scopeList",
                                      container : "rbac-scope-list",
                                      autoConfig : true,
                                      view : "datatable",
                                      height:600,
                                      width:400,
                                      columns : [
                                        { id : "label", header : lblHeaderName, fillspace : true },
                                        { id : "object", header : lblHeaderObject, template:function(obj){

                                                var objName = "?";
                                                var O = _this.data.objectsCollection.AD.getModel(obj.object.id);
                                                if (O) {
                                                    objName = O.name;
                                                }
                                                return objName;
                                            } 
                                        },
                                        { id : "copy", header : "", width : 40, css:{"text-align":"center"}, template:function(obj) { return "<div class='clone fa fa-copy fa-2 offset-9 rbac-scope-list-clone' scope-id='"+obj.id+"'  ></div>"; }  },
                                        { id : "trash", header : "", width : 40, css:{"text-align":"center"}, template:"<span class='trash'>{common.trashIcon()}</span>" }
                                      ],

                                      select:"row", 
                                      navigation:"true",      

                                      pager:{
                                          container:"rbac-scope-list-pager",
                                          size:8,
                                          group:5,
                                          width:300
                                      }

                                });


                                _this.dom.formCombo = webix.ui({
                                        id: "rbac-scope-object",
                                        container:'rbac-scope-object',
                                        view : "richselect",
                                        label : labelObject,
                                        // value : "1",
                                        // options : [
                                        //   { id : 1, value : "My Calendar" },
                                        //   { id : 2, value : "Webix project" },
                                        //   { id : 3, value : "Other" }
                                        // ],
                                        labelWidth : 100
                                      });
                                
                                ////
                                //// Setup the Role Form
                                ////
                                var labelLabel = AD.lang.label.getLabel('rbac.scopes.name') || 'Scope Name*';
                                // var placeHolderLabel = AD.lang.label.getLabel('rbac.scopes.label') || 'enter a new name*';
                                // var labelObject = AD.lang.label.getLabel('rbac.scopes.object') || 'Object*';
                                // var placeHolderDesc = AD.lang.label.getLabel('rbac.roles.descriptionPlaceholder') || 'Role Description*';
                                // _this.dom.formScope = webix.ui({
                                //     container:'rbac-scopes-form',
                                //     view:"form",
                                //     id:'formScope',

                                //     rows : [
                                //       { id:"label", view : "text", placeholder : placeHolderLabel, label : labelLabel, labelWidth : 100 },
                                //       _this.dom.formCombo,
                                //       { view : "spacer", height : 15 },
                                //       {
                                //         type : "line",
                                //         cols : [
                                //           { view : "template" },
                                //           { view : "template" }
                                //         ]
                                //       },
                                //       {
                                //         margin : 10,
                                //         paddingY : 7,
                                //         paddingX : 2,
                                //         borderless : true,
                                //         cols : [
                                //           { view : "spacer" },
                                //           { view : "button", label : "Info", align : "right", width : 120 },
                                //           {
                                //             view : "button",
                                //             type : "form",
                                //             label : "Done",
                                //             align : "right",
                                //             width : 120
                                //           }
                                //         ]
                                //       }
                                //     ]


                                // });




                            });

                        },



                    //     /*
                    //      * @actionChecked
                    //      *
                    //      * perform the actions to add an action to the current Role.
                    //      *
                    //      * @param {int} id  the unique id of the action to work with
                    //      */
                    //     actionChecked: function(id) {
                    // // console.log('... actionChecked:', id);
                    //         // get current action
                    //         var action = this.data.actionsCollection.AD.getModel(id);
                    //         var role = this.data.rolesCollection.AD.currModel();

                    //         if (role.actions) {
                    //             role.actions.push(action);
                    //         } else {
                    //             role.actions = new can.List([ action ]);
                    //         }

                    //         return role.save()
                    //         .fail(function(err){
                    //             AD.error.log('Roles:actionChecked(): error saving action to role:', {error:err, action:action.attr(), role:role.attr() });
                    //         });

                    //     },



                    //     /*
                    //      * @actionUnChecked
                    //      *
                    //      * perform the actions to remove an action from the current Role.
                    //      *
                    //      * @param {int} id  the unique id of the action to work with
                    //      */
                    //     actionUnChecked: function(id) {
                    // // console.log('... actionUnChecked:', id);

                    //         var action = this.data.actionsCollection.AD.getModel(id);
                    //         var role = this.data.rolesCollection.AD.currModel();

                    //         if (role.actions) {
                    //             var pos = -1;
                    //             role.actions.each(function(a, i){
                    //                 if (a.id == action.id) {
                    //                     pos = i;
                    //                 }
                    //             });
                    //             if (pos != -1) {
                    //                 role.actions.splice(pos,1);
                    //             }
                    //         } 

                    //         return role.save()
                    //         .fail(function(err){
                    //             AD.error.log('Roles:actionChecked(): error saving action to role:', {error:err, action:action.attr(), role:role.attr() });
                    //         });

                    //     },



                    //     /**
                    //      * @listRoleNames
                    //      *
                    //      * return an array of current role names.
                    //      * @return {array}
                    //      */
                    //     listRoleNames:function() {
                    //         var list = [];
                    //         for (var i = this.data.roles.length - 1; i >= 0; i--) {
                    //             list.push(this.data.roles[i].role_label);
                    //         };
                    //         return list;
                    //     },



                        /**
                         * @loadObjects
                         *
                         * reques the list of Scope Object definitions from the server, and
                         * load them into our actionGrid.
                         */
                        loadObjects: function() {
                            var _this = this;

                            var Model = AD.Model.get('opstools.RBAC.PermissionScopeObject'); 
                            Model.findAll()
                            .fail(function(err){
                                AD.error.log('RBAC:Roles.js: error loading actions.', {error:err});
                            })
                            .then(function(list) {
                                list.forEach(function(l) {
                                    if (l.translate) l.translate();
                                })
                                _this.data.objects = list;
                                _this.data.objectsCollection = AD.op.WebixDataCollection(list);
                                // if (_this.dom.actionGrid) {
                                //     _this.dom.actionGrid.data.sync(_this.data.actionsCollection);
                                // }
                            });

                        },



                        /** 
                         * @function loadScopes
                         *
                         * load the given list of scopes.
                         * @param {array/can.List} list  the current list of scopes.
                         */
                        loadScopes: function(list) {
                            this.data.scopes = list;
                            this.data.scopesCollection = AD.op.WebixDataCollection(list);
                            if (this.dom.scopeGrid) {
                                this.dom.scopeGrid.data.sync(this.data.scopesCollection);
                                // this.dom.formScope.bind(this.data.scopesCollection);
                            }
                            // this.resize();
                        },



                        /**
                         * @function resize
                         *
                         * this is called when the Role controller is displayed and the window is
                         * resized.  
                         */
                        resize: function() {
                            var pager = this.dom.scopeGrid.getPager();
                            this.dom.scopeGrid.adjust(); 
                            
                            // now update the related pager/searchbox with the proper $width
                            pager.define('width', this.dom.scopeGrid.$width);
                            this.dom.roleSearch.define('width', this.dom.scopeGrid.$width/2);

                            // resize everything now:
                            pager.resize();
                            this.dom.scopeSearch.resize();


                            this.dom.formScope.adjust();
                            

                        },



                    //     /*
                    //      * @function roleAdd
                    //      *
                    //      * step through the process of adding a new role.
                    //      */
                    //     roleAdd:function(){
                    //         var _this = this;

                    //         var listNames = this.listRoleNames();

                    //         var attrs = {};

                    //         // role names need to be unique
                    //         attrs.role_label = AD.lang.label.getLabel('rbac.roles.newRole') || 'New Role';
                    //         attrs.role_description = AD.lang.label.getLabel('rbac.roles.newRoleDescription') || 'Describe this role ...';
                    //         while (listNames.indexOf(attrs.role_label) != -1) {
                    //             attrs.role_label += '.';
                    //         }

                    //         return this.roleCreate(attrs)
                    //         .done(function(newRole){

                    //             // insert at the beginning of our list
                    //             _this.data.roles.unshift(newRole);
                    //         });
                    //     },



                    //     /*
                    //      * @function roleClone
                    //      *
                    //      * step through the process of cloning a new role.
                    //      */
                    //     roleClone:function(id){
                    //         var _this = this;

                    //         var origModel = this.data.rolesCollection.AD.getModel(id);
                    //         var attrs = AD.Model.clone(origModel);
                    //         delete attrs.permissions;

                    //         var actions = [];
                    //         attrs.actions.forEach(function(action){
                    //             actions.push(action.id);
                    //         })
                    //         attrs.actions = actions;

                    //         var listNames = this.listRoleNames();

                    //         // role names need to be unique
                    //         attrs.role_label += ' (cloned) ';
                    //         while (listNames.indexOf(attrs.role_label) != -1) {
                    //             attrs.role_label += '.';
                    //         }

                    //         return this.roleCreate(attrs)
                    //         .done(function(newRole){

                    //             // insert right under our original role
                    //             var roleIndex = _this.data.roles.indexOf(origModel);
                    //             _this.data.roles.splice(roleIndex+1, 0, newRole);
                    //         });

                    //     },



                    //     /**
                    //      * @function roleCreate
                    //      *
                    //      * create a new role entry.
                    //      * @param {json} attrs  the attributes of the role to create.
                    //      * @return {deferred}
                    //      */
                    //     roleCreate:function(attrs) {
                    //         var _this = this;
                    //         var dfd = AD.sal.Deferred();

                    //         var Roles = AD.Model.get('opstools.RBAC.PermissionRole');
                    //         Roles.create(attrs)
                    //         .fail(function(err){
                    //             AD.error.log('Error creating new role.', {error:err, attrs:attrs});
                    //             dfd.reject();
                    //         })
                    //         .then(function(data){

                    //             // now do a full find for this entry, so we have all the filled out info:
                    //             Roles.findOne({ id:data.id })
                    //             .fail(function(err){
                    //                 AD.error.log('Error looking up new role.', {error:err, role:data});
                    //                 dfd.reject();
                    //             })
                    //             .then(function(newRole){

                    //                 // console.log('... new cloned Role:', newRole);
                    //                 newRole.translate();

                    //                 dfd.resolve(newRole);
                    //             });

                    //         });

                    //         return dfd;
                    //     },



                    //     /**
                    //      * @function roleSelect
                    //      * 
                    //      * make sure all components are updated reflecting the current role
                    //      * being selected.
                    //      *
                    //      * @param {integer} id the unique id of the role being selected.
                    //      */
                    //     roleSelect: function(id) {

                    //         // set the cursor to this form:
                    //         this.data.rolesCollection.setCursor(id);
                    //         this.dom.roleForm.show();
                    //         this.dom.actionGrid.refresh();
                    //         this.resize();  
                    //     },



                    //     /** 
                    //      * show()
                    //      *
                    //      * when this controller is shown, make sure the bootstrap-table gets properly
                    //      * refreshed().
                    //      */
                    //     show:function() {
                    //         this._super();
                    //         this.resize();
                    //     },



                    //     /*
                    //      * The click handler for the [add] button
                    //      */
                    //     '.rbac-role-addRole click': function($el, ev) {
                    //         var _this = this;

                    //         this.roleAdd()
                    //         .done(function(){
                    //             var rc = _this.data.rolesCollection;
                    //             var id = rc.getIdByIndex(0);
                    //             _this.dom.roleGrid.select(id);
                    //             _this.roleSelect(id);
                    //         });

                    //     }

                });
        });
    });
});