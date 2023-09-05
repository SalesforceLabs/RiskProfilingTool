({
    doInit: function(component, event, helper) {
        helper.getQuestions(component);
        helper.hideError(component);
    },
    nextButton: function(component, event, helper) {
        var currentScore = component.get("v.currentScore");
        if (currentScore !== undefined) {
            helper.addResponse(component);
            helper.updateQuestion(component, true);
            helper.hideError(component);
        } else {
            helper.showError(component, 'You need to answer the question before proceeding.');
        }
    },
    prevButton: function(component, event, helper) {
        helper.addResponse(component);
        helper.updateQuestion(component, false);
        helper.hideError(component);
    },
    submitButton: function(component, event, helper) {
        var currentScore = component.get("v.currentScore");
        if (currentScore !== undefined) {
            helper.addResponse(component);
            // complete questionnaire
            helper.submitAnswers(component);
            helper.hideError(component);
        } else {
            helper.showError(component, 'You need to answer the question before proceeding.');
        }
    },
    close: function(component, event, helper) {
        var navEvt = $A.get('e.force:navigateToSObject');
        navEvt.setParams({
            recordId: component.get('v.clientId')
        });
        navEvt.fire();
    },
    handleUpdateResponse : function(component, event, helper){
        component.set("v.currentAnswer", event.getParam("answer"));
        component.set("v.currentScore",  event.getParam("score"));
    },
    handleShowResult: function(component, event, helper) {
        helper.showResult(component);
    }
})