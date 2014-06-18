define([

    'ash',
    'utils/Point',
    'utils/MathUtils',

    'game/nodes/motioncontrol',
    'game/nodes/bowcontrol',

], function (Ash, Point, MathUtils, MotionControlNode, BowControlNode) {

    var KeyboardControlSystem = Ash.System.extend({

        nodesMovers: null,
        nodesBow: null,
        keyPoll: null,
        keyCode: null,
        sounds: null,

        constructor: function (keyPoll, sounds) {
            
            this.keyPoll = keyPoll;
            this.sounds = sounds;

            return this;
        },


        /*


        UPDATE


        */


        update: function(time) {

            for(var node = this.nodesMovers.head; node; node = node.next) {
                this.updateNode(node, time);
            }
            
            for(var bow = this.nodesBows.head; bow; bow = bow.next) {
                if (this.keyPoll.isDown(bow.control.trigger)) {
                    bow.control.shooting = true;
                }
            }
        },

        updateNode: function (node, time) {

            var control = node.control,
                physics = node.physics,
                vx = physics.velocity.x, //update from chipmunk logic
                vy = physics.velocity.y,
                va = physics.angularVelocity,

                acc = control.acceleration,
                rate = control.rotationRate,
                maxF = control.maxSpeedForward,
                maxB = control.maxSpeedBackward,
                maxS = control.maxSpeedStrafe;
            
            if (this.keyPoll.isDown(control.left)) {
                if (this.keyPoll.isDown(control.strafe)) {
                    //strafe left
                    //if (vx < maxS && vx > -maxS) vx += Math.sin(va) * acc;
                    //if (vy < maxS && vy > -maxS) vy -= Math.cos(va) * acc;
                    vx = Math.sin(va) * maxS;
                    vy = -Math.cos(va) * maxS; 
                } else {
                    //turn left 
                    va -= MathUtils.d2r(rate);
                }
                control.touching = false;
            }
            if (this.keyPoll.isDown(control.right)) {
                if (this.keyPoll.isDown(control.strafe)) {
                    //strafe right
                    //if (vx < maxS && vx > -maxS) vx -= Math.sin(va) * acc;
                    //if (vy < maxS && vy > -maxS) vy += Math.cos(va) * acc;
                    vx = -Math.sin(va) * maxS;
                    vy = Math.cos(va) * maxS; 
                } else {
                    //turn right
                    va += MathUtils.d2r(rate);
                }
                control.touching = false;
            }
            if (this.keyPoll.isDown(control.backup)) {
                vx = -Math.cos(va) * maxB;
                vy = -Math.sin(va) * maxB;
                control.touching = false;
            }

            if (this.keyPoll.isDown(control.accelerate)) {
                vx = Math.cos(va) * maxF;
                vy = Math.sin(va) * maxF;
                //console.log("vx:", vx, "vy:", vy, "r:", physics.angularVelocity);
                control.touching = false;
            }

            //TO DO: quick hack for single key press
            if (this.keyCode == 81) {
                this.keyCode = null;
                this.sounds.playRandom(node, "teleport");
                control.isTeleporting = true;
            }

            physics.velocity.x = vx;
            physics.velocity.y = vy;
            physics.angle = physics.angularVelocity = va;
        },


        onKeyDown: function(e, scope) {
            scope.keyCode = e.keyCode;
        },


        /*


        Add / Remove


        */


        addToEngine: function (engine) {
            this.nodesMovers = engine.getNodeList(MotionControlNode);
            this.nodesBows = engine.getNodeList(BowControlNode);
            this.keyPoll.addEventListener("keyup", this.onKeyDown, this);
        },

        removeFromEngine: function (engine) {
            this.nodesMovers = null;
            this.nodesBows = null;
        }
    });

    return KeyboardControlSystem;
});