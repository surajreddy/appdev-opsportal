
steal(
        // List your Controller's dependencies here:
        'appdev',

        'webix.js',
        'webix.css',
        'webix-opsportal.js',
function(){


    // The OpsPortal will define a global namespace for our added utilities:
    if (typeof AD.op == 'undefined') AD.op = {};
    
    /**
     * @class AD.op.WebixDataCollection
     * @parent 
     *
     * This is a generic OpsPortal helper for translating can.List() into a 
     * Webix DataCollection.
     *
     * We attempt to listen for changes in either object, and then update the
     * other.
     *
     */
    AD.op.WebixDataCollection = function(List) {

        if (List.___webixDataCollection) {

            return List.___webixDataCollection;

        } else {


            var newData = [];


            List.forEach(function(item){
                newData.push(item.attr());
            })

            var dc =  new webix.DataCollection({ data:newData });
            List.___webixDataCollection = dc;

            dc.AD = {};
            dc.AD.__list = List;


            // dc.AD.currModel()
            dc.AD.currModel = function() {
                var model = null;

                // should return the current model from the List:
                var id = dc.getCursor();
                List.forEach(function(item){
                    if (item.getID() +'' == id) {
                        model = item;
                    }
                });

                return model;
            }
            return dc;
        }

    };


});