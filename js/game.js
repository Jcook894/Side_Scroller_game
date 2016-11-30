var game = new Phaser.Game(650, 350, Phaser.CANVAS);

var gameState = {
  preload: function(){
    game.load.spritesheet('Little Jay', 'assets/little_jay.png', 32, 50);

  },
  create: function(){
    game.add.sprite(0,0,'Little Jay');
  },

  update: function(){


  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
