({
    scriptsLoaded : function(component, event, helper) {
        helper.initSortable(component);
    },
    updateQuestion : function(component, event, helper) {
        const question     = component.get("v.question");
        const questionName = component.find("questionName").get("v.value");
        
        if (questionName) {
            if (questionName.length <= 255) {
                question.Question__c     = questionName;
                question.ATR_Template__c = component.get("v.template").Id;
                const updateEvt = $A.get("e.c:ATR_AddQuestion");
                updateEvt.setParams({
                    'question'    : question,
                    'answers'     : component.get("v.answers"),
                    'todelete'    : component.get("v.todelete")
                });
                updateEvt.fire();
                component.find("overlayLib1").notifyClose();
            } else {
                helper.showToast('Error', 'Question must not exceed 255 characters.', 'error');
            }
        } else {
            helper.showToast('Error', 'Question must not be empty.', 'error');
        }
    },
    addAnswer : function(component, event, helper) {
        let answers       = component.get("v.answers");
        const answerName  = component.find("answerName").get("v.value");
        const answerScore = component.find("answerScore").get("v.value");
        let newOrder      = 0;
        if (answers.length > 0) {
            newOrder = answers[answers.length - 1].Order_Number__c + 1;
        }
        
        if (!isNaN(parseInt(answerScore))) {
            if (answerName.length <= 50) {
                var answer = {
                    'sobjectType'              : 'ATR_Choice__c',
                    'Order_Number__c' : newOrder,
                    'Answer__c'       : answerName,
                    'Score__c'        : answerScore
                };
                answers.push(answer);
                component.set("v.answers", answers);
                
                helper.showToast('New answer has been added!', answerName, 'success');
                
                // Reset answer input
                component.find("answerName").set("v.value", "");
                component.find("answerScore").set("v.value", "");
            } else {
                helper.showToast('Error', 'Answer must not exceed 50 characters.', 'error');
            }
        } else {
            helper.showToast('Error', 'Score must be number type.', 'error');
        }
    },
    saveOrder : function(component, event, helper) {
        const answerIds = component.get("v.answerIds");
        let answers = component.get("v.answers");
        for(let i = 0; i < answers.length; i++) {
            for (let j = 0; j < answerIds.length; j++) {
                if (answers[i].Answer__c == answerIds[j]) {
                    answers[i].Order_Number__c = j;
                }
            }
        }
        answers.sort(function(a,b) {
            return (a.Order_Number__c > b.Order_Number__c) ? 1 :
            ((a.Order_Number__c < b.Order_Number__c) ? -1 : 0);
        });
        
        component.set('v.answers', answers);
    },
    deleteAnswer : function(component, event, helper) {
        const selA = event.getParam("selectedAnswer");
        let todelete = component.get("v.todelete");
        if (selA.Id) {
            todelete.push(selA);
        }
        component.set("v.todelete", todelete);
        let answers = component.get("v.answers");
        const index = event.getParam("index");
        if (index > -1) {
            answers.splice(index, 1);
        }
        component.set("v.answers", answers);
    }
})