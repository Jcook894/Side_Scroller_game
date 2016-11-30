var game = new Phaser.Game(650, 350, Phaser.AUTO);

var gameState = {
  preload: function(){


  },
  create: function(){

  },

  update: function(){


  }
};

game.state.add("GameState", gameState);
game.state.start("GameState");
