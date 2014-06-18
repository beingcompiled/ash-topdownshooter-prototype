define(['pixi'], function (PIXI) { 

    "use strict";

    function WaterView(id, w, h, gameState) {
    
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

        var waveWidth = 40,
            waveHeight = 20,
            spacingX = 0,
            spacingY = 10,
            cols = w / (waveWidth+spacingX),
            rows = h / (waveHeight+spacingY);
        
        self.update = function(message) {

            for (var prop in message) self[prop] = message[prop];
            
            g.clear();

            switch (self.state) {

                case "idle" :
                    g.beginFill(self.gameState.palette.water);
                    g.drawRect(-w2, -h2, w, h);

                    // for (var i=0; i<rows*cols; i++) { 
                        
                    //     var x = ((waveWidth + spacingX) * (i % cols)) -w2,
                    //         y = waveHeight + ((waveHeight + spacingY) * Math.floor(i / cols)) -h2;

                    //     g.moveTo(x,y);
                    //     g.lineTo(x+waveWidth*0.5, y-waveHeight);
                    //     g.lineTo(x+waveWidth, y);
                    // }

                    break;
            }
        };

        self.update({state: "idle"});
        self.addChild(g);
    }

    WaterView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    WaterView.prototype.constructor = WaterView;

    return WaterView;
});