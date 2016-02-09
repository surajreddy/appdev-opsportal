
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

            var dc =  new webix.DataCollection({ 
                data:newData,

                on:{
                    onAfterDelete:function(id) {

                        var model = dc.AD.getModel(id);

                        if (model) {

                            // Deleting an element from the DataCollection
                            // auto removes it from the can.List:
                            var index = List.indexOf(model);
console.log('... list index to remove:'+index);
                            if (index >= 0) {
                                List.splice(index,1);
                            }

                        }

                        // model.destroy()
                        // .fail(function(err){
                        //     AD.error.log('Error with auto delete from WebixDataCollection to Can.Model:', {error:err, model:model });
                        // })
                        // .then(function(data){
                        //     console.log('... can model destroyed:', model);
                        // })


                    }
                }
            });

            List.___webixDataCollection = dc;
            List.bind('change', function(ev, attr, how, newVals, oldVals) {
// console.log('... change: ' + attr + ', ' + how + ', ' + newVals + ', ' + oldVals);

                if (how == 'add') {
                    newVals.forEach(function(item){
                        dc.add(item.attr(), attr );
                        attr++;
                    })
                }
                
            });
            List.bind('remove', function(ev, oldVals, where) {
                oldVals.forEach(function(item){
                    dc.remove(item.getID());
                })
            });

            dc.AD = {};
            dc.AD.__list = List;


            // dc.AD.currModel()
            dc.AD.currModel = function() {

                // get the id of the current cursor position
                var id = dc.getCursor();
                return this.getModel(id);
            }

            // dc.AD.getModel(id)
            dc.AD.getModel = function(id) {
                var model = null;

                // should return the current model from the List:
                List.forEach(function(item){
                    if (item.getID() +'' == id) {
                        model = item;
                    }
                });

                return model;
            }

            dc.AD.destroyModel = function(id) {
                var model = this.getModel(id);
                if (model) {
// // temp to test out without actually deleting from server.
// var index = List.indexOf(model);
// console.log('... list index to remove:'+index);
// List.splice(index,1);
// return AD.sal.Deferred().resolve(model);

                    return model.destroy();
                } else {
                    return AD.sal.Deferred().reject( new Error('no model for id:'+id));
                }
            }

            return dc;
        }

    };


});