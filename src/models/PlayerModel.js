

export default class PlayerModel {
    constructor() {
        this.lives = 3;
    }


    loseLife() {
        this.lives -= 1;
    }

    isGameOver() {
        return this.lives <= 0;
    }
}