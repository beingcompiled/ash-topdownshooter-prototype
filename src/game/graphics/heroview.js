define(['pixi'], function (PIXI) { 

    "use strict";

    function HeroView(id, width, height, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = width;
        self.height = height;
        self.state = null; 
        self.gameState = gameState;

        var w = self.width,
            h = self.height,
            w2 = self.width * 0.5,
            h2 = self.height * 0.5,
            g = new PIXI.Graphics();

        g.position.x = w2;
        g.position.y = w2;
        g.pivot.x = w*0.25;
        g.pivot.y = h2;

        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            
            g.clear();

            switch (self.state) {

                case "idle" :
                    // g.beginFill("0xff00ff");
                    // g.drawRect(-w2, -h2, w, h);
                    g.beginFill(self.gameState.palette.hero);
                    g.moveTo(-w2, -h2);
                    g.lineTo(w2, 0);
                    g.lineTo(-w2, h2);
                    g.lineTo(-w, h*0.25);
                    g.lineTo(-w2, 0);
                    g.lineTo(-w, -h*0.25);
                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);

        return self;
    }

    HeroView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    HeroView.prototype.constructor = HeroView;

    return HeroView;
});