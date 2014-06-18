define(['ash'], function (Ash) {
    
    var CameraControls = Ash.Class.extend({
        
        constructor: function (zoomIn, zoomOut, zoom) {

			//keyboard
            this.zoomIn = zoomIn;
            this.zoomOut = zoomOut;

            //camera
            this.zoom = zoom;
        }
    });

    return CameraControls;
});
