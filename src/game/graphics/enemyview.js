define(['pixi'], function (PIXI) { 

    "use strict";

    function EnemyView(id, width, height, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);
        
        self.state = null; 
        self.gameState = gameState;

        self.id = id;
        self.width = width;
        self.height = height;
        self.color = self.gameState.palette.enemy;

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

                    g.beginFill(self.color);
                    g.moveTo(-w2, -h2);
                    g.lineTo(w, -h2);
                    g.lineTo(0, 0);
                    g.lineTo(w, h2);
                    g.lineTo(-w2, h2);
                    g.lineTo(-w*0.25, 0);
                    //g.lineTo(-w, -h2);
                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);
        return self;
    }

    EnemyView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    EnemyView.prototype.constructor = EnemyView;

    return EnemyView;
});