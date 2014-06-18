define(['pixi'], function (PIXI) { 

    "use strict";

    function WallView(id, w, h, gameState) {
    
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
                    g.beginFill(self.gameState.palette.wall);
                    g.drawRect(-w2, -h2, w, h); 
                    //g.drawRect(0, 0, w, h);
                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);
    }

    WallView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    WallView.prototype.constructor = WallView;

    return WallView;
});