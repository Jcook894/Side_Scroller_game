var game = new Phaser.Game(650, 350, Phaser.CANVAS);

var gameState = {
  preload: function(){
    this.load.spritesheet('Little Jay', 'assets/little_jay.png', 32, 50);

  },
  create: function(){
    game.add.sprite(250, 250 ,'Little Jay');
  },

  update: function(){


  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
