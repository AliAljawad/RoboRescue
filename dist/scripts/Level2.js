class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset1", "./assets/Tiles.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", "./assets/character1.png");
    this.load.image("character2", "./assets/character1.png");
    this.load.tilemapCSV("tilemap2", "./assets/lvl2.csv");
    this.load.audio("coinSound", "./assets/coinSound.mp3");
    this.load.audio("jumpSound", "./assets/jumpSound.mp3");
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

    this.map = this.make.tilemap({
      key: "tilemap2",
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles = this.map.addTilesetImage("tileset1");
    this.layer = this.map.createLayer(0, tiles, 0, 0);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.character = this.physics.add
      .sprite(50, 500, "character1")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.25);
      this.character.setTint(0x0000ff);

      this.character.body.setSize(80, 150)

    this.character2 = this.physics.add
      .sprite(1170, 100, "character2")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.35);
      this.character2.setTint(0xff0000);   

    this.character2.body.setSize(80, 150)

    this.layer.setCollisionByExclusion([-1, 0]); // Assuming indices -1 and 0 are non-colliding

    this.physics.add.collider(this.character, this.layer, this.handleTileCollision, null, this);
    this.physics.add.collider(this.character2, this.layer, this.handleTileCollision, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.character, true);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.layer.setDepth(1);
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
    this.textTime.setScrollFactor(0);

    this.coinText = this.add.text(1100, 10, "Coins: 0", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.coinText.setScrollFactor(0);

    this.timedEvent = this.time.addEvent({
      delay: 99000,
      callback: this.gameOver,
      callbackScope: this,
      loop: false,
    });
  }

  handleTileCollision(character, tile) {
    if (tile.index === 26 && character.texture.key === 'character1') {
      this.getCoin(character, tile);
      console.log("Coin collected by character1.");
    } else if (tile.index === 41 && character.texture.key === 'character2') {
      this.getCoin(character, tile);
      console.log("Coin collected by character2.");
    } else if (tile.index === 106 || tile.index === 105 || tile.index === 120) {
      this.character.setPosition(50, 500);
      this.character2.setPosition(1168,50);
    }
  }
  getCoin(character, tile) {
    this.sound.play("coinSound");
    this.coins += 1;
    this.coinText.setText(`Coins: ${this.coins}`);
    console.log("Coin collected:", this.coins);
    this.layer.removeTileAt(tile.x, tile.y);

    if (this.coins >= 6) {
      this.nextlvl();
    }
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`);

    this.character.setVelocityX(0);
    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }

    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.sound.play("jumpSound");
      this.character.setVelocityY(-500);
    }

    this.character2.setVelocityX(0);
    if (this.wasd.left.isDown) {
      this.character2.setVelocityX(-200);
    } else if (this.wasd.right.isDown) {
      this.character2.setVelocityX(200);
    }

    if (this.wasd.up.isDown && this.character2.body.blocked.down) {
      this.sound.play("jumpSound");
      this.character2.setVelocityY(-500);
    }

    // Check if character falls below the screen
    if (this.character.y > this.physics.world.bounds.height) {
      this.character.setPosition(50, 500);
    }

    if (this.character2.y > this.physics.world.bounds.height) {
      this.character2.setPosition(1168,50);
    }
  }

  gameOver() {
    this.scene.start("GameOver");
  }

  nextlvl() {
    this.scene.start("Level1");
  }
}

export default Level2;