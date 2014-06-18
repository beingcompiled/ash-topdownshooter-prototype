define(['ash'], function(Ash) {
	
    var Display = Ash.Class.extend({

        constructor: function(view) {
            
            this.id = view.id;
            this.view = view;
            this.color = view.color;
            this.update = this.view.update;
        }
    });

    return Display;
});
