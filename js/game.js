// Global Variables.
var game = new Phaser.Game(800, 600, Phaser.CANVAS,'gameDiv');

var platforms;
var player;
var hearts;

var score = 0;
var scoreTxt;

var cursors;
var bullets;
var bulletTime = 0;
var fireButton;

var aliens;



var gameState = {
//Loads all the images to the game.
  preload: function(){
    game.load.image('aliens', 'assets/Invaders.png');
    game.load.image('bullets', 'assets/bullet.png');
    game.load.image('heart', 'assets/heart.png');
    game.load.image('grass', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('Mac', 'assets/Mac.png', 0, 0);

  },
  create: function(){
// Give the game arcade like physics.
    game.physics.startSystem(Phaser.Physics.ARCADE);
//Appends the sky background.
    game.add.image(0, 0, 'sky');
//Adds the ground and platform elements the canvas.
    platforms = game.add.group();
    platforms.enableBody = true;

    var grass = platforms.create(0, game.world.height - 64, 'grass');
    grass.scale.setTo(2,2);
    grass.body.immovable = true;

    var ledge = platforms.create(400, 400, 'grass');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'grass');
    ledge.body.immovable = true;

    //Creates the player an puts it on the canvas.
    player = game.add.sprite(32, game.world.height -175, "Mac");

    game.physics.arcade.enable(player);

// Gives the sprite physics when the player jumps.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    hearts = game.add.group();

    hearts.enableBody = true;


//Puts bullets into a group and gives them physics.
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50,'bullets');
    bullets.setAll('anchor.x', -0.2);
    bullets.setAll('anchor.y', -1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    player.anchor.x = 0.5;


    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);



//loops the hearts and appends them to the page, with a space of 70px between each other.
    for(var i = 0; i < 8; i++){
      var heart = hearts.create(i * 70, 0, 'heart');

//Makes the hearts float down the canvas.
      heart.body.gravity.y = 6;

    }

    // Adds score text to the canvas.
    scoreTxt = game.add.text(16,16, "score: 0",{fontSize: '32px', fill: '#000'});

  },

  update: function(){


    game.physics.arcade.collide(player, aliens);

    // Basically an event listener for the keys.

    cursors = game.input.keyboard.createCursorKeys();

    var onPlatform = game.physics.arcade.collide(player,platforms);



    player.body.velocity.x = 0;

    if(cursors.left.isDown){
      player.body.velocity.x = -150;
    }

  else  if(cursors.right.isDown){
      player.body.velocity.x = 150;


    }

    if(cursors.up.isDown && player.body.touching.down && onPlatform ){
      player.body.velocity.y = -300;
    }
    if(fireButton.isDown){
      fireGun();
    }


//When it collides with platforms dont fall throw, and player collects hearts to get points.

    game.physics.arcade.collide(aliens, platforms);
    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);

    function fireGun(){
      if(game.time.now > bulletTime)
    {
      bullet = bullets.getFirstExists(false);
    }

    if(bullet)
    {
      bullet.reset(player.x,player.y);
      bullet.body.velocity.x = 350;
      bulletTime = game.time.now + 80;
    }
  };

// Player and heart collision.
    function collectHearts (player, hearts) {

    // Removes the heart from the screen
    hearts.kill();
    score += 10;

    scoreTxt.text = "score:" + score;

  };

  }
};



game.state.add("GameState", gameState);
game.state.start("GameState");
