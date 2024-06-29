class Level2 extends Phaser.Scene {
    constructor() {
      super({ key: "Level2" });
    }
  
    preload() {
      this.load.image("tileset", "./assets/tileset.png");
      this.load.image("background", "./assets/background.png");
      this.load.image("character1", "./assets/character1.png");
      this.load.image("character2", "./assets/character1.png");
      this.load.image("laser", "./assets/laser.png");
      this.load.tilemapCSV("tilemap", "./assets/level2.csv");
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
        .setGravityY(600).setScale(0.5);
  
      this.character.body.setSize(50, 50);
  
      this.character2 = this.physics.add
        .sprite(100, 500, "character2")
        .setOrigin(0.5, 0.8)
        .setCollideWorldBounds(true)
        .setBounce(0.2)
        .setDrag(100)
        .setGravityY(600).setScale(0.5);
  
      this.character2.body.setSize(50, 50);
  
      map.setCollisionBetween(0, 2);
      this.physics.add.collider(this.character, layer);
      map.setCollisionBetween(0, 2);
      this.physics.add.collider(this.character2, layer);
  
      this.cursors = this.input.keyboard.createCursorKeys();
      this.cameras.main.startFollow(this.character, true);
      this.cameras.main.startFollow(this.character2, true);
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
  }
  
  export default Level2;
  