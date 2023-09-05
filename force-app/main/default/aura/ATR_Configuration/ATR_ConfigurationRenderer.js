({
    rerender : function(component, helper){
        this.superRerender();
        helper.initSortable(component);            
    }
})