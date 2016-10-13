// List your Controller's dependencies here:
// 'opstools/OPTheme/models/Projects.js',
// '/opstools/OPTheme/views/OPTheme/OPTheme.ejs',
steal(
  function () {
    System.import('appdev').then(function () {
      steal.import('appdev/ad', 'appdev/control/control').then(function () {
        //'appdev/widgets/ad_delete_ios/ad_delete_ios',

        // Namespacing conventions:
        // AD.Control.extend('[application].[controller]', [{ static },] {instance} );
        AD.Control.OpsTool.extend('OPTheme', {

          init: function (element, options) {
            var self = this;
            options = AD.defaults({
              templateDOM: '/opstools/OPTheme/views/OPTheme/OPTheme.ejs'
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);

            this.data = {};

            this.loadDOM();

          },


          loadDOM: function () {
            var _this = this;

            // Asynchronously Load the Template
            can.view(this.options.templateDOM, {}, function (frag) {
              _this.element.html(frag);

              // now that the HTML is in the DOM, attach our components:
              _this.initDOM();
            })
          },


          initDOM: function () {
            var _this = this;

            this.dom = {};

            webix.ready(function () {
              _this.dom.layoutGrid = webix.ui({
                type: "space",
                width: 1200,
                height: 600,
                container: "container-webix-layout",
                rows: [
                  {
                    type: 'header', template: 'Theme Builder Wizard'
                  },
                  {
                    cols: [
                      {
                        view: "list",
                        id: "my-optheme-list",
                        select: true,
                        scroll: true,
                        width: 300,
                        template: "#name#",
                      },
                      {
                        view: "form",
                        id: "my-optheme-form",
                        width: 870,
                        elements: [
                          {
                            view: "text",
                            label: "Theme Name *",
                            name: "name",
                            labelWidth: 220,
                            placeholder: 'Theme name'
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Body BG",
                                labelWidth: 220,
                                name: "vars[bodyBG]"
                              },
                              {
                                view: "colorpicker",
                                label: "Header BG",
                                labelWidth: 220,
                                name: "vars[headerBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Header Color",
                                labelWidth: 220,
                                name: "vars[headerColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Navigation BG",
                                labelWidth: 220,
                                name: "vars[navBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Pagination Button Color",
                                labelWidth: 220,
                                name: "vars[paginationBtnColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Pagination Button BG",
                                labelWidth: 220,
                                name: "vars[paginationBtnBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Pagination Button Active Color",
                                labelWidth: 220,
                                name: "vars[paginationActiveBtnColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Pagination Active Button BG",
                                labelWidth: 220,
                                name: "vars[paginationActiveBtnBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Button Color",
                                labelWidth: 220,
                                name: "vars[btnColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Button BG",
                                labelWidth: 220,
                                name: "vars[btnBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Navigation Button Color",
                                labelWidth: 220,
                                name: "vars[navBtnColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Navigation Button BG",
                                labelWidth: 220,
                                name: "vars[navBtnBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Navigation Button Active Color",
                                labelWidth: 220,
                                name: "vars[navActiveBtnColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Navigation Active Button BG",
                                labelWidth: 220,
                                name: "vars[navActiveBtnBG]"
                              }
                            ]
                          },
                          {
                            cols: [
                              {
                                view: "colorpicker",
                                label: "Table Header Color",
                                labelWidth: 220,
                                name: "vars[tableHeaderColor]"
                              },
                              {
                                view: "colorpicker",
                                label: "Table Header BG",
                                labelWidth: 220,
                                name: "vars[tableHeaderBG]"
                              }
                            ]
                          },
                          {
                            view: "button",
                            name: "optheme-addTheme",
                            label: "Create new theme",
                            inputWidth: 200,
                            icon: "plus-circle", //font-awesome icons class
                            type: "iconButton",
                            align: "right",
                            click: function () {
                              if (this.getParentView().validate()) {
                                var theme = this.getFormView().getValues();
                                // Disable submit button
                                this.getParentView().elements['optheme-addTheme'].disable();
                                // Save theme
                                _this.addTheme(theme, this);
                              } else {
                                webix.message({
                                  type: "error",
                                  text: "Please provide a theme name"
                                });
                              }

                            }
                          }
                        ],
                        rules: {
                          name: "isNotEmpty"
                        },
                      },
                    ]
                  },
                  {
                    rows: [
                      {
                        cols: [
                          {
                            view: "button",
                            width: 280,
                            icon: "heart",
                            type: "iconButton",
                            label: 'Set as default theme',
                            id: "optheme-set-default",
                            align: 'center',
                            click: function (event) {
                              var selectedTheme = $$("my-optheme-list").getSelectedItem();
                              if (typeof selectedTheme !== 'undefined') {
                                var themeName = selectedTheme.name;
                                this.disable();
                                _this.setDefaultTheme(themeName, this);
                              } else {
                                webix.message({
                                  type: "error",
                                  text: "Please select a theme from list"
                                });
                              }
                            }
                          }
                        ]
                      }
                    ]

                  }
                ]
              })
            });

            // Transform the encoded ejs template into an actual EJS template
            // there is no need of it right now since all template is being made by webix


            // now load our data:
            this.loadData();

          },


          loadData: function () {
            var _this = this;

            // request a list of themes from the server and display them:
            AD.comm.service.get({url: '/optheme'})
              .fail(function (err) {
                AD.error.log('Error loading themes list', {error: err});
              })
              .done(function (list) {

                $$('my-optheme-list').clearAll();
                $$('my-optheme-list').parse(list);

              });


          },


          'addTheme': function (values, form) {

            var _this = this;
            AD.comm.service.post({url: '/optheme', params: values})
              .fail(function (err) {
                webix.message({
                  type: "error",
                  text: "Error creating new theme"
                });
                form.getParentView().elements['optheme-addTheme'].enable();
                AD.error.log("Error creating new theme", {error: err, values: values});
              })
              .then(function () {

                // server transaction complete.
                form.getParentView().elements['optheme-addTheme'].enable();

                // should now update your list of current themes
                _this.loadData();

                webix.message({
                  type: "info",
                  text: "Theme was created"
                });

              })

          },


          'setDefaultTheme': function (themeName, defaultButton) {

            AD.comm.service.post({url: '/optheme/default', params: {name: themeName}})
              .fail(function (err) {
                defaultButton.enable();
                AD.error.log('Error setting OPTheme.default', {error: err, name: themeName});
              })
              .done(function (status) {

                // now try to load the selected theme:
                steal('opstools/OPTheme/themes/' + themeName);
                defaultButton.enable();
              })

          },

        });

      });
    });

  }
);
