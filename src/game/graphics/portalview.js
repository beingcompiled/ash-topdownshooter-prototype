define(['pixi'], function (PIXI) { 

    "use strict";

    function PortalView(id, radius, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = radius*2;
        self.height = radius*2;
        self.radius = radius*2;
        self.state = null; 
        self.gameState = gameState;

        var r = this.radius,
            r2 = r * 0.5,
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
                    g.beginFill("0x000000");//self.gameState.palette.enemy
                    g.drawCircle(r, r, r);

                    g.beginFill("0xffffff");//self.gameState.palette.enemy
                    g.drawCircle(r, r, r*0.9);

                    g.beginFill("0x000000");//self.gameState.palette.enemy
                    g.drawCircle(r, r, r*0.8);

                    g.beginFill("0xffffff");//self.gameState.palette.enemy
                    g.drawCircle(r, r, r*0.5);

                    //g.lineStyle("0x000000");//self.gameState.palette.enemy
                    //g.drawCircle(r2, r2, r2);
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