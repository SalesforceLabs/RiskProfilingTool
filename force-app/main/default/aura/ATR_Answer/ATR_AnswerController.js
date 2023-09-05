({
    deleteAnswer : function(component, event, helper) {
        const deleteEvt = component.getEvent("deleteAnswer");
        deleteEvt.setParams({
            'selectedAnswer': component.get("v.answer"),
            'index'         : component.get("v.index")
        });
        deleteEvt.fire();
    }
})