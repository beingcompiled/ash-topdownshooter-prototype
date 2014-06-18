define([

    'ash', 
    'game/components/controls/motioncontrols', 
    'game/components/attributes/physics',
    'game/components/attributes/life',
    'game/components/attributes/sound',

], function (Ash, MotionControls, Physics, Life, Sound) {

    var MotionControl = Ash.Node.create({
        control         : MotionControls,
        physics         : Physics,
        life	        : Life,
        sound           : Sound
    });

    return MotionControl;
});
