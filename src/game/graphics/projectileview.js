define(['pixi'], function (PIXI) { 

    "use strict";

    function ProjectileView(id, w, h, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = w;
        self.height = h;
        self.state = null; 
        self.gameState = gameState;
        
        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            
            g.clear();

            switch (self.state) {

                case "idle" :
                    g.beginFill(self.gameState.palette.projectile);
                    g.drawRect(0,0,w,h);
                    g.pivot.x = w2;
                    g.pivot.y = h2;
                    self.addChild(g); 
                    break;
            }
        };

        var w2 = w * 0.5,
            h2 = h * 0.5,
            g = new PIXI.Graphics();

        self.update({state: "idle"});
        self.addChild(g);
    }

    ProjectileView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    ProjectileView.prototype.constructor = ProjectileView;

    return ProjectileView;
});


/*
define(['Palette', 'pixi'], function (Palette) {
    
    function ProjectileView(id, w, h, palette) {
        this.initialise(id, w, h);
    }

    var api = ProjectileView.prototype;
    // api.x = 0;
    // api.y = 0;
    // api.rotation = 0;
    api.width = 0;
    api.height = 0;
    api.color = palette.projectile");
    //api.graphic = null;

    api.initialise = function(id, w, h) {

        api.id = id;
        api.width = w;
        api.height = h;
        api.displayObject = api.draw();
        return api;
    };

    api.draw = function() {

        var w = api.width,
            h = api.height,
            w2 = w*0.5,
            h2 = h*0.5;

        var g = new PIXI.Graphics();
        g.beginFill(this.color);
        g.pivot.x = w2;
        g.pivot.y = h2;
        g.drawRect(0,0,w,h); //this works
        return g;
    };

    return ProjectileView;
});
*/