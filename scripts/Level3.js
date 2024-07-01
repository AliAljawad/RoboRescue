class Level3 extends Phaser.Scene {
  constructor() {
    super({ key: "Level3" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset", "./assets/Tiles.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", "./assets/character1.png");
    this.load.image("character2", "./assets/character1.png");
    this.load.tilemapCSV("tilemap", "./assets/lvl3.csv");
    this.load.audio("jumpSound", "./assets/jumpSound.mp3");
    this.load.audio("coinSound", "./assets/coinSound.mp3");
    this.coinPositions = [];
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
      key: "tilemap",
      tileWidth: 32,
      tileHeight: 32,
    });

    const tiles = this.map.addTilesetImage("tileset");
    this.layer = this.map.createLayer(0, tiles, 0, 0);

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.character = this.physics.add
      .sprite(100, 500, "character1")
      .setOrigin(0.5, 0)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600);
    this.character.body.setSize(80, 150);
    this.character.setScale(0.5);

    this.character2 = this.physics.add
      .sprite(1100, 500, "character2")
      .setOrigin(0.5, 0)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600);
    this.character2.body.setSize(80, 150);
    this.character2.setScale(0.5);

    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    /// timer top left corner
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    this.textTime.setScrollFactor(0); 

    this.layer.setCollisionByExclusion([-1, 0]); // Assuming indices -1 and 0 are non-colliding

    this.physics.add.collider(
      this.character,
      this.layer,
      this.handleTileCollision,
      null,
      this
    );

    this.physics.add.collider(
      this.character2,
      this.layer,
      this.handleTileCollision,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(
      this.character,
      true,
      0.1,
      0.1,
      0,
      -this.cameras.main.height / 2
    );


    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.layer.setDepth(1);
    this.character.setDepth(2);
      this.character.setDepth(2);
    this.character.setDebug(true, true, 0xff0000);

    //time remaing 
    this.timedEvent = this.time.addEvent({
      delay: 99000, 
      callback: this.gameOver,
      callbackScope: this,
      loop: false,
    });
    this.initializeCoins();
  }

  initializeCoins() {
    this.map.forEachTile((tile) => {
      if (tile.index == 26 || tile.index == 41) {
        this.coinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
    });
  }


  handleTileCollision(character, tile) {
    // 26 is tile id for chr 2 ( (tile.index === 26 && character == this.character2) || (tile.index === 41 && character == this.character) )
    if ( (tile.index === 26 && character == this.character2) || (tile.index === 41 && character == this.character) ) {
      this.getCoin(character, tile);
      console.log("Coin collected or hazard encountered.");
    } else if (tile.index === 105 || tile.index === 106) {
      console.log(character.body.blocked.down);
      console.log(character == this.character2);
      if (character.body.blocked.down) {
        this.resetCharacter();
      }
    }
  }

  resetCharacter() {
    this.resetCoins(); // Call to reset the coins on the map
    this.character.setPosition(100, 500);
    this.character2.setPosition(1100, 500);
    console.log("Character reset due to hazard.");
  }

  getCoin(character, tile) {
    if (this.coins < 7) {
      this.coins += 1;
      console.log(this.coins);
      this.layer.removeTileAt(tile.x, tile.y);
      console.log("Coin collected, tile removed.");
    } else {
      nextlvl();
    }
  }
  resetCoins() {
    this.coinPositions.forEach((pos) => {
      this.layer.putTileAt(pos.index, pos.x, pos.y);
      this.coins = 0;
    });
    console.log("Coins have been reset on the map.");
  }

  nextlvl() {
    console.log("Next level loaded.");
  }
  update() {
    //remaining time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Remaining Time: ${Math.round(this.remainingTime).toString()}`
    );

    this.character.setVelocityX(0);
    if (this.cursors.left.isDown) {
      console.log("Left");
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }
    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.character.setVelocityY(-625);
    }

    this.character2.setVelocityX(0);

    if (this.wasd.left.isDown) {
      this.character2.setVelocityX(-200);
    } else if (this.wasd.right.isDown) {
      this.character2.setVelocityX(200);
    }

    if (this.wasd.up.isDown && this.character2.body.blocked.down) {
      this.sound.play("jumpSound");
      this.character2.setVelocityY(-625);
    }
  }
  gameOver() {
    this.scene.start("GameOver");
  }
  nextlvl() {
    console.log("Next level loaded.");
  }
}

export default Level3;
