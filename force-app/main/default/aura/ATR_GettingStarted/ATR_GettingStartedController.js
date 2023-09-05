({
    handleActive: function (component, event, helper) {
        const tab = event.getSource();
        switch (tab.get('v.id')) {
            case 'startTab' :
                helper.injectComponent(component, 'c:ATR_Instruction', tab);
                break;
            case 'configTab' :
                helper.injectComponent(component, 'c:ATR_Configuration', tab);
                break;
        }
    },
    handleFocus: function(component, event, helper) {
        const tabName  = event.getParam('tabName');
        const template = event.getParam('template');
        
        // Switch to the configuration tab and load the template created
        component.set('v.selectedTabId',   tabName);
        component.set('v.template',        template);
        component.set('v.showNewTemplate', true);
        
        const tab = component.find(tabName);
        helper.injectComponent(component, 'c:ATR_Configuration', tab);
    }
})