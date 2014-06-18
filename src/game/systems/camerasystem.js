define([
    
    'ash',
    'utils/Point',
    'utils/MathUtils',
    'brejep/keyboard',

    'game/components/controls/cameracontrols',
    //'game/components/camera',
 
    'game/nodes/collision/herocollision'

], function(

    Ash,
    Point,
    MathUtils,
    Keyboard,

    CameraControls,
    //Camera,

    HeroCollisionNode

    ) {

    var CameraSystem = Ash.System.extend({
    
        convert: true,
        world: null,
        width: null,
        height: null,
        keyPoll: null,
        controls: null,
        hero: null,

        constructor: function(world, gameState, keyPoll) {

            this.world = world;
            this.width = gameState.width;
            this.height = gameState.height;

            this.zoom = 0.65; 
            this.zoomMin = 0.25;
            this.zoomMax = 2;
            this.zoomSpeed = 0.05;
            this.position = new Point(0,0);

            this.keyPoll = keyPoll;
            this.controls = new CameraControls(
                Keyboard.I,
                Keyboard.O,
                this.zoom
            );

            return this;
        },

        update: function(time) {

            //TO DO: delegate this to keyboard control system
            if (this.keyPoll.isDown(this.controls.zoomIn)) this.zoomIn();
            if (this.keyPoll.isDown(this.controls.zoomOut)) this.zoomOut();

            if (this.controls.zoom !== this.zoom) this.zoomTo(this.controls.zoom);

            if (this.hero.head) this.position = this.hero.head.physics.position;

            if (!this.convert) {
                this.world.pivot.x = this.position.x - this.getOffset().x;
                this.world.pivot.y = this.position.y - this.getOffset().y;
            } else {
                this.world.pivot.x = MathUtils.m2p(this.position.x) - this.getOffset().x;
                this.world.pivot.y = MathUtils.m2p(this.position.y) - this.getOffset().y;
            }
        },

        /*


        METHODS


        */

        zoomIn: function() {
        
            this.zoom = this.zoom + this.zoomSpeed;
            if (this.zoom < this.zoomMin) this.zoom = this.zoomMin;
            if (this.zoom > this.zoomMax) this.zoom = this.zoomMax;
            this.world.scale = new Point(this.zoom, this.zoom);
        },

        zoomOut: function() {

            this.zoom = this.zoom - this.zoomSpeed;
            if (this.zoom < this.zoomMin) this.zoom = this.zoomMin;
            if (this.zoom > this.zoomMax) this.zoom = this.zoomMax;
            this.world.scale = new Point(this.zoom, this.zoom);
        },

        zoomTo: function(n) {
            if (n > this.zoomMin && n < this.zoomMax) {
                this.world.scale = new Point(this.zoom, this.zoom);
            }
        },

        // moveTo: function(pos) {
        //     follow = null;
        //     position = pos;
        // },

        /*


        UTIL


        */

        getOffset: function() {
            return new Point(
                (this.width * 0.5) / this.world.scale.x,
                (this.height * 0.5) / this.world.scale.y
            );
        },


        /*


        ADD / REMOVE


        */


        addToEngine: function(engine) {
            this.hero = engine.getNodeList(HeroCollisionNode);
            this.world.scale.x = this.zoom;
            this.world.scale.y = this.zoom;
        },

        removeFromEngine: function(engine) {
            this.hero = null;
            this.world = null;
        }
    });

    return CameraSystem;
});
