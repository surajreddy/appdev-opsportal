
steal(
        // List your Controller's dependencies here:
        'appdev',
function(){

    // Namespacing conventions:
    // AD.classes.[application].[Class]  --> Object
    if (typeof AD.classes.opsportal == 'undefined') AD.classes.opsportal = {};
    AD.classes.opsportal.OpsTool = can.Control.extend({

        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                resize_notification: 'opstool.resize'
            }, options);

            this.shouldUpdateUI = true;     // we have not updated our UI for the work area yet.

        },



        needsUpdate: function() {
            // called by containing ops portal Tool() object when a new
            // has been issued.
            this.shouldUpdateUI = true;
        },



        resize: function( data ) {
            // called by containing ops portal Tool() object when a tool is
            // shown to the user.

            // more importantly it keeps a tool from resizing when it isn't
            // shown, which can introduce css mistakes from false height()
            // values.

            if (this.shouldUpdateUI) {
                AD.comm.hub.publish(this.options.resize_notification, data);
                this.shouldUpdateUI = false;
            }

        }


    });


});