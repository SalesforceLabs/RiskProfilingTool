({
    doInit : function(component, event, helper) {
        const startPage = component.get("v.startPage");
        if (startPage) {
            helper.callServer(
                component,
                "c.getTemplates",
                function (response) {
                    if (response.length > 0) {
                        component.set("v.templates", response);
                        component.find("templateList").set("v.value", response[0].Id);
                    }
                },
                function () {},
                {}
            );
        } else {
            const template = component.get('v.template');
            if (template) {
                helper.getQuestions(component, template.Id);
            }
        }
        helper.getRiskProfiles(component);
    },
    scriptsLoaded : function(component, event, helper) {
        helper.initSortable(component);            
    },
    backButton : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },
    loadButton : function(component, event, helper) {
        const templateId = component.find("templateList").get("v.value");
        const templates = component.get("v.templates");
        for (let i = 0; i < templates.length; i++) {
            if (templates[i].Id === templateId) {
                component.set("v.template", templates[i]);
                helper.getQuestions(component, templates[i].Id);
                component.set("v.startPage", false);
            }
        }
        
    },
    addQuestion : function(component, event, helper) {
        const question  = event.getParam("question");
        const answers   = event.getParam("answers");
        const questions = component.get("v.questions");
        
        if (question.Id == undefined) {
            question.Order_Number__c = 0;
            if (questions.length > 0) {
                question.Order_Number__c = questions[questions.length - 1].Order_Number__c + 1;
            }
        }
        
        helper.toggle(component);
        helper.callServer(
            component,
            "c.updateQuestion",
            function (response) {
                component.set("v.questions", response);
                helper.refreshTemplate(component);
            },
            function () {
                helper.toggle(component);
            },
            {
                "question"  : question,
                "answers"   : answers,
                "todelete"  : event.getParam("todelete"),
                "templateId": component.get("v.template").Id
            }
        );
    },
    createTemplate : function(component, event, helper) {
        const templateName = component.find("templateName").get("v.value");
        if (templateName) {
            helper.callServer(
                component,
                "c.addTemplate",
                function (response) {
                    component.set("v.template", response);
                    component.set("v.startPage", false);
                },
                function () {},
                {
                    "templateName": templateName
                }
            );
        } else {
            helper.showToast('Error', 'Template name must not be empty.', 'error');
        }
    },
    saveOrder : function(component, event, helper) {
        const questionIds = component.get("v.questionIds");
        let questions = component.get("v.questions");
        for(var i = 0; i < questions.length; i++) {
            for (var j = 0; j < questionIds.length; j++) {
                if (questions[i].Id == questionIds[j]) {
                    questions[i].Order_Number__c = j;
                }
            }
        }
        questions.sort(function(a,b) {
            return (a.Order_Number__c > b.Order_Number__c) ? 1 :
            ((a.Order_Number__c < b.Order_Number__c) ? -1 : 0);
        });
        
        helper.toggle(component);        
        helper.callServer(
            component,
            "c.updateQuestionOrder",
            function (response) {
                component.set("v.questions", response);
            },
            function () {
                helper.toggle(component);  
            },
            {
                "questions": questions
            }
        );
    },
    deleteQuestion : function(component, event, helper) {
        const selQ = event.getParam("selectedQuestion");
        
        helper.toggle(component);        
        helper.callServer(
            component,
            "c.removeQuestion",
            function (response) {
                let questions = component.get("v.questions");
                for (let i = 0; i < questions.length; i++) {
                    if (questions[i].Id === selQ.Id) {
                        questions.splice(i, 1);
                    }
                }
                component.set("v.questions", questions);
                helper.showToast('Question has been deleted!', selQ.Name, 'success');
                helper.refreshTemplate(component);
            },
            function () {
                helper.toggle(component);  
            },
            {
                "questionId": selQ.Id
            }
        );
    },
    editQuestion : function(component, event, helper) {
        let modalBody;
        $A.createComponent("c:ATR_Modal", {
            'template'   : component.get("v.template"),
            'question'   : event.getParam("selectedQuestion"),
            'answers'    : event.getParam("choices"),
            'actionName' : 'Edit'
        }, function(content, status) {
            if (status === "SUCCESS") {
                modalBody = content;
                component.find('ModalDialogPlaceholder').showCustomModal({
                    header: "Edit Question",
                    body: modalBody,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        
                    }
                })
            }
        });
    },
    addNewQuestion: function(component, event, helper) {
        const question = {
            'sobjectType'              : 'ATR_Question__c',
            'Name'                     : '',
            'Question__c'     : '',
            'Order_Number__c' : 0
        };
        
        let modalBody;
        $A.createComponent("c:ATR_Modal", {
            'template'   : component.get("v.template"),
            'question'   : question,
            'actionName' : 'Add'
        }, function(content, status) {
            if (status === "SUCCESS") {
                modalBody = content;
                component.find('ModalDialogPlaceholder').showCustomModal({
                    header: "Add New Question",
                    body: modalBody,
                    showCloseButton: true,
                    cssClass: "mymodal",
                    closeCallback: function() {
                        
                    }
                })
            }
        });
    },
    navigate: function(component, event, helper) {
        const homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "Risk_Profile__c"
        });
        homeEvent.fire();
    }
})