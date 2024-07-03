class Level3 extends Phaser.Scene {
  constructor() {
    super({ key: "Level3" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset", "./assets/Tiles.png");
    this.load.image("background", "./assets/background.png");
    this.load.image(
      "character1",
      this.loadImageFromLocalStorage1("character1")
    );
    this.load.image(
      "character2",
      this.loadImageFromLocalStorage2("character2")
    );
    this.load.tilemapCSV("tilemap", "./assets/lvl3.csv");
    this.load.audio("coinSound", "./assets/coinSound.mp3");
    this.load.audio("jumpSound", "./assets/jumpSound.mp3");
    this.coinPositions = [];
    this.laserPositions = [];
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
      .sprite(100, 600, "character1")
      .setOrigin(0.5, 0)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600);
    this.character.body.setSize(80, 150);
    this.character.setScale(0.5);

    this.character2 = this.physics.add
      .sprite(100, 600, "character2")
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

    this.layer.setCollisionByExclusion([-1, 0]); // Assuming indices -1 and 0 are non-colliding
    // Sets collision on all tiles in the given layer, except for tiles that have an index specified in the given array.

    this.physics.add.collider(
      this.character,
      this.layer,
      (character, tile) => this.handleTileCollision(character, tile, [72, 57]),
      null,
      this
    );

    this.physics.add.collider(
      this.character2,
      this.layer,
      (character, tile) => this.handleTileCollision(character, tile, [71, 56]),
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

    // this.layer.setDepth(2);
    // this.character.setDepth(2);
    // this.character2.setDepth(2);
    // this.character.setDebug(true, true, 0xff0000);

    this.initializeCoinsandLasers();
  }

  initializeCoinsandLasers() {
    this.map.forEachTile((tile) => {
      if (tile.index == 26 || tile.index == 41) {
        // coins
        this.coinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
      if (tile.index == 71 || tile.index == 57 || tile.index == 56 || 72) {
        // lazer id
        this.laserPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
    });
  }

  removeTiles(tileIndices) {
    this.map.forEachTile((tile) => {
      if (tileIndices.includes(tile.index)) {
        this.layer.removeTileAt(tile.x, tile.y);
      }
    });
    console.log("Specified tiles removed from the map.");
  }

  handleTileCollision(character, tile,phasingTiles) {

    // 26 is tile id for chr 2 ( (tile.index === 26 && character == this.character2) || (tile.index === 41 && character == this.character) )
    if (
      (tile.index === 26 && character == this.character2) ||
      (tile.index === 41 && character == this.character)
    ) {
      this.getCoin(character, tile);
      console.log("Coin collected or hazard encountered.");
    } else if (tile.index === 105 || tile.index === 106) {
      // iron fence
      console.log(character.body.blocked.down);
      console.log(character == this.character2);
      if (character.body.blocked.down) {
        this.resetCharacter();
      }
    } else if (tile.index === 101 && character === this.character) {
      this.removeTiles([72, 57]); // the red lazer tiles id
      tile.setCollision(false);
      console.log(
        "Tile 101 touched by character1, specified tiles removed and collision disabled."
      );
    } else if (tile.index === 86 && character === this.character2) {
      this.removeTiles([71, 56]); // the blue lazer tiles id
      tile.setCollision(false);
      console.log(
        "Tile 86 touched by character2, specified tiles removed and collision disabled."
      );
      // 52 and 72 are the red
    }else if((tile.index === 72 || tile.index === 57) && character === this.character2){
      this.resetCharacter(this.character, this.character2);
    }else if ((tile.index === 71 || tile.index === 56) && character === this.character){
      this.resetCharacter(this.character, this.character2);
    }

  }

  // resetCharacterIfNecessary(character, tile) {
  //   if (
  //     tile.index === 106 ||
  //     ((tile.index === 72 || tile.index === 57) &&
  //       character === this.character2) ||
  //     ((tile.index === 71 || tile.index === 56) && character === this.character)
  //   ) {
  //     this.resetCharacter(this.character, this.character2);
  //   }
  // }

  loadImageFromLocalStorage1(key) {
    let imgData = localStorage.getItem(key);
    if (imgData) {
      return imgData;
    }
    return "assets/character1.png";
  }
  loadImageFromLocalStorage2(key) {
    let imgData = localStorage.getItem(key);
    if (imgData) {
      return imgData;
    }
    return "assets/character2.png";
  }

  resetLaser() {
    this.laserPositions.forEach((pos) => {
      this.layer.putTileAt(pos.index, pos.x, pos.y);
    });
    console.log("Coins have been reset on the map.");
  }

  resetCharacter() {
    this.resetCoins(); // Call to reset the coins on the map
    this.character.setPosition(100, 600);
    this.character2.setPosition(100, 600);
    this.resetLaser()

    console.log("Character reset due to hazard.");
  }


  getCoin(character, tile) {
    if (this.coins < 7) {
      this.sound.play("coinSound");
      this.coins += 1;
      console.log(this.coins);
      this.layer.removeTileAt(tile.x, tile.y);
      console.log("Coin collected, tile removed.");
    } else {
      this.nextlvl();
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
    this.scene.start("Level4");
  }
  update() {
    //remaining time

    this.character.setVelocityX(0);
    if (this.cursors.left.isDown) {
      console.log("Left");
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }
    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.sound.play("jumpSound");
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
}

export default Level3;
