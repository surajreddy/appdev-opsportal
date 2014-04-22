
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/controllers/ToolArea.js',
function(){



        if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
        AD.controllers.OpsPortal.WorkArea = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    template_area: '//OpsPortal/views/WorkArea/area.ejs',
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();

            this.listAreas = {};


            // listen for new area notifications.
            AD.comm.hub.subscribe('opsportal.area.new', function(key, data) {
                self.createArea(data);
            });


            // listen for menu toggle notifications
            AD.comm.hub.subscribe('opsportal.menu.toggle', function (key, data) {
                self.toggle(data.width);
            })

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



        toggle: function( width ) {

            this.element.animate({
                left: parseInt(this.element.css('left'),10) == 0 ? width : 0
              });
        },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        },


    });


});