define(['ash'], function (Ash) {
    
    var Palette = Ash.Class.extend({
        
        constructor: function() {

           this.generic = "0x000000";
           this.hero = "0x000000";
           this.enemy = "0x000000";
           this.projectile = "0x000000";
           this.wall = "0x000000";
           this.tree = "0x000000";
           this.stage = 0xffffff; //PIXI stage takes an hex int, not string
        }
    });

    return Palette;
});
