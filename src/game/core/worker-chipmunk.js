importScripts("../../../lib/vendor/require.min.js");

require(["./../../../lib/vendor/chipmunk/cp"], function() {
  
    onmessage = function(e) {

        switch (e.data.cmd) {

            case "init":
                postMessage("init:" + cp); //cp undefined!!! need to shim? how?
                break;

            case "update":
              break;
        }
    };
});