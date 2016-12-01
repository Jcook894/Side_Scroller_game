var game = new Phaser.Game(800, 600, Phaser.CANVAS);
var platforms;
var player;
var hearts;


var gameState = {

  preload: function(){
    game.load.image('heart', 'assets/heart.png');
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

    hearts = game.add.group();

    hearts.enableBody = true;

    for(var i = 0; i < 12; i++){
      var heart = hearts.create(i * 70, 0, 'heart');

      heart.body.gravity.y = 6;

    }

  },

  update: function(){
    cursors = game.input.keyboard.createCursorKeys();

    var onPlatform = game.physics.arcade.collide(player,platforms);

    player.body.velocity.x = 0;

    if(cursors.left.isDown){
      player.body.velocity.x = -150;


    }

    else if(cursors.right.isDown){
      player.body.velocity.x = 150;
    }

    if(cursors.up.isDown && player.body.touching.down && onPlatform ){
      player.body.velocity.y = -300;
    }





  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
