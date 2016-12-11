// Global Variables.
var game = new Phaser.Game(800, 600, Phaser.CANVAS,'gameDiv');

var platforms;
var player;
var hearts;
var lives;

var score = 0;
var scoreTxt;

var deadTxt;

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
    game.load.image('gems','assets/Gem.png');
    game.load.image('heart', 'assets/heart.png');
    game.load.image('platform','assets/platform.png');
    game.load.image('grass', 'assets/grass1.png');
    game.load.image('background', 'assets/bckgrnd.png');
    game.load.image('Mac-left', 'assets/Mac_left.png');
    game.load.image('Mac', 'assets/Mac.png');

  },
  create: function(){
// Give the game arcade like physics.
    game.physics.startSystem(Phaser.Physics.ARCADE);
//Appends the sky background.
    game.add.tileSprite(0, 0, 1900, 600, 'background');
//Adds the ground and platform elements the canvas.
    platforms = game.add.group();
    platforms.enableBody = true;

    var grass = platforms.create(0, game.world.height - 50, 'grass');
    grass.scale.setTo(2,8);
    grass.body.immovable = true;

 //Adding multiple platforms to the game.
    var ledge = platforms.create(300, 400, 'platform');
    ledge.body.immovable = true;

    ledge = platforms.create(750, 250, 'platform');
    ledge.body.immovable = true;

    ledge = platforms.create(1400, 300, 'platform');
    ledge.body.immovable = true;

    //Creates the player an puts it on the canvas.
    player = game.add.sprite(32, game.world.height -175, "Mac");

    game.physics.arcade.enable(player);

// Gives the sprite physics and weight when the player jumps.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

// Adds hearts into a group.
    gems = game.add.group();
    gems.enableBody = true;

//Adds a group of lives to the screen.
    lives = game.add.group();
    var livesTxt = game.add.text(game.world.width - 100, 10, "Lives: " );
    livesTxt.fixedToCamera = true;

//loops through the lives group and appends the hearts to corner of the screen.
    for(var i = 0; i < 4; i++){
      var heart = lives.create(game.world.width - 150 + (30 * i), 60, "heart");
      heart.fixedToCamera = true;


    }


//Puts bullets into a group and gives them physics.
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50,'bullets');
    bullets.setAll('anchor.x', -2);
    bullets.setAll('anchor.y', -3);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    player.anchor.x = 0.5;



    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

//sets the canvas bounds to 1920 x 1920.
    game.world.setBounds(0, 0, 1900, 605);

//Camera that follows the player across the canvas.
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);




//loops the hearts and appends them to the page, with a space of 70px between each other.
    for(var i = 0; i < 20; i++){
      var gem = gems.create(i * 500, 0, 'gems');

//Makes the hearts float down the canvas.
      gem.body.gravity.y = 100;
    }

// Adds score text to the canvas.
    scoreTxt = game.add.text(16,16, "score: 0",{fontSize: '32px', fill: '#000'});
    scoreTxt.fixedToCamera = true;
//when player dies, click screen to reset.
    deadTxt = game.add.text(250, 250, "You died! \
click here to reset!");
    deadTxt.visible = false;
    deadTxt.fixedToCamera = true;


//Creates a group of 35 aliens.
     aliens = game.add.group();
     aliens.enableBody = true;
     aliens.createMultiple(35, 'aliens', 0, false);


     game.time.events.repeat(Phaser.Timer.SECOND, 20, resurrect, this);

//ressurects the alien from the group and adds it to the group, and gives it movement & physics.
     function resurrect() {
       var ufos = aliens.getFirstDead();

       if(ufos){
         ufos.reset(game.world.randomX, game.world.randomY);

         ufos.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);

         ufos.body.bounce.setTo(0.5, 0.5);
         ufos.body.collideWorldBounds = true;
         ufos.frame = game.rnd.integerInRange(0,36);
       }
     };

  },

  update: function(){

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
      player.body.velocity.y = -400;
    }

    if(fireButton.isDown){
      fireGun();
    }


//When it collides with platforms dont fall throw, and player collects hearts to get points.
game.physics.arcade.overlap(bullets, aliens, bulletCollision, null, this);

game.physics.arcade.overlap(player, aliens, enemyCollision, null, this);

    game.physics.arcade.collide(aliens, platforms);
    game.physics.arcade.collide(gems, platforms);
    game.physics.arcade.overlap(player, gems, collectGems, null, this);

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

     if (cursors.left.isDown) {
      bullet.body.velocity.x = -350;

    }
    if(cursors.up.isDown){
      bullet.body.velocity.y = -350
    }
    if(cursors.down.isDown){
      bullet.body.velocity.y = 350;
    }
  };

// Player and heart collision.
    function collectGems (player, gems) {

// Removes the heart from the screen and updates score.
    gems.kill();
    score += 100;

    scoreTxt.text = "score:" + score;

  };

//Bullet and enemy collision handler.
  function bulletCollision(bullet, alien){
    bullet.kill();
    alien.kill();
    score += 200;

    scoreTxt.text = "score:" + score;

  };

//Enemy and player collision.
  function enemyCollision(player, bullet){
//Gets the first heart in the group.
    live = lives.getFirstAlive();
    score -= 500;

    if(live){
      live.kill();
      player.reset(32, game.world.height -175)
    }

//If lives are gone, kill player and display text!
    if(lives.countLiving() < 1){
      player.kill();
      console.log("dead");
      deadTxt.visible = true;

      game.input.onTap.addOnce(reset, this);
    }
  };

// Resets the canvas when player dies.
  function reset(){
    player.revive();
    lives.callAll('reset');
    deadTxt.visible = false;

    score = 0;
  }

  }
};



game.state.add("GameState", gameState);
game.state.start("GameState");
