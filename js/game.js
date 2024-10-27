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
  this.load.image("background", "../img/assets/fondo.png");
  this.load.image("background_medium", "../img/assets/medio.png");
  this.load.image("background_superior", "../img/assets/pasto_superior.png");
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






// Función para inicializar los objetos del juego
gameScene.initGameObjects = function (fondo) {
  // Se posiciona al jugador
  this.playerObject[0].y = fondo.height - 200;

  // Crear el jugador
  this.player = this.physics.add.sprite(
    this.playerObject[0].x,
    this.playerObject[0].y,
    "player"
  ).setCollideWorldBounds(true); // Encadenamiento para mayor claridad

  // Se crean los suelos
  this.grounds = this.physics.add.staticGroup();
  this.gameObjects.forEach((obj) => {
    this.grounds
      .create(obj.x, fondo.height + obj.y, obj.type)
      .setScale(1)
      .refreshBody();
  });

  // Crea enemigos
  this.enemiesGroup = this.physics.add.group();
  this.enemiesObjects.forEach((enemy) => {
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
  });
  // Crear plataformas
  this.platformGroup = this.physics.add.staticGroup();
  this.platforms.forEach((plat) => {
    this.platformGroup
      .create(plat.x, fondo.height + plat.y, plat.type)
      .setScale(1)
      .refreshBody();
  });

  // Objetos del juego (llave, espada, pan, hongo, duende, cuervo)
  this.gameItemsGroup = this.physics.add.staticGroup();
  this.gameItems.forEach((item) => {
    this.gameItemsGroup
      .create(item.x, fondo.height + item.y, item.type)
      .setScale(1)
      .refreshBody();
  });

  // Inicializar el texto de vidas
  this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, {
    fontSize: '32px',
    fill: '#FFFFFF'
  });
};

// Crea los elementos del juego
gameScene.create = function () {
  let fondo = this.add.image(0, 0, "background").setOrigin(0, 0);
  let fondoMedio = this.add.image(0, 0, "background_medium").setOrigin(0, 0);

  // Inicializa los objetos del juego
  this.initGameObjects(fondo);

  // Se establecen los límites del mapa
  const worldWidth = 5760; // ancho
  const worldHeight = fondo.height;
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  this.cameras.main.setZoom(config.height / fondo.height);

  // Se pone el pasto
  this.add.image(0, fondo.height, "background_superior").setOrigin(0, 1);

  // Colisiones
  this.physics.add.collider(this.player, this.grounds);
  this.physics.add.collider(this.player, this.platformGroup);
  this.physics.add.collider(this.player, this.gameItemsGroup);
  this.physics.add.collider(this.enemiesGroup, this.grounds);
  this.physics.add.collider(this.enemiesGroup, this.platformGroup);

  // Colisión entre el jugador y los enemigos
  this.physics.add.overlap(this.player, this.enemiesGroup, this.handleGameOver, null, this);

  // Control de teclas
  this.cursors = this.input.keyboard.createCursorKeys();
};

// Función para manejar la pérdida del juego
gameScene.handleGameOver = function () {
  this.lives--; // Restar una vida
  this.livesText.setText('Lives: ' + this.lives); // Actualizar el texto de vidas

  if (this.lives <= 0) {
    // Si no quedan vidas, se pierde el juego
    this.physics.pause();
    this.cameras.main.stopFollow();

    // Se muestra el mensaje de Game Over centrado
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

    // Reiniciar la escena después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.lives = 3;
      this.scene.restart();
    }, null, this);
  } else {
    // Reiniciar la posición del jugador y hacer que regrese a la vida
    this.player.setPosition(this.playerObject[0].x, this.playerObject[0].y);
    this.cameras.main.shake(200, 0.02);
  }
};


// Función para manejar el movimiento de los enemigos
gameScene.updateEnemyMovement = function (enemy) {
  // Cambiar dirección si choca con los límites
  if (enemy.body.blocked.left || enemy.body.blocked.right) {
    enemy.patrolDirection *= -1; // Cambia la dirección
  }

  // Mover el enemigo
  enemy.body.setVelocityX(enemy.patrolDirection * enemy.patrolSpeed);
  enemy.setFlipX(enemy.patrolDirection === 1); // Voltear según la dirección

  // Limitar el patrullaje
  if (enemy.x > enemy.startX + enemy.patrolDistance) {
    enemy.patrolDirection = -1; // Cambia a la izquierda
  } else if (enemy.x < enemy.startX - enemy.patrolDistance) {
    enemy.patrolDirection = 1; // Cambia a la derecha
  }
};


// Función para actualizar, realiza movimientos del personaje, patrullaje
gameScene.update = function () {
  if (!this.cursors) return;

  // Movimiento horizontal del jugador
  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = true;
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = false;
  } else {
    this.player.body.setVelocityX(0);
  }

  // Saltar
  if (
    (this.cursors.up.isDown || this.cursors.space.isDown) &&
    this.player.body.onFloor()
  ) {
    this.player.body.setVelocityY(this.playerJump);
  }

  // Marcar límites del personaje
  this.player.x = Phaser.Math.Clamp(
    this.player.x,
    0,
    this.physics.world.bounds.width
  );

  // Lógica de patrullaje para los enemigos
  this.enemiesGroup.getChildren().forEach((enemy) => {
    this.updateEnemyMovement(enemy); // Actualizar el movimiento del enemigo
  });
};

// Configuración del juego
let config = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
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
