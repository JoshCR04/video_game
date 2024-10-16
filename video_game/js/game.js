// Crea una nueva escena
let gameScene = new Phaser.Scene('Game');

//parametrso del pj
gameScene.init = function () {
    this.playerSpeed = 300;
    this.playerJump = -800;
};

//se cargan las imagenes
gameScene.preload = function () {
    this.load.image('background', '../img/assets/fondo.png');
    this.load.image('background_medium', '../img/assets/medio.png');
    this.load.image('background_superior', '../img/assets/pasto_superior.png');
    this.load.image('player', '../img/assets/pj.png');
    this.load.image('ground_1', '../img/assets/suelo_piedra_1.png');
    this.load.image('ground_2', '../img/assets/suelo_piedra_2.png');
    this.load.image('ground_3', '../img/assets/suelo_piedra_3.png');
    this.load.image('ground_4', '../img/assets/suelo_tierra.png');
};

// crea los elementos del juego
gameScene.create = function () {
    let fondo = this.add.image(0, 0, 'background').setOrigin(0, 0);
    let fondoMedio = this.add.image(0, 0, 'background_medium').setOrigin(0, 0);

    //se pone el pj
    this.player = this.physics.add.sprite(100, fondo.height - 200, 'player');
    this.player.setCollideWorldBounds(true);

    // se establecen los limites del mapa
    const worldWidth = 5760; //ancho
    const worldHeight = fondo.height;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // se ponen limites a la camara 
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    let screenRatio = config.height / fondo.height;
    this.cameras.main.setZoom(screenRatio);
    //se pone el suelo
    this.grounds = this.physics.add.staticGroup();
    this.grounds.create(390, fondo.height - 65, 'ground_1').setScale(1).refreshBody();
    this.grounds.create(1485, fondo.height - 65, 'ground_2').setScale(1).refreshBody();
    this.grounds.create(2648, fondo.height - 65, 'ground_3').setScale(1).refreshBody();
    this.grounds.create(3937, fondo.height - 72, 'ground_4').setScale(1).refreshBody();
    this.grounds.create(5408, fondo.height - 70, 'ground_4').setScale(1).refreshBody();
    //se pone el pasto
    let pastoSuperior = this.add.image(0, fondo.height, 'background_superior').setOrigin(0, 1);
    this.physics.add.collider(this.player, this.grounds);
    this.cursors = this.input.keyboard.createCursorKeys();
};

// funcion para actualizar, realiza movimientos del pj
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

    //saltar
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
        this.player.body.setVelocityY(this.playerJump);
    }

    // marcar limites del pj
    if (this.player.x < 0) {
        this.player.x = 0;
    } else if (this.player.x > this.physics.world.bounds.width) {
        this.player.x = this.physics.world.bounds.width;
    }
};

// Configuración del juego
let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 997,
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


// creacion del juego
let game = new Phaser.Game(config);
