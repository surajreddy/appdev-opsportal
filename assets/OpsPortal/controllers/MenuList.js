
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'OpsPortal/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        'OpsPortal/views/MenuList/MenuList.ejs',
function(){


    if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
    AD.controllers.OpsPortal.MenuList = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM: '//OpsPortal/views/MenuList/MenuList.ejs',
                    templateItem: '//OpsPortal/views/MenuList/menuItem.ejs',
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();


            // listen for new area notifications
            AD.comm.hub.subscribe('opsportal.area.new', function (key, data) {
                self.createArea(data);
            });

            // listen for menu toggle notifications
            AD.comm.hub.subscribe('opsportal.menu.toggle', function (key, data) {
                self.toggle(data.width);
            });

        },



        createArea: function( area) {
            console.log(area);

            this.element.find('.opsportal-nav-list > ul')
                .append(can.view(this.options.templateItem, {area:area}));

        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },



        toggle: function( width ) {

            this.element.animate({
                left: parseInt(this.element.css('left'),10) == 0 ? -width : 0
              });
        },



        width: function() {

            return this.element.outerWidth();
        },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        },

        '.opsportal-nav-list-item click' : function($el, ev) {

            var area = $el.attr('area');
            AD.comm.hub.publish('opsportal.area.show', {area:area});
            ev.preventDefault();
        }


    });


});