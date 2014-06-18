importScripts("../../../lib/vendor/require.min.js");

require(["./../../../lib/vendor/box2d/box2dweb.min"], function() {

      var b2 = {      
          DebugDraw: Box2D.Dynamics.b2DebugDraw,
          World: Box2D.Dynamics.b2World,
          Vec2: Box2D.Common.Math.b2Vec2,
          FixtureDef: Box2D.Dynamics.b2FixtureDef,
          CircleShape: Box2D.Collision.Shapes.b2CircleShape,
          PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
          BodyDef: Box2D.Dynamics.b2BodyDef,
          ContactListener: Box2D.Dynamics.b2ContactListener,
          dynamicBody: Box2D.Dynamics.b2Body.b2_dynamicBody,
          staticBody: Box2D.Dynamics.b2Body.b2_staticBody,
          RevoluteJointDef: Box2D.Dynamics.Joints.b2RevoluteJointDef,
          MouseJointDef: Box2D.Dynamics.Joints.b2MouseJointDef,
          ContactBaumgarte: Box2D.Common.b2Settings.b2ContactBaumgarte
      };

      var WORLD_SCALE = 30,
          // TO DO: lower rate reduces some temporal aliasing
          // recommended: 1/30, 1/45 or 1/300 for mobile?
          STEP_RATE = 1/30,
          VELOCITY_ITERATIONS = 8, //recommended 8
          POSITION_ITERATIONS = 3; //recommended 3

      var gravity = 0,
          world = null;
    
      this.onmessage = function(e) {

          var data = e.data,
              cmd = data.cmd,
              msg = data.msg,
              args = (data.json) ? JSON.parse(data.json) : null;

          switch (cmd) {

              case "init":

                  world = new b2.World(new b2.Vec2(0, gravity), true);
                  initContact();
                  break;

              case "update":

                  updateBodies(args);
                  world.Step(STEP_RATE, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
                  world.ClearForces();
                  respond();
                  break;

              case "createBody":

                  var w = p2m(args.width*0.5),
                      h = p2m(args.height*0.5),
                      x = p2m(args.position.x), 
                      y = p2m(args.position.y),
                      a = d2r(args.angle);

                  var fixDef = new b2.FixtureDef();
                  fixDef.density = args.density;
                  fixDef.restitution = args.restitution;
                  fixDef.friction = args.friction;

                  if (args.shape == "circle") {
                      fixDef.shape = new b2.CircleShape(p2m(args.radius));
                  } else {
                      fixDef.shape = new b2.PolygonShape();
                      fixDef.shape.SetAsBox(w, h);
                  }

                  var bodyDef = new b2.BodyDef();
                  bodyDef.type = (args.bodyType == "static") ? b2.staticBody : bodyDef.type = b2.dynamicBody;
                  bodyDef.position = new b2.Vec2(x, y);
                  bodyDef.angle = a;
                  bodyDef.active = args.active;
                  bodyDef.allowSleep = args.allowSleep;
                  bodyDef.angle = args.angle;
                  bodyDef.angularVelocity = args.angularVelocity;
                  bodyDef.awake = args.awake;
                  bodyDef.bullet = args.bullet;
                  bodyDef.fixedRotation = args.fixedRotation;
                  bodyDef.linearDamping = args.linearDamping;
                  bodyDef.userData = args.userData;
                  
                  var body = world.CreateBody(bodyDef).CreateFixture(fixDef);

                  var response = { bodies: {} };
                  response.bodies[bodyDef.userData.id] = {
                      position: bodyDef.position,
                      angle: bodyDef.angle,
                      active: bodyDef.active,
                      awake: bodyDef.awake,
                      type: bodyDef.type,
                      userData: bodyDef.userData
                  };

                  //message to physicssystem
                  response.cmd = "physics";
                  postMessage(response);
                  break;

              case "destroyBody":
                  for (body = world.GetBodyList(); body !== null; body = body.GetNext()) {
                      if (body.GetUserData() && body.GetUserData().id == args.id) {
                          //console.log("destroyed: " + args.id);
                          world.DestroyBody(body);
                      }
                  }
                  break;
          }
      };

      var updateBodies = function(updates) {

          for (var body = world.GetBodyList(); body !== null; body = body.GetNext()) {
              for (var velID in updates) {
                  if (body.GetUserData() && body.GetUserData().id == velID) { //TO DO: why/when getuserdata is null?
                      var vel = updates[velID];
                      body.ApplyImpulse(new b2.Vec2(vel.x, vel.y), body.GetPosition());
                  }
              }
          }
      };

      var respond = function() {
          
          var response = { bodies: {} };
          for (var body = world.GetBodyList(); body !== null; body = body.GetNext()) {
              if (typeof body.GetUserData() !== 'undefined' && body.GetUserData() !== null) {
                  if (body.GetType() !== 0) { //0 is static. only update dynamic bodies
                      response.bodies[body.GetUserData().id] = {
                          position: body.GetWorldCenter(), //body.GetPosition(),
                          angle: body.GetAngle(),
                          active: body.IsActive(),
                          awake: body.IsAwake(),
                          type: body.GetType(),
                          userData: body.GetUserData()
                      };
                  }
              }
          }
          
          //message to physicssystem
          response.cmd = "physics";
          postMessage(response);
      };


      /*


      CONTACT HANDLERS


      */


      var initContact = function() {

          b2.ContactBaumgarte = 0.8;

          var listener = new b2.ContactListener(), fixtureUserData, bodyUserData;

          world.SetContactListener(listener);

          listener.BeginContact = function(contact) {
              var response = {
                      a : contact.GetFixtureA().GetBody().GetUserData(),
                      b : contact.GetFixtureB().GetBody().GetUserData()
                  };
              response.cmd = "collision";
              postMessage(response);
          };
      };


      /*


      CONVERSION UTILS


      */


      //pixels to meters
      var p2m = function(n) {
          return n / WORLD_SCALE;
      };

      //meters to pixels
      var m2p = function(n) {
          return n * WORLD_SCALE;
      };

      //degrees to radians
      var d2r = function(d) {
          return d * (Math.PI / 180);
      };

      //radians to degrees
      var r2d = function(r) {
          return r * (180 / Math.PI);
      };
});