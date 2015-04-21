
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/RBAC/models/SiteUser.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//opstools/RBAC/views/Users/Users.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.RBAC.Users', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/RBAC/views/Users/Users.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.dom = {};      // hold all our DOM widgets:


            this.initDOM();
            this.loadData();
        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));


            //// 
            //// Create a template for our User List:
            //// 

            // register template as :  'FCFActivities_ActivityReport_ActivityTaggedPeople'
            //  NOTE:  DON'T USE '.' as seperators here!!!  -> can.ejs thinks they are file names then... doh!
            var templateUserList =  this.domToTemplate(this.element.find('#userList>tbody'));
            can.view.ejs('RBAC_User_UserList', templateUserList);

            // remove the template from the DOM
            this.dom.listUsers = this.element.find('#userList');
            this.dom.listUsersTbody = this.dom.listUsers.find('tbody');
            this.dom.listUsersTbody.html(' ');



            this.dom.listAssignments = this.element.find('.rbac-user-table-assignments');
            this.dom.listAssignmentsTbody = this.dom.listAssignments.find('tbody');
            var templateAssignmentList = this.domToTemplate(this.dom.listAssignmentsTbody);
            can.view.ejs('RBAC_User_AssignmentList', templateAssignmentList);
            this.assignmentsClear();

        },


        loadData: function() {
            var _this = this;

            var User = AD.Model.get('opstools.RBAC.SiteUser');
            User.findAll()
            .fail(function(err){
                // handle error!
            })
            .then(function(list){
                _this.dom.listUsersTbody.html(' ');
                _this.dom.listUsersTbody.append(can.view('RBAC_User_UserList', {users: list }));
            })

        },



        assignmentsClear: function() {
            this.dom.listAssignmentsTbody.html('');
        },



        assignmentsShow:function(permissions) {
            this.assignmentsClear();

            

        },



        // when the user clicks on the [quickview] icon:
        '.rbac-user-perm-quickview click': function($el, ev) {

            var user = $el.data('user');
            this.assignmentsShow(user.permissions);

        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});