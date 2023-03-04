let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    /* scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3
    }, */
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update,
        render: render
    },
}

const game = new Phaser.Game(config);


//============ControlVars=============
let canFire = 1;
let canMove = 1;
let enemyqtd = 0;
let frameVictory = 0;
let shipLive = 1;
let frameOver = 0;
let fireqtd = 0;
let fire1 = 0;
let fire2 = 0;
let flareTimer = 0;
let agentDir = 1;
let agentVel = 2;
let agentOldX = 400;
let agentOldY = 50;
let agentArray = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
let limitLeft = -250;
let limitRight = 250;
let bottomLimit = 200;
let score = 0;
let lives = 3;
let intervalFire =0;
let strDebug;
let strScore;
let strLives;
//====================================


function init() {

}

function preload() {
    this.load.image('bg', './assets/blue.png');
    this.load.image('ship', './assets/ship_1.png');
    this.load.image('enemy1', './assets/ship_3.png');
    this.load.image('enemy2', './assets/ship_4.png');
    this.load.image('laserEnemy', './assets/enemyL.png');
    this.load.image('enemy3', './assets/ship_6.png');
    this.load.image('agent', './assets/planet_1.png');
    this.load.image('hud', './assets/spr_hud.png');
    this.load.spritesheet('fire', './assets/shot.png', {
        frameWidth: 48,
        frameHeight: 48
    });
    this.load.spritesheet('nitro', './assets/turbo_blue.png', {
        frameWidth: 48,
        frameHeight: 48
    });
    this.load.spritesheet('boom', './assets/explosions.png', {
        frameWidth: 48,
        frameHeight: 48
    });
    this.load.image('flare', './assets/flare.png');
    this.load.image('gameOver', './assets/gameover.png');
    this.load.spritesheet('playerexp', './assets/explo.png', {
        frameWidth: 80,
        frameHeight:80,
    });



};


function create() {

    cursors = this.input.keyboard.createCursorKeys();

    this.add.image(0, 0, 'bg').setOrigin(0, 0);
    obj_ship = this.add.image(400, 520, 'ship').setOrigin(0.5, 0)
    this.anims.create({
        key: 'nitro',
        frames: this.anims.generateFrameNumbers('nitro'),
        frameRate: 12,
        repeat: -1
    });
    obj_nitro = this.add.sprite(obj_ship.x, obj_ship.y, 'nitro').setOrigin(0.46, -0.5);
    obj_nitro.anims.play('nitro', true);

    obj_flare = this.add.image(obj_ship.x, obj_ship.y - 2, 'flare').setScale(0.05).setOrigin(0.5, 0.5);
    obj_flare.visible = 0;

    // ============Depth============
    obj_ship.depth = 1;
/*     obj_fire.depth = 1;
 */    obj_nitro.depth = 1;
    //==============================


    this.Group_Enemy = this.add.group({ runChildUpdate: true });
    let OrigemX = 175;
    let OrigemY = 50;
    for (i = 0; i <= 9; i++) {
        for (j = 0; j <= 3; j++) {
            let sprite = ' ';
            if (j == 0) { sprite = 'enemy1' };
            if (j == 1) { sprite = 'enemy2' };
            if (j == 2) { sprite = 'enemy3' };
            if (j == 3) { sprite = 'enemy1' };
            this.Group_Enemy.add(enemy = new Enemy(this, OrigemX + 50 * i, OrigemY + 50 * j, sprite))
        }
    }

    obj_agent = this.add.sprite(400, 50, 'agent').setOrigin(0.5, 0.5).setAlpha(0);


    this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('boom'),
        frameRate: 20,
        repeat: 0
    });

    this.Group_Enemy_Explode = this.add.group({ runChildUpdate: true });
    this.Group_Enemy_Shot = this.add.group({runChildUpdate: true});

    this.add.image(267, 0, 'hud').setScale(0.3).setOrigin(0, 0).setAlpha(0.4);

    strScore = this.add.text(310, 7, '', {
        fontFamily: 'Impact',
        fontSize: '12px',
        fill: '#fff',
    }).setOrigin(0, 0.5);

    strLives = this.add.text(425, 7, '', {
        fontFamily: 'Impact',
        fontSize: '12px',
        fill: '#fff',
    }).setOrigin(0, 0.5);


    // Debug

    strDebug = this.add.text(400, 320, '-DEBUG-', {
        fontFamily: 'Verdana',
        fontSize: '20px',
        fill: '#ff0000'
    }).setOrigin(0.5, 0);

    g = this.add.graphics();

    this.anims.create({
        key: 'playerexp',
        frames: this.anims.generateFrameNumbers('playerexp'),
        frameRate: 24,
        repeat: 0, 
    });

}


function update() {

    this.Group_Enemy.add(enemy = new Enemy(this))

    if (flareTimer > 0) {
        flareTimer -= 0.1;
        obj_flare.alpha = flareTimer / 3;
        obj_flare.scaleX = flareTimer / 8;
        obj_flare.scaleY = flareTimer / 8;
    } else {
        obj_flare.visible = 0;
    }

    /* if(cursors.left.isDown) {obj_ship.x -= 5;}
    if(cursors.right.isDown) {obj_ship.x += 5;}

    obj_flare.x = obj_ship.x;
    obj_flare.y = obj_ship.y-3;

    if( obj_ship.x < 24) {obj_ship.x = 24}
    if( obj_ship.x > 776) {obj_ship.x = 776}

    if(cursors.space.isDown && canFire == 1 && fireqtd <2) {
        if(fireqtd <= 1 && fire1 ==0) {
            this.anims.create({
                key: 'fire',
                frames: this.anims.generateFrameNumbers('fire'),
                frameRate: 12,
                repeat: -1
            });
            obj_fire1=this.add.sprite(obj_ship.x, obj_ship.y, 'fire').setOrigin(0.5, 1);
            obj_fire1.anims.play('fire', true);
            obj_flare.visible = 1; flareTimer = 1;
            fire1 = 1;
        }
        if(fireqtd ==1 && fire2 == 0) {
            this.anims.create({
                key: 'fire',
                frames: this.anims.generateFrameNumbers('fire'),
                frameRate: 12,
                repeat: -1
            });
            obj_fire2=this.add.sprite(obj_ship.x, obj_ship.y, 'fire').setOrigin(0.5, 1);
            obj_fire2.anims.play('fire', true);
            obj_flare.visible = 1; flareTimer = 1;
            fire2 = 1;
        }
        fireqtd++;
        canFire = 0;
    }
    if(cursors.space.isUp) {canFire = 1};
    if(fire1 == 1) {
        obj_fire1.y -= 8;
        if(obj_fire1.y < -70) {
            obj_fire1.destroy();
            fire1 = 0;
            fireqtd--;
        }
    };
    if(fire2 == 1) {
        obj_fire2.y -= 8;
        if(obj_fire2.y < -70) {
            obj_fire2.destroy();
            fire2 = 0;
            fireqtd--;
        }
    }; */

    if (fire1 == -1) {
        fire1 = 0;
        if( enemyqtd != 40){
            this.Group_Enemy_Explode.add(enemy_explode =
                new Enemy_Explode(this, obj_fire1.x, obj_fire1.y, 'boom'));
        }
    }
    if (fire2 == -1) {
        fire2 = 0;
        if (enemyqtd != 40){
            this.Group_Enemy_Explode.add(enemy_explode =
                new Enemy_Explode(this, obj_fire2.x, obj_fire2.y, 'boom'));
        }
    }


    //Agent
    enemyqtd = 0;

    let calcLim = 1;
    limitLeft = 0;
    limitRight = 0;

    for (i = 0; i <= 9; i++) {
        for (j = 0; j <= 4; j++) {
            enemyqtd += agentArray[j][i];
            let vtemp;
            if (i == 0) { vtemp = -250 };
            if (i == 1) { vtemp = -200 };
            if (i == 2) { vtemp = -150 };
            if (i == 3) { vtemp = -100 };
            if (i == 4) { vtemp = -50 };
            if (i == 5) { vtemp = 0 };
            if (i == 6) { vtemp = 50 };
            if (i == 7) { vtemp = 100 };
            if (i == 8) { vtemp = 150 };
            if (i == 9) { vtemp = 200 };
            if (calcLim == 1 && agentArray[j][i] != 0) {
                limitLeft = vtemp;
                calcLim = 0;
            }
            if (agentArray[j][i] != 0) {
                limitRight = vtemp + 50;
            }

        };
    };

    bottomLimit = 0;
    for (i = 0; i <= 3; i++) {
        for (j = 0; j <= 9; j++) {
            let vtemp;
            if (i == 0) { vtemp = 50 };
            if (i == 1) { vtemp = 100 };
            if (i == 2) { vtemp = 150 };
            if (i == 3) { vtemp = 200 };

        }
    };

    //========================PLayer========================//
    if (enemyqtd == 0) {
        canMove = 0;
        frameVictory++;
        if (fire1 == 1) { obj_fire1.y -= 10 };
        if (fire2 == 1) { obj_fire2.y -= 10 };
    }
    if (canMove == 1) {
        if (cursors.left.isDown) { obj_ship.x -= 5; }
        if (cursors.right.isDown) { obj_ship.x += 5; }

        obj_flare.x = obj_ship.x;
        obj_flare.y = obj_ship.y - 3;

        if (obj_ship.x < 24) { obj_ship.x = 24 }
        if (obj_ship.x > 776) { obj_ship.x = 776 }

        if (cursors.space.isDown && canFire == 1 && fireqtd < 2) {
            if (fireqtd <= 1 && fire1 == 0) {
                this.anims.create({
                    key: 'fire',
                    frames: this.anims.generateFrameNumbers('fire'),
                    frameRate: 12,
                    repeat: -1
                });
                obj_fire1 = this.add.sprite(obj_ship.x, obj_ship.y, 'fire').setOrigin(0.5, 1);
                obj_fire1.anims.play('fire', true);
                obj_flare.visible = 1; flareTimer = 1;
                fire1 = 1;
            }
            if (fireqtd == 1 && fire2 == 0) {
                this.anims.create({
                    key: 'fire',
                    frames: this.anims.generateFrameNumbers('fire'),
                    frameRate: 12,
                    repeat: -1
                });
                obj_fire2 = this.add.sprite(obj_ship.x, obj_ship.y, 'fire').setOrigin(0.5, 1);
                obj_fire2.anims.play('fire', true);
                obj_flare.visible = 1; flareTimer = 1;
                fire2 = 1;
            }
            fireqtd++;
            canFire = 0;
        }
        if (cursors.space.isUp) { canFire = 1 };
        if (fire1 == 1) {
            obj_fire1.y -= 8;
            if (obj_fire1.y < -70) {
                obj_fire1.destroy();
                fire1 = 0;
                fireqtd--;
            }
        };
        if (fire2 == 1) {
            obj_fire2.y -= 8;
            if (obj_fire2.y < -70) {
                obj_fire2.destroy();
                fire2 = 0;
                fireqtd--;
            }
        };
    }

    agentOldX = obj_agent.x;
    agentOldY = obj_agent.y;

    if (obj_agent.x > (400 - limitRight) + 400) {
        agentDir = -1; obj_agent.x = (400 - limitRight) + 400;
        obj_agent.y += 5;
    };
    if (obj_agent.x < limitLeft * -1) {
        agentDir = 1; obj_agent.x = limitLeft * -1;
        obj_agent.y += 5;
    };


    /* if(obj_agent.x > 800) { agentDir = -1; obj_agent.x = 800};
    if(obj_agent.x < 0) {agentDir = 1; obj_agent.x = 0}; */
    obj_agent.x += agentVel * agentDir;


    //============Hud Sys============================//
    strScore.setText('Score: ' + score);             //   
    strLives.setText('Lives: ' + lives);             //
    strScore.setShadow(3, 3, 'rgba(0,0,0,1)', 0);    //
    strLives.setShadow(3, 3, 'rgba(0,0,0,1)', 0);    //
    strScore.depth = 10;                             //
    strLives.depth = 10;                             //
    //===============================================//


    //========================Victory==========================================================================//
    if (frameVictory ==0){                              
        obj_agent.x += agentVel* agentDir;
    }
    if (frameVictory == 120) {
        obj_ship.x = 400;
        obj_agent.x = 400;
        obj_agent.y = 100;
        agentOldX = 400;
        agentOldY = 100;
        agentVel = 2;
        canMove = 1;
        frameVictory = 0;
        enemyqtd = 40;
        agentArray = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        let OrigemX = 175;
        let OrigemY = 50;
        for (i = 0; i <= 9; i++) {
            for (j = 0; j <= 3; j++) {
                let sprite = ' ';
                if (j == 0) { sprite = 'enemy1' };
                if (j == 1) { sprite = 'enemy2' };
                if (j == 2) { sprite = 'enemy3' };
                if (j == 3) { sprite = 'enemy1' };
                this.Group_Enemy.add(enemy = new Enemy(this, OrigemX + 50 * i, OrigemY + 50 * j, sprite))
            }
        }
    }
    //=========================================================================================================//


    //========================Game Over na cara==========================================================================//
    if(bottomLimit + obj_agent.y > 360) {
        shipLive = 0;
        obj_agent.y +=2;
    }
    if(frameOver ==1) {
        obj_playerexp = this.add.sprite(
            obj_ship.x,
            obj_ship.y,
            'playerexp').setOrigin(0.5, 0.5),
            obj_playerexp.anims.play('playerexp', true),
            obj_playerexp.once(
                'animationcomplete', () => {
                    obj_playerexp.destroy();
                }
            
        )
    }
    if(frameOver == 60) {
        if(lives == 0){
            obj_over = this.add.image( 400, 300,'gameOver').setOrigin(0.5, 0.5);
        }else{
            shipLive = 1;
            canMove = 1;
            obj_ship.visible = 1;
            obj_nitro.visible = 1;
            obj_fire1.visible = 1;
            obj_fire2.visible = 1;
            if(fire1 == 1) { obj_fire1.visible = 1};
            if(fire2 == 1) { obj_fire2.visible = 1};
            frameOver = 0;
        }
    };

    if (shipLive ==0) {
        canMove = 0;
        obj_ship.visible = 0;
        obj_fire1.visible =0;
        obj_fire2.visible = 0;
        obj_nitro.visible = 0;
        if(fire1 ==1) { fire1.visible =0};
        if(fire2 ==1) { fire2.visible =0};
        obj_agent.x = agentOldX;
        if (frameOver < 60) {
            obj_agent.y = agentOldY
        };
        frameOver++;
    }


    //========================Enemy's Fire========================================//
    intervalFire++;
    if(intervalFire > 120){
        intervalFire = 0;
    };


    if (enemyqtd>0){
        let ILACF = 0; //Is Living And Can Fire;
        let fireLine = 0;
        let fireColumn = 0;
        
        while(ILACF == 0) {
            var sorteio = Phaser.Math.Between(0, 39);
            var sorteio = sorteio/10;
            let integerPart = Math.floor(sorteio);
            let floatPart = Math.round((sorteio-integerPart)* 10);
            ILACF = agentArray[integerPart][floatPart];
            fireLine = integerPart;
            fireColumn = floatPart;
        }
        if(fireLine ==0) {fireLine = obj_agent.y + 50 - 25};
        if(fireLine ==1) {fireLine = obj_agent.y + 100 - 25};
        if(fireLine ==2) {fireLine = obj_agent.y + 150 - 25};
        if(fireLine ==3) {fireLine = obj_agent.y + 200 - 25};

        if(fireColumn ==0) {fireColumn = obj_agent.x - 250 + 25};
        if(fireColumn ==1) {fireColumn = obj_agent.x - 200 + 25};
        if(fireColumn ==2) {fireColumn = obj_agent.x - 150 + 25};
        if(fireColumn ==3) {fireColumn = obj_agent.x - 100 + 25};
        if(fireColumn ==4) {fireColumn = obj_agent.x -  50 + 25};
        if(fireColumn ==5) {fireColumn = obj_agent.x -   0 + 25};
        if(fireColumn ==6) {fireColumn = obj_agent.x +  50 + 25};
        if(fireColumn ==7) {fireColumn = obj_agent.x + 100 + 25};
        if(fireColumn ==8) {fireColumn = obj_agent.x + 150 + 25};
        if(fireColumn ==9) {fireColumn = obj_agent.x + 200 + 25};
        if(intervalFire == 0 && frameOver ==0 ){
            this.Group_Enemy.add(enemy_shot =
                new Enemy_Shot(this, fireColumn, fireLine, 'laserEnemy')
            );

        }
    }

    /* strDebug.setText(
        'Sinvaders' + '\n' +
        'Qts de tiros: ' + fireqtd + '\n' +
        'Laser1: ' + fire1 + '\n' +
        'Laser2: ' + fire2 + '\n'
        'agentArray' + '\n' +
        agentArray[0] + '\n' +
        agentArray[1] + '\n' +
        agentArray[2] + '\n' +
        agentArray[3] + '\n'

    );

    g.clear();
    g.fillStyle(0xff0000, 0.5);
    g.fillRect(obj_agent.x + limitLeft, obj_agent.y - 25,
        limitRight - limitLeft,
        bottomLimit
    ); */



    obj_nitro.x = obj_ship.x;
};

function render() {

}