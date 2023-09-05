({
    toggle: function (component, event) {
        const spinner = component.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    showToast : function(title, message, type) {
        const toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title":   title,
            "message": message,
            "type":    type,
            "mode":    'dismissible'
        });
        toastEvent.fire();
    },
    initSortable : function(component) {
        var answerList = component.find("answerList");
        if (answerList) {
            try {
                var listElem = answerList.getElement();
                if (jQuery && typeof jQuery.ui != 'undefined') {
                    $(listElem).sortable({
                        axis: 'y',
                        opacity: .6,
                        tolerance: 'pointer',
                        revert: true,
                        placeholder: 'sortable-placeholder',
                        update: function(event, ui) {
                            var cIdArray  = [];
                            var aList = $(listElem).find('.answerItem');
                            for (var i = 0; i < aList.length; i++) {
                                var aId = $(aList[i]).attr('id');
                                cIdArray.push(aId);
                            }
                            component.set("v.answerIds", cIdArray);
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