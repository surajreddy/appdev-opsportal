
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/controllers/Tool.js',
        'OpsPortal/views/ToolArea/tool.ejs',
function(){


    if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
    AD.controllers.OpsPortal.ToolArea = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    template_tool: '//OpsPortal/views/ToolArea/tool.ejs'
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

 //           this.initDOM();

            // keep track of all the Tools in our area:
            this.listTools = {};


            // listen for new tool notifications.
            AD.comm.hub.subscribe('opsportal.tool.new', function(key, data) {

                // if this tool is for my area, then create it.
                if (self.options.key == data.area) {
                    self.createTool(data);
                }
            });


            // listen for area show notifications.
            AD.comm.hub.subscribe('opsportal.area.show', function(key, data) {

                // if this tool is for my area, then create it.
                if (self.options.key == data.area) {
                    self.element.show();
/*
                    // for each of our tools
                    for (var t in self.listTools) {
                        var tool = self.listTools[t];

                        // if it is the active tool
                        if (tool.isActive()) {

                            // recall it's resize()
                            // ?? do we remember the last resize value and
                            //    send that in here?
                            tool.resize();
                        }
                    }
*/
                } else {
                    self.element.hide();
                }

            });


            // default to hide this element
//            this.element.hide();

        },



        createTool: function(tool) {

            // add a new tool area div
            var divKey = 'opsportal-area-tool-'+tool.controller;
            var data = {
                key: divKey
            }
            this.element.append( can.view(this.options.template_tool, data));


            // attach the ToolArea controller to the new div
            var newTool = new AD.controllers.OpsPortal.Tool(this.element.find('.'+divKey), {
                key: tool.controller,
                areaKey:this.options.key,
                data:tool
            });


            // remember this area.
            this.listTools[tool.controller] = newTool;
        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateDOM, {} ));
        },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        }


    });


});