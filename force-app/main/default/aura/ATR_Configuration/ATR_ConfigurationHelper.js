({
    toggle: function (component) {
        const spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(title, message, type) {
        const toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": 'dismissible'
        });
        toastEvent.fire();
    },
    refreshTemplate: function(component) {
        this.callServer(
            component,
            "c.getTemplate",
            function (response) {
                component.set("v.template", response);
            },
            function() {},
            { 
                "templateId": component.get("v.template").Id 
            }
        );
    },
    getRiskProfiles: function(component) {
        this.callServer(
            component,
            "c.getProfiles",
            function (response) {
                component.set("v.profiles", response);
            },
            function() {},
            {}
        );
    },
    getQuestions: function(component, templateId) {
        this.callServer(
            component,
            "c.getTemplateQuestions",
            function (response) {
                component.set("v.questions", response);              
            },
            function() {},
            { 
                "templateId": templateId
            }
        );
    },
    callServer: function(component, method, successCallback, callbackInit, params) {
        const action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {
            callbackInit.call(this);
            const state = response.getState();
            if (state === "SUCCESS") {
                // pass returned value to callback function
                successCallback.call(this, response.getReturnValue());
            } else if (state === "ERROR") {
                // generic error handler
                const errors = response.getError();
                if (errors) {
                    console.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error" + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
        
        $A.enqueueAction(action);
    },
    initSortable : function(component) {
        var questionList = component.find("questionList");
        if (questionList) {
            try {
                var listElem = questionList.getElement();
                if (jQuery && typeof jQuery.ui != 'undefined') {
                    $(listElem).sortable({
                        axis: 'y',
                        opacity: .6,
                        tolerance: 'pointer',
                        revert: true,
                        placeholder: 'sortable-placeholder',
                        update: function(event, ui) {
                            var cIdArray  = [];
                            var aList = $(listElem).find('.questionItem');
                            for (var i = 0; i < aList.length; i++) {
                                var aId = $(aList[i]).attr('id');
                                cIdArray.push(aId);
                            }
                            component.set("v.questionIds", cIdArray);
                        }
                    });
                }
            } catch (e) {
                console.log(e.message);
                this.showToast('Error', 
                               'An error has occurred. Please refresh the current page in your browser.',
                               'error');
            }
        }
    }
})