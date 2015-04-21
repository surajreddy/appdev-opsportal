
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'opstools/RBAC/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//opstools/RBAC/views/Roles/Roles.ejs',
function(){

    // Namespacing conventions:
    // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
    AD.Control.extend('opstools.RBAC.Roles', {  


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    // templateDOM: '//opstools/RBAC/views/Roles/Roles.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);

            
            this.initDOM();


        },



        initDOM: function () {

            // this.element.html(can.view(this.options.templateDOM, {} ));

        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});