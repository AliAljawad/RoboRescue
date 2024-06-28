class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }

  preload() {
    this.load.image("tileset", "./assets/tileset.png");
    this.load.image("background", "./assets/background.png");
    this.load.image("character1", "./assets/character1.png");
    this.load.tilemapCSV("tilemap", "./assets/level1.csv");
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
      .setGravityY(600);

    this.character.body.setSize(80, 200);

    map.setCollisionBetween(0, 2);
    this.physics.add.collider(this.character, layer);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.character, true);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physics.world.createDebugGraphic();
    layer.setDepth(1);
    this.character.setDepth(2);
    this.character.setDebug(true, true, 0xff0000);
  }

  update() {
    this.character.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(200);
    }

    if (this.cursors.up.isDown && this.character.body.blocked.down) {
      this.character.setVelocityY(-500);
    }
  }
}

export default Level1;
