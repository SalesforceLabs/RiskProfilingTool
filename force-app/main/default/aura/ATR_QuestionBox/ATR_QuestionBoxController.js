({
    doInit : function(component, event, helper) {
        helper.callServer(
            component,
            "c.getAnswerChoices",
            function (response) {
                if (response && response.length > 0) {
                    component.set("v.answers", response);
                }
            },
            { 
                'questionId' : component.get("v.question").Id
            }
        );
    },
    onSelectChange: function(component, event, helper){
        const selected = event.getSource();
        if (selected != null) {
            const updateEvent = component.getEvent("updateResponse");
            updateEvent.setParams({
                answer: selected.get("v.label"),
                score:  selected.get("v.value")
            });
            updateEvent.fire();
        }
    }
})