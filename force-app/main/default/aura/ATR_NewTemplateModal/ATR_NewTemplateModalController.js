({
    save : function(component, event, helper) {
        const action = component.get("c.addTemplate");
        const templateName = component.find("templateName").get("v.value");
        
        if (templateName) {
            action.setParams({
                "templateName": templateName
            });
            
            action.setCallback(this, function(response) {
                const state = response.getState();
                if (state === "SUCCESS") {
                    const template = response.getReturnValue();
                    component.set("v.template", template);
                    
                    const evt = $A.get("e.c:ATR_ChangeTabFocus");
                    evt.setParams({
                        tabName: 'configTab',
                        template: template
                    }).fire();
                    component.find('overlay1').notifyClose();
                } else {
                    const errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            helper.showToast('Error', 'Template name must not be empty.', 'error');
        }
    }
})