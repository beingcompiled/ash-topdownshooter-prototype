define(['ash'], function (Ash) {
    
    var Sound = Ash.Class.extend({
        
        constructor: function() {
			this.test = false;
            this.explosion = false;
            this.shoot = false;
            this.powerup = false;
            this.hit = false;
            this.jump = false;
            this.blip = false;
        }
    });

    return Sound;
});
