define([

    'ash',
    'brejep/tickprovider',
    'brejep/keypoll',
    'pixi',

    'game/core/gamemanager',
    'game/core/systempriorities',
    'game/core/entitycreator',
    'game/core/gamestate',
    'game/core/soundmanager',
    'game/components/palettes/palette',

    'game/systems/physicssystem-box2D',
    'game/systems/camerasystem',
    'game/systems/palettesystem',
    'game/systems/movementsystem',
    'game/systems/collisionsystem',
    'game/systems/lifesystem',
    'game/systems/hudsystem',
    'game/systems/rendersystem-pixi',
    'game/systems/bowcontrolsystem',
    'game/systems/selfdestructsystem',
    'game/systems/predatorsystem',
    'game/systems/soundsystem',

    'game/systems/input/keyboardcontrolsystem',
    'game/systems/input/touchcontrolsystem',
    'game/systems/input/mousecontrolsystem',

], function (

    Ash,
    TickProvider,
    KeyPoll,
    PIXI,

    GameManager,
    SystemPriorities,
    EntityCreator,
    GameState,
    SoundManager,
    Palette,
    
    PhysicsSystem,
    CameraSystem,
    PaletteSystem,
    MovementSystem,
    CollisionSystem,
    LifeSystem,
    HudSystem,
    RenderSystem,
    BowControlSystem,
    SelfDestructSystem,
    PredatorSystem,

    AudioSystem,

    KeyboardControlSystem,
    TouchControlSystem,
    MouseControlSystem

) {

    var Game = Ash.Class.extend({

        width: 0,
        height: 0,
        engine: null,
        gameState: null,
        tickProvider: null,
        touchable: null,
        sounds: null,

        constructor: function (html, canvas, stats, touchable) {

            var isRetina = true;
            if(isRetina) {
                var w = canvas.width, h = canvas.height;
                canvas.width = w * window.devicePixelRatio;
                canvas.height = h * window.devicePixelRatio;
                canvas.style.width = w + "px";
                canvas.style.height = h + "px";
            }

            this.width = canvas.width;
            this.height = canvas.height;
            this.touchable = touchable;

            this.engine = new Ash.Engine();
            this.gameState = new GameState(this.width, this.height, new Palette());
            
            /*


            WEB WORKER: PHYSICS


            */

            var physicsWorker = new Worker("./src/game/core/worker-box2D.js");
            physicsWorker.addEventListener('error', function(e) {
                console.log(
                    'Worker error: ', e.filename, 
                    'line: ', e.lineno, 
                    'details: ', e.message
                );
            });

            /*


            WEB AUDIO API


            */

            var soundManager = new SoundManager();
            
            /* 


            PIXI DEPENDENCIES


            */

            var stage = new PIXI.Stage(0xffffff),
                renderer = PIXI.autoDetectRenderer(this.width, this.height, canvas), //new PIXI.CanvasRenderer(this.width, this.height, canvas);
                world = new PIXI.DisplayObjectContainer();
            
            html.appendChild(renderer.view);


            /*


            SYSTEMS


            */

            var creator = new EntityCreator(this.engine, this.gameState);

            this.engine.addSystem(
                new GameManager(this.gameState, creator),
                SystemPriorities.preUpdate
            );
            this.engine.addSystem(
                new PhysicsSystem(physicsWorker),
                SystemPriorities.physics
            );
            this.engine.addSystem(
                new CollisionSystem(physicsWorker, creator, soundManager),
                SystemPriorities.resolveCollisions
            );
            this.engine.addSystem(
                new PaletteSystem(this.gameState, stage, KeyPoll),
                SystemPriorities.update
            );
            this.engine.addSystem(
                //new BowControlSystem(KeyPoll, creator, stage, this.width, this.height, this.touchable),
                new BowControlSystem(creator, soundManager),
                SystemPriorities.update
            );
            this.engine.addSystem(
                new SelfDestructSystem(creator),
                SystemPriorities.update
            );
            this.engine.addSystem(
                new PredatorSystem(),
                SystemPriorities.update
            );
            this.engine.addSystem(
                new LifeSystem(creator, soundManager),
                SystemPriorities.update
            );
            this.engine.addSystem(
                new HudSystem(this.gameState, stage),
                SystemPriorities.update
            );
            this.engine.addSystem(
                new MovementSystem(this.gameState),
                SystemPriorities.move
            );         
            this.engine.addSystem(
                new KeyboardControlSystem(KeyPoll, soundManager),
                SystemPriorities.motionControl
            );
            this.engine.addSystem(
                new MouseControlSystem(stage, this.width, this.height),
                SystemPriorities.motionControl
            );
            if (this.touchable) {
                this.engine.addSystem(
                    new TouchControlSystem(stage, this.width, this.height, soundManager),
                    SystemPriorities.motionControl
                );
            }
            this.engine.addSystem(
                new CameraSystem(world, this.gameState, KeyPoll),
                SystemPriorities.render
            );
            this.engine.addSystem(
                new RenderSystem(stage, renderer, physicsWorker, world),
                SystemPriorities.render
            );
            
            this.tickProvider = new TickProvider(stats);
        },

        stop : function(params) {
            console.log("stop");

            var tickprovider = params[0],
                engine = params[1],
                update = params[2];

            tickprovider.remove(update, engine);
            tickprovider.stop();
        },

        start : function() {
            
            this.gameState.level = 0;
            this.gameState.lives = 3;
            this.gameState.points = 0;

            this.tickProvider.add(this.engine.update, this.engine);
            this.tickProvider.start();

            //setTimeout(this.stop, 2000, [this.tickProvider, this.engine, this.engine.update]);
        }
    });

    return Game;
});