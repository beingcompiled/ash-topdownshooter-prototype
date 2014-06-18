define(['pixi'], function (PIXI) { 

    "use strict";

    function WyrmView(id, width, height, gameState) {
    
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

                    g.beginFill(self.gameState.palette.wyrm);

                    //wings
                    g.moveTo( 0, 0 );
                    g.lineTo( w, h2 );
                    g.lineTo( 0, h );
                    g.lineTo( w2, h2 );

                    //tail
                    g.moveTo( w2, h2 );
                    g.lineTo( w * 0.25, h * 0.4 );
                    g.lineTo( -w2, h2 );
                    g.lineTo( w * 0.25, h * 0.6 );

                    /*
                    //head
                    g.moveTo( 0, 0 );
                    g.lineTo( w, h2 );
                    g.lineTo( 0, h );

                    //tail
                    g.moveTo( 0, h * 0.25 );
                    g.lineTo( -w*2, h2 );
                    g.lineTo( 0, h *0.75 );

                    //wings
                    g.moveTo( -w, -h );
                    g.lineTo( 0, h2 );
                    g.lineTo( -w, h*2 );
                    g.lineTo( -w*0.75, h2 );
                    */
                    
                    g.pivot.x = w2;
                    g.pivot.y = h2;
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

    WyrmView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    WyrmView.prototype.constructor = WyrmView;

    return WyrmView;
});