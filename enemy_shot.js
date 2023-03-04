class Enemy_Shot extends Phaser.GameObjects.Sprite{
    constructor( scene, x, y, sprite) {
        super(scene, x, y, sprite).setOrigin(0.5,0.5);
        scene.add.existing(this); 
    };

    update(){
        this.y +=5;
        if(this.y > 595) {this.destroy()}
        let impactPlayer = Phaser.Math.Distance.Between(obj_ship.x, obj_ship.y, this.x, this.y);
        if (impactPlayer < 40) {
            //Player lost 1 lifePoint
            lives--;
            shipLive =0;
            this.destroy();
            if(frameVictory > 0) { this.destroy};
        }
    };
}