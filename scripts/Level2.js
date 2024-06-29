class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset", "./assets/tileset.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", "./assets/character1.png");
    this.load.image("character2", "./assets/character1.png");
    this.load.image("coin", "./assets/coin1.png"); // Load the coin image
    this.load.tilemapCSV("tilemap", "./assets/level2.csv");
    this.load.audio("coinSound", "./assets/coinSound.mp3");
  }

  create() {
    const background = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "background"
    );

    background.displayWidth = 1200;
    background.displayHeight = 600;
    background.setScrollFactor(0);

    const map = this.make.tilemap({
      key: "tilemap",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tiles = map.addTilesetImage("tileset");
    const layer = map.createLayer(0, tiles, 0, 0);

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.character = this.physics.add
      .sprite(100, 500, "character1")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.25);

    this.character.body.setSize(50, 50);

    this.character2 = this.physics.add
      .sprite(1200, 100, "character2")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.5);

    this.character2.body.setSize(50, 50);

    map.setCollisionBetween(0, 2);
    this.physics.add.collider(this.character, layer);
    map.setCollisionBetween(0, 2);
    this.physics.add.collider(this.character2, layer);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.character, true);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physics.world.createDebugGraphic();
    layer.setDepth(1);
    this.character2.setDepth(2);
    this.character2.setDebug(true, true, 0xff0000);
    this.character.setDepth(2);
    this.character.setDebug(true, true, 0xff0000);
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.textTime.setScrollFactor(0); // Ensure the text stays in the top-left corner

    // Create a group for coins
    this.coinsGroup = this.physics.add.staticGroup();

    // Add coins at specific locations
    const coinPositions = [
      { x: 200, y: 150 },
      { x: 400, y: 250 },
      { x: 600, y: 350 },
      { x: 800, y: 450 },
      { x: 1000, y: 550 }
    ];

    coinPositions.forEach(pos => {
      this.coinsGroup.create(pos.x, pos.y, "coin").setScale(0.1);
    });

    // Add overlap between coins and characters
    this.physics.add.overlap(this.character, this.coinsGroup, this.collectCoin, null, this);
    this.physics.add.overlap(this.character2, this.coinsGroup, this.collectCoin, null, this);

    // Add the coin count text
    this.coinText = this.add.text(1100, 10, "Coins: 0", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.coinText.setScrollFactor(0); // Ensure the text stays in the top-left corner

    this.timedEvent = this.time.addEvent({
      delay: 99000, // 30 seconds
      callback: this.gameOver,
      callbackScope: this,
      loop: false,
    });
  }

  collectCoin(character, coin) {
    coin.disableBody(true, true);
    this.sound.play("coinSound");
    this.coins += 1;
    this.coinText.setText(`Coins: ${this.coins}`); // Update the coin count text
    console.log("Coin collected:", this.coins);

    if (this.coins >= 5) {
      this.nextlvl();
    }
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Remaining Time: ${Math.round(this.remainingTime).toString()}`
    );
    this.character.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }

    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.character.setVelocityY(-500);
    }
    this.character2.setVelocityX(0);

    if (this.wasd.left.isDown) {
      this.character2.setVelocityX(-200);
    } else if (this.wasd.right.isDown) {
      this.character2.setVelocityX(200);
    }

    if (this.wasd.up.isDown && this.character2.body.blocked.down) {
      this.character2.setVelocityY(-500);
    }
  }

  gameOver() {
    this.scene.start("GameOver");
  }

  nextlvl() {
    console.log("Next level loaded.");
  }
}

export default Level2;
