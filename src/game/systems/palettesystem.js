define([
    
    'ash',
    'utils/Point',
    'brejep/keyboard',

    'game/components/controls/palettecontrols', 
    'game/nodes/render',

    'game/components/palettes/black',
    'game/components/palettes/white',
    'game/components/palettes/tarnish'

], function(

    Ash,
    Point,
    Keyboard,

    PaletteControls,
    RenderNode,

    Black,
    White,
    Tarnish

    ) {

    var PaletteSystem = Ash.System.extend({

        gameState: null,
        stage: null,
        keyPoll: null,
        controls: null,
        nodes: null,

        paletteIDs: null,
        palettes: null,
        paletteIndex: 0,

        constructor: function(gameState, stage, keyPoll) {

            this.gameState = gameState;
            this.stage = stage;

            this.keyPoll = keyPoll;
            this.controls = new PaletteControls(
                Keyboard.CLOSE_SQUARE_BRACKET,
                Keyboard.OPEN_SQUARE_BRACKET,
                Keyboard.P
            );

            this.paletteIDs = ["black", "white", "tarnish"];
            this.palettes = {
                "black": new Black(),
                "white": new White(),
                "tarnish": new Tarnish()
            };

            return this;
        },

        updateDisplay: function() {

            var id = this.paletteIDs[this.paletteIndex];
            this.gameState.palette = this.palettes[id];
            
            for (node = this.nodes.head; node; node = node.next) {
                node.display.update({palette: this.gameState.palette});
            }
            this.stage.setBackgroundColor(this.gameState.palette.stage);
        },


        /*


        METHODS


        */


        nextPalette: function() {
            if (this.paletteIndex < this.paletteIDs.length-1) { 
                this.paletteIndex++; 
            } else {
                this.paletteIndex = 0;
            }
            this.updateDisplay();
        },

        lastPalette: function() {
            if (this.paletteIndex > 0) {
                this.paletteIndex--; 
            } else { 
                this.paletteIndex = this.paletteIDs.length-1;
            }
            this.updateDisplay();
        },

        randomPalette: function() {
            this.paletteIndex = _.random(0, this.paletteIDs.length-1);
            this.updateDisplay();
        },

        onKeyDown: function(e, scope) {

            switch (e.keyCode) {

                case scope.controls.nextPalette :
                    scope.nextPalette();
                    break;

                case scope.controls.lastPalette :
                    scope.lastPalette();
                    break;

                case scope.controls.randomPalette :
                    scope.randomPalette();
                    break;
            }
        },

        /*


        ADD / REMOVE


        */

        addToEngine: function(engine) {
            
            this.nodes = engine.getNodeList(RenderNode);
            this.keyPoll.addEventListener("keydown", this.onKeyDown, this);
            this.nodes.nodeAdded.add(this.updateDisplay, this);
        },

        removeFromEngine: function(engine) {
            this.nodes = null;
        }
    });

    return PaletteSystem;
});
