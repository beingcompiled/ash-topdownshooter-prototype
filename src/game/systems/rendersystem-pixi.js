define([
    
    'ash',
    'utils/Point',
    'utils/MathUtils',

    'game/nodes/render',
    'game/nodes/collision/herocollision',

    'pixi'

], function(

    Ash,
    Point,
    MathUtils,

    RenderNode,
    HeroCollisionNode

    ) {

    var RenderSystem = Ash.System.extend({
    
        stage: null,
        renderer: null,
        physics: null,
        world: null,
        renderNodes: null,
        ready: null,

        constructor: function(stage, renderer, physics, world) {

            this.stage = stage;
            this.renderer = renderer;
            this.physics = physics;
            this.world = world;
            this.ready = false;
            
            return this;
        },

        update: function() {

            for (var node = this.renderNodes.head; node; node = node.next) {
                
                var physics = node.physics,
                    view = node.display.view;

                    view.position.x = MathUtils.m2p(physics.position.x);
                    view.position.y = MathUtils.m2p(physics.position.y);
                    view.rotation = physics.angle;
            }
            this.renderer.render(this.stage);
        },


        /*


        ADD / REMOVE


        */


        addToDisplay: function(node) {
            this.world.addChild(node.display.view);
        },

        removeFromDisplay: function(node) {
            this.world.removeChild(node.display.view);
        },


        /*


        UTILS


        */


        testStage: function() {

            // NOTE: dummy to test stage
            var g = new PIXI.Graphics();
            g.beginFill(0xFF00FF);
            g.moveTo(-10,-10);
            g.lineTo(10, -10);
            g.lineTo(10, 10);
            g.lineTo(-10, 10);

            this.world.addChild(g);  
        },


        /*


        ADD / REMOVE


        */


        addToEngine: function(engine) {

            var scope = this;

            this.renderNodes = engine.getNodeList(RenderNode);
            for (var node = this.renderNodes.head; node; node = node.next) {
                this.addToDisplay(node);
            }
            this.renderNodes.nodeAdded.add(this.addToDisplay, this);
            this.renderNodes.nodeRemoved.add(this.removeFromDisplay, this);

            this.stage.addChildAt(this.world, 0);
        },

        removeFromEngine: function(engine) {
            this.renderNodes = null;
        }
    });

    return RenderSystem;
});