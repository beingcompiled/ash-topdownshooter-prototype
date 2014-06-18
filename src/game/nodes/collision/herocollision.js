define([
    
    'ash', 
    'game/components/entities/hero', 
    'game/components/controls/motioncontrols', 
    'game/components/attributes/physics',
    'game/components/attributes/life',
    'game/components/attributes/melee',
    'game/components/attributes/sound'

], function (Ash, Hero, MotionControls, Physics, Life, Melee, Sound) {
    
    var HeroCollision = Ash.Node.create({
        hero : Hero,
        control : MotionControls,
        physics : Physics,
        life : Life,
        melee : Melee,
        sound : Sound
    });

    return HeroCollision;
});