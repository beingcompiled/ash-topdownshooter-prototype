define(['ash'], function (Ash) {
    
    var PaletteTarnish = Ash.Class.extend({
        
        constructor: function() {
          
            this.stage = 0xE0DED6;
            this.generic = "0x000000";
            this.hero = "0x111111";
            this.projectile = "0x9E7F5E";
            this.enemy = "0x590000";
            this.wyrm = "0x990000";
            this.wall = "0x666666";
            this.tree = "0x5B6452";
            this.water = "0x000066";
        }
    });

    return PaletteTarnish;
});
