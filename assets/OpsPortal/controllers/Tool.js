
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/views/Tool/Tool.ejs',
function(){



    //
    // Tool 
    // 
    // This controller manages the actual opstool/Controller application that
    // is being shown to the user.
    //
    // This controller is responsible for:
    //  1) creating the instance of the Application and inserting it in the DOM
    //  2) deciding if the Tool should be shown 
    //  3) deciding if a Tool should be resized()
    //
    // Resizing: 
    // The OpsPortal is intended to work in the maximum area of your browser 
    // display.  It is possible that the browser window is resized and in some
    // cases your Tool might want to respond to the new screen size.
    //
    // This Tool controller is responsible for figuring out when an Application
    // should be notified of a new resize action.
    //
    // Performing a resize when a tool is not actually shown, can cause the tool
    // to misalign it's view due to dom elements not actually being show at the 
    // moment and reporting 0 heights when they do take up space when shown.
    //
    //
    AD.Control.extend('OpsPortal.Tool', { 

        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM: '//OpsPortal/views/Tool/Tool.ejs'
            }, options);


            this.controller = null;     // our Application controller
            this.sizeData = null;       // the last reported resize() height
            this.isActive = false;      // is our tool the active one?
            this.isAreaActive = false;  // is our area the active area?


            // we were provided the Application's Controller name
            // if it exists, then create an instance of it on the DOM:
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


            // listen to resize notifications
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


            // listen to notifications to show a particular area
            AD.comm.hub.subscribe('opsportal.area.show', function(message, data){
                self.areaShow(data);
            });


            // listen to notification to show a particular tool
            AD.comm.hub.subscribe('opsportal.tool.show', function(message, data){
                self.toolShow(data);
            });


            // start off hidden until we are told to show ourselves:
            this.element.hide();
        },



        /**
         * areaShow
         *
         * Determines if it is our area and then decide if our tool should be
         * told to resize itself.
         *
         * @param {obj} data  the notification packet: { area: 'AreaString' }
         */
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



        /**
         * toolShow
         *
         * Determines if it is our Tool and then decide if our tool should be
         * told to resize itself.
         *
         * @param {obj} data  the notification packet: 
         *                    { area: 'AreaString', tool:'ControllerName' }
         */
        toolShow:function(data) {

            if (this.options.areaKey == data.area) {

                if (data.tool == this.options.key) {

                    if(!this.isActive) {

                        //// this is a switch TO our tool

                        this.isActive = true;

                        // remember: show() first then resize()
                        this.element.show();
                        this.controller.resize(this.sizeData);
                    }

                } else {

                    if (this.isActive){

                        //// this is a switch AWAY from our tool
                        
                        this.isActive = false;
                        this.element.hide();
                    }

                }
            }
        }


    });


});