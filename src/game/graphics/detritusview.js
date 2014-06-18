define(['pixi'], function (PIXI) { 

    "use strict";

    function DetritusView(id, w, h, color, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = w;
        self.height = h;
        self.state = null; 
        self.gameState = gameState;

        var w2 = w * 0.5,
            h2 = h * 0.5,
            g = new PIXI.Graphics();

        g.position.x = w2;
        g.position.y = h2;
        g.pivot.x = w2;
        g.pivot.y = h2;

        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            
            g.clear();

            switch (self.state) {

                case "idle" :
                    g.beginFill(color);
                    var p1 = _.random(0, -w),
                        p2 = _.random(0,-h);
                    g.moveTo(p1,p2);
                    g.lineTo(_.random(0, w), 0);
                    g.lineTo(_.random(0, -w), _.random(0, h));
                    g.lineTo(p1,p2);
                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);
    }

    DetritusView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    DetritusView.prototype.constructor = DetritusView;

    return DetritusView;
});