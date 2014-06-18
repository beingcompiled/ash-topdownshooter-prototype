define(['ash'], function (Ash) {
    
    var PaletteBlack = Ash.Class.extend({
        
        constructor: function() {

          this.stage = 0xffffff;//PIXI stage takes an hex int, not string
          this.generic = "0x000000";
          this.hero = "0x000000";
          this.projectile = "0x000000";
          this.enemy = "0x000000";
          this.wyrm = "0x000000";
          this.wall = "0x000000";
          this.tree = "0x000000";
          this.water = "0x000000";
        }
    });

    return PaletteBlack;
});
