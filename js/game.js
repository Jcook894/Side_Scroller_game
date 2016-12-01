var game = new Phaser.Game(800, 600, Phaser.CANVAS);
var platforms;
var player;
var hearts;
var score = 0;
var scoreTxt;



var gameState = {

  preload: function(){
    game.load.image('heart', 'assets/heart.png');
    game.load.image('grass', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('Mac', 'assets/Mac.png', 100, 100);
    game.load.image('Mac-right', 'assets/Mac-run-right.png');

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

    player = game.add.sprite(32, game.world.height -175, "Mac");

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    hearts = game.add.group();

    hearts.enableBody = true;

    for(var i = 0; i < 8; i++){
      var heart = hearts.create(i * 70, 0, 'heart');

      heart.body.gravity.y = 6;

    }
    scoreTxt = game.add.text(16,16, "score: 0",{fontSize: '32px', fill: '#000'});

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

    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);


    function collectHearts (player, hearts) {

    // Removes the star from the screen
    hearts.kill();
    score += 10;

    scoreTxt.text = "score:" + score;

    }





  }
};



game.state.add("GameState", gameState);
game.state.start("GameState");
