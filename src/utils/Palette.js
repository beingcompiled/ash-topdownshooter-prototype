define(function () {
    'use strict';

    
    var palettes = {

        tarnish : {
            "generic"       : "0x000000",
            "hero"          : "0x111111",
            "enemy"	        : "0x590000",
            "projectile"	: "0x9E7F5E",
            "wall"          : "0x666666",
            "tree"          : "0x5B6452",
            "stage"			: "0xE0DED6"
        },
    
        white : {
            "generic"       : "0xffffff",
            "hero"          : "0xffffff",
            "enemy"         : "0xffffff",
            "projectile"    : "0xffffff",
            "wall"          : "0xffffff",
            "tree"          : "0xffffff",
            "stage"         : "0x000000"
        },

        black : {
            "generic"       : "0x000000",
            "hero"          : "0x000000",
            "enemy"         : "0x000000",
            "projectile"    : "0x000000",
            "wall"          : "0x000000",
            "tree"          : "0x000000",
            "stage"         : "0xffffff"
        }
    };

    var activePalette = null;

    var palette = {

        set: function(id) {
            activePalette = palettes[id];
        },

        get: function(id) {
			return Number(activePalette[id]);  
        }
    };

    return palette;
});