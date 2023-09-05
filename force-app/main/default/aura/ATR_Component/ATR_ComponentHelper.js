({    
    getQuestions: function(component){
        this.callServer(
            component,
            "c.getQuestions",
            function (response) {            
                component.set("v.ATRQuestions", response);
                // Retreive the first question
                // only when there is more than one question in a template
                if (response.length > 0) {
                    component.set("v.currentQuestion", response[0]);
                    // There is only one question in this template
                    if (response.length == 1) {
                        component.set("v.nextButton", false);
                    }
                } else {
                    this.showError(component, 'There is no question added for this template.');
                    component.set("v.showQuestion", false);
                }
            },
            { 
                "templateId": component.get("v.templateId") 
            }
        );
    },
    addResponse: function(component) {
        var question  = component.get("v.currentQuestion");
        var responses = component.get("v.questionResponses");
        var answered  = false;
        
        // Check if the question was answered before and change the response
        for (var i = 0; i < responses.length && !answered; i++) {
            var response = responses[i];
            if (response.ATR_Question__c == question.Id) {
                response.Response__c       = component.get("v.currentAnswer");
                response.Response_Score__c = component.get("v.currentScore");
                response.ATR_Question__c   = question.Id;
                answered = true;
            }
        }
        
        // Add a new response if it hasn't been answered already
        if (!answered && component.get("v.currentScore") !== undefined) {
            responses.push({
                'sobjectType'                : 'ATR_Question_Response__c',
                'Response__c'       : component.get("v.currentAnswer"),
                'Response_Score__c' : component.get("v.currentScore"),
                'ATR_Question__c'   : question.Id
            });
        }
        component.set("v.questionResponses", responses);
    },
    updateQuestion: function(component, next) {
        var questions = component.get("v.ATRQuestions");
        var newIndex  = component.get("v.currentIndex") + (next ? 1 : -1);
        
        // Update visibility of buttons
        component.set("v.prevButton", newIndex !== 0);
        component.set("v.nextButton", newIndex !== questions.length - 1);
        
        // Update progress tracker
        var width   = (newIndex / (questions.length - 1)) * 100;
        var percent = (newIndex / questions.length) * 100;
        component.set("v.progresswidth",   parseInt(width));
        component.set("v.progresspercent", parseInt(percent));
        
        // Update question
        var responses = component.get("v.questionResponses");
        var question  = questions[newIndex];
        var response = responses.find(function(item) {
            return item.ATR_Question__c == question.Id;
        });
        if (response) {
            component.set("v.currentAnswer", response.Response__c);
            component.set("v.currentScore",  response.Response_Score__c);
        } else {
            component.set("v.currentAnswer", undefined);  // Reset answer
            component.set("v.currentScore",  undefined);  // Reset score
        }
        
        component.set("v.currentIndex",    newIndex);
        component.set("v.currentQuestion", question);
    },
    submitAnswers: function(component) {
        this.callServer(
            component,
            "c.submitAnswers",
            function (response) {
                component.set("v.ATRTaken", response);
                component.set("v.atrPages", false); // Toggle to show the result
            },
            { 
                "templateId": component.get("v.templateId"),
                "clientId"  : component.get("v.clientId"),
                "responses" : component.get("v.questionResponses")
            }
        );
    },
    showResult: function(component) {
        try {
            var resultEvent = component.getEvent("showResult");
            var atrTaken    = component.get("v.ATRTaken");
            resultEvent.setParams({
                "ATRTaken"  : atrTaken
            });
            resultEvent.fire();
        } catch (e) {
            console.log(e.message);
            this.showToast('Error', 
                           'An error has occurred. Error: ' + e.message,
                           'error');
        }
    },
    showError: function(component, errorText) {
        var errorTextCmp = component.find("errorMessage");
        component.set('v.errorText', errorText);
        $A.util.removeClass(errorTextCmp, 'hideError');
        $A.util.addClass(errorTextCmp, 'showError');
    },
    hideError: function(component) {
        var errorTextCmp = component.find("errorMessage");
        $A.util.addClass(errorTextCmp, 'hideError');
        component.set('v.errorText', '');
    },
    callServer: function(component, method, callback, params) {
        var action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // pass returned value to callback function
                callback.call(this, response.getReturnValue());
            } else if (state === "ERROR") {
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        this.showToast('Error', 
                                       'An error has occurred. Error: ' + errors[0].message,
                                       'error');
                    }
                } else {
                    this.showToast('Error', 
                                   'An unknown error has occurred.',
                                   'error');
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": 'dismissible'
        });
        toastEvent.fire();
        $A.get('e.force:refreshView').fire();
        
    }
})