define(['pixi'], function (PIXI) { 

    "use strict";

    function HudView(id, pos) {
    
        var self = this;
        PIXI.DisplayObjectContainer.call(self);

        self.width = 200;
        self.height = 40;
        self.margin = 10;
        self.data = null;
        
        var paddingX = 5,
            paddingY = 5,
            spacing = 0;

        var g = new PIXI.Graphics();
        g.lineStyle(1, "0xffffff");
        g.beginFill("0x000000");
        g.drawRect(0, 0, self.width, self.height);
        g.alpha = 0.25;
        self.addChild(g);

        var text = new PIXI.Text(id + ":", {font:"28px Arial", fill:"white"});
        text.position.x = paddingX;
        text.position.y = paddingY;
        self.addChild(text);

        self.update = function(data) {
            if (data !== self.data) {
                text.setText(id + ": " + data);
                self.data = data;
            }
        };

        return self;
    }

    HudView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    HudView.prototype.constructor = HudView;

    return HudView;
});