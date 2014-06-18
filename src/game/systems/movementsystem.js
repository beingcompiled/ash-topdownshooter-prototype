define([
    
    'ash', 
    'game/nodes/movement'

], function(

    Ash, 
    MovementNode

    ) {

    var MovementSystem = Ash.System.extend({

        gameState: null,
        nodeList: null,

        constructor: function(gameState) {
            this.gameState = gameState;
            return this;
        },

        update: function(time) {
            for(var node = this.nodeList.head; node; node = node.next) {
                this.updateNode(node, time);
            }
        },

        updateNode: function(node, time) {

            var physics = node.physics,
                vx = physics.velocity.x,
                vy = physics.velocity.y,
                va = physics.angularVelocity,
                fr = physics.friction;
                // a  = physics.acceleration, 
                // ax = Math.cos(va) * a,
                // ay = Math.sin(va) * a;

            var speed = Math.sqrt(vx * vx + vy * vy),
                angle = Math.atan2(vy, vx);
            if (speed > fr) {
                speed -= fr;
            } else {
                speed = 0;
            }
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;

            // vx += ax;
            // vy += ay;
            // vx *= fr;
            // vy *= fr;

            physics.velocity.x = vx;
            physics.velocity.y = vy;

            /*
            console.log("speed:", speed, "angle:", angle);
            */
        },

        addToEngine: function(engine) {
            this.nodeList = engine.getNodeList(MovementNode);
        },

        removeFromEngine: function(engine) {
            this.nodeList = null;
        }
    });

    return MovementSystem;
});
