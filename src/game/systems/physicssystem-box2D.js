define([

    'ash',
    'utils/Point',
    'game/nodes/physicsnode'

], function (

    Ash,
    Point,
    PhysicsNode

) {
    
    var PhysicsSystem = Ash.System.extend({

        nodes: null,
        worker: null,

        constructor: function(worker) {

            this.worker = worker;            
            return this;
        },


        /*


        UPDATE


        */
        

        update: function(time) {

            var bodies = {};
            for (node = this.nodes.head; node; node = node.next) {
                if (node.physics.bodyType !== "static") {
                    bodies[node.physics.id] = node.physics.velocity;
                }
            }
            this.worker.postMessage({'cmd': 'update', 'json': JSON.stringify(bodies)});
        },


        /*


        WORKER HANDLERS


        */

        updateNode: function(node, response) {
            
            var physics = node.physics;
            physics.position = response.position;
            physics.angle = response.angle;
        },

        lookupNode: function(response) {
            for (node = this.nodes.head; node; node = node.next) {
                if (node.physics.id == response.userData.id) this.updateNode(node, response);
            }
        },


        /*


        FACTORY METHODS


        */


        createBody: function(node) {
            this.worker.postMessage({'cmd': 'createBody', 'json': JSON.stringify(node.physics)});
        },

        destroyBody: function(node) {
            this.worker.postMessage({'cmd': 'destroyBody', 'json': JSON.stringify(node.physics)});
        },
   
    
        /*


        UTILS


        */


        addToEngine: function(engine) {

            var scope = this;
            this.worker.addEventListener("message", function(e) {
                //console.log("message from worker:", e.data);
                var data = e.data;
                if (data.cmd == "physics") {
                    for (var item in data.bodies) scope.lookupNode(data.bodies[item]);
                }
            });            
            this.worker.postMessage({'cmd': 'init', 'msg': 'Box2D Worker'});

            this.nodes = engine.getNodeList(PhysicsNode);
            this.nodes.nodeAdded.add(this.createBody, this);
            this.nodes.nodeRemoved.add(this.destroyBody, this);
        },

        removeFromEngine: function(game) {
            this.nodes = null;
            //console.log("TO DO: remove or replace space");
        }
    });

    return PhysicsSystem;
});
