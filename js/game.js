var game = new Phaser.Game(800, 600, Phaser.CANVAS);
var platforms;


var gameState = {

  preload: function(){
    game.load.image('grass', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.spritesheet('Little Jay', 'assets/little_jay.png', 32, 50);

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




    this.add.sprite(250, 250 ,'Little Jay');
  },

  update: function(){


  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
