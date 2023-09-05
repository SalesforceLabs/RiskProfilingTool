({
    callServer: function(component, method, callback, params) {
        const action = component.get(method);
        if (params) {
            action.setParams(params);
        }
        
        action.setCallback(this,function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                // pass returned value to callback function
                callback.call(this, response.getReturnValue());
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
    getClient: function (component) {
        this.callServer(
            component,
            "c.getClient",
            function (response) {
                component.set("v.client", response);
            },
            { 
                "clientId": component.get("v.recordId")
            }
        );
    },
    getTemplates: function(component) {
        this.callServer(
            component,
            "c.getTemplates",
            function (response) {
                if (response.length > 0) {
                    component.set("v.templates", response);
                    component.set("v.templateId", response[0].Id) // Set the first template as the default
                }
            }, {}
        );
    },
    getRiskProfile: function (component) {
        var totalScore = component.get("v.ATRTaken").ATR_Score__c;
        
        this.callServer(
            component,
            "c.getRiskProfile",
            function (response) {
                if (response) {
                    component.set("v.riskProfile", response);
                    this.updateATR(component, response.Id);
                }
            },
            {
                score: totalScore.toString()
            }
        );
    },
    updateATR: function (component, riskProfileId) {
        this.callServer(
            component,
            "c.updateATR",
            function (response) {
                component.set("v.ATRTaken", response);
            },
            {
                atr:           component.get("v.ATRTaken"),
            	riskProfileId: riskProfileId
            }
        );
    },
    setTemplate: function(component) {
        const selected = component.find("templateList").get("v.value");
        const btn = component.find("startButton");
        if (selected != "") {
            component.set("v.templateId", selected);
            btn.set("v.disabled", false);
        } else {
            btn.set("v.disabled", true);
        }
    }
})