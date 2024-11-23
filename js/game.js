// Crea una nueva escena
let gameScene = new Phaser.Scene("Game");

// Parámetros iniciales del juego
gameScene.init = function () {
  fetch('../data/levelData.json')
    .then((response) => response.json())
    .then((data) => {
      // Asignar los valores del JSON a las propiedades del juego
      this.playerSpeed = data.playerSpeed;
      this.playerJump = data.playerJump;
      this.playerObject = data.playerObject;
      this.gameObjects = data.gameObjects;
      this.enemiesObjects = data.enemiesObjects;
      this.gameItems = data.gameItems;
      this.platforms = data.platforms;

      console.log('Datos del juego cargados:', data); // Depuración
    })
    .catch((error) => {
      console.error('Error cargando el archivo JSON:', error);
    });

  // Inicialización de estados
  this.lives = 3; // Inicializa el número de vidas
  this.score = 0; // Inicializa la puntuación
  this.isAttacking = false; // Indica si el jugador está atacando
  this.attackDuration = 500; // Duración del ataque en milisegundos
};

//  Carga de assets
gameScene.preload = function () {
  // Fondo
  this.load.image("background_superior", "../img/assets/pasto_superior.png");
  this.load.image("background", "../img/assets/fondo.png");
  this.load.image("background_medium", "../img/assets/medio.png");

  // Jugador y plataformas
  this.load.image("player", "../img/assets/pj.png");
  this.load.image("ground_1", "../img/assets/suelo_piedra_1.png");
  this.load.image("ground_2", "../img/assets/suelo_piedra_2.png");
  this.load.image("ground_3", "../img/assets/suelo_piedra_3.png");
  this.load.image("ground_4", "../img/assets/suelo_tierra.png");
  this.load.image("platform_1", "../img/assets/plataforma_piedra.png");
  this.load.image("platform_2", "../img/assets/plataforma_tierra.png");

  // Enemigos
  this.load.image("flying_bug", "../img/assets/bicho_volador.png");
  this.load.image("witch", "../img/assets/bruja_mala.png");
  this.load.image("monster", "../img/assets/monstruo.png");
  this.load.image("crow", "../img/assets/cuervo.png");
  this.load.image("goblin", "../img/assets/duende.png");

  // Ítems
  this.load.image("mushroom", "../img/assets/hongo.png");
  this.load.image("key", "../img/assets/llave.png");
  this.load.image("bread", "../img/assets/pan.png");
  this.load.image("sword", "../img/assets/espada_con_luz.png");
  this.load.image("magic_stone", "../img/assets/alma_petra.png");
};

// Inicialización del fondo
gameScene.initBackground = function () {
  this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
  this.backgroundMedium = this.add.image(0, 0, "background_medium").setOrigin(0, 0);
  this.pastoSuperior = this.add.image(0, 0, "background_superior").setOrigin(0, 0).setDepth(1);
};

// Inicialización del jugador
gameScene.initPlayer = function (fondo) {
  this.player = this.physics.add.sprite(
    this.playerObject[0].x,
    fondo.height - 200,
    "player"
  ).setCollideWorldBounds(true);

  this.physics.world.setBoundsCollision(true, true, true, false);
};

//  Inicialización de suelos
gameScene.initGrounds = function (fondo) {
  this.grounds = this.physics.add.staticGroup();
  this.gameObjects.forEach((obj) => {
    this.grounds.create(obj.x, fondo.height + obj.y, obj.type)
      .setScale(1)
      .refreshBody();
  });
};

// Inicialización de plataformas
gameScene.initPlatforms = function (fondo) {
  this.platformGroup = this.physics.add.staticGroup();
  this.platforms.forEach((plat) => {
    this.platformGroup.create(plat.x, fondo.height + plat.y, plat.type)
      .setScale(1)
      .refreshBody();
  });
};

// Inicialización de enemigos
gameScene.initEnemies = function (fondo) {
  this.enemiesGroup = this.physics.add.group();
  this.enemiesObjects.forEach((enemy) => {
    this.createEnemy(enemy, fondo);
  });
};

// Inicialización de ítems
gameScene.initGameItems = function (fondo) {
  this.gameItemsGroup = this.physics.add.group();
  this.gameItems.forEach((item) => {
    this.createGameItem(item, fondo);
  });
};

// Inicialización de todos los objetos del juego
gameScene.initGameObjects = function (fondo) {
  this.initPlayer(fondo);
  this.initGrounds(fondo);
  this.initEnemies(fondo);
  this.initPlatforms(fondo);
  this.initGameItems(fondo);

  // Inicializar el texto de vidas y puntuación en el HTML
  this.livesTextElement = document.getElementById('lives-text');
  this.livesTextElement.textContent = 'Lives: ' + this.lives;
  this.scoreTextElement = document.getElementById('score-text');
  this.scoreTextElement.textContent = 'Score: ' + this.score;
};




//configuración inicial////////////////////////////////

// Configuración de colisiones
gameScene.setupCollisions = function () {
  this.physics.add.collider(this.player, this.grounds);
  this.physics.add.collider(this.player, this.platformGroup);
  this.physics.add.collider(this.enemiesGroup, this.platformGroup);
  this.physics.add.collider(this.enemiesGroup, this.grounds);
  this.physics.add.overlap(this.player, this.gameItemsGroup, this.collectItem, null, this);
  this.physics.add.overlap(this.player, this.enemiesGroup, this.handleGameOver, null, this);
};


gameScene.setupCamera = function () {
  const worldWidth = 5760;
  const worldHeight = this.background.height;
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

  // Ajuste de zoom según el dispositivo
  const defaultZoom = config.height / worldHeight;
  this.cameras.main.setZoom(isMobile() ? defaultZoom * 1.5 : defaultZoom);
};

gameScene.create = function () {
  this.createJoystick();
  this.initBackground();
  this.initGameObjects(this.background);
  this.setupCamera();
  this.setupCollisions();

  // Configuración de controles
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D,
  });

  this.isPaused = false;
  this.createPauseFunctionality(); // Crear funcionalidad de pausa
};

// Configuración del joystick para dispositivos móviles
// Función para crear el joystick
gameScene.createJoystick = function () {
  if (!isMobile()) return; // Solo activar cuando se está en un celular
  const joystickArea = document.getElementById('joystick-area');
  if (!joystickArea) {
    console.error("El contenedor del joystick no existe");
    return;
  }
  // Crear el joystick con nipplejs
  this.joystick = nipplejs.create({
    zone: joystickArea,
    mode: 'dynamic',
    color: 'gray', // Color del joystick
    size: 100, // Tamaño del joystick
    threshold: 0.5, // Sensibilidad
  });
};
//pausa////////////////////////////////
gameScene.createPauseFunctionality = function () {
  const pauseButton = document.getElementById('pause-button');
  const pausePanel = document.getElementById('pause-panel');
  const resumeButton = document.getElementById('resume-button');

  pauseButton.addEventListener('click', () => this.togglePause());
  resumeButton.addEventListener('click', () => this.togglePause());
  document.getElementById("menu-button").addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  this.input.keyboard.on('keydown-ESC', () => this.togglePause());
};

gameScene.togglePause = function () {
  if (!this.isPaused) {
    this.isPaused = true;
    this.physics.pause();
    this.cameras.main.setAlpha(0.5);
    document.getElementById('pause-panel').style.display = 'flex';
  } else {
    this.isPaused = false;
    this.physics.resume();
    this.cameras.main.setAlpha(1);
    document.getElementById('pause-panel').style.display = 'none';
  }
};

//movimiento de pj//////////////////////
gameScene.handlePlayerMovement = function () {
  if (this.cursors.left.isDown || this.keys.A.isDown) {
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
  } else if (this.cursors.right.isDown || this.keys.D.isDown) {
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = false;
  } else {
    this.player.body.setVelocityX(0);
  }

  if ((this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
    this.player.body.setVelocityY(this.playerJump);
  }
};

// Evento cuando el joystick se mueve
this.joystick.on('move', (evt, data) => {
  if (data.direction) {
    const angle = data.angle.degree;
    const power = data.distance;
    const vx = Math.cos(Phaser.Math.DegToRad(angle)) * power * 10;
    this.player.setVelocityX(vx); // Movimiento horizontal
    // Si se mueve hacia arriba y el jugador está en el suelo, saltar
    this.player.flipX = vx < 0; // Cambiar la dirección del personaje
    if (data.direction.angle === 'up' && this.player.body.onFloor()) {
      this.player.setVelocityY(this.playerJump); // Salto
    }
  } else {
    this.player.setVelocityX(0); // Detener el movimiento horizontal si no se está moviendo
  }
});

//creacion de objetos y enemigos////////////////////////////////
gameScene.createGameItem = function (item, fondo) {
  let newItem = this.gameItemsGroup.create(item.x, fondo.height + item.y, item.type);
  newItem.type = item.type;
  newItem.setImmovable(true);
  newItem.body.setAllowGravity(false);
};

gameScene.createEnemy = function (enemy, fondo) {
  let newEnemy = this.enemiesGroup.create(
    enemy.x,
    fondo.height + enemy.y,
    enemy.type
  );
  newEnemy.body.setAllowGravity(enemy.type !== "flying_bug");
  newEnemy.setCollideWorldBounds(true);
  newEnemy.body.setSize(newEnemy.width, newEnemy.height - 13, true);

  newEnemy.startX = newEnemy.x;
  newEnemy.patrolDistance = enemy.patrolDistance || 100;
  newEnemy.patrolDirection = enemy.patrolDirection || 1;
  newEnemy.patrolSpeed = enemy.patrolSpeed || 150;
};

gameScene.updateEnemyMovement = function (enemy) {
  if (enemy.body.blocked.left || enemy.body.blocked.right) {
    enemy.patrolDirection *= -1;
  }
  enemy.body.setVelocityX(enemy.patrolDirection * enemy.patrolSpeed);
  enemy.setFlipX(enemy.patrolDirection === 1);

  if (enemy.x > enemy.startX + enemy.patrolDistance) {
    enemy.patrolDirection = -1;
  } else if (enemy.x < enemy.startX - enemy.patrolDistance) {
    enemy.patrolDirection = 1;
  }
};


//recolecion////////////////////////////////
gameScene.collectItem = function (player, item) {
  if (item.type === 'bread') {
    this.lives++;
    this.livesTextElement.textContent = 'Lives: ' + this.lives;
    item.destroy();
  } else if (item.type === 'magic_stone') {
    this.score++;
    this.scoreTextElement.textContent = 'Score: ' + this.score;
    item.destroy();
  } else if (item.type === 'mushroom') {
    this.player.body.setEnable(false);
    item.destroy();

    this.time.delayedCall(5000, function () {
      this.player.body.setEnable(true);
    }, [], this);
  } else if (item.type === 'key') {
    this.score += 5;
    this.scoreTextElement.textContent = 'Score: ' + this.score;
    item.destroy();
  }
};

///eventos////////////////////////////////
gameScene.checkPlayerFall = function () {
  if (this.player.y > this.physics.world.bounds.height) {
    this.handleGameOver();
  }
};

gameScene.handleGameOver = function () {
  if (this.isGameOver) return;
  this.isGameOver = true;

  this.lives--;
  this.livesTextElement.textContent = 'Lives: ' + this.lives;

  if (this.lives <= 0) {
    this.showGameOverScreen();
  } else {
    this.handlePlayerDamage();
    this.isGameOver = false;
  }
};

gameScene.showGameOverScreen = function () {
  this.physics.pause();
  this.cameras.main.stopFollow();

  const gameOverBackground = document.getElementById('game-over-background');
  const gameOverTextElement = document.getElementById('game-over-text');

  gameOverBackground.style.display = 'block';
  gameOverTextElement.textContent = 'Game Over!';
  gameOverTextElement.style.display = 'block';

  this.time.delayedCall(2000, () => {
    this.lives = 3;
    this.score = 0;
    this.isGameOver = false;

    gameOverBackground.style.display = 'none';
    gameOverTextElement.style.display = 'none';

    this.scene.restart();
  }, null, this);
};

gameScene.handlePlayerDamage = function () {
  this.cameras.main.shake(200, 0.02);
  this.player.setAlpha(0.5);
  this.player.body.setEnable(false);

  this.time.delayedCall(1000, () => {
    this.player.setAlpha(1);
    this.player.body.setEnable(true);
  }, null, this);
};


// Actualización del juego
gameScene.update = function () {
  this.handlePlayerMovement();
  this.handleJoystickMovement();
  this.enemiesGroup.children.each((enemy) => this.updateEnemyMovement(enemy));
  this.checkPlayerFall();
};


// Configuración del juego
let config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: gameScene,
  title: "Sword Of Destiny",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
};

// Creación del juego
let game = new Phaser.Game(config);

// Función para detectar dispositivos móviles
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}