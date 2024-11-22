import GameScene from "./scenes/GameScene.js";

const config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
  title: "Sword Of Destiny",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
};

// Crear el juego
const game = new Phaser.Game(config);
