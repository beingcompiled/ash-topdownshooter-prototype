define(['pixi'], function (PIXI) { 

    "use strict";

    function TreeView(id, width, height, gameState) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.id = id;
        self.width = width;
        self.height = height;
        self.state = null; 
        self.gameState = gameState;
        
        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            
            g.clear();

            switch (self.state) {

                case "idle" :

                    g.beginFill(self.gameState.palette.tree);
                    g.moveTo(0, -h2);
                    g.lineTo(w2, h2);
                    g.lineTo(-w2, h2);
                    g.lineTo(0, -h2);

                    // g.pivot.x = w2;
                    // g.pivot.y = h2;
                    break;
            }
        };

        var w = self.width,
            h = self.height,
            w2 = self.width * 0.5,
            h2 = self.height * 0.5,
            g = new PIXI.Graphics();

        self.update({state: "idle"});
        self.addChild(g);

        return self;
    }

    TreeView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    TreeView.prototype.constructor = TreeView;

    return TreeView;
});

/*
define(['Palette', 'pixi'], function (Palette) {
    
    function TreeView(id, w, h, palette) {
        this.initialise(id, w, h);
    }
    
    var api = TreeView.prototype;
    //TODO: remove these?
    api.x = 0;
    api.y = 0;
    api.width = 0;
    api.height = 0;
    api.rotation = 0;
    api.graphic = null;

    api.initialise = function(id, w, h) {
        //console.log(id, pos);
        api.id = id;
        api.width = w;
        api.height = h;
        api.color = palette.tree") || "0xFFFFFF";
        api.displayObject = api.draw();
        return api;
    };
    
    api.draw = function() {

        var w = this.width,
            h = this.height,
            w2 = this.width * 0.5,
            h2 = this.height * 0.5;

        var g = new PIXI.Graphics();
        g.beginFill(this.color);
        g.moveTo(0, -h2);
        g.lineTo(w2, h2);
        g.lineTo(-w2, h2);
        g.lineTo(0, -h2);

        return g;
    };
    
    return TreeView;
});
*/
