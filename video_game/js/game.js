// Crea una nueva escena
let gameScene = new Phaser.Scene('Game'); // Ahora `gameScene` está correctamente definido

// Parámetros del personaje
gameScene.init = function () {
    this.playerSpeed = 300;
    this.playerJump = -440;
};

// Se cargan las imágenes
gameScene.preload = function () {
    this.load.image('background', '../img/assets/fondo.png');
    this.load.image('background_medium', '../img/assets/medio.png');
    this.load.image('background_superior', '../img/assets/pasto_superior.png');
    this.load.image('player', '../img/assets/pj.png');
    this.load.image('ground_1', '../img/assets/suelo_piedra_1.png');
    this.load.image('ground_2', '../img/assets/suelo_piedra_2.png');
    this.load.image('ground_3', '../img/assets/suelo_piedra_3.png');
    this.load.image('ground_4', '../img/assets/suelo_tierra.png');
    this.load.image('platform_1', '../img/assets/plataforma_piedra.png');
    this.load.image('platform_2', '../img/assets/plataforma_tierra.png');
};

// Datos del pj
gameScene.playerObject = [
    { type: 'player', x: 100, y: 0 }
];

// Datos del suelo
gameScene.gameObjects = [
    { type: 'ground_1', x: 390, y: -65 },
    { type: 'ground_2', x: 1485, y: -65 },
    { type: 'ground_3', x: 2648, y: -65 },
    { type: 'ground_4', x: 3937, y: -72 },
    { type: 'ground_4', x: 5408, y: -70 }
];

// Datos de las plataformas
gameScene.platforms = [
    { type: 'platform_1', x: 47, y: -310 },
    { type: 'platform_1', x: 147, y: -310 },
    { type: 'platform_1', x: 247, y: -310 },
    { type: 'platform_1', x: 347, y: -310 },
    { type: 'platform_1', x: 447, y: -310 },
    { type: 'platform_1', x: 647, y: -215 },
    { type: 'platform_1', x: 247, y: -510 },
    { type: 'platform_1', x: 147, y: -380 },
    { type: 'platform_1', x: 47, y: -450 },
    { type: 'platform_1', x: 547, y: -510 },
    { type: 'platform_1', x: 920, y: -330 },
    { type: 'platform_1', x: 1020, y: -360 },
    { type: 'platform_1', x: 1105, y: -430 },
    { type: 'platform_1', x: 1290, y: -530 },
    { type: 'platform_1', x: 1105, y: -130 },
    { type: 'platform_1', x: 1290, y: -310 },
    { type: 'platform_1', x: 1890, y: -100 },
    { type: 'platform_1', x: 2110, y: -190 },
    { type: 'platform_1', x: 3200, y: -200 },
    { type: 'platform_2', x: 3410, y: -100 },
    { type: 'platform_2', x: 4510, y: -140 },
    { type: 'platform_2', x: 4810, y: -140 }
];

// Función para inicializar los objetos del juego
gameScene.initGameObjects = function (fondo) {
    // Se posiciona al pj
    this.playerObject[0].y = fondo.height - 200; // Actualizar la posición Y del jugador

    // Crear el pj
    this.player = this.physics.add.sprite(this.playerObject[0].x, this.playerObject[0].y, 'player');
    this.player.setCollideWorldBounds(true);

    // Se crean los suelos
    this.grounds = this.physics.add.staticGroup();

    this.gameObjects.forEach(obj => {
        this.grounds.create(obj.x, fondo.height + obj.y, obj.type).setScale(1).refreshBody();
    });

    // Crear las plataformas
    this.platformGroup = this.physics.add.staticGroup();

    this.platforms.forEach(plat => {
        let platform = this.platformGroup.create(plat.x, fondo.height + plat.y, plat.type).setScale(1).refreshBody();
    });
};

// Crea los elementos del juego
gameScene.create = function () {
    let fondo = this.add.image(0, 0, 'background').setOrigin(0, 0);
    let fondoMedio = this.add.image(0, 0, 'background_medium').setOrigin(0, 0);

    // Inicializa el jugador, suelos y plataformas
    this.initGameObjects(fondo);

    // Se establecen los límites del mapa
    const worldWidth = 5760; // ancho
    const worldHeight = fondo.height;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Se ponen límites a la cámara
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    let screenRatio = config.height / fondo.height;
    this.cameras.main.setZoom(screenRatio);

    // Se pone el pasto
    let pastoSuperior = this.add.image(0, fondo.height, 'background_superior').setOrigin(0, 1);

    // Colisiones
    this.physics.add.collider(this.player, this.grounds);
    this.physics.add.collider(this.player, this.platformGroup); // Colisiona con plataformas

    // Control de teclas
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Función para actualizar, realiza movimientos del personaje
gameScene.update = function () {
    if (!this.cursors) return;

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
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
        this.player.body.setVelocityY(this.playerJump);
    }

    // Marcar límites del personaje
    if (this.player.x < 0) {
        this.player.x = 0;
    } else if (this.player.x > this.physics.world.bounds.width) {
        this.player.x = this.physics.world.bounds.width;
    }
};

// Configuración del juego
let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: gameScene,
    title: 'Sword Of Destiny - video_game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    }
};

// Creación del juego
let game = new Phaser.Game(config);
