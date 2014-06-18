define(['ash', 'utils/Point',], function (Ash, Point) {
    
    var Melee = Ash.Class.extend({
        
        constructor: function(damage, stagger) {
            this.damage = damage;
            this.stagger = stagger;
        }
    });

    return Melee;
});