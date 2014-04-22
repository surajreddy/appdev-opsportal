/**
 * Global adapter opsportal
 *
 * The Ops Portal configuration allows you to configure the installed ops tools
 * for the portal.
 *
 */

module.exports.opsportal = {

  // list out all the possible permissions listed by
  permissions: {
    'hris.profile' : 'this user can access their individual user profile',
    'hrisadmin.objects':'this user has permission to define/redefine new objects to track in HRIS.'
  },


  // The ops portal is broken down into specific "areas".  Each area shows up
  // as a menu option on the Ops Portal [Menu] list.
  areas: [
/*
      {
          icon:'fa-user',   : one of the icons offered by the Font Awesome
                              library (http://fontawesome.io/icons/).
                              if not specified 'fa-beer' is the default.
                              I suggest coming up with something more appropriate

          key:'profile',    : a unique text key for this area. (does not have
                              to be the same as the label)
                              can be lowercase, uppercase, or a mix. Just make
                              sure it is unique.

          label:'Profile',  : the label that is displayed (will be translated)

          isDefault: true,  : consider this the default area to display when
                              portal is loaded.

          tools:[           : which installed tools reside in this area

              {
                  controller:'[name]',  : which tool in /assets/opstools
                                          this value == [directoryName]
                                          so you should have a
                                          /assets/opstools/[name]

                  label:'text',         : The label displayed for this tool


                  isDefault:true,       : consider this the default tool in an
                                          area to display. (default : false)


                  permissions:[         : define the actions required for a
                                          user to be able to access this tool
                                          each entry specifies a required permission.
                                          However > 1 entry are optional groups.
                                          For example, the following specifies
                                          user must have 'hrisadmin.objects' OR ( 'opsleader AND hrleader)
                      'hrisadmin.objects'
                      , [ 'opsleader', 'hrleader']
                  ]
              }

          ]
      },

 */
//      {
//          // User Profile Tool
//          icon:'fa-user',
//          key:'profile',
//          label:'Profile',
//          isDefault:false,
//          tools:[{
//              // Hris User Profile Tool
//              controller:'HrisUserProfile',
//              label:'Profile',
//              isDefault: true,
//              permissions:[
//                  'hris.profile'
//                  , 'developer'
//              ]
//          }]
//      },
      {
          // HR Admin Tools
          icon:'fa-wrench',
          key:'hradmin',
          label:'HR Admin',
          isDefault: false,
          tools:[
              {
                  // Hris Admin Objects
                  controller:'HrisAdminObjects',
                  label:'Configure Objects',
                  isDefault: true,
                  permissions:[
                      'hrisadmin.objects'
                      , 'developer'
                  ]
              }
          ]
      },
//      {
//          // Balance Report Tool
//          icon:'fa-user',
//          key:'balancereporttool',
//          label:'Balance Report Tool',
//          isDefault:true,
//          tools:[{
//              // Balance Report Tool
//              controller:'BalanceReportTool',
//              label:'Balance Report Tool',
//              isDefault: true,
//              permissions:[
//                  //'hris.profile'
//                  //, 'developer'
//				'developer'
//              ]
//          }]
//      },
//      {
//          icon:'fa-cogs',
//          key:'opsleader',
//          label:'Ops Leader',
//          tools:[{
//              // GMA Matrix Entry tool
//              controller:'GMAMatrix',
//              label:'GMA Matrix',
//              isDefault: true,
//              permissions:[
//                  'gma.matrix'
//                  , 'developer'
//              ]
//          }]
//      }
  ]
};