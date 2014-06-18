define([

    'ash',
    'utils/Point',
    'utils/MathUtils',
    
    'game/nodes/collision/herocollision',
    'game/nodes/collision/genericcollision',
    'game/nodes/collision/enemycollision',
    'game/nodes/collision/projectilecollision',

    'underscore'

], function (

        Ash,
        Point,
        MathUtils,

        HeroCollisionNode,
        GenericCollisionNode,
        EnemyCollisionNode,
        ProjectileCollisionNode

    ) {

    var GameManager = Ash.System.extend({

        gameState: null,
        creator: null,
        heros: null,
        hero: null,
        generics: null,
        enemies: null,
        projectiles: null,

        worldWidth: null,
        worldHeight: null,
        w2: null,
        h2: null,

        numWalls: null,     
        numEnemies: null,   

        spawned: false,
        heroFails: -1,

        constructor: function (gameState, creator) {

            this.gameState = gameState;
            this.creator = creator;
            this.spawnWorld();
        },

        update: function (time) {
            
            var rect, width, height, position, rotation, i;

            if (this.heros.head === null) {
                
                this.destroyAll();
                this.spawnWorld();
                this.heroFails++;
                this.creator.createHero("hero" + 0, this.getRandomWorldPoint(), this.heroFails);//this.getRandomWorldPoint());
                this.hero = this.heros.head;
                this.spawned = false;
            }
            
            if (this.hero.control.isTeleporting) {
                this.hero.control.isTeleporting = false;
                this.hero.life.teleports++;
                this.destroyAll();
                this.spawned = false;
            }

            if(!this.spawned) {

                this.spawned = true;

                var freq = (this.worldWidth + this.worldHeight) * 0.01,
                    ww = (this.worldWidth + this.worldHeight) * 0.025;

                //top
                position = new Point(0, -this.h2);
                this.creator.createWall("wall" + 0, position, this.worldWidth+ww, ww, "static", 0);

                //bottom
                position = new Point(0, this.h2);
                this.creator.createWall("wall" + 1, position, this.worldWidth+ww, ww, "static", 0);

                //left
                position = new Point(-this.w2, 0);
                this.creator.createWall("wall" + 2, position, ww, this.worldHeight+ww, "static", 0);

                //right
                position = new Point(this.w2, 0);
                this.creator.createWall("wall" + 3, position, ww, this.worldHeight+ww, "static", 0);

                for(i=4; i < this.numWalls; ++i) {
                    do {
                        size = _.random(freq*2, freq*20);
                        w = _.random(size*0.15, size*0.95);
                        h = size-w;
                        position = this.getRandomWorldPoint();
                        bodyType = "static";
                        rect = {
                            x: position.x,
                            y: position.y,
                            width: w,
                            height: h
                        };
                    }
                    while (this.checkHit(rect));
                    this.creator.createWall("wall" + i, position, rect.width, rect.height, bodyType, 0);
                }
                
                for(i=0; i < this.numEnemies; ++i) {
                    do {
                        position = this.getRandomWorldPoint();
                        size = _.random(20, 25);
                        rect = {
                            x: position.x,
                            y: position.y,
                            width: size,
                            height: size
                        };
                    }
                    while (this.checkHit(rect));
                    this.creator.createEnemy("enemy" + i, position, size, size);
                } 

                for(i=0; i < this.numCivilians; ++i) {
                    do {
                        position = this.getRandomWorldPoint();
                        size = 10;
                        rect = {
                            x: position.x,
                            y: position.y,
                            width: size,
                            height: size
                        };
                    }
                    while (this.checkHit(rect));
                    this.creator.createCivilian("civilian" + i, position, size);
                }

                for(i=0; i < this.numPortals; ++i) {
                    do {
                        position = this.getRandomWorldPoint();
                        size = 60;
                        rect = {
                            x: position.x,
                            y: position.y,
                            width: size,
                            height: size
                        };
                    }
                    while (this.checkHit(rect)); 
                    this.creator.createPortal("portal" + i, position, size);  
                }           
            }
        },


        /*


        UTILS


        */


        spawnWorld: function() {

            this.worldWidth = this.gameState.width * _.random(1, 4);
            this.worldHeight = this.gameState.height * _.random(1, 4);
            this.w2 = this.worldWidth * 0.5;
            this.h2 = this.worldHeight * 0.5;

            var freq = (this.worldWidth + this.worldHeight) * 0.01;
            this.numWalls = _.random(freq*0.3, freq*0.6);
            this.numEnemies = _.random(freq*0.1, freq*0.2);
            this.numCivilians = _.random(freq * 0.1, freq * 0.2);
            this.numPortals = _.random(freq*0.01, freq*0.05);
        },

        destroyAll: function() {
            for(node = this.generics.head; node; node = node.next) {
                this.creator.destroyEntity(node.entity);
            }  
            for(node = this.enemies.head; node; node = node.next) {
                this.creator.destroyEntity(node.entity);
            }
        },
        
        checkHit: function(rect) {

            var node, bool = false;

            for(node = this.heros.head; node; node = node.next) {
                bool = MathUtils.hitTest(rect, node.physics.hitRect);
            } 
            for(node = this.generics.head; node; node = node.next) {
                bool = MathUtils.hitTest(rect, node.physics.hitRect);
            }  
            for(node = this.enemies.head; node; node = node.next) {
                bool = MathUtils.hitTest(rect, node.physics.hitRect);
            }    

            return bool;
        },

        getRandomWorldPoint: function() {
            return new Point(
                _.random(-this.w2*0.9, this.w2 * 0.9), 
                _.random(-this.h2*0.9, this.h2 * 0.9)
            );
        },



        /*


        ADD / REMOVE


        */


        addToEngine: function (game) {

            this.heros = game.getNodeList(HeroCollisionNode);
            this.generics = game.getNodeList(GenericCollisionNode);
            this.enemies = game.getNodeList(EnemyCollisionNode);
            this.projectiles = game.getNodeList(ProjectileCollisionNode);
        },

        removeFromEngine: function (game) {

            this.heros = null;
            this.generics = null;
            this.enemies = null;
            this.projectiles = null;
        }
    });

    return GameManager;
});
