import Level1 from "./Level1.js";
var config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  parent: "gameContainer",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: [Level1],
};

var game = new Phaser.Game(config);
