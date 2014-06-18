define(['ash'], function (Ash) {
    
    var PaletteWhite = Ash.Class.extend({
        
        constructor: function() {

          this.stage = 0x000000;//PIXI stage takes an hex int, not string
          this.generic = "0xffffff";
          this.hero = "0xffffff";
          this.projectile = "0xffffff";
          this.enemy = "0xffffff";
          this.wyrm = "0xffffff";
          this.wall = "0xffffff";
          this.tree = "0xffffff";
          this.water = "0xffffff";
        }
    });

    return PaletteWhite;
});
