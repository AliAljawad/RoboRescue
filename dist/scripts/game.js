import Level1 from "./Level1.js";
import Level2 from "./Level2.js";
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
  scene: [Level1,Level2],
};

var game = new Phaser.Game(config);
