// Crea una nueva escena
let gameScene = new Phaser.Scene("Game");
// Definir variables para las vidas
gameScene.lives = 3; // Inicializa el número de vidas
gameScene.livesText = null; // Inicializa la variable para el texto de vidas


// Parámetros iniciales del juego
gameScene.init = function () {
  this.playerSpeed = 300;
  this.playerJump = -440;


  // Datos del personaje
  this.playerObject = [{ type: "player", x: 100, y: 0 }];

  // Datos del suelo
  this.gameObjects = [
    { type: "ground_1", x: 390, y: -65 },
    { type: "ground_2", x: 1485, y: -65 },
    { type: "ground_3", x: 2648, y: -65 },
    { type: "ground_4", x: 3937, y: -72 },
    { type: "ground_4", x: 5408, y: -72 },
  ];

  // Datos de enemigos
  this.enemiesObjects = [
    { type: "flying_bug", x: 920, y: -600, patrolDistance: 290, patrolSpeed: 200 },
    { type: "flying_bug", x: 790, y: -300, patrolDistance: 200, patrolSpeed: 200 },
    { type: "flying_bug", x: 3500, y: -250, patrolDistance: 200, patrolSpeed: 200 },
    { type: "witch", x: 2600, y: -350, patrolDistance: 280, patrolSpeed: 100 },
    { type: "monster", x: 4050, y: -300, patrolDistance: 200, patrolSpeed: 100 },
  ];


  // Assets
  this.gameItems = [
    { type: "mushroom", x: 4000, y: -190 },
    { type: "key", x: 5400, y: -180 },
    { type: "crow", x: 2960, y: -510 },
    { type: "goblin", x: 1249, y: -331 },
    { type: "sword", x: 40, y: -500 },
    { type: "bread", x: 1105, y: -175 },
  ];

  // Datos de plataformas
  this.platforms = [
    { type: "platform_1", x: 47, y: -310 },
    { type: "platform_1", x: 147, y: -310 },
    { type: "platform_1", x: 247, y: -310 },
    { type: "platform_1", x: 347, y: -310 },
    { type: "platform_1", x: 447, y: -310 },
    { type: "platform_1", x: 647, y: -215 },
    { type: "platform_1", x: 247, y: -510 },
    { type: "platform_1", x: 147, y: -380 },
    { type: "platform_1", x: 47, y: -450 },
    { type: "platform_1", x: 547, y: -510 },
    { type: "platform_1", x: 920, y: -330 },
    { type: "platform_1", x: 1020, y: -360 },
    { type: "platform_1", x: 1105, y: -430 },
    { type: "platform_1", x: 1290, y: -530 },
    { type: "platform_1", x: 1105, y: -130 },
    { type: "platform_1", x: 1290, y: -310 },
    { type: "platform_1", x: 1890, y: -100 },
    { type: "platform_1", x: 2110, y: -190 },
    { type: "platform_1", x: 3200, y: -200 },
    { type: "platform_2", x: 3410, y: -100 },
    { type: "platform_2", x: 4510, y: -140 },
    { type: "platform_2", x: 4810, y: -140 },
  ];
};

// Se cargan las imágenes
gameScene.preload = function () {
  this.load.image("background_superior", "../img/assets/pasto_superior.png");
  this.load.image("background", "../img/assets/fondo.png");
  this.load.image("background_medium", "../img/assets/medio.png");
  this.load.image("player", "../img/assets/pj.png");
  this.load.image("ground_1", "../img/assets/suelo_piedra_1.png");
  this.load.image("ground_2", "../img/assets/suelo_piedra_2.png");
  this.load.image("ground_3", "../img/assets/suelo_piedra_3.png");
  this.load.image("ground_4", "../img/assets/suelo_tierra.png");
  this.load.image("platform_1", "../img/assets/plataforma_piedra.png");
  this.load.image("platform_2", "../img/assets/plataforma_tierra.png");
  this.load.image("flying_bug", "../img/assets/bicho_volador.png");
  this.load.image("witch", "../img/assets/bruja_mala.png");
  this.load.image("monster", "../img/assets/monstruo.png");
  this.load.image("mushroom", "../img/assets/hongo.png");
  this.load.image("key", "../img/assets/llave.png");
  this.load.image("bread", "../img/assets/pan.png");
  this.load.image("sword", "../img/assets/espada_con_luz.png");
  this.load.image("crow", "../img/assets/cuervo.png");
  this.load.image("goblin", "../img/assets/duende.png");
};




// Función para inicializar el jugador
gameScene.initPlayer = function (fondo) {
  this.player = this.physics.add.sprite(
    this.playerObject[0].x,
    fondo.height - 200,
    "player"
  ).setCollideWorldBounds(true);

  this.physics.world.setBoundsCollision(true, true, true, false);
};


// Función para inicializar el grupo de suelos
gameScene.initGrounds = function (fondo) {
  this.grounds = this.physics.add.staticGroup();
  this.gameObjects.forEach((obj) => {
    this.grounds.create(obj.x, fondo.height + obj.y, obj.type)
      .setScale(1)
      .refreshBody();
  });
};

// Función para inicializar enemigos
gameScene.initEnemies = function (fondo) {
  this.enemiesGroup = this.physics.add.group();
  this.enemiesObjects.forEach((enemy) => {
    this.createEnemy(enemy, fondo);
  });
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

  // Configura el patrullaje
  newEnemy.startX = newEnemy.x; // Guardar la posición inicial
  newEnemy.patrolDistance = enemy.patrolDistance || 100; // Distancia de patrullaje
  newEnemy.patrolDirection = enemy.patrolDirection || 1; // 1 para derecha, -1 para izquierda
  newEnemy.patrolSpeed = enemy.patrolSpeed || 150; // Velocidad de patrullaje
};

// Función para inicializar plataformas
gameScene.initPlatforms = function (fondo) {
  this.platformGroup = this.physics.add.staticGroup();
  this.platforms.forEach((plat) => {
    this.platformGroup.create(plat.x, fondo.height + plat.y, plat.type)
      .setScale(1)
      .refreshBody();
  });
};

// Función para inicializar los objetos del juego
gameScene.initGameItems = function (fondo) {
  this.gameItemsGroup = this.physics.add.group();
  this.gameItems.forEach((item) => {
    this.createGameItem(item, fondo);
  });
};

gameScene.createGameItem = function (item, fondo) {
  let newItem = this.gameItemsGroup.create(item.x, fondo.height + item.y, item.type);
  newItem.type = item.type;
  newItem.setImmovable(true); // Evita que el objeto se mueva al colisionar
  newItem.body.setAllowGravity(false); // Desactiva la gravedad en el objeto
};

// Inicializa los objetos del juego
gameScene.initGameObjects = function (fondo) {
  this.initPlayer(fondo);
  this.initGrounds(fondo);
  this.initEnemies(fondo);
  this.initPlatforms(fondo);
  this.initGameItems(fondo);

  // Inicializar el texto de vidas
  this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, {
    fontSize: '32px',
    fill: '#FFFFFF'
  });
};

// Función para manejar la recogida de un objeto
gameScene.collectItem = function (player, item) {
  if (item.type === 'bread') {
    this.lives++;
    this.livesText.setText('Lives: ' + this.lives);
  }
  item.destroy(); // Eliminar el objeto recolectado
};

// Función para crear el joystick
gameScene.createJoystick = function () {
  if (!isMobile()) return; //maneja que solo sea activado cuando esta en un celular
  const joystickArea = document.getElementById('joystick-area');
  if (!joystickArea) {
    console.error("El contenedor del joystick no existe");
    return;
  }

  this.joystick = nipplejs.create({
    zone: joystickArea,
    mode: 'dynamic',
    color: 'gray',
    size: 100,
    threshold: 0.5
  });
};

// Función para inicializar el fondo
gameScene.initBackground = function () {
  this.background = this.add.image(0, 0, "background").setOrigin(0, 0);
  this.backgroundMedium = this.add.image(0, 0, "background_medium").setOrigin(0, 0);
  this.pastoSuperior = this.add.image(0, 0, 'background_superior').setOrigin(0, 0).setDepth(1);
};

// Función para configurar las colisiones
gameScene.setupCollisions = function () {
  this.physics.add.collider(this.player, this.grounds);
  this.physics.add.collider(this.player, this.platformGroup);
  this.physics.add.collider(this.enemiesGroup, this.platformGroup);
  this.physics.add.collider(this.enemiesGroup, this.grounds);
  this.physics.add.overlap(this.player, this.gameItemsGroup, this.collectItem, null, this);
  this.physics.add.overlap(this.player, this.enemiesGroup, this.handleGameOver, null, this);
};

// Función para configurar la cámara

  gameScene.setupCamera = function () {
    const worldWidth = 5760;
    const worldHeight = this.background.height;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  
    // Configura el zoom basado en el dispositivo
    const defaultZoom = config.height / worldHeight;
    this.cameras.main.setZoom(isMobile() ? defaultZoom * 1.1 : defaultZoom); // 10% más de zoom en móviles
  };
  

// Función para crear los elementos del juego
gameScene.create = function () {
  this.createJoystick();
  this.initBackground();
  this.initGameObjects(this.background);
  this.setupCamera();
  this.setupCollisions();

  this.cursors = this.input.keyboard.createCursorKeys();
};

// Variable para indicar si el juego está en modo "Game Over"
gameScene.isGameOver = false;

// Función para manejar la pérdida del juego
gameScene.handleGameOver = function () {
  if (this.isGameOver) return; // Evita múltiples pantallas de Game Over
  this.isGameOver = true;

  this.lives--;
  this.livesText.setText('Lives: ' + this.lives);

  if (this.lives <= 0) {
    this.showGameOverScreen();
  } else {
    this.handlePlayerDamage();
    this.isGameOver = false; // Permitir nuevos "Game Over" después del daño
  }
};

gameScene.showGameOverScreen = function () {
  this.physics.pause();
  this.cameras.main.stopFollow();

  // Mostrar mensaje de Game Over
  let background = this.add.rectangle(
    this.cameras.main.midPoint.x,
    this.cameras.main.midPoint.y,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000
  ).setOrigin(0.5).setDepth(1);

  let textStyle = { font: "64px Karantina", fill: "#FFFFFF", align: "center" };
  let text = this.add.text(
    this.cameras.main.midPoint.x,
    this.cameras.main.midPoint.y,
    "Game Over!",
    textStyle
  ).setOrigin(0.5).setDepth(2);

  // Reiniciar el juego después de 2 segundos
  this.time.delayedCall(2000, () => {
    this.lives = 3; // Reiniciar las vidas
    this.isGameOver = false; // Permitir que el juego siga después del reinicio
    this.scene.restart(); // Reiniciar la escena
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

// Función para manejar el movimiento de los enemigos
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

// Función para manejar el movimiento del jugador
gameScene.handlePlayerMovement = function () {
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = false;
  } else {
    this.player.body.setVelocityX(0);
  }

  if (
    (this.cursors.up.isDown || this.cursors.space.isDown) &&
    this.player.body.onFloor()
  ) {
    this.player.body.setVelocityY(this.playerJump);
  }
};
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
// Función para manejar el joystick
gameScene.handleJoystickMovement = function () {
  // Manejo de movimiento
  if (!this.joystick) return;

  this.joystick.on('move', (evt, data) => {
    if (data.direction) {
      const angle = data.angle.degree;
      const power = data.distance;
      const vx = Math.cos(Phaser.Math.DegToRad(angle)) * power * 10;
      this.player.setVelocityX(vx);
      this.player.flipX = vx < 0;

      if (data.direction.angle === 'up' && this.player.body.onFloor()) {
        this.player.setVelocityY(this.playerJump);
      }
    } else {
      this.player.setVelocityX(0);
    }
  });

  // Detener movimiento al finalizar joystick
  this.joystick.on('end', () => {
    this.player.setVelocityX(0);
  });
};


let falling = false;

gameScene.update = function () {
  this.handlePlayerMovement();
  this.handleJoystickMovement();
  this.enemiesGroup.children.each((enemy) => this.updateEnemyMovement(enemy));

  // Verificar si el jugador ha caído fuera del límite inferior del mapa
  if (this.player.y > this.physics.world.bounds.height) {
    this.handleGameOver();
  }
};






let config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: isMobile() ? 2 : 1, // Aumenta la resolución en móviles
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: gameScene,
  title: "Sword Of Destiny - video_game",
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
