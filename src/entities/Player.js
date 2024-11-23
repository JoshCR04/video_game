class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;

        // Crear el sprite del jugador
        this.sprite = scene.physics.add.sprite(x, y, texture).setCollideWorldBounds(true);

        // Configuración de controles
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Propiedades del jugador
        this.speed = scene.playerSpeed || 200; // Velocidad predeterminada
        this.jumpForce = scene.playerJump || 300; // Fuerza del salto
        this.isAttacking = false; // Estado de ataque
        this.attackDuration = scene.attackDuration || 500; // Duración del ataque
    }

    // Movimiento del jugador
    update() {
        const { sprite, cursors, keys } = this;

        // Movimiento horizontal
        if (cursors.left.isDown || keys.A.isDown) {
            sprite.setVelocityX(-this.speed);
            sprite.setFlipX(true); // Girar sprite
        } else if (cursors.right.isDown || keys.D.isDown) {
            sprite.setVelocityX(this.speed);
            sprite.setFlipX(false);
        } else {
            sprite.setVelocityX(0); // Detenerse
        }

        // Salto
        if ((cursors.up.isDown || keys.W.isDown) && sprite.body.blocked.down) {
            sprite.setVelocityY(-this.jumpForce);
        }

        // Ataque
        if (cursors.space.isDown && !this.isAttacking) {
            this.attack();
        }
    }

    // Lógica de ataque
    attack() {
        this.isAttacking = true;
        console.log("Jugador atacando"); // Aquí podrías activar animaciones o colisiones de ataque
        this.scene.time.delayedCall(this.attackDuration, () => {
            this.isAttacking = false;
        });
    }

    // Colisión con enemigos
    handleCollision(enemy) {
        if (this.isAttacking) {
            console.log("Enemigo eliminado");
            enemy.destroy(); // Eliminar enemigo
        } else {
            console.log("Jugador herido");
            this.scene.lives -= 1; // Reducir vidas
            this.scene.events.emit("updateLives", this.scene.lives);
        }
    }

    // Recolección de ítems
    collectItem(item) {
        console.log("Ítem recolectado:", item.texture.key);
        this.scene.score += 10; // Aumentar puntuación
        this.scene.events.emit("updateScore", this.scene.score);
        item.destroy();
    }
}
