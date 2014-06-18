define([

    'ash',
    'utils/Point',

    'game/nodes/collision/herocollision',
    'game/nodes/collision/genericcollision',
    'game/nodes/collision/enemycollision',
    'game/nodes/collision/projectilecollision'



], function (

    Ash, 
    Point,

    HeroCollisionNode,
    GenericCollisionNode,
    EnemyCollisionNode,
    ProjectileCollisionNode

) {
    
    var CollisionSystem = Ash.System.extend({

        worker: null,
        creator: null,
        sounds: null,

        heros: null,
        generics: null,
        projectiles: null,
        enemies: null,
        
        nodeLists : {

            "hero"       : "heros",
            "generic"    : "generics",
            "projectile" : "projectiles",
            "enemy"      : "enemies",
            "civilian"   : "generics",
            "portal"     : "generics"
        },

        constructor: function(worker, creator, sounds) {

            this.worker = worker;
            this.creator = creator;
            this.sounds = sounds;
            this.toDestroy = [];

            return this;
        },

        update: function(time) {
            for (var entity in this.toDestroy) this.creator.destroyEntity(this.toDestroy[entity]);
            this.toDestroy = [];
        },


        /*


        SPECIFIC COLLISION HANDLERS


        */


        handleCollisionHero: function(heroData, contactData) {

            //TO DO: node occassionally missing.
            if (heroData.node && contactData.node) {

                var hero = heroData.node,
                    entity = hero.entity,
                    physics = hero.physics,
                    melee = hero.melee,
                    contact = contactData.node;

                switch (contactData.collisionType) {
                    
                    case "enemy" :

                        // contact.physics.velocity = new Point(
                        //     // hero.physics.velocity.x * melee.stagger, 
                        //     // hero.physics.velocity.y * melee.stagger
                        //     (-contact.physics.velocity.x * melee.stagger),//contact.physics.friction, 
                        //     (-contact.physics.velocity.y * melee.stagger)//contact.physics.friction
                        // );
                        this.sounds.playRandom(contact, "hit");
                        hero.life.health -= contact.melee.damage;
                        hero.physics.velocity = new Point(
                            (contact.physics.velocity.x * contact.melee.stagger),// * hero.physics.friction, 
                            (contact.physics.velocity.y * contact.melee.stagger)// * hero.physics.friction
                        );
                        break;

                    case "civilian" :
                        this.sounds.playRandom(hero, "pickup");
                        hero.life.civilians++;
                        hero.life.health += 5;
                        this.toDestroy.push(contact.entity);
                        break;

                    case "portal" :
                        this.sounds.playRandom(hero, "teleport");
                        hero.control.isTeleporting = true;
                        break;

                    case "generic" :
                        //hero.life.health--;
                        break;
                }
            }
        },

        handleCollisionProjectile: function(projectileData, contactData) {

            //TO DO: node occassionally missing.
            if (projectileData.node && contactData.node) {

                var projectileNode = projectileData.node,
                    entity = projectileNode.entity,
                    physics = projectileNode.physics,
                    projectile = projectileNode.projectile;

                switch (contactData.collisionType) {
                    
                    case "enemy" :
                        //console.log('hit');
                        var enemy = contactData.node;
                        this.sounds.playRandom(enemy, "hit");
                        enemy.life.health -= projectile.damage;
                        enemy.physics.velocity = new Point(
                            (-enemy.physics.velocity.x * projectile.stagger) * enemy.physics.friction, 
                            (-enemy.physics.velocity.y * projectile.stagger) * enemy.physics.friction
                        );
                        enemy.predator.targetPos = new Point(enemy.physics.position.x + (Math.random()*100), enemy.physics.position.y + (Math.random()*100));
                        this.toDestroy.push(entity);
                        for (var i=0; i<_.random(2, 4); i++) this.creator.createDetritus("detritus" + Math.random(), enemy.physics, enemy.display.color);
                        break;

                    default :
                        this.toDestroy.push(entity);
                        break;
                }
            }
        },

        /*


        GENERAL


        */


        sortCollision: function(response, scope) {

            var a = response.a,
                b = response.b;

            a.node = scope.lookupNode(a);
            b.node = scope.lookupNode(b);

            switch (a.collisionType) {

                case "hero" :
                    scope.handleCollisionHero(a, b);
                    break;

                case "projectile" : 
                    scope.handleCollisionProjectile(a, b);
                    break;
            }

            switch (b.collisionType) {

                case "hero" :
                    scope.handleCollisionHero(b, a);
                    break;

                case "projectile" : 
                    scope.handleCollisionProjectile(b, a);
                    break;
            }
        },

        lookupNode: function(userData) {
            var nodeList = this[this.nodeLists[userData.collisionType]];
            for (var node = nodeList.head; node; node = node.next) {
                if (node.physics.id == userData.id) return node;
            }
            //return console.log("node not found: ", userData, nodeList);
        },


        /*


        ADD / REMOVE


        */
        

        addToEngine: function(game) {

            //WOW! SCOPE THIS!
            var scope = this;
            this.worker.addEventListener("message", function(e) {
                //console.log("message from worker:", e.data);
                if (e.data.cmd == "collision") scope.sortCollision(e.data, scope);
            });            

            this.heros = game.getNodeList(HeroCollisionNode);
            this.generics = game.getNodeList(GenericCollisionNode);
            this.projectiles = game.getNodeList(ProjectileCollisionNode);
            this.enemies = game.getNodeList(EnemyCollisionNode);
        },

        removeFromEngine: function (game) {

            this.heros = null;
            this.generics = null;
            this.projectiles = null;
            this.enemies = null;
        }
    });

    return CollisionSystem;
});