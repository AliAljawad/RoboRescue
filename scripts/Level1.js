class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
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
    this.load.tilemapCSV("tilemap1", "./assets/Lvl1.csv");
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
    background.displayHeight = 800;
    background.setScrollFactor(0);

    this.map = this.make.tilemap({
      key: "tilemap1",
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
      .sprite(100, 500, "character2")
      .setOrigin(0.7, 0)
      .setCollideWorldBounds(true)
      .setBounce(0.2)
      .setDrag(0)
      .setGravityY(600);
    this.character2.body.setSize(80, 150);
    this.character2.setScale(0.5);

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
    this.initializeCoinsandLasers();
    this.createUI();
  }
  initializeCoinsandLasers() {
    this.map.forEachTile((tile) => {
      if (tile.index == 26 || tile.index == 41) {
        this.coinPositions.push({ x: tile.x, y: tile.y, index: tile.index });
      }
      if (tile.index == 71 || tile.index == 57 || tile.index == 56 || 72) {
        // Assuming these are coin tiles
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
      let teleportDistance;

      // Determine the base X position of the tile the character is currently on
      let baseX = tile.x * tile.width;

      // Determine the direction and set teleport distance
      let direction = character.body.velocity.x > 0 ? -0.5 : 3;
      teleportDistance = direction * 1 * tile.width; // Directly calculate teleport distance in pixels

      // Calculate new x position from the baseX position of the tile
      let newX = baseX + teleportDistance;
      character.x = newX;

      // Diagnostic logs to trace values
      console.log("Teleporting", character.name);
      console.log("Velocity X:", character.body.velocity.x);
      console.log("Current Tile X:", tile.x);
      console.log("Base X Position:", baseX);
      console.log("Teleport Distance:", teleportDistance);
      console.log("Tile Width:", tile.width);
      console.log("New X Calculated:", newX);
      console.log("Direction:", direction === -1 ? "Left" : "Right");
      console.log("Actual New X Set:", character.x);
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
      tile.index === 106 ||
      ((tile.index === 72 || tile.index === 57) &&
        character === this.character2) ||
      ((tile.index === 71 || tile.index === 56) && character === this.character)
    ) {
      this.resetCharacter(this.character, this.character2);
    }
  }
  
  createUI() {
    // Create coin text
    this.coinText = this.add.text(10, 10, `Coins: ${this.coins}`, {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#ffffff",
    });
    this.coinText.setScrollFactor(0);
    this.coinText.setDepth(3); // Ensure text is above everything else
  }
  
  getCoin(character, tile) {
    if (this.coins < 5) {
      this.coins += 1;
      this.sound.play("coinSound");
      console.log(this.coins);
      this.layer.removeTileAt(tile.x, tile.y);
      console.log("Coin collected, tile removed.");
      this.coinText.setText(`Coins: ${this.coins}`);  // Update the coin text
    } else {
      this.nextlvl();
    }
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
    character.setPosition(100, 500);
    character2.setPosition(100, 500);
    this.resetCoins();
    this.resetLaser();
    console.log("Characters and coins reset due to hazard.");
  }

  resetCoins() {
    this.coinPositions.forEach((pos) => {
      this.layer.putTileAt(pos.index, pos.x, pos.y);
      this.coins = 0;
      if (this.coinText) {
        this.coinText.setText("Coins: " + this.coins); // Reset coinText
      } else {
        console.error("coinText is not defined!");
      }
    });
    console.log("Coins have been reset on the map.");
  }
  resetLaser() {
    this.laserPositions.forEach((pos) => {
      this.layer.putTileAt(pos.index, pos.x, pos.y);
    });
    console.log("Coins have been reset on the map.");
  }

  nextlvl() {
    this.scene.start("Level2");
  }

  update() {
    this.updateCharacter(this.character, this.cursors);
    this.updateCharacter(this.character2, this.wasd);

    if (
      this.character.y <
      this.cameras.main.scrollY + this.cameras.main.height / 2
    ) {
      this.cameras.main.scrollY =
        this.character.y - this.cameras.main.height / 4;
    }
  }

  updateCharacter(character, controls) {
    if (controls.left.isDown || controls.right.isDown) {
      character.setDrag(0);
      character.setDrag(0);
      character.setVelocityX(controls.left.isDown ? -200 : 200);
    } else {
      character.setDrag(100);
      character.setVelocityX(0);
      character.setDrag(100);
      character.setVelocityX(0);
    }
    if (controls.up.isDown && character.body.blocked.down) {
      this.sound.play("jumpSound");
      character.setVelocityY(-625);
    }
  }
}

export default Level1;
