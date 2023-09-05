({
    doInit: function(component, event, helper){
        helper.getClient(component);
        helper.getTemplates(component);
        helper.setTemplate(component);
    },
    startButton: function(component, event, helper) {
        component.set("v.startPage", false);
        component.set("v.atrPages",  true);
    },
    selectTemplate: function(component, event, helper) {
        helper.setTemplate(component);
    },
    close: function(component, event, helper) {
        const navEvt = $A.get('e.force:navigateToSObject');
        navEvt.setParams({
            recordId: component.get('v.client.Id')
        });
        navEvt.fire();
    },
    handleShowResult: function(component, event, helper) {
        const atrTaken = event.getParam("ATRTaken");
        component.set("v.summaryPage", true);
        component.set("v.atrPages",    false);
        component.set("v.ATRTaken",    atrTaken);
        component.set("v.riskScore",   atrTaken.ATR_Score__c);
        helper.getRiskProfile(component);
    }
})