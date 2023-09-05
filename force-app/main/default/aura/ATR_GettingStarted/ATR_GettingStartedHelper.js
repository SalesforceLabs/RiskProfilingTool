({
    injectComponent: function (component, name, target) {
        const params = {
            'template':  component.get('v.template'),
            'startPage': !component.get('v.showNewTemplate')
        };
        $A.createComponent(name, params,
        function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                target.set('v.body', contentComponent);
            } else {
                throw new Error(error);
            }
        });
    }
})