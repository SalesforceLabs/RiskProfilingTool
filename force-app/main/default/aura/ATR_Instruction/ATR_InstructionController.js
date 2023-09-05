({
    doInit: function(component, event, helper) {
        helper.getRiskProfiles(component, event, helper);
        helper.getTemplates(component, event, helper);
    },
    loadRiskProfileHome: function(component, event, helper) {
        const homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Risk_Profile__c"
        });
        homeEvent.fire();
    },
    loadConfigTab: function(component, event, helper) {
        let modalBody;
        $A.createComponent("c:ATR_NewTemplateModal", { 
        }, function(content, status) {
            if (status === "SUCCESS") {
                modalBody = content;
                component.find('ModalDialogPlaceholder').showCustomModal({
                    header: "Create New Template",
                    body: modalBody,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                    }
                })
            }
        });
    }
})