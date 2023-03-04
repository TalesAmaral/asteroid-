class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite).setOrigin(0.5, 0.5);
        scene.add.existing(this);
    }

    update() {

        this.x = (obj_agent.x - agentOldX) + this.x;
        this.y = (obj_agent.y - agentOldY) + this.y;

        let deltaFire1;
        let deltaFire2;

        if (fire1 == 1) {
            deltaFire1 = Phaser.Math.Distance.Between(obj_fire1.x, obj_fire1.y, this.x, this.y);
        }
        if (fire2 == 1) {
            deltaFire2 = Phaser.Math.Distance.Between(obj_fire2.x, obj_fire2.y, this.x, this.y);
        }

        let enemyPositionX = ((Math.floor(this.x) - Math.floor(obj_agent.x)+225))/50;
        let enemyPositionY = (Math.floor(this.y) - Math.floor(obj_agent.y))/50;

        if(deltaFire1 < 25) {
            this.destroy();
            agentArray[enemyPositionY][enemyPositionX] = 0;
            agentVel += 0.225;
            if(enemyPositionY == 0) { score += 30};
            if(enemyPositionY == 1) { score += 20};
            if(enemyPositionY >= 2) { score += 10};
            obj_fire1.destroy();
            fire1= -1;
            fireqtd --;
        }
        if(deltaFire2 < 25) {
            this.destroy();
            agentArray[enemyPositionY][enemyPositionX] = 0;
            agentVel += 0.225;
            if(enemyPositionY == 0) { score += 30};
            if(enemyPositionY == 1) { score += 20};
            if(enemyPositionY >= 2) { score += 10};
            obj_fire2.destroy();
            fire2= -1;
            fireqtd--;
        }

    }
}
