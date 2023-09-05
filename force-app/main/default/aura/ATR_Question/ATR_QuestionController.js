({
    doInit: function(component, event, helper) {
        const action = component.get("c.getAnswers");
        action.setParams({
            "questionId": component.get("v.question").Id
        });

        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.choices", response.getReturnValue());
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
    },
    removeQuestion: function(component, event, helper) {
        const removeEvt = component.getEvent("deleteQuestion");
        removeEvt.setParams({
            'selectedQuestion' : component.get("v.question")
        });
        removeEvt.fire();
    },
    editQuestion: function(component, event, helper) {
        const editEvt = component.getEvent("editQuestion");
        editEvt.setParams({
            'selectedQuestion': component.get("v.question"),
            'choices':          component.get("v.choices")
        });
        editEvt.fire();
    }

})