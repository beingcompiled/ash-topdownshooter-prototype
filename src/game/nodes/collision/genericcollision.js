define([
    
    'ash', 
    'game/components/entities/generic', 
    'game/components/attributes/physics',
    'game/components/attributes/display'
    //, 'game/components/attributes/sound'

], function (Ash, Wall, Physics, Display) {
    
    var GenericCollision = Ash.Node.create({
        generic : Wall,
        physics : Physics,
        display : Display
        //, sound   : Sound
    });

    return GenericCollision;
});