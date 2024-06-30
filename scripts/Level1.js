class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.coins = 0;
  }

  preload() {
    this.load.image("tileset", "./assets/Tiles.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", "./assets/character1.png");
    this.load.tilemapCSV("tilemap1", "./assets/lvl1.csv");
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

    this.layer.setCollisionByExclusion([-1, 0]); // Assuming indices -1 and 0 are non-colliding

    this.physics.add.collider(
      this.character,
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
    this.character.setDebug(true, true, 0xff0000);
  }

  handleTileCollision(character, tile) {
    if (tile.index === 26 || tile.index === 41) {
      this.getCoin(character, tile);
      console.log("Coin collected or hazard encountered.");
    } else if (tile.index === 106) {
      this.resetCharacter(character);
    }
  }

  getCoin(character, tile) {
    if (this.coins < 5) {
      this.coins += 1;
      console.log(this.coins);
      this.layer.removeTileAt(tile.x, tile.y);
      console.log("Coin collected, tile removed.");
    } else {
      this.nextlvl()
    }
  }

  resetCharacter(character, tile) {
    character.setPosition(100, 500);
    console.log("Character reset due to hazard.");
  }

  nextlvl() {
    this.scene.start("Level2");
  }
  update() {
    this.character.setVelocityX(0);
    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }
    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.character.setVelocityY(-625);
    }
  }
}

export default Level1;
