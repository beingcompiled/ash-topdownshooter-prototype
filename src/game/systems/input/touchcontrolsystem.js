  define([

    'ash',
    'utils/Point',
    'utils/MathUtils',
    
    'game/nodes/motioncontrol',
    'game/nodes/bowcontrol',

    'game/graphics/touchview',
    'game/graphics/touchmoveview'

], function (Ash, Point, MathUtils, MotionControlNode, BowControlNode, TouchView, MoveView) {

    var TouchControlSystem = Ash.System.extend({

        nodesMotion: null,
        nodesBow: null,

        stage: null,
        stageWidth: null,
        stageHeight: null,

        moveLtPos: null,
        touchLtDistance: null,
        touchLtAngle: null,
        touchLtView: null,
        moveLtView: null,

        moveRtPos: null,
        touchRtDistance: null,
        touchRtAngle: null,
        touchRtView: null,
        moveRtView: null,
        sound: false,

        constructor: function (stage, stageWidth, stageHeight, sound) {
            
            this.stage = stage;
            this.stageWidth = stageWidth;
            this.stageHeight = stageHeight;
            this.sound = sound;
            
            return this;
        },


        /*


        UPDATE


        */


        update: function(time) {
            for(var node = this.nodesMotion.head; node; node = node.next) {
                this.updateNode(node, time);
            }
        },

        updateNode: function (node, time) {

            var control = node.control;

            if (control.touching) {

                var physics = node.physics,
                    vx = physics.velocity.x,
                    vy = physics.velocity.y,
                    va = physics.angularVelocity,
                    ltPos = this.touchLtView.position,
                    rtPos = this.touchRtView.position,
                    maxF = control.maxSpeedForward;
    
                this.touchLtDistance = MathUtils.distanceTo(this.touchLtPos, this.moveLtPos); //*sigh
                this.touchLtAngle = MathUtils.angleTo(this.touchLtPos, this.moveLtPos);

                var perc = MathUtils.getPerc(this.touchLtDistance, 0, this.touchLtView.radius),
                    speed = MathUtils.getPoint(perc, 0, maxF);

                if (this.touchLtDistance > 0) {
                    va = this.touchLtAngle + MathUtils.r2d(44); //TO DO: WTF compensate?!
                    vx = Math.cos(va) * speed;
                    vy = Math.sin(va) * speed;
                }

                physics.angularVelocity = va;
                this.touchRtAngle = MathUtils.angleTo(rtPos, this.moveRtPos);
                
                physics.angle = this.touchRtAngle + MathUtils.r2d(44); // TO DO: WTF! COMPENSATE?
                physics.velocity.x = vx;
                physics.velocity.y = vy; 

                this.toggleTouchControls(1);
            
            }  else {
                
                this.toggleTouchControls(0);
            }   
        },

        toggleTouchControls: function(a) {

            if (this.touchLtView.alpha !== a) this.touchLtView.alpha = a;
            if (this.moveLtView.alpha !== a) this.moveLtView.alpha = a;
            if (this.touchRtView.alpha !== a) this.touchRtView.alpha = a;
            if (this.moveRtView.alpha !== a) this.moveRtView.alpha = a;
        },

        /*


        TOUCH HANDLERS


        */

        onTap: function(e, scope) {
            for(var node = this.nodesBow.head; node; node = node.next) {
                node.control.shooting = true;
            }
        },

        onTouchMove: function(e, scope) {

            var touchView,
                moveView,
                radius,
                origPos = new Point(),
                curPos = new Point(e.global.x, e.global.y);

            if (scope.hitTest(curPos, scope.touchLtView)) {

                touchView = scope.touchLtView;
                moveView = scope.moveLtView;
                origPos = touchView.position;
                radius = touchView.radius;

                scope.updateControl(origPos, curPos, radius, moveView, scope, "lt"); //WTF! can't believe how shitty scope is, forced to do this
            }

            if (scope.hitTest(curPos, scope.touchRtView)) {

                touchView = scope.touchRtView;
                moveView = scope.moveRtView;
                origPos = touchView.position;
                radius = touchView.radius;

                scope.updateControl(origPos, curPos, radius, moveView, scope, "rt");
            }

            for(var node = this.nodesMotion.head; node; node = node.next) {
                node.control.touching = true;
            }
        },

        updateControl: function(origPos, curPos, radius, moveView, scope, type) {

            var a = MathUtils.angleTo(origPos, curPos) + MathUtils.d2r(90), //TO DO: wtf compensate?!
                d = MathUtils.distanceTo(origPos, curPos),
                newPos = new Point(0,0);

            if (Math.ceil(d) >= radius) {
                newPos.x = Math.cos(a) * radius + origPos.x;
                newPos.y = Math.sin(a) * radius + origPos.y;
            } else {
                newPos.x = curPos.x;
                newPos.y = curPos.y;
            }

            moveView.position = newPos;
            (type == "lt") ? scope.moveLtPos = newPos : scope.moveRtPos = newPos;
        },

        hitTest: function(point, view) {

            var p = new Point(view.position.x, view.position.y),
                d = MathUtils.distanceTo(p, point);

            //extra large radius for superior handling
            if (d < view.radius*2) return true;

            return false;
        },


        /*


        Add / Remove


        */


        addTouchControl: function() {

            var scope = this,
                onTouchStart = scope.onTouchStart,
                onTouchMove = scope.onTouchMove,
                onTouchEnd = scope.onTouchEnd,
                onTap = scope.onTap;

            var w = scope.stageWidth,
                touchLtView = new TouchView(w),
                moveLtView = new MoveView(w),
                touchRtView = new TouchView(w),
                moveRtView = new MoveView(w);

            var marginX = scope.stageWidth * 0.15,
                marginY = scope.stageHeight * 0.2,
                posLt = new Point(marginX, scope.stageHeight - marginY),
                posRt = new Point(scope.stageWidth - marginX, scope.stageHeight - marginY);

            scope.touchLtPos = posLt;
            scope.moveLtPos = posLt;
            scope.touchRtPos = posRt;
            scope.moveRtPos = posRt;

            touchLtView.position = moveLtView.position = scope.touchLtPos;
            touchRtView.position = moveRtView.position = scope.touchRtPos;
            touchLtView.alpha = 1; //WTF PIXI ?! visible bwoken?
            touchRtView.alpha = 1; //WTF PIXI ?! visible bwoken?

            scope.stage.addChildAt(touchLtView, 0);
            scope.stage.addChild(moveLtView);
            scope.stage.addChildAt(touchRtView, 0);
            scope.stage.addChild(moveRtView);

            scope.touchLtView = touchLtView;
            scope.moveLtView = moveLtView;
            scope.touchRtView = touchRtView;
            scope.moveRtView = moveRtView;

            scope.stage.setInteractive(true);
            scope.stage.touchmove = function(e) {
                scope.onTouchMove(e, scope);
            };

            scope.stage.setInteractive(true);
            scope.stage.touchstart = function(e) {
                scope.onTouchMove(e, scope);
            };
            scope.stage.tap = function(e) {
                scope.onTap(e, scope);
            };

            //WTF PIXI? touchendoutside no work?!!!
        },


        /*


        ADD / REMOVE


        */


        addToEngine: function (engine) {
            this.nodesMotion = engine.getNodeList(MotionControlNode);
            this.nodesBow = engine.getNodeList(BowControlNode);
            this.addTouchControl();
        },

        removeFromEngine: function (engine) {
            this.nodesMotion = null;
            this.nodesBow = null;
        }
    });

    return TouchControlSystem;
});