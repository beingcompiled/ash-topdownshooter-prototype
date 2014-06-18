define(['ash'], function (Ash) {

    var GameState = Ash.Class.extend({

        constructor: function (width, height, palette) {

            this.width = width;
            this.height = height;
            this.palette = palette; //default palette

            this.lives = 0;
            this.level = 0;
            this.points = 0;
        }
    });

    return GameState;
});
