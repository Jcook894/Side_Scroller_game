// Global Variables.
var game = new Phaser.Game(800, 600, Phaser.CANVAS,'gameDiv');

var platforms;
var player;
var hearts;
var score = 0;
var scoreTxt;

var cursors;
var bullets;
var fireButton;



var gameState = {
//Loads all the images to the game.
  preload: function(){
    game.load.image('bullets', 'assets/bullet.png');

    game.load.image('heart', 'assets/heart.png');
    game.load.image('grass', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('Mac', 'assets/Mac.png', 50, 50);


  },
  create: function(){

    weapon = game.add.weapon(1, 'bullets');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    weapon.bulletAngleOffSet = 90;

    weapon.bulletSpeed = 400;


    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);






// Give the game arcade like physics.
    game.physics.startSystem(Phaser.Physics.ARCADE);

//Appends the sky img.
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
    weapon.trackSprite(player, 0, 0, true);

    console.log(weapon);



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

    // Basically an event listener for the keys.

    cursors = game.input.keyboard.createCursorKeys();

    var onPlatform = game.physics.arcade.collide(player,platforms);

    player.body.velocity.x = 0;

    if(cursors.left.isDown){
      player.body.velocity.x = -150;
    }

    if(cursors.right.isDown){
      player.body.velocity.x = 150;


    }

       if(fireButton.isDown){
          weapon.fire();
        }

    if(cursors.up.isDown && player.body.touching.down && onPlatform ){
      player.body.velocity.y = -300;
    }


//When it collides with platforms dont fall throw, and player collects hearts to get points.
    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);


    function collectHearts (player, hearts) {

    // Removes the star from the screen
    hearts.kill();
    score += 10;

    scoreTxt.text = "score:" + score;

    }

    function render(){
       weapon.debug();
    }





  }
};



game.state.add("GameState", gameState);
game.state.start("GameState");
