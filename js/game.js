// Crea una nueva escena
let gameScene = new Phaser.Scene('Game');

// Parámetros iniciales del juego
gameScene.init = function () {
    this.playerSpeed = 300;
    this.playerJump = -440;

    // Datos del personaje
    this.playerObject = [{ type: 'player', x: 100, y: 0 }];

    // Datos del suelo
    this.gameObjects = [
        { type: 'ground_1', x: 0.5, y: -65 },
        { type: 'ground_2', x: 0.5, y: -65 },
        { type: 'ground_3', x: 0.5, y: -65 },
        { type: 'ground_4', x: 0.5, y: -72 },
        { type: 'ground_4', x: 0.5, y: -72 }
    ];

    // Datos de enemigos
    this.enemiesObjects = [
        { type: 'flying_bug', x: 0.5, y: -600 },
        { type: 'flying_bug', x: 0.5, y: -300 },
        { type: 'witch', x: 0.5, y: -350 },
        { type: 'monster', x: 0.5, y: -300 }
    ];

    // Assets
    this.gameItems = [
        { type: 'mushroom', x: 0.5, y: -190 },
        { type: 'key', x: 0.5, y: -180 },
        { type: 'crow', x: 0.5, y: -510 },
        { type: 'goblin', x: 0.5, y: -331 },
        { type: 'sword', x: 0.5, y: -500 },
        { type: 'bread', x: 0.5, y: -175 }
    ];

    // Datos de plataformas
    this.platforms = [
        { type: 'platform_1', x: 0.5, y: -310 },
        { type: 'platform_1', x: 0.5, y: -310 },
        { type: 'platform_1', x: 0.5, y: -310 },
        // Añadir más plataformas según sea necesario
    ];
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
    this.load.image('flying_bug', '../img/assets/bicho_volador.png');
    this.load.image('witch', '../img/assets/bruja_mala.png');
    this.load.image('monster', '../img/assets/monstruo.png');
    this.load.image('mushroom', '../img/assets/hongo.png');
    this.load.image('key', '../img/assets/llave.png');
    this.load.image('bread', '../img/assets/pan.png');
    this.load.image('sword', '../img/assets/espada_con_luz.png');
    this.load.image('crow', '../img/assets/cuervo.png');
    this.load.image('goblin', '../img/assets/duende.png');
};

// Función para inicializar los objetos del juego
gameScene.initGameObjects = function (fondo) {
    // Se posiciona al jugador
    this.playerObject[0].y = fondo.height - 200;

    // Crear el jugador
    this.player = this.physics.add.sprite(this.playerObject[0].x, this.playerObject[0].y, 'player');
    this.player.setCollideWorldBounds(true);

    // Se crean los suelos
    this.grounds = this.physics.add.staticGroup();
    this.gameObjects.forEach(obj => {
        this.grounds.create(this.scale.width * obj.x, fondo.height + obj.y, obj.type).setScale(1).refreshBody();
    });

    // Crea enemigos
    this.enemiesGroup = this.physics.add.group();
    this.enemiesObjects.forEach(enemy => {
        let newEnemy = this.enemiesGroup.create(this.scale.width * enemy.x, fondo.height + enemy.y, enemy.type);
        newEnemy.body.setAllowGravity(enemy.type !== 'flying_bug');
        newEnemy.setCollideWorldBounds(true);
        newEnemy.body.setSize(newEnemy.width, newEnemy.height - 13, true);
    });

    // Crear las plataformas
    this.platformGroup = this.physics.add.staticGroup();
    this.platforms.forEach(plat => {
        this.platformGroup.create(this.scale.width * plat.x, fondo.height + plat.y, plat.type).setScale(1).refreshBody();
    });

    // Objetos del juego (llave, espada, pan, hongo, duende, cuervo)
    this.gameItemsGroup = this.physics.add.staticGroup();
    this.gameItems.forEach(item => {
        this.gameItemsGroup.create(this.scale.width * item.x, fondo.height + item.y, item.type).setScale(1).refreshBody();
    });
};

// Crea los elementos del juego
gameScene.create = function () {
    let fondo = this.add.image(0, 0, 'background').setOrigin(0, 0);
    let fondoMedio = this.add.image(0, 0, 'background_medium').setOrigin(0, 0);

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
    let pastoSuperior = this.add.image(0, fondo.height, 'background_superior').setOrigin(0, 1);

    // Colisiones
    this.physics.add.collider(this.player, this.grounds);
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.player, this.enemiesGroup);
    this.physics.add.collider(this.player, this.gameItemsGroup);
    this.physics.add.collider(this.enemiesGroup, this.grounds);
    this.physics.add.collider(this.enemiesGroup, this.platformGroup);

    // Control de teclas
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Función para actualizar, realiza movimientos del personaje
gameScene.update = function () {
    if (!this.cursors) return;

    // Movimiento horizontal
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
    this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.physics.world.bounds.width);
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
    },
};

// Inicia el juego
let game = new Phaser.Game(config);

// Manejo del evento de redimensionamiento de la ventana
window.addEventListener('resize', () => {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    game.scale.resize(newWidth, newHeight);
    game.scene.scenes.forEach(scene => {
        if (scene.initGameObjects) {
            scene.initGameObjects(scene.add.image(0, 0, 'background').setOrigin(0, 0));
        }
    });
});
