
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/views/Tool/Tool.ejs',
function(){



    if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
    AD.controllers.OpsPortal.Tool = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM: '//OpsPortal/views/Tool/Tool.ejs'
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

//            this.initDOM();
            this.controller = null;
            this.sizeData = null;
            this.isActive = false;
            this.isAreaActive = false;


            //// TODO: attach the controller here
            var controllerName = this.options.data.controller;

            if (AD.controllers.opstools[controllerName]) {
                if( AD.controllers.opstools[controllerName].Tool) {
                    this.controller = new AD.controllers.opstools[controllerName].Tool( this.element);
                } else {
                    console.error('controller ('+controllerName+').Tool()   not found!');
                }
            } else {
                console.error('controller ('+controllerName+') not found!');
            }

            AD.comm.hub.subscribe('opsportal.resize', function(message, data){
                self.sizeData = data;

                // tell controller it needs to update it's display at some point
                self.controller.needsUpdate();

                // and if I'm active
                if ((self.isAreaActive)
                    && (self.isActive)) {

                    // make sure my controller knows to resize();
                    self.controller.resize(data);
                }
            });

            AD.comm.hub.subscribe('opsportal.area.show', function(message, data){
                self.areaShow(data);
            });

            AD.comm.hub.subscribe('opsportal.tool.show', function(message, data){
                self.toolShow(data);
            });
        },


        areaShow:function(data){
            // if it is our area
            if (this.options.areaKey == data.area) {

                this.isAreaActive = true;

                // and I'm active
                if (this.isActive) {

                    // make sure my controller knows to resize();
                    this.controller.resize(this.sizeData);
                }

            } else {

                this.isAreaActive = false;
            }
        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },



        resize:function(){
            if (this.isActive) {
                this.controller.resize();
            }
        },



        toolShow:function(data) {

            if (this.options.areaKey == data.area) {

                if (data.tool == this.options.key) {

                    if(!this.isActive) {
                        this.isActive = true;
                        this.element.show();
                        this.controller.resize(this.sizeData);
                    }

                } else {

                    if (this.isActive){
                        this.isActive = false;
                        this.element.hide();
                    }

                }
            }
        },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        }


    });


});