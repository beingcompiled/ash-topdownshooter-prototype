define(['ash'], function (Ash) {
    
    var MotionControls = Ash.Class.extend({
        
        constructor: function (left, right, accelerate, backup, run, strafe, teleport, rotationRate, maxSpeed) {

            this.left = left;
            this.right = right;

            //controls
            this.accelerate = accelerate;
            this.backup = backup;
            this.run = run;
            this.strafe = strafe;
            this.teleport = teleport;

            //values
            //this.acceleration = acceleration;
            this.rotationRate = rotationRate;
            this.maxSpeedForward = maxSpeed;
            this.maxSpeedBackward = maxSpeed * 0.85;
            this.maxSpeedStrafe = maxSpeed * 0.95;
            this.isTeleporting = false;

            //override keyboard math which is slightly different
            this.touching = false;
        }
    });

    return MotionControls;
});
