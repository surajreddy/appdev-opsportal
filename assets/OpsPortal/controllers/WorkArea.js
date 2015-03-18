
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/controllers/ToolArea.js',
        'OpsPortal/views/WorkArea/area.ejs',
function(){


    //
    // WorkArea 
    // 
    // This controller manages the area below the OpsPortal Menu
    //
    // Each entry in the menu represents an "Area" within the OpsPortal.
    //
    // An "Area" is a collection of related tools that can be displayed
    // to the user.
    //
    // When the main OpsPortal controller receives it's configuration 
    // information from the server, the OpsPortal will fire off a 
    // 'opsportal.area.new' notification for each Area defined.
    //
    // This MenuList controller listens for each of those notifications and
    // creates a new entry in it's list for each Area it is told about.
    //
    // Clicking on one of the Menu Entries will cause this MenuList controller
    // to emit 'opsportal.area.show', with the area definition for that area.
    //
    AD.Control.extend('OpsPortal.WorkArea', { 

        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    template_area: '//OpsPortal/views/WorkArea/area.ejs'
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();

            this.listAreas = {};


            // listen for new area notifications.
            AD.comm.hub.subscribe('opsportal.area.new', function(key, data) {
                self.createArea(data);
            });


            // // listen for menu toggle notifications
            // AD.comm.hub.subscribe('opsportal.menu.toggle', function (key, data) {
            //     self.toggle(data.width);
            // })

        },



        createArea: function(area) {

            // add a new tool area div
            var areaKey = 'opsportal-area-'+area.key;
            var data = {
                key: areaKey
            }
            this.element.append( can.view(this.options.template_area, data));


            // attach the ToolArea controller to the new div
            var newArea = new AD.controllers.OpsPortal.ToolArea(this.element.find('.'+areaKey), {
                key: area.key
            });


            // remember this area.
            this.listAreas[area.key] = newArea;
        },



        initDOM: function() {

 //           this.element.html(can.view(this.options.templateDOM, {} ));

        },



        // toggle: function( width ) {

        //     this.element.animate({
        //         left: parseInt(this.element.css('left'),10) == 0 ? width : 0
        //       });
        // },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        }


    });


});