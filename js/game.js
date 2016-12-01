var game = new Phaser.Game(800, 600, Phaser.CANVAS);
var platforms;
var player;


var gameState = {

  preload: function(){
    game.load.image('grass', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.spritesheet('Little Jay', 'assets/Mac.png', 100, 100);

  },
  create: function(){


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.image(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;

    var grass = platforms.create(0, game.world.height - 64, 'grass');
    grass.scale.setTo(2,2);
    grass.body.immovable = true;

    var ledge = platforms.create(400, 400, 'grass');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'grass');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height -175, "Little Jay");

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


  },

  update: function(){

    var onPlatform = game.physics.arcade.collide(player,platforms);

    player.body.velocity = 0;




  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
