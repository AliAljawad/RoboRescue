import Level1 from "./Level1.js";
import Level2 from "./Level2.js";
import Level3 from "./Level3.js";
import Level4 from "./Level4.js";
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
  scene: [ Level4],
};

var game = new Phaser.Game(config);

// Assuming the Phaser game instance is stored in a variable named `game`
function resizeGame() {
  var gameContainer = document.getElementById("gameContainer");
  var width = gameContainer.clientWidth; // Width of the container
  var height = gameContainer.clientHeight; // Height of the container
  var gameRatio = game.config.width / game.config.height; // Original game ratio
  var currentRatio = width / height;

  if (currentRatio < gameRatio) {
    game.canvas.style.width = width + "px";
    game.canvas.style.height = width / gameRatio + "px";
  } else {
    game.canvas.style.width = height * gameRatio + "px";
    game.canvas.style.height = height + "px";
  }
}

window.onload = function () {
  resizeGame();
  window.addEventListener("resize", resizeGame);
};
