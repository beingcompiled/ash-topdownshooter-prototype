define([

    'ash',
    'brejep/keyboard',
    'utils/Point',
    'utils/MathUtils',

    'game/components/attributes/physics',
    'game/components/attributes/display',
    'game/components/controls/motioncontrols',
    'game/components/attributes/life',
    'game/components/attributes/melee',
    'game/components/attributes/sound',

    'game/components/entities/hero',
    'game/graphics/heroview',
    'game/components/entities/enemy',
    'game/graphics/enemyview',
    'game/graphics/wyrmview',
    'game/graphics/civilianview',
    'game/graphics/portalview',

    'game/components/behaviors/predator',
    'game/components/behaviors/selfdestruct',

    'game/components/attributes/bow',
    'game/components/controls/bowcontrols',
    'game/components/attributes/projectile',
    'game/graphics/projectileview',

    'game/components/entities/generic',
    'game/graphics/wallview',
    'game/graphics/treeview',
    'game/graphics/waterview',
    'game/graphics/detritusview'

], function (

    Ash,
    Keyboard,
    Point,
    MathUtils,

    Physics,
    Display,
    MotionControls,
    Life,
    Melee,
    Sound,

    Hero,
    HeroView,
    Enemy,
    EnemyView,
    WyrmView,
    CivilianView,
    PortalView,

    Predator,
    SelfDestruct, 

    Bow,
    BowControls,
    Projectile,
    ProjectileView,

    Generic,
    WallView,
    TreeView,
    WaterView,
    DetritusView

) {

    var EntityCreator = Ash.Class.extend({

        game: null,
        gameState: null,

        constructor: function(game, gameState) {
            this.game = game;
            this.gameState = gameState;
        },

        createHero: function(id, pos, fails) {

            var args = {
                
                // type: "circle",                 
                width: 25,
                height: 30,
                radius: 15,
                friction: 0.5,
                density: 0.5,

                position: pos,
                acceleration: 0.6,
                rotationRate: 5,
                maxSpeed: 1.2,
                linearDamping: 4,

                health: 20,
                civilians: 0,

                meleeDamage: 0,
                meleeStagger: 0,
                
                collisionType: "hero"
            };

            var hero = new Ash.Entity()
                .add(new Hero())
                .add(new Physics(id, args))
                .add(new Life(args.health, args.civilians, fails))
                .add(new Melee(args.meleeDamage, args.meleeStagger))
                .add(new Sound({
                    shoot: ["shoot0", "shoot1", "shoot2"],
                    teleport: ["teleport0","teleport1","teleport2"],
                    pickup: ["pickup0","pickup1","pickup2"]
                }))
                .add(new MotionControls(
                    
                    Keyboard.LEFT,
                    Keyboard.RIGHT,
                    Keyboard.UP,        // accelerate, 
                    Keyboard.DOWN,      // backup, 
                    Keyboard.W,         // run
                    Keyboard.SHIFT,     // strafe
                    Keyboard.Q,         // selfdestruct

                    args.rotationRate,  // rotationRate
                    args.maxSpeed       // maxSpeed
                ))
                .add(new Bow(
                    1.5,                        // power
                    1,                          // damage
                    2,                          // range
                    0.85,                       // life,
                    15,                         // stagger,
                    0.35,                       // minShotInterval
                    new Point(args.width*1.25, 0)    // offset
                ))
                .add(new BowControls(Keyboard.SPACEBAR))
                .add(new Display(new HeroView(id, args.width, args.height, this.gameState)));

            this.game.addEntity(hero);

            return hero;
        },

        createUserProjectile: function(id, weapon, parentPosition, parentAngle, projectileAngle) {

            var cos = Math.cos(parentAngle),
                sin = Math.sin(parentAngle),
                pos = new Point(
                    cos * weapon.offsetFromParent.x - sin * weapon.offsetFromParent.y + parentPosition.x,
                    sin * weapon.offsetFromParent.x + cos * weapon.offsetFromParent.y + parentPosition.y
                );

            var args = {
                position: pos,
                angle: projectileAngle,
                width: 5,
                height: 8, 
                density: 0.5,
                friction: 1,
                linearDamping: 0.5,
                bullet: true,
                fixedRotation: true,
                velocity: new Point(cos * weapon.power, sin * weapon.power),
                collisionType: "projectile"       
            };

            var projectile = new Ash.Entity()
                .add(new Projectile(weapon.damage, weapon.range, weapon.stagger))
                .add(new Physics(id, args))
                .add(new SelfDestruct(weapon.life))
                .add(new Display(new ProjectileView(id, args.width, args.height, this.gameState)));

            this.game.addEntity(projectile);

            return projectile;
        },

        createEnemy: function(id, pos, width, height) {

            var args = {

                position: pos,
                width: width,
                height: height,
                friction: 0.5,
                density: 1,
                linearDamping: _.random(2, 4),
                maxSpeed: _.random(75, 85) * 0.01,
                health: _.random(1, 2),
                damage: _.random(3, 5),
                stagger: 3,
                perception: _.random(5, 25),
                civilians: _.random(0, 5),
                collisionType: "enemy" 
            };

            var enemy = new Ash.Entity()
                .add(new Enemy())
                .add(new Physics(id, args))
                .add(new Life(args.health, args.civilians))
                .add(new Melee(args.damage, args.stagger))
                .add(new Sound({
                    hit: ["hit0","hit1","hit2"], 
                    explosion: ["explosion0","explosion1","explosion2"]
                }))
                .add(new Display(new EnemyView(id, args.width, args.height, this.gameState)))
                .add(new Predator(
                        args.maxSpeed, 
                        args.perception,
                        args.position
                ));

            this.game.addEntity(enemy);

            return enemy;
        },

        createCivilian: function(id, pos, size) {

            var args = {

                position: pos,
                width: size,
                height: size,
                radius: size,
                density: 100,
                shape: "circle",
                bodyType: "dynamic",
                collisionType: "civilian" 
            };

            var civilian = new Ash.Entity()
                .add(new Generic())
                .add(new Physics(id, args))
                //.add(new Sound({pickup: ["pickup"]}))
                .add(new Display(new CivilianView(id, args.radius, this.gameState)));

            this.game.addEntity(civilian);

            return civilian;
        },

        createWall: function(id, pos, w, h, bodyType, rotation) {

            var args = {
                position: pos,
                width: w,
                height: h,
                bodyType: bodyType,
                collisionType: "generic" 
            };

            var wall = new Ash.Entity()
                .add(new Generic())
                .add(new Physics(id, args))
                //.add(new Sound())
                .add(new Display(new WallView(id, w, h, this.gameState)));

            this.game.addEntity(wall);

            return wall;
        },

        createDetritus: function(id, physics, color) {

            var pos = new Point(MathUtils.m2p(physics.position.x), MathUtils.m2p(physics.position.y));

            var args = {
                position: pos,
                width: _.random(10, 15),
                height: _.random(10, 15),
                velocity: new Point(_.random(-1.5,1.5),_.random(-1.5,1.5)),
                collisionType: "generic"
            };

            var detritus = new Ash.Entity()
                .add(new Generic())
                .add(new Physics(id, args))
                .add(new SelfDestruct(0.6))
                //.add(new Sound())
                .add(new Display(new DetritusView(id, args.width, args.height, color, this.gameState)));

            this.game.addEntity(detritus);

            return detritus;
        },

        createPortal: function(id, pos, size) {
            //console.log('portla', pos);
            var args = {
                position: pos,
                width: size,
                height: size,
                radius: size*0.5,
                density: 100,
                shape: "circle",
                bodyType: "dynamic",
                collisionType: "portal"
            };

            var portal = new Ash.Entity()
                .add(new Generic())
                .add(new Physics(id, args))
                //.add(new Sound({teleport: ["teleport"]}))
                .add(new Display(new PortalView(id, args.radius, this.gameState)));

            this.game.addEntity(portal);

            return portal;
        },


        /*


        DESTROY


        */


        destroyEntity: function(entity) {
            //console.log(entity);
            this.game.removeEntity(entity);
            //physicssystem nicely handles removing physic body
        }
    });

    return EntityCreator;
});
