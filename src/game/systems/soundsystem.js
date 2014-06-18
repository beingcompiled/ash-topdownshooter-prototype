define([

    'ash',
    'utils/Point',
    'game/nodes/soundnode',
    'audio',
    'jsfx',
    'jsfxlib'

], function (

    Ash, 
    Point,
    SoundNode,
    audio,
    jsfx,
    jsfxlib

) {
    
    var AudioSystem = Ash.System.extend({

        nodes: null,
        volume: null,
        audioLibParams: null,
        sounds: null,

        constructor: function(audioLibParams) {

            this.audioLibParams = audioLibParams;
            this.volume = 0.25;

            return this;
        },

        update: function(time) {
            for (node = this.nodes.head; node; node = node.next) {
                var sounds = node.sound.sounds;
                for (var sound in sounds) {
                    if (sounds[sound]) {
                        var soundArray = this.sounds[sound],
                            randomIndex = _.random(0, soundArray.length);
                        soundArray[randomIndex].play();
                    }
                }
            }
        },


        /*


        ADD / REMOVE


        */
        

        addToEngine: function(engine) {
            this.sounds = jsfxlib.createWaves(this.audioLibParams);
            this.nodes = engine.getNodeList(SoundNode);
        },

        removeFromEngine: function(engine) {
            this.nodes = null;
        }
    });

    return AudioSystem;
});