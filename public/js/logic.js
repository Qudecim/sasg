//postion main person X and Y
var personX = (canvas.width)/2;
var personY = (canvas.height)/2;

//position world
var canvasPositionX = 0;                    
var canvasPositionY = 0;   

//for smothing
var personPositionX = 0;
var personPositionY = 0;


//color main person
var colorPerson = '9595DD';

//id main person
var personId = '';

//person skin
var personSkin = 1;
var personHands = 1;

//array stat main person
var personStat = {accuracy:1,damage:10,armor:1,rapidFire:1,teleport:0};

//mouse angle
var angle=0;

//main name
var personName = '';

//blood screen enabled or not
var bloodScreen = 0;

//array statisctic
var statistics = Array();

//array blood places
var blood = Array();

//permission to shoot main person
var permissionToShoot = true;

//permission Ability, value time!   Teleport max it is 100%
var permissionAbility = {teleport:0,teleportMax:0,invis:0,invisMax:0,shield:0,shieldMax:0};

//all players postion 
var players = {};

//player info
var playerInfo = {};

//timing ability all players
var playersAbility = [];

//name and skin all players
var startInfoPlayers = {};

//all drop position
var airDrop = Array(); 

//array postion bullets main and enemies
var bullets = [];

var mouseX = 0;
var mouseY = 0;

//i think it's not need
var personPoint = 0;  

//events -------------------------------------------------------

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.querySelector('#myCanvas').addEventListener('click', function(e) {
    
    if (game && playerInfo.points>0) {
        mouseX = (e.pageX - e.target.offsetLeft);
        mouseY = (e.pageY - e.target.offsetTop);
        if (mouseY>canvas.height - 70&&mouseY<canvas.height - 40) {
            if (mouseX>0&&mouseX<100) {
                socket.emit('addStat','damage');
                return;
            }
            if (mouseX>100&&mouseX<180) {
                socket.emit('addStat','armor');
                return;
            }
            if (mouseX>190&&mouseX<280) {
                socket.emit('addStat','rapidFire');
                return;
            }
            if (mouseX>280&&mouseX<380) {
                socket.emit('addStat','maxHP');
                return;
            }
        }
        if (mouseY>canvas.height - 40&&mouseY<canvas.height) {
            if (mouseX>0&&mouseX<100) {
                socket.emit('addStat','teleport');
                return;
            }
            if (mouseX>100&&mouseX<180) {
                socket.emit('addStat','invis');
                return;
            }
            if (mouseX>190&&mouseX<280) {
                socket.emit('addStat','shield');
                return;
            }
        }
    }
    
    if (game && permissionToShoot) {

        mouseX = (e.pageX - e.target.offsetLeft) - (personX - canvasPositionX),
        mouseY = (e.pageY - e.target.offsetTop) - (personY - canvasPositionY);

        randomN = + getRandomAccuracy();
        
        //Это угол полета пули
        var deg = Math.atan2(mouseY, mouseX);
        var deltaY = speedBullet * Math.sin(deg)/ 3000;
        var deltaX = speedBullet * Math.cos(deg)/ 3000;
        
        //В дальнейшем нужно переделать, а то несколько раз расчитываю наклон (Это стартовая позиция пули)
        var xmouse=e.clientX; var ymouse=e.clientY; var xcenter=personX - canvasPositionX; var ycenter=personY - canvasPositionY;
        var ang=Math.atan2(xmouse-xcenter, ymouse-ycenter); 
        var x=xcenter+Math.round(Math.sin(ang)*50); 
        var y=ycenter+Math.round(Math.cos(ang)*50);

        starBuletX = x + canvasPositionX;
        starBuletY = y + canvasPositionY;

        bulletArray = [{id:personId,x:starBuletX,y:starBuletY,dx:deltaX,dy:deltaY,damage:personStat['damage'],color:colorPerson}];
        bullets.push({deltaY:deltaY, deltaX:deltaX,x:starBuletX,y:starBuletY,damage:personStat['damage'],id:personId,color:colorPerson});
        
        permissionToShoot=false;
        socket.emit('bullet', JSON.stringify(bulletArray));
        
        //var tm = 2000-(40*players[personId].rf);

        tm = 1000;
        for (var i=0;i<playerInfo.rf-1;i++) {
            tm = tm - tm/10
        }
        
        setTimeout(function(){permissionToShoot=true;},tm);
    }
    
    if (!game) {
        mouseX = (e.pageX - e.target.offsetLeft);
        mouseY = (e.pageY - e.target.offsetTop);
        
//        for (i=1;i<=Object.keys(skinArray).length;i++) {
//            if (mouseY>i*60 && mouseY<(i+1)*60 && mouseX>canvas.width-100 && mouseX<canvas.width-40) {
//                personSkin = i;
//                
//            }
//        }
        if (mouseY>(canvas.height/2)+10 && mouseY<(canvas.height/2)+60 && mouseX>(canvas.width/2)-150 && mouseX<(canvas.width/2)-75) {
            if (personSkin-1==0) {
                personSkin = Object.keys(skinArray).length;
            } else {
                personSkin--; 
            }
        }
        
        if (mouseY>(canvas.height/2)+10 && mouseY<(canvas.height/2)+60 && mouseX>(canvas.width/2)+150 && mouseX<(canvas.width/2)+200) {
            if (personSkin==Object.keys(skinArray).length) {
                personSkin = 1;
            } else {
                personSkin++; 
            }
        }
        
         if (mouseY>(canvas.height/2)+60 && mouseY<(canvas.height/2)+110 && mouseX>(canvas.width/2)-150 && mouseX<(canvas.width/2)-75) {
            if (personHands-1==0) {
                personHands = Object.keys(handsArray).length;
                console.log(personHands);
            } else {
                personHands--; 
            }
             
        }
        
        
        if (mouseY>(canvas.height/2)+60 && mouseY<(canvas.height/2)+110 && mouseX>(canvas.width/2)+150 && mouseX<(canvas.width/2)+200) {
            if (personHands==Object.keys(handsArray).length) {
                personHands = 1;
            } else {
                personHands++; 
            }
        } 
        
    }
    
}, false);

document.querySelector('#myCanvas').addEventListener('mousemove', function(e) {
     var offset = {
            dx: (e.pageX - e.target.offsetLeft) - canvas.width/2,
            dy:(e.pageY - e.target.offsetTop) - canvas.height/2
        };
        angle = Math.atan(offset.dy / offset.dx);
        if (offset.dx < 0) angle += Math.PI;  
});

document.querySelector('#myCanvas').addEventListener('contextmenu', function(e) {
    mouseX = (e.pageX - e.target.offsetLeft);
    mouseY = (e.pageY - e.target.offsetTop);

    if (game && playerInfo.teleport) {
        if (permissionAbility.teleport == 0) {
            socket.emit('ability',JSON.stringify({ability:'teleport',x:(mouseX + canvasPositionX),y:(mouseY + canvasPositionY)}));
            permissionAbility.teleport = Math.round(500/playerInfo.teleport);
            permissionAbility.teleportMax = Math.round(500/playerInfo.teleport);
        }
    }
    e.preventDefault();
    return false;
}, false);

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

//draw function -----------------------------------------------

function drawPlayers() {
    
    for (var player in players) {

        var isInvis = 0;
        var isShield = 0;
        for (i=0;i<playersAbility.length;i++) {
            if (playersAbility[i].id == player && playersAbility[i].ability == 'invis') {
                isInvis=1;
            }
            if (playersAbility[i].id == player && playersAbility[i].ability == 'shield') {
                isShield=1;
            }
        }

        
        if (player == personId) {

            if (isInvis) {
                ctx.globalAlpha = 0.5;
            }
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(angle);
              
            ctx.drawImage(handsArray[personHands], 5, -20,80,40);
            
            ctx.beginPath();
            ctx.arc(0, 0, personRadius, 0, Math.PI*2);
            ctx.fillStyle = '#' + playerInfo.color;
            ctx.fill();
            ctx.closePath();
            
            ctx.drawImage(skinArray[personSkin], -30, -30,60,60);
            
            if (isShield) {
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(0, 0, 22, 0, Math.PI*2);
                ctx.fillStyle = '#dd0000';
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1.0;
            }
            
            ctx.restore();
            ctx.globalAlpha = 1.0;
            personX = players[player].x;
            personY = players[player].y;
            

        } else if (!isInvis) {
            ctx.save();
            ctx.translate(players[player].x - canvasPositionX,players[player].y - canvasPositionY);
            ctx.rotate(players[player].angle);

            ctx.beginPath();
            ctx.arc(0, 0, personRadius, 0, Math.PI*2);
            ctx.fillStyle = '#ddd';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            
            ctx.drawImage(imgHands, 5, -20,80,40);
            if (startInfoPlayers[player]) {
                ctx.drawImage(skinArray[startInfoPlayers[player].skin], -30, -30,60,60);
            }
            
            if (isShield) {
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(0, 0, 22, 0, Math.PI*2);
                ctx.fillStyle = '#dd0000';
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1.0;
            }
            
            ctx.restore();

        }
        
    } 
}   

function drawBullet() {
    
    bullets.forEach(function(bullet, i, arr) {

        bullet.x = bullet.x+bullet.deltaX;
        bullet.y = bullet.y+bullet.deltaY;
        
        ctx.beginPath();
        ctx.arc(bullet.x - canvasPositionX, bullet.y - canvasPositionY, 7, 0, Math.PI*2);
        ctx.fillStyle = '#' + bullet.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
        for (var objMap in map) {
            if (map[objMap].coll == 'circle') {
                if (Math.sqrt((Math.pow(map[objMap].x-bullet.x,2) + Math.pow(map[objMap].y-bullet.y,2)))<(map[objMap].rad + 7)) {
                    bullets.splice(i, 1);
                }
            } else if (map[objMap].coll == 'box'){
                if (bullet.x> map[objMap].x && bullet.x< map[objMap].endX && bullet.y > map[objMap].y && bullet.y < map[objMap].endY) {
                    bullets.splice(i, 1);
                }
            }
        }
        
        if(bullet.x<0||bullet.y<0||bullet.x>mapSize||bullet.y>mapSize){
            bullets.splice(i, 1);
        }
        
        if ((bullet.x > (personX - 20)) && (bullet.x < (personX + 20)) && (bullet.y > (personY - 20)) && (bullet.y < (personY + 20))) {
            if(bullet.id != personId) {
                bullets.splice(i, 1);  
                
                var isShieldMain = 0;
                for (i=0;i<playersAbility.length;i++) {
                    if (playersAbility[i].id == personId && playersAbility[i].ability == 'shield') {
                        isShieldMain=1;
                    }
                }
                
                if (!isShieldMain) {
                    socket.emit('hit',bullet.id);

                    //blood screen
                    bloodScreen = 1;
                    setTimeout(bloodScreenAlpha, 100);
                }
                
            }
        }
        
        for (var player in players) {
            if(player != bullet.id) {
                if ((bullet.x > (players[player].x - 20)) && (bullet.x < (players[player].x + 20)) && (bullet.y > (players[player].y - 20)) && (bullet.y < (Number(players[player].y) + 20))) {
                    bullets.splice(i, 1);
                    var isShield = 0;
                    for (i=0;i<playersAbility.length;i++) {
                        if (playersAbility[i].id == player && playersAbility[i].ability == 'shield') {
                            isShield=1;
                        }
                    }
                    if (!isShield) {
                        blood.push({x:players[player].x-50,y:players[player].y-50});
                        if (blood.length>20) {
                            blood.splice(0,1);
                        }
                    }
                }
            }
        }
    });
    
}     

function drawBorder() {
    ctx.beginPath();
    ctx.moveTo(0-canvasPositionX, 0-canvasPositionY);
    ctx.lineTo(0-canvasPositionX, mapSize - canvasPositionY);
    
    ctx.moveTo(0-canvasPositionX, 0 - canvasPositionY);
    ctx.lineTo(0-canvasPositionX + mapSize, 0 - canvasPositionY);
    
    ctx.moveTo(0-canvasPositionX + mapSize, 0 - canvasPositionY + mapSize);
    ctx.lineTo(0-canvasPositionX + mapSize, 0 - canvasPositionY);
    
    ctx.moveTo(0-canvasPositionX, mapSize - canvasPositionY);
    ctx.lineTo(0-canvasPositionX + mapSize, 0 - canvasPositionY + mapSize);
    
    ctx.lineWidth = 8;
    ctx.stroke();
}

function drawDrop() {
    airDrop.forEach(function(item,i,arr) {
        if (airDrop[i].obj == 'medKit') {
            ctx.drawImage(imgMed, airDrop[i]['x'] - canvasPositionX, airDrop[i]['y'] - canvasPositionY);
        } else if (airDrop[i].obj == 'point') {
            ctx.drawImage(imgPoint, airDrop[i]['x'] - canvasPositionX, airDrop[i]['y'] - canvasPositionY);
        }
    });
}                    

function drawMap() {
    var imgDifference = 0;
    for (var objMap in map) {
        if (map[objMap].obj == 'tree') {
            imgDraw = imgTree;
            imgDifference=25;
            
        } else if (map[objMap].obj == 'stone') {
            imgDraw = imgStone;  
            imgDifference=38;
        } else if (map[objMap].obj == 'bush') {
            imgDraw = imgBush;  
            imgDifference=25;
        }
        if (map[objMap].x>canvasPositionX-drawingAbroad && map[objMap].x<canvasPositionX + canvas.width +drawingAbroad && map[objMap].y>canvasPositionY-drawingAbroad && map[objMap].y<canvasPositionY + canvas.height + drawingAbroad ) {
            ctx.drawImage(imgDraw,map[objMap].x - imgDifference - canvasPositionX, map[objMap].y - imgDifference - canvasPositionY);
        }
    }
}

function drawFon() {
    //ctx.drawImage(imgFon, 0 - canvasPositionX, 0 - canvasPositionY,mapSize,mapSize);
    ctx.drawImage(imgFon,canvasPositionX,canvasPositionY,canvas.width,canvas.height, 0, 0,canvas.width,canvas.height);
}

function drawLearn() {
    if (learn) {
//        if (learn==1) {
//            ctx.drawImage(imgLearn1,10, 100,370,150);
//            learnTiming--;
//            if (learnTiming<0) {
//                learn=2;
//                learnTiming = 500;
//            }
//        } else if (learn==2) {
//            ctx.drawImage(imgLearn2,10, canvas.height - 250,370,150);
//            learnTiming--;
//            if (learnTiming<0) {
//                learn=0;
//                localStorage.setItem('notFirstEntry',1);
//            }
//        }
    
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.fillRect((canvas.width/2)-300,(canvas.height/2)-250,600,200);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        ctx.font = "18px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText("Обязательно прокачайте способности, они находятся в низу слева", (canvas.width/2)-280, (canvas.height/2)-200);
        ctx.fillText("Тыкайте в то что хотите прокачать и готово!", (canvas.width/2)-200, (canvas.height/2)-152);
        ctx.fillText("За каждое убийства вам будут давать по очку способностей", (canvas.width/2)-250, (canvas.height/2)-108);
        if (learnTiming<0) {
            learn=0;
            localStorage.setItem('notFirstEntry',1);
        }
    }
}

function drawUI() {
    
    //console.log(playerInfo);
    
    //if (!playerInfo[personId]) {return;}
    
    var proc = (100 * playerInfo.hp / playerInfo.maxHP)*2;
    
    ctx.beginPath();
    ctx.moveTo(10,20);
    ctx.lineTo(proc + 10,20);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#ecf0f1';;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(proc + 10,20);
    ctx.lineTo(210,20);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#e74c3c';
    ctx.stroke();
    
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(0,canvas.height - 100,370,100);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    ctx.font = "11px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText("Hp: " + playerInfo.hp + '/' + playerInfo.maxHP, 10, 50);
    
    ctx.font = "11px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText("Points: " + playerInfo.points, 10, 70);
    
    if (playerInfo.points>0) {
        ctx.fillStyle = '#2ecc71';
    } else {
        ctx.fillStyle = '#ecf0f1';
    }
    ctx.font = "16px Arial";
    ctx.fillText("Stats and ability:", 10, canvas.height - 80);
    
    ctx.font = "14px Arial";
    ctx.fillText("Damage: " + playerInfo.damage, 10, canvas.height - 50);
    ctx.fillText("Armor: " + playerInfo.armor, 110, canvas.height - 50);
    ctx.fillText("Rapid fire: " + playerInfo.rf, 190, canvas.height - 50);
    ctx.fillText("Max hp: " + playerInfo.maxHP, 290, canvas.height - 50);
   
    ctx.fillText("Teleport: " + playerInfo.teleport, 10, canvas.height - 20);
    ctx.fillText("Invis: " + playerInfo.invis, 110, canvas.height - 20);
    ctx.fillText("Shield: " + playerInfo.shield, 190, canvas.height - 20);
    
    
//    if (playerInfo.points>0) {
//        ctx.drawImage(imgAddStat, 30, canvas.height - 170); 
//        ctx.drawImage(imgAddStat, 120, canvas.height - 170); 
//        ctx.drawImage(imgAddStat, 210, canvas.height - 170);
//        ctx.drawImage(imgAddStat, 310, canvas.height - 170); 
//        
//        ctx.drawImage(imgAddStat, 310, canvas.height - 70); 
//    }
    
    ctx.strokeStyle = '#000000';
}

function drawStatistics() {
    
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(canvas.width-210,0,210,28);
    ctx.globalAlpha = 1.0;
    
    ctx.font = "14px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Statistic', canvas.width-200,18);
    
    ctx.font = "14px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('L', canvas.width-50,18);

    ctx.font = "14px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('K', canvas.width-25,18);
    
    statistics.forEach(function(statistic, i, arr) {
        
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.fillRect(canvas.width-210,20*(i+1)+8,210,20);
        ctx.globalAlpha = 1.0;
        
        ctx.font = "14px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText((i+1) + '.' + statistic.name, canvas.width-200, 20*(i+1)+20);
        
        ctx.font = "14px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(statistic.level, canvas.width-50, 20*(i+1)+20);
        
        ctx.font = "14px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(statistic.kill, canvas.width-25, 20*(i+1)+20);
    });
    
    //quantity players
    ctx.font = "16px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText('Players online:', canvas.width-200,canvas.height - 30);
    
    ctx.font = "16px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(statistics.length, canvas.width-80,canvas.height - 30);
}

function drawGameOff() {
    
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1.0;
    
    ctx.font = "22px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText("Name:", (canvas.width/2)-150, (canvas.height/2) - 100);
    
    ctx.font = "22px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText(personName, (canvas.width/2)-150, (canvas.height/2)-70);
    
    ctx.beginPath();
    ctx.moveTo((canvas.width/2)-150, (canvas.height/2)-60);
    ctx.lineTo((canvas.width/2)+150,(canvas.height/2)-60);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    
    ctx.drawImage(imglogo, (canvas.width/2)-(canvas.width/4), (canvas.height/10),(canvas.width/2),(canvas.height/8));
    
    ctx.drawImage(handsArray[personHands], (canvas.width/2)+20, (canvas.height/2)+30,140,70);
    ctx.drawImage(imgArrowL, (canvas.width/2)-125, (canvas.height/2)+60,50,50);
    ctx.drawImage(imgArrowR, (canvas.width/2)+150, (canvas.height/2)+60,50,50);
    
    ctx.drawImage(skinArray[personSkin], (canvas.width/2)-60, (canvas.height/2),120,120);
    ctx.drawImage(imgArrowL, (canvas.width/2)-125, (canvas.height/2)+10,50,50);
    ctx.drawImage(imgArrowR, (canvas.width/2)+150, (canvas.height/2)+10,50,50);
    
    ctx.font = "28px Arial";
    ctx.fillStyle = '#ecf0f1';
    ctx.fillText("Preess enter to start", (canvas.width/2)-120, (canvas.height/2) + 220);
    
    ctx.drawImage(imgControl, 50, (canvas.height/2)-50,(canvas.width/7),(canvas.height/4));
    
}

function drawBlood() {
    blood.forEach(function(item, i, arr){
        ctx.drawImage(imgBlood, item.x - canvasPositionX, item.y - canvasPositionY);
    });
    
}

function drawBloodScreen() {
    if (bloodScreen>0) {
        ctx.globalAlpha = bloodScreen;
        ctx.drawImage(imgBloodScreen,0,0,canvas.width,canvas.height);
        ctx.globalAlpha = 1.0;
    }
}

function drawTiming() {
    var countAbilityTiming = 1;
    if (permissionAbility.teleport) {
        var procientTimingTeleport= (100 * permissionAbility.teleport / permissionAbility.teleportMax)*2;

        ctx.beginPath();
        ctx.moveTo((canvas.width/2)-200, canvas.height-(20*countAbilityTiming));
        ctx.lineTo(((canvas.width/2)-200) + procientTimingTeleport,canvas.height-(20*countAbilityTiming));
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#e74c3c';
        ctx.stroke();

        ctx.strokeStyle = '#000';
        
        ctx.font = "11px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText('Teleport', (canvas.width/2)-190, canvas.height-(20*countAbilityTiming) +3);
        
        countAbilityTiming++;
    }
    
    if (permissionAbility.invis) {

        var procientTimingInvis = (100 * permissionAbility.invis / permissionAbility.invisMax)*2;

        ctx.beginPath();
        ctx.moveTo((canvas.width/2)-200, canvas.height-(20*countAbilityTiming));
        ctx.lineTo(((canvas.width/2)-200) + procientTimingInvis,canvas.height-(20*countAbilityTiming));
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#e74c3c';
        ctx.stroke();

        ctx.strokeStyle = '#000';
        
        ctx.font = "11px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText('Invis', (canvas.width/2)-190,canvas.height-(20*countAbilityTiming) + 3);
        countAbilityTiming++;
    }
    
    if (permissionAbility.shield) {

        var procientTimingShield = (100 * permissionAbility.shield / permissionAbility.shieldMax)*2;

        ctx.beginPath();
        ctx.moveTo((canvas.width/2)-200, canvas.height-(20*countAbilityTiming));
        ctx.lineTo(((canvas.width/2)-200) + procientTimingShield,canvas.height-(20*countAbilityTiming));
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#e74c3c';
        ctx.stroke();

        ctx.strokeStyle = '#000';
        
        ctx.font = "11px Arial";
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText('Shield', (canvas.width/2)-190,canvas.height-(20*countAbilityTiming) + 3);
        countAbilityTiming++;
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePosition();
    calcTiming();
    drawFon();
    drawBlood();
    if(game) {
        drawBullet();
    }
    drawPlayers();
    
    
    drawDrop();
    drawMap();
    drawBorder();
    
    drawBloodScreen();

    drawLearn();
    
    if(game) {
        drawUI();
        drawStatistics();
        drawTiming();
    } else {
        drawGameOff();
    }
    smoothingSteps();
}

//other function ----------------------------------------------

function startGame() {
    var tmpMainInfo = {name:personName,skin:personSkin};
    socket.emit('connection', JSON.stringify(tmpMainInfo));
    var today = new Date();
    nextDateFps = today.getSeconds() + 5;
    
    if (!localStorage.getItem('notFirstEntry')) {
        learn = true;
    }
}

function calcTiming() {
    //Эта часть на разрешение юзания
    if (permissionAbility.teleport>0) {
        permissionAbility.teleport--;
    }
    if (permissionAbility.invis>0) {
        permissionAbility.invis--;
    }
    if (permissionAbility.shield>0) {
        permissionAbility.shield--;
    }
    
    
    //Эта на длительность
    for (i=0;i<playersAbility.length;i++) {
        playersAbility[i].time--;
        if (playersAbility[i].time<0) {
            playersAbility.splice(i,1);
        }
    }
}

function updatePosition() {
    for (var player in players) {
        if (player== personId) {
            canvasPositionX = players[player].x - (canvas.width)/2;
            canvasPositionY = players[player].y - (canvas.height)/2;
            
            personPositionX = players[player].x;
            personPositionY = players[player].y;
        }
    } 
}

function addPoint(prop) {
    socket.emit('addStat',prop);
}

function getRandomAccuracy() {
    if(Math.round(Math.random())>0.5) {
        return Math.floor(Math.random() * 50 - (personStat['accuracy'] * 20));
    } else {
        return -Math.floor(Math.random() * 50 - (personStat['accuracy'] * 20));         
    }
}            

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

function bloodScreenAlpha() {
    if (bloodScreen>0) {
        bloodScreen += -0.1;
    
        setTimeout(bloodScreenAlpha, 100);
    }
}

function useAbility(ability) {
    if (ability == 'invis' && playerInfo.invis) {
        if (permissionAbility.invis == 0) {
            socket.emit('ability', JSON.stringify({ability:ability}));
        }
    }
    if (ability == 'shield' && playerInfo.shield) {
        if (permissionAbility.shield == 0) {
            socket.emit('ability', JSON.stringify({ability:ability}));
        }
    }
}

function smoothingSteps() {
    
    var rightAccesStep = 1;
    var leftAccesStep = 1;
    var upAccesStep = 1;
    var downAccesStep = 1;


    for (var objMap in map) {

        if (map[objMap].coll == 'circle') {
            var distance = Math.sqrt((Math.pow(map[objMap].x-(personPositionX+speedPerson),2) + Math.pow(map[objMap].y-personPositionY,2)));
            if (distance<(map[objMap].rad + personRadius)) {
                rightAccesStep = 0;
            }
            distance = Math.sqrt((Math.pow(map[objMap].x-(personPositionX-speedPerson),2) + Math.pow(map[objMap].y-personPositionY,2)));
            if (distance<(map[objMap].rad + personRadius)) {
                leftAccesStep = 0;
            }
            distance = Math.sqrt((Math.pow(map[objMap].x-personPositionX,2) + Math.pow(map[objMap].y-(personPositionY - speedPerson),2)));
            if (distance<(map[objMap].rad + personRadius)) {
                upAccesStep = 0;
            }
            distance = Math.sqrt((Math.pow(map[objMap].x-personPositionX,2) + Math.pow(map[objMap].y-(personPositionY + speedPerson),2)));
            if (distance<(map[objMap].rad + personRadius)) {
                downAccesStep = 0;
            }

        } else if(map[objMap].coll == 'box') {
            if ((personPositionX + personRadius + speedPerson) > map[objMap].x && (personPositionX - personRadius) < map[objMap].endX && (personPositionY + personRadius) > map[objMap].y && (personPositionY -  personRadius) < map[objMap].endY) {
                rightAccesStep = 0;
            }

            if ((personPositionX  + personRadius) > map[objMap].x && (personPositionX - personRadius - speedPerson) < map[objMap].endX && (personPositionY + personRadius) > map[objMap].y && (personPositionY -  personRadius) < map[objMap].endY) {
                leftAccesStep = 0;
            }

            if ((personPositionX  + personRadius) > map[objMap].x && (personPositionX - personRadius) < map[objMap].endX && (personPositionY + personRadius) > map[objMap].y && (personPositionY - personRadius - speedPerson) < map[objMap].endY) {
                upAccesStep = 0;
            }

            if ((personPositionX  + personRadius)> map[objMap].x && (personPositionX - personRadius) < map[objMap].endX && (personPositionY + personRadius + speedPerson) > map[objMap].y && (personPositionY -  personRadius) < map[objMap].endY) {
                downAccesStep = 0;
            }
        }
    } 

    if (keyDownArr['rightPressed'] && rightAccesStep){
        personPositionX += 3;
        canvasPositionX = personPositionX - (canvas.width)/2;
    }
    if (keyDownArr['leftPressed'] && leftAccesStep){
        personPositionX = personPositionX - 3;
        canvasPositionX = personPositionX- (canvas.width)/2;
    }
    if (keyDownArr['upPressed'] && upAccesStep){
        personPositionY = personPositionY - 3;
        canvasPositionY = personPositionY - (canvas.height)/2;
    }
    if (keyDownArr['downPressed'] && downAccesStep){
        personPositionY = personPositionY + 3;
        canvasPositionY = personPositionY - (canvas.height)/2;
    }
}

function outPutInfo() {
    socket.emit('angle',angle.toFixed(3));
}
setInterval(outPutInfo,40);

//socket.on --------------------------------------------------

socket.on('bullet', function(msg){
    var newBullet = JSON.parse(msg);
    newBullet = newBullet[0];
    bullets.push({deltaY:newBullet.dy, deltaX:newBullet.dx,x:newBullet.x,y:newBullet.y,damage:newBullet.damage,id:newBullet.id,color:newBullet.color});
});

socket.on('statistic', function(msg){
    statistics = $.parseJSON(msg);
});    

socket.on('start', function(msg) {

    dataArr = JSON.parse(msg);
    personId = dataArr['main'].id;
    colorPerson = dataArr['main'].color;
    dataArr['otherPlayers'].forEach(function(item,i,arr){
        startInfoPlayers[dataArr['otherPlayers'][i].id] = {skin:dataArr['otherPlayers'][i].skin};
    }); 

    game = true;
});

socket.on('updatePosition',function(msg){
    players = $.parseJSON(msg);
})

socket.on('addDrop',function(msg){
    var drop = $.parseJSON(msg);

    if (drop['delete'] == 1) {
        airDrop.forEach(function(item,i,arr) {
            if (item['id'] == drop['id']) {
                airDrop.splice(i,1);
            }
        });
    } else {
        airDrop.push(drop);
    }
})

socket.on('stopGame',function(msg){
    game = false;
})

socket.on('changeStat',function(msg){
    playerInfo = $.parseJSON(msg);
})

socket.on('newPlayer',function(data){
    tmpArrData = $.parseJSON(data);
    startInfoPlayers[tmpArrData.id] = {skin:tmpArrData.skin};
})

socket.on('useAbility',function(data){
    var tmpArrAbility = $.parseJSON(data);
    playersAbility.push(tmpArrAbility);
    if (tmpArrAbility.ability == 'invis') {
        permissionAbility.invis = 700;
        permissionAbility.invisMax = 700;
    } else if (tmpArrAbility.ability == 'shield') {
        permissionAbility.shield = 700;
        permissionAbility.shieldMax = 700;     
    }
})

//worker ----------------------------------------------------

if (window.Worker) {
	const myWorker = new Worker("js/worker.js");
	myWorker.onmessage = function(e) {
        draw();
	}
} else {
	alert('Your browser doesn\'t support web workers.')
}
