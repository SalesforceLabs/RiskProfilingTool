({
    toggle : function(component, event, helper) {
        const tooltip = component.find('helpText');
        $A.util.toggleClass(tooltip, "slds-hide");
    }
})