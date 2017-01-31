// Global Variables.
var game = new Phaser.Game(800, 600, Phaser.CANVAS,'gameDiv');


var player;

var lives;
var livesTxt;
var live;

var facing = 'right';
var platforms;
var hearts;
var bullets;

var kaboom;
var kaboomSnd;

var enemyBullet;
var livingBoss = [];
var boss;
var aliens;
var ufos;
var gems;

var bossRound = 1;
var score = 0;
var round = 0;
var scoreTxt;
var winTxt;
var deadTxt;
var roundTxt;

var cursors;
var executed;


var bossBulletTime = 0;
var bulletTime = 0;
var timeDelay = 0;
var fireButton;

var landSnd;
var gunSound;
var jumpSnd;


//Creates A group of boss aliens.
function  createBoss(){
  boss = game.add.group();
  boss.enableBody = true;
  boss.createMultiple(6, 'boss', 0, false);


}

//land sound collision check.
function collision(){

  if(!executed){
    landSnd.play();
    executed = true;
  }

}

//Starts the the creates and startTimer function.
function start(){
  createAliens();
  startTimer();
}

//Creates a group of 35 aliens.
function createAliens(){

   aliens = game.add.group();
   aliens.enableBody = true;     aliens.createMultiple(35, 'aliens', 0, false);

}


//Timers for the mothership and aliens.
function bossTimer(){
  game.time.events.repeat(Phaser.Timer.SECOND, 20, bossRessurect);
}

function startTimer(){

    game.time.events.repeat(Phaser.Timer.SECOND, 20, resurrect);
}

//ressurects the alien from the group and adds it to the group, and gives it movement & physics.
function resurrect() {
    ufos = aliens.getFirstDead();

      if(ufos){
         ufos.reset(game.world.randomX       ,game.world.randomY);
         ufos.body.velocity.setTo(20 + Math.random() * 70, 20 + Math.random() * 70);
         ufos.body.bounce.setTo(0.5, 0.5);           ufos.body.collideWorldBounds = true;
         ufos.frame = game.rnd.integerInRange(0,36);
      }


}

function bossRessurect(){


  motherShip = boss.getFirstDead();


  if(motherShip){
     motherShip.reset(game.world.randomX       ,game.world.randomY);
     motherShip.body.velocity.setTo(20 + Math.random() * 80, 20 + Math.random() * 80);
     motherShip.body.bounce.setTo(0.5, 0.5);           motherShip.body.collideWorldBounds = true;
     motherShip.frame = game.rnd.integerInRange(0,36);

  }




}

// Player and gem collision.
 function collectGems (player, gems) {
// Removes the heart from the screen and updates score.
     gems.kill();
     live = lives.getFirstDead();

        if(live){
          live.reset();
         }

     score += 100;
     livesTxt.text = "Lives: " + live;

}

function bossCollision(boss,bullet) {
      boss.kill();
      bullet.kill();

}


//Bullet and enemy collision handler.
function bulletCollision(bullet, alien){
     bullet.kill();
     alien.kill();
 //Puts the explosion sprite into a group.
     kaboom = game.add.group();
     kaboom.createMultiple(35,'kaboom');
     kaboomSnd = game.add.audio('boomSound',true);
     kaboomSnd.play();

//Adds the explosion animation when alien is shot.
     var explosion = kaboom.getFirstExists(false);
     explosion.animations.add('kaboom', [0,1]);
     explosion.animations.play('kaboom', 2, false, true);
     explosion.reset(alien.body.x, alien.body.y);

     score += 200;
     scoreTxt.text = "Score: " + score;

        if(aliens.countLiving() === 0){
           winTxt.visible = true;
           game.input.onTap.addOnce(nextRound);
         }
 }

//Boss bullet group.
 function bossFire(){
   bossBulletTime = game.time.now + 600 ;
   enemyBullet = enemyBullets.getFirstExists(false);

     livingBoss.length = 0;

     boss.forEachAlive(function(boss){

       livingBoss.push(boss);
     });

     if(enemyBullet && livingBoss.length > 0){

       var random = game.rnd.integerInRange(0, livingBoss.length-1);

       //selects a random shooter thats still avir
       var shooter = livingBoss[random];
       enemyBullet.reset(shooter.body.x, shooter.body.y);

       game.physics.arcade.moveToObject(enemyBullet, player, 120);
     }




   }


//Enemy and player collision.
function enemyCollision(player, bullet){


//Gets the first heart in the group.
    live = lives.getFirstAlive();
    score -= 500;
    scoreTxt.text = "Score: " + score ;


      if(live){
         live.kill();
         player.reset(32, game.world.height -175);
      }

 //If lives are gone, kill player and display text!
     if(lives.countLiving() === 0){
        player.kill();
        bullet.kill();
        deadTxt.visible = true;

        game.input.onTap.addOnce(restart);
      }
}

//loops the hearts and appends them to the page, with a space of 70px between each other.
         function gemFall(){
             for(var i = 0; i < 20; i++){
               var gem = gems.create(i * 500, 10, 'gems');

 //Makes the hearts float down the canvas.
               gem.body.gravity.y = 100;
             }
         }



//Starts the next round of aliens.
      function nextRound(){
           aliens.callAll('kill');
           gems.callAll('kill');
           winTxt.visible = false;
           gemFall();
           startTimer();
           score += 500;
           round += 1;
           scoreTxt.text = "Score: " + score;
           roundTxt.text = "Round:" + round;
           if(round === bossRound){
             bossRounds();
           }


         }


function bossRounds() {
    aliens.destroy();
    winTxt.visible = false;
    bossTimer();


}

// Resets the canvas when player dies.
        function restart(){
            game.world.setBounds(0, 0, 1900, 605);
            boss.callAll('kill');
            aliens.callAll('kill');
            lives.callAll('revive');
            gems.callAll('kill');
            player.revive();
            deadTxt.visible = false;
            score = 0;
            round = 0;
            scoreTxt.text = "Score: " + score;
            roundTxt.text = "Round: " + round;
            gemFall();
            startTimer();


         }



var gameState = {
//Loads all the images to the game.
  preload: function(){
    game.load.image('boss','assets/Boss.png');
    game.load.spritesheet('Mac', 'assets/Mac_spritesheet.png', 52, 60);
    game.load.image('aliens', 'assets/Invaders.png');
    game.load.spritesheet('kaboom', 'assets/BOOM.png', 50, 45);
    game.load.image('bullets', 'assets/bullet.png');
    game.load.image('enemyBullet', 'assets/bossBullet.png');
    game.load.audio('shot',['SoundEffects/gunShot.ogg']);
    game.load.audio('boomSound',['SoundEffects/explosion.wav']);
    game.load.audio('jumpSound',['SoundEffects/jump_07.wav']);
    game.load.audio('jumpLand',['SoundEffects/jumpLand.wav']);
    game.load.image('gems','assets/Gem.png');
    game.load.image('heart', 'assets/heart.png');
    game.load.image('platform','assets/platform.png');
    game.load.image('grass', 'assets/grass1.png');
    game.load.image('background', 'assets/bckgrnd.png');
  },
  create: function(){
   game.scale.pageAlignHorizontally = true;
   game.scale.pageAlignVertically = true;
   game.scale.refresh();

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

//Loads the audio files to the correct variables.
    jumpSnd = game.add.audio('jumpSound');
    landSnd = game.add.audio('jumpLand',true);
    gunSound = game.add.audio('shot', true);


// Adds the animations to the right frames.
    player.animations.add('left',[0,1,2,3]);
    player.animations.add('right',[7,8,9,10]);

// Gives the sprite physics and weight when the player jumps.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

// Adds hearts into a group.
    gems = game.add.group();
    gems.enableBody = true;






//Adds a group of lives to the screen.
    lives = game.add.group();
    livesTxt = game.add.text(game.world.width - 100, 10, "Lives: ",{fontSize: '32px', fill: '#000'} );
    livesTxt.fixedToCamera = true;

//loops through the lives group and appends the hearts to corner of the screen.
    for(var i = 0; i < 4; i++){
      var heart = lives.create(game.world.width - 150 + (30 * i), 60, "heart");
      heart.fixedToCamera = true;



    }

//Puts bullets into a group and gives them physics.
  bullets = game.add.group();
  game.physics.enable(bullets, Phaser.Physics.ARCADE);
  player.anchor.x = 0.5;

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(50,'enemyBullet');
  enemyBullets.setAll('anchor.x', -4.6);
  enemyBullets.setAll('anchor.y', -5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  cursors = game.input.keyboard.createCursorKeys();

  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

//sets the canvas bounds to 1920 x 1920.
  game.world.setBounds(0, 0, 1900, 605);

//Camera that follows the player across the canvas.
  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


// Adds score text to the canvas.
  scoreTxt = game.add.text(16,16, "Score: 0",{fontSize: '32px', fill: '#000'});
  scoreTxt.fixedToCamera = true;

//when player dies, click screen to reset.
  deadTxt = game.add.text(250, 250, "You died! click here to reset");
  deadTxt.visible = false;
  deadTxt.fixedToCamera = true;

//When player kills all aliens on canvas, you win!

  winTxt = game.add.text(80, 250, "You Win the round!!!! Click here to play the next one!");
  winTxt.visible = false;
  winTxt.fixedToCamera = true;

//Text telling you what round you are on.

  roundTxt = game.add.text(350, 16, "Round: 0",{fontSize: '32px', fill: '#000'});
  roundTxt.visible = true;
  roundTxt.fixedToCamera = true;



  start();
  createAliens();
  createBoss();
  gemFall();



  },

  update: function(){

// Basically an event listener for the keys.


    var onPlatform = game.physics.arcade.collide(player,platforms, collision);

    player.body.velocity.x = 0;

    if(cursors.right.isDown){
      player.scale.x = 1;
      player.body.velocity.x = 150;
      player.animations.play('right', 10,true);
      facing = 'right';



    }
    else if(cursors.left.isDown){
            player.body.velocity.x = -150;
            player.scale.x = 1;
            player.animations.play('left', 10, true);
            facing = 'left';

    }

else
  {
    if(facing != 'idle')
    {
      player.animations.stop();

    if (facing == 'left')
      {

        player.frame = 4;
      }
    if (facing == 'right'){
        player.frame = 5;

      }
    else {
          player.frame = 4;
      }
      facing = 'idle';
    }

  }
  if(game.time.now > bossBulletTime){


     bossFire();
   }

fireButton.onDown.add(function (){
  fireGun();
});

  if (cursors.up.isDown && player.body.touching.down && onPlatform ){
      player.body.velocity.y = -400;
      jumpSnd.play();
      executed = false;

    }


  //player.animations.play('right', 10, true);
//When it collides with platforms dont fall throw, and player collects hearts to get points.
game.physics.arcade.overlap(bullets, aliens, bulletCollision, null, this);


game.physics.arcade.overlap(bullets, boss, bossCollision, null, this);

game.physics.arcade.overlap(player, aliens, enemyCollision, null, this);

game.physics.arcade.overlap(player, enemyBullet, enemyCollision, null, this);


game.physics.arcade.overlap(player, boss, enemyCollision, null, this);

game.physics.arcade.collide(aliens, platforms);
game.physics.arcade.collide(gems, platforms);
game.physics.arcade.overlap(player, gems, collectGems, null, this);


function fireGun(){
  if (game.time.now > bulletTime)
    {
      var bullet;



      bulletTime = game.time.now + 150;
      if(facing == 'right'){
           bullet = bullets.create(player.body.x + player.body.width / 2 + 20, player.body.y + player.body.height / 2 - 4, 'bullets');
      }

      else {
          bullet = bullets.create(player.body.x + player.body.width / 2 - 20, player.body.y + player.body.height / 2 - 4, 'bullets');
      }

        bullets.createMultiple(50,'bullets');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.anchor.setTo(0.5, 0);
        gunSound.play();


      if(facing == "right"){
        bullet.anchor.setTo(0.5, 0);
        bullet.body.velocity.x = 350;
      }
      if(facing == 'left'){
        bullet.anchor.setTo(0,0);
        bullet.body.velocity.x = -350;

      }

      if(player.frame == 5){
          bullet.anchor.setTo(-4,0);
          bullet.body.velocity.x = 350;
          facing = 'right';
        }

      else if(player.frame == 4){
          bullet.anchor.setTo(0, 0);
          bullet.body.velocity.x = -350;
          facing = 'left';
        }
      if(cursors.up.isDown){
        bullet.body.velocity.y = -350;
      }

      if(cursors.down.isDown){
        bullet.body.velocity.y = 350;
      }

    }

  }

}




};




game.state.add("GameState", gameState);
game.state.start("GameState");
