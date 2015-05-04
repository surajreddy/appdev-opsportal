
steal(
        // List your Controller's dependencies here:
        'appdev',
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
                    eventRoleEdit: 'role.edit.clicked'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);

            this.data = {}; 
            this.data.roles = [];

            
            this.initDOM();

        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));



            // attach the FilteredBootstrapTable Controller
            var Filter = AD.Control.get('OpsPortal.FilteredBootstrapTable');
            this.Filter = new Filter(this.element, {
                tagFilter: '.autocomplete-filter',
                tagBootstrapTable: '#rolelist',
                scrollToSelect:true,

                cssSelected:'orange',

                tableOptions:{

                    pagination: true,

                    columns: [
                        { title:'Role Name',     field:'role_label' },  // function(value, row, index){ return row.numAssignments(); }
                        { title:'Role Description',      field:'role_description'     },
                        { title:'Action',        formatter:'.actions'         }
                    ]
                },

                rowClicked:function(data) {

                    if (data) {
                        console.log('... clicked role:', data);
                        // self.selectedActivity = data;
                        // self.nextEnable();
                    }

                },
                rowDblClicked: function(data) {
                    // if they dbl-click a row,
                    // just continue on as if they clicked [next]
                    if (data) {
                        console.log('... dbl.clicked role:', data);
                    }
                },
                termSelected:function(data) {

                    // if they select a term in the typeahead filter,
                    // just continue on as if they clicked [next]
                    if (data) {
                        console.log('... search selected role:', data);
                    }
                },
                dataToTerm: function(data) {  
                    if (data) {
                        return data.role_label;
                    } else {
                        return '';
                    }
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
            this.refresh();
        },



        /** 
         * @function refresh
         *
         * Redraw the list of roles
         */
        refresh: function() {

            this.Filter.load(this.data.roles);
            this.Filter.ready();
        },



        roleForID:function(id) {

            var foundRole = null;
            this.data.roles.forEach(function(role){
                if (role.id == id) {
                    foundRole = role;
                }
            });

            return foundRole;
        },



        // when the user clicks the [ADD] button:
        '.rbac-role-addButton click':function($el, ev) {

            // emit the RoleAdd event:
            this.element.trigger( this.options.eventRoleAdd );

            ev.preventDefault();

        },


        // when the user clicks on the [edit] icon of an entry
        '.rbac-role-list-edit click':function($el, ev) {

            var id = $el.attr('role-id');
            var role = this.roleForID(id);

            this.element.trigger(this.options.eventRoleEdit, role);
            ev.preventDefault();
        },


        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});