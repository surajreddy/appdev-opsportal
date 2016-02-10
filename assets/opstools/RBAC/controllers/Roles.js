
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/RBAC/models/PermissionAction.js',
        'opstools/RBAC/models/PermissionRole.js',
//        'opstools/RBAC/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//opstools/RBAC/views/Roles/Roles.ejs',
function(){

    //
    // Roles 
    // 
    // This is the interface for managing the list of Roles and their 
    // various editing options.
    //

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.RBAC.Roles', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/RBAC/views/Roles/Roles.ejs'
                    eventRoleAdd: 'role.add.clicked',
                    eventRoleEdit: 'role.edit.clicked',
                    eventRoleDeleted: 'role.deleted'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);

            this.dom = {};

            this.data = {}; 
            this.data.roles = [];

            
            this.initDOM();

            this.loadActions();


        },



        initDOM: function () {

            var _this = this;


            // this.element.html(can.view(this.options.templateDOM, {} ));



            // // attach the FilteredBootstrapTable Controller
            // var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
            // this.Filter = new Filter(this.element, {
            //     tagFilter: '.autocomplete-filter',
            //     tagBootstrapTable: '#rolelist',
            //     scrollToSelect:true,

            //     cssSelected:'orange',

            //     tableOptions:{

            //         pagination: true,

            //         columns: [
            //             { title:'Role Name',            field:'role_label',         sortable:true },  // function(value, row, index){ return row.numAssignments(); }
            //             { title:'Role Description',     field:'role_description'     },
            //             { title:'Action',               formatter:'.actions'         }
            //         ]
            //     },

            //     rowClicked:function(data) {

            //         if (data) {
            //             console.log('... clicked role:', data);
            //             // self.selectedActivity = data;
            //             // self.nextEnable();
            //         }

            //     },
            //     rowDblClicked: function(data) {

            //         var editIcon = _this.element.find('.rbac-role-list-edit[role-id="'+data.id+'"]');
            //         if (editIcon.length) {
            //             editIcon.click();
            //         }
            //     },
            //     termSelected:function(data) {

            //         // if they select a term in the typeahead filter,
            //         // just continue on as if they clicked [next]
            //         if (data) {
            //             console.log('... search selected role:', data);
            //         }
            //     },
            //     dataToTerm: function(data) {  
            //         if (data) {
            //             return data.role_label;
            //         } else {
            //             return '';
            //         }
            //     }
            // });

            this.dom.roleForm = this.element.find('.rbac-roles-form');
            this.dom.roleForm.hide();



            webix.ready(function(){


                ////
                //// Setup the User Search Bar:    
                ////  
                var lblPlaceholderSearch = AD.lang.label.getLabel('rbac.roles.search') || 'Search *';           
                _this.dom.roleSearch = AD.op.WebixSearch({
                    id:"searchroles",
                    container:"search2",
                    view:"search",
                    placeholder:lblPlaceholderSearch,
                    width:300
                });
                _this.dom.roleSearch.AD.filter(function(value){

                    _this.dom.roleGrid.filter(function(obj){ //here it filters data!
                        return obj.role_label.indexOf(value)>=0;
                    })
                });


                ////
                //// Setup the Role List
                ////             
                var lblHeaderName = AD.lang.label.getLabel('rbac.roles.name') || 'Name*';
                var lblHeaderDescription = AD.lang.label.getLabel('rbac.roles.description') || 'Description*';
                _this.dom.roleGrid = webix.ui({
                    id:"rolestable",
                    container:"userlist-tbl-role",
                    view:"datatable",
                    // width:483,

                    columns:[
                        { id:"role_label",  header:lblHeaderName, width:180, sort:"string"},
                        { id:"role_description",  header:lblHeaderDescription , fillspace:true},
                        { id:"copy",  header:"" , width:40, css:{"text-align":"center"}, template:function(obj) { return "<div class='clone fa fa-copy fa-2 offset-9 rbac-role-list-clone' role-id='"+obj.id+"'  ></div>"; } } ,
                        { id:"trash", header:"" , width:40, css:{"text-align":"center"}, template:"<span class='trash'>{common.trashIcon()}</span>"},
                    ],


                    select:"row",
                    yCount:8, 
                    scrollY:false,
                    scrollX:false,
                    navigation:"true",      

                    pager:{
                        container:"pgb",
                        size:8,
                        group:5,
                        width:300
                    },  
                    on:{
                        onItemClick:function(id){

                            _this.roleSelect(id);
                        }
                    },
                    onClick:{

                        clone:function(e,id){
                            var role = this.getItem(id);
                            var lblConfirmClone = AD.lang.label.getLabel('rbac.roles.confirmClone', [this.getItem(id).role_label]) || 'Clone :'+this.getItem(id).role_label;
                            webix.confirm({text:lblConfirmClone, 
                                          
                                callback:function(result){

                                    if (result) {

                                        _this.roleClone(id);

                                        // var clonedRole = {};
                                        // clonedRole.actions = [];
                                        // role.actions.forEach(function(action){
                                        //     clonedRole.actions.push(action.id);
                                        // });


                                        return false;
                                    }
                                }
                            });
                        },
                        trash:function(e, id){

                            var role = this.getItem(id);
                            var lblConfirm =  AD.lang.label.getLabel('rbac.roles.confirmDelete', [this.getItem(id).role_label]) || 'Remove :'+this.getItem(id).role_label;
                            webix.confirm({text:lblConfirm, 
                                          
                                   callback:function(result){

                                       if (result) {

                                            _this.data.rolesCollection.AD.destroyModel(id)
                                            .fail(function(err){
                                                AD.error.log('Error destroying role.', { error:err, role:role, id:id });
                                            })
                                            .then(function(oldData){

                                            });

                                            return false;
                                       }
                                   }
                              });
                           
                        }
                    }
                }); 



                ////
                //// Setup the Role Form
                ////
                var labelLabel = AD.lang.label.getLabel('rbac.roles.name') || 'Role Name*';
                var placeHolderLabel = AD.lang.label.getLabel('rbac.roles.label') || 'Role Name*';
                var labelDesc = AD.lang.label.getLabel('rbac.roles.description') || 'Role Description*';
                var placeHolderDesc = AD.lang.label.getLabel('rbac.roles.descriptionPlaceholder') || 'Role Description*';
// _this.dom.roleForm.find('[placeholder="rbac.roles.label"]').attr('placeholder',placeHolderLabel);
// _this.dom.roleForm.find('[placeholder="rbac.roles.descriptionPlaceholder"]').attr('placeholder',placeHolderDesc);
// this.dom.formRole.elements.item(1).placeholder = 'yadda yadda';
// _this.dom.formRole = webix.ui({
//     container:'rbac-roles-form',
//     view:"htmlform",
//     id:'formRole',
//     content: "rbac-roles-form",
//     autoheight: true,

//     on: {

//         onChange: function(newv, oldv){
//             webix.message("Value changed from: ",oldv," to: ",newv);
//         }
//     }
// });
                _this.dom.formRole = webix.ui({
                    container:'rbac-roles-form',
                    view:"form",
                    id:'formRole',
                    elements:[

                        { id:"role_label", view: "text", name:"role_label", label:labelLabel, value:'', placeholder: placeHolderLabel, labelPosition:"top" },
                        { id:"role_description", view: "textarea", name:"role_description", label:labelDesc, labelPosition:"top", value:'', placeholder: placeHolderDesc, height:150 }
                        
                    ],
                    autoheight: true,

                    on: {

                        onChange: function(newv, oldv){
                            console.log("Value changed from: ",oldv," to: ",newv);
                        }
                    }
                });

                //// onChange handlers for each field
                var fields = ['role_label', 'role_description'];
                fields.forEach(function(field){
                    _this.dom.formRole.elements[field].attachEvent("onChange", function(newv, oldv){
                        var model = _this.data.rolesCollection.AD.currModel();
                        var modelValue = model.attr(field);
                        if (modelValue != newv){

                            model.attr(field, newv);
                            model.save()
                            .fail(function(err){
                                AD.error.log('Error saving current model.', {error:err, field:field, value:newv });
                            })
                            .then(function(){
                                console.log(field+": Value changed from: "+oldv+" to: "+newv);
                            })
                        }
                        
                    });
                })



                //// 
                //// Setup the Action Search
                ////
                
                // webix.ui({
                //     id:"searchactions",
                //     container:"search3",
                //     view:"search",
                //     placeholder:"Search..",
                //     width:300

                // });
                // $$("searchactions").attachEvent("onSearchIconClick",function(e){ 
                //     //get user input value
                //     var value = this.getValue().toLowerCase(); 

                //     $$("actiontable").filter(function(obj){ //here it filters data!
                //         return obj.name.toLowerCase().indexOf(value)==0;
                //     })
                // });  
                var lblPlaceholderSearchActions = AD.lang.label.getLabel('rbac.roles.searchActions') || 'Search Actions*';           
                _this.dom.roleSearchActions = AD.op.WebixSearch({
                    id:"rbac-search-actions",
                    container:"rbac-search-actions",
                    view:"search",
                    placeholder:lblPlaceholderSearchActions,
                    width:300
                });
                _this.dom.roleSearchActions.AD.filter(function(value){
                    _this.dom.actionGrid.filter(function(obj){ 
                        return obj.action_key.indexOf(value)>=0;
                    })
                });



                //// 
                //// Setup the Action Grid
                ////

                _this.dom.actionGrid = webix.ui({
                    id:"rbacGridActions",
                    container:"rbac-grid-actions",
                    view:"datatable",
                    // width:993,
                    editable:true,

                    columns:[

                        { id:"enabled", header:{text:"", template:"{common.checkbox()}"}, width:40, css:{"text-align":"center"}, template:"{common.checkbox()}"},
                        { id:"action_key",  header:"Name", width:100, sort:"string"},
                        { id:"action_description",  header:"Description" , editor:"text", fillspace:true}
                                    
                    ],

                           
                    select:"row",
                    yCount:5, 
                    scrollY:false, 
                    scrollX:false,
                    navigation:"true", 


                    pager:{
                        container:"rbac-pager-actions",
                        size:5,
                        group:5,
                        width:300
                    },


                    onClick:{
                        

                    } 

                });



            });

        },



        // iconBusy: function($el) {
        //     $el.addClass(' fa-spinner fa-pulse');
        // },

        // iconReady:function($el) {
        //     $el.removeClass(' fa-spinner fa-pulse');
        // },



        /**
         * @listRoleNames
         *
         * return an array of current role names.
         * @return {array}
         */
        listRoleNames:function() {
            var list = [];
            for (var i = this.data.roles.length - 1; i >= 0; i--) {
                list.push(this.data.roles[i].role_label);
            };
            return list;
        },



        loadActions: function() {
            var _this = this;

            var Actions = AD.Model.get('opstools.RBAC.PermissionAction'); 
            Actions.findAll()
            .fail(function(err){
                AD.error.log('RBAC:Roles.js: error loading actions.', {error:err});
            })
            .then(function(list) {
                list.forEach(function(l) {
                    l.translate();
                })
                _this.data.actions = list;
                _this.data.actionsCollection = AD.op.WebixDataCollection(list);
                if (_this.dom.actionGrid) {
                    _this.dom.actionGrid.data.sync(_this.data.actionsCollection);
                }
            });

        },



        /** 
         * @function loadRoles
         *
         * load the given list of roles.
         * @param {array/can.List} list  the current list of roles.
         */
        loadRoles: function(list) {
            this.data.roles = list;
            this.data.rolesCollection = AD.op.WebixDataCollection(list);
            if (this.dom.roleGrid) {
                this.dom.roleGrid.data.sync(this.data.rolesCollection);
                this.dom.formRole.bind(this.data.rolesCollection);
            }
            this.refresh();
        },



        /** 
         * @function refresh
         *
         * Redraw the list of roles
         */
        refresh: function() {

        },



        /**
         * @function resize
         *
         * this is called when the Role controller is displayed and the window is
         * resized.  
         */
        resize: function() {
            var pager = this.dom.roleGrid.getPager();
            this.dom.roleGrid.adjust(); 
            
            // now update the related pager/searchbox with the proper $width
            pager.define('width', this.dom.roleGrid.$width);
            this.dom.roleSearch.define('width', this.dom.roleGrid.$width/2);

            // resize everything now:
            pager.resize();
            this.dom.roleSearch.resize();


            this.dom.formRole.adjust();


            this.dom.actionGrid.adjust();
            this.dom.roleSearchActions.define('width', this.dom.actionGrid.$width );
            this.dom.roleSearchActions.resize();
            

        },


        roleClone:function(id){
            var _this = this;

            var origModel = this.data.rolesCollection.AD.getModel(id);
            var attrs = AD.Model.clone(origModel);
            delete attrs.permissions;

            var actions = [];
            attrs.actions.forEach(function(action){
                actions.push(action.id);
            })
            attrs.actions = actions;

            var listNames = this.listRoleNames();

            // role names need to be unique
            attrs.role_label += ' (cloned) ';
            while (listNames.indexOf(attrs.role_label) != -1) {
                attrs.role_label += '.';
            }
// console.log('... clone attrs:', attrs);

            var Roles = AD.Model.get('opstools.RBAC.PermissionRole');
            Roles.create(attrs)
            .fail(function(err){
                AD.error.log('Error creating new cloned role.', {error:err, attrs:attrs});
            })
            .then(function(data){

                // now do a full find for this entry, so we have all the filled out info:
                Roles.findOne({ id:data.id })
                .fail(function(err){
                    AD.error.log('Error looking up new cloned role.', {error:err, role:data});
                })
                .then(function(newRole){

                    // console.log('... new cloned Role:', newRole);
                    newRole.translate();

                    // insert right under our original role
                    var roleIndex = _this.data.roles.indexOf(origModel);
                    _this.data.roles.splice(roleIndex+1, 0, newRole);

                });

            });



        },



        roleSelect: function(id) {

            // set the cursor to this form:
            this.data.rolesCollection.setCursor(id);
            this.dom.roleForm.show();
            this.resize();  
        },



        // roleForID:function(id) {

        //     var foundRole = null;
        //     this.data.roles.forEach(function(role){
        //         if (role.id == id) {
        //             foundRole = role;
        //         }
        //     });

        //     return foundRole;
        // },


        /** 
         * show()
         *
         * when this controller is shown, make sure the bootstrap-table gets properly
         * refreshed().
         */
        show:function() {
            this._super();
            this.resize();
        },



//         // when the user clicks the [ADD] button:
//         '.rbac-role-addButton click':function($el, ev) {

//             // emit the RoleAdd event:
//             this.element.trigger( this.options.eventRoleAdd );

//             ev.preventDefault();

//         },


//         // when the user clicks on the [edit] icon of an entry
//         '.rbac-role-list-edit click':function($el, ev) {

//             var id = $el.attr('role-id');
//             var role = this.roleForID(id);

//             this.element.trigger(this.options.eventRoleEdit, role);
//             ev.preventDefault();
//         },



//         // when the user clicks on the [clone] icon of an entry
//         '.rbac-role-list-clone click':function($el, ev) {
//             var _this = this;

//             this.iconBusy($el);

//             var id = $el.attr('role-id');
//             var role = this.roleForID(id);
//             var roleIndex = this.data.roles.indexOf(role);

//             var listNames = this.listRoleNames();

//             // make a useable clone of the current role:
//             var attrs = AD.Model.clone(role);

//             // role names need to be unique
//             attrs.role_label += ' (cloned) ';
//             while (listNames.indexOf(attrs.role_label) != -1) {
//                 attrs.role_label += '.';
//             }

// console.log('... cloned role data: ', attrs);

//             var Roles = AD.Model.get('opstools.RBAC.PermissionRole');
//             Roles.create(attrs)
//             .fail(function(err){
// //// TODO: handle Error properly!
// console.error('... error creating cloned entry:', err);
//                 _this.iconReady($el);
//             })
//             .then(function(data){

//                 // now do a full find for this entry, so we have all the filled out info:
//                 Roles.findOne({ id:data.id })
//                 .fail(function(err){
// console.error('... error looking up full cloned entry:', err);
//                     _this.iconReady($el);
//                 })
//                 .then(function(newRole){

//                     console.log('... new cloned Role:', newRole);
//                     newRole.translate();

//                     // insert right under our original role
//                     _this.data.roles.splice(roleIndex, 1, role, newRole);

//                     // display as selected
//                     _this.Filter.selectRow(newRole);
//                     _this.iconReady($el);
//                 })



//             });

//         },



//         // when the user clicks on the [delete] icon of an entry
//         '.rbac-role-list-delete click':function($el, ev) {
//             var _this = this;

//             var id = $el.attr('role-id');
//             var role = this.entryForID(this.data.roles, id); // this.roleForID(id);
//             var roleIndex = this.data.roles.indexOf(role);

//             this.iconBusy($el);

//             AD.op.Dialog.Confirm({
//                 fnYes:function() {

//                     role.destroy()
//                     .fail(function(err){
// console.error('*** error deleting role:', err);
//                         _this.iconReady($el);                        
//                     })
//                     .then(function(){
//                         _this.data.roles.splice(roleIndex, 1);
//                         _this.iconReady($el);

//                         _this.element.trigger(_this.options.eventRoleDeleted, role);
//                     })

//                 },
//                 fnNo:function() {

//                     _this.iconReady($el);

//                 }
//             })


//             ev.preventDefault();
//         },


//         '.ad-item-add click': function ($el, ev) {

//             ev.preventDefault();
//         }


    });


});