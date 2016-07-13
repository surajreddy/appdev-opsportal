/**
 * This file specifies any default Ops Portal Tool Definitions 
 * provided by this modlue.
 *  
 */
module.exports = [

    { 
        key:'opsportal.rbac', 
        permissions:'adcore.admin, adcore.developer, opsportal.rbac.view', 
        icon:'fa-users', 
        label:'opp.toolPermissions', 
        context:'opsportal', 
        controller:'RBAC', 
        isController:true, 
        options:{}, 
        version:'0' 
    // },
    // { 
    //     key:'opsportal.theme', 
    //     permissions:'adcore.admin, adcore.developer, opsportal.theme.view', 
    //     icon:'fa-file-image-o', 
    //     label:'opp.toolTheme', 
    //     context:'opsportal', 
    //     controller:'OPTheme', 
    //     isController:true, 
    //     options:{}, 
    //     version:'0' 
    }


];
