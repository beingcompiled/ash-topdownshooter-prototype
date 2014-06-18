define(['pixi'], function (PIXI) { 

    "use strict";

    function PortalView(id, radius, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = radius*2;
        self.height = radius*2;
        self.radius = radius;
        self.state = null; 
        self.gameState = gameState;

        var r = radius,
            r2 = radius * 0.5,
            g = new PIXI.Graphics();

        g.position.x = -r2;
        g.position.y = -r2;
        g.pivot.x = r2;
        g.pivot.y = r2;
        
        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            g.clear();

            switch (self.state) {
                case "idle" :
                    g.beginFill("0x528B8B");//self.gameState.palette.enemy
                    g.drawCircle(r, r, r);
                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);

        return self;
    }

    PortalView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    PortalView.prototype.constructor = PortalView;

    return PortalView;
});