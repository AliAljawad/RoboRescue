class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset1", "./assets/Tiles.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", this.loadImageFromLocalStorage1("character1"));
    this.load.image("character2", this.loadImageFromLocalStorage2("character2"));
    this.load.tilemapCSV("tilemap2", "./assets/lvl2.csv");
    this.load.audio("coinSound", "./assets/coinSound.mp3");
    this.load.audio("jumpSound", "./assets/jumpSound.mp3");
    this.coinPositions = [];
  }

  create() {
    const background = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "background"
    );
    background.displayWidth = 1200;
    background.displayHeight = 800;
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
      .sprite(40, 500, "character1")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.4);

    this.character.body.setSize(80, 150);

    this.character2 = this.physics.add
      .sprite(1170, 100, "character2")
      .setOrigin(0.5, 0.8)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(100)
      .setGravityY(600)
      .setScale(0.4);

    this.character2.body.setSize(80, 150);

    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.layer.setCollisionByExclusion([-1, 0]);

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
      0.2,
      0.2,
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
    this.character2.setDepth(2);

    this.character.setDebug(true, true, 0xff0000);

    this.initializeCoins();
    this.createUI(); // Call createUI to set up UI elements
  }

  initializeCoins() {
    this.map.forEachTile((tile) => {
      if (tile.index == 26 || tile.index == 41) {
        this.coinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
    });
  }

  handleTileCollision(character, tile, phasingTiles) {
    if (phasingTiles.includes(tile.index)) {
      this.teleportCharacter(character, tile, phasingTiles);
      console.log("Phasing through tile");
      return;
    }

    if (tile.index === 101 && character === this.character) {
      this.removeTiles([72, 57]);
      this.disableTileCollision(tile);
      console.log(
        "Tile 101 touched by character1, specified tiles removed and collision disabled."
      );
    }

    if (tile.index === 86 && character === this.character2) {
      this.removeTiles([71, 56]);
      this.disableTileCollision(tile);
      console.log(
        "Tile 86 touched by character2, specified tiles removed and collision disabled."
      );
    }

    this.normalTileCollision(character, tile, phasingTiles);
  }

  teleportCharacter(character, tile, phasingTiles) {
    if (phasingTiles.includes(tile.index)) {
      if (character.body.velocity.x > 0) {
        character.x = (tile.x - 2) * tile.width;
      } else if (character.body.velocity.x < 0) {
        character.x = (tile.x + 2) * tile.width;
      }
      console.log("Phasing through tile");
    }
  }

  normalTileCollision(character, tile) {
    if (tile.index === 41 && character === this.character) {
      this.getCoin(character, tile);
    } else if (tile.index === 26 && character === this.character2) {
      this.getCoin(character, tile);
    } else {
      this.resetCharacterIfNecessary(character, tile);
    }
  }

  disableTileCollision(tile) {
    if (tile) {
      tile.setCollision(false);
    }
  }

  resetCharacterIfNecessary(character, tile) {
    if (
      (tile.index === 106 || tile.index === 105) ||
      ((tile.index === 72 || tile.index === 57) &&
        character === this.character2) ||
      ((tile.index === 71 || tile.index === 56) && character === this.character)
    ) {
      this.resetCharacter(this.character, this.character2);
    }
  }

  removeTiles(tileIndices) {
    this.map.forEachTile((tile) => {
      if (tileIndices.includes(tile.index)) {
        this.layer.removeTileAt(tile.x, tile.y);
      }
    });
    console.log("Specified tiles removed from the map.");
  }

  getCoin(character, tile) {
    if (this.coins < 5) {
      this.coins += 1;
      console.log(this.coins);
      this.layer.removeTileAt(tile.x, tile.y);
      if (this.coinText) {
        this.coinText.setText('Coins: ' + this.coins); // Update coinText
      } else {
        console.error("coinText is not defined!");
      }
      console.log("Coin collected, tile removed.");
    } else {
      this.nextlvl();
    }
  }

  createUI() {
    // Create coin text
    this.coinText = this.add.text(10, 10, 'Coins: 0', {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
    });
    this.coinText.setScrollFactor(0);
    this.coinText.setDepth(3); // Ensure text is above everything else
  }

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

  resetCharacter(character, character2) {
    character.setPosition(40, 500);
    character2.setPosition(1170, 100);
    this.resetCoins();
    console.log("Characters and coins reset due to hazard.");
  }

  resetCoins() {
    this.coinPositions.forEach((pos) => {
      this.layer.putTileAt(pos.index, pos.x, pos.y);
      this.coins = 0;
      if (this.coinText) {
        this.coinText.setText('Coins: ' + this.coins); // Reset coinText
      } else {
        console.error("coinText is not defined!");
      }
    });
    console.log("Coins have been reset on the map.");
  }

  nextlvl() {
    window.location.href = "../pages/gameEnding.html";
  }

  update() {
    this.updateCharacter(this.character, this.cursors);
    this.updateCharacter(this.character2, this.wasd);

    if (
      this.character.y <
      this.cameras.main.scrollY + this.cameras.main.height / 2
    ) {
      this.cameras.main.scrollY =
        this.character.y - this.cameras.main.height / 2;
    }

    // Check if the characters have fallen below the tilemap
    if (this.character.y > this.map.heightInPixels) {
      this.resetCharacter(this.character, this.character2);
    }
    if (this.character2.y > this.map.heightInPixels) {
      this.resetCharacter(this.character, this.character2);
    }
  }

  updateCharacter(character, controls) {
    if (controls.left.isDown || controls.right.isDown) {
      character.setDrag(0);
      character.setVelocityX(controls.left.isDown ? -200 : 200);
    } else {
      character.setDrag(100);
      character.setVelocityX(0);
    }
    if (controls.up.isDown && character.body.blocked.down) {
      this.sound.play("jumpSound");
      character.setVelocityY(-625);
    }
  }
}

export default Level2;
