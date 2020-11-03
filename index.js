var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var players = {};
var playersInfo = {};

//Очереь на смену статов
var turnChangeStat = {};

var keyPressed = Array();
var speedPerson = 6;
var mapSize = 3000;
var personRadius = 15;
var airDrop = Array();
var idDrop = 0;
var mapJson = '[{"obj":"stone","x":1579,"y":2540,"rad":38,"coll":"circle"},{"obj":"stone","x":1596,"y":396,"rad":38,"coll":"circle"},{"obj":"stone","x":792,"y":2010,"rad":38,"coll":"circle"},{"obj":"stone","x":510,"y":1986,"rad":38,"coll":"circle"},{"obj":"stone","x":1014,"y":874,"rad":38,"coll":"circle"},{"obj":"stone","x":2410,"y":1643,"rad":38,"coll":"circle"},{"obj":"stone","x":2254,"y":837,"rad":38,"coll":"circle"},{"obj":"stone","x":1370,"y":2056,"rad":38,"coll":"circle"},{"obj":"stone","x":165,"y":55,"rad":38,"coll":"circle"},{"obj":"stone","x":434,"y":779,"rad":38,"coll":"circle"},{"obj":"stone","x":437,"y":2393,"rad":38,"coll":"circle"},{"obj":"stone","x":39,"y":1953,"rad":38,"coll":"circle"},{"obj":"stone","x":1133,"y":989,"rad":38,"coll":"circle"},{"obj":"stone","x":777,"y":1589,"rad":38,"coll":"circle"},{"obj":"stone","x":632,"y":2522,"rad":38,"coll":"circle"},{"obj":"stone","x":682,"y":479,"rad":38,"coll":"circle"},{"obj":"stone","x":2922,"y":1447,"rad":38,"coll":"circle"},{"obj":"stone","x":71,"y":1107,"rad":38,"coll":"circle"},{"obj":"stone","x":481,"y":2577,"rad":38,"coll":"circle"},{"obj":"stone","x":2810,"y":940,"rad":38,"coll":"circle"},{"obj":"stone","x":2484,"y":1866,"rad":38,"coll":"circle"},{"obj":"stone","x":2103,"y":2614,"rad":38,"coll":"circle"},{"obj":"stone","x":1063,"y":219,"rad":38,"coll":"circle"},{"obj":"stone","x":276,"y":1553,"rad":38,"coll":"circle"},{"obj":"stone","x":59,"y":1752,"rad":38,"coll":"circle"},{"obj":"bush","x":1197,"y":145,"coll":"none"},{"obj":"bush","x":1264,"y":1182,"coll":"none"},{"obj":"bush","x":1467,"y":2534,"coll":"none"},{"obj":"bush","x":934,"y":1557,"coll":"none"},{"obj":"bush","x":435,"y":926,"coll":"none"},{"obj":"bush","x":1682,"y":1723,"coll":"none"},{"obj":"bush","x":95,"y":348,"coll":"none"},{"obj":"bush","x":2530,"y":1828,"coll":"none"},{"obj":"bush","x":767,"y":1953,"coll":"none"},{"obj":"bush","x":1463,"y":774,"coll":"none"},{"obj":"bush","x":380,"y":131,"coll":"none"},{"obj":"bush","x":569,"y":1504,"coll":"none"},{"obj":"bush","x":1233,"y":2796,"coll":"none"},{"obj":"bush","x":2684,"y":48,"coll":"none"},{"obj":"bush","x":166,"y":2801,"coll":"none"},{"obj":"bush","x":997,"y":1849,"coll":"none"},{"obj":"bush","x":511,"y":1879,"coll":"none"},{"obj":"bush","x":406,"y":2691,"coll":"none"},{"obj":"bush","x":2956,"y":2170,"coll":"none"},{"obj":"bush","x":2820,"y":1465,"coll":"none"},{"obj":"tree","x":2914,"y":1966,"endX":2964,"endY":2016,"coll":"box"},{"obj":"tree","x":2578,"y":2637,"endX":2628,"endY":2687,"coll":"box"},{"obj":"tree","x":1648,"y":2557,"endX":1698,"endY":2607,"coll":"box"},{"obj":"tree","x":1437,"y":258,"endX":1487,"endY":308,"coll":"box"},{"obj":"tree","x":960,"y":1440,"endX":1010,"endY":1490,"coll":"box"},{"obj":"tree","x":471,"y":401,"endX":521,"endY":451,"coll":"box"},{"obj":"tree","x":684,"y":2673,"endX":734,"endY":2723,"coll":"box"},{"obj":"tree","x":215,"y":2562,"endX":265,"endY":2612,"coll":"box"},{"obj":"tree","x":1412,"y":131,"endX":1462,"endY":181,"coll":"box"},{"obj":"tree","x":132,"y":1918,"endX":182,"endY":1968,"coll":"box"},{"obj":"tree","x":1903,"y":399,"endX":1953,"endY":449,"coll":"box"},{"obj":"tree","x":467,"y":2507,"endX":517,"endY":2557,"coll":"box"},{"obj":"tree","x":27,"y":2701,"endX":77,"endY":2751,"coll":"box"},{"obj":"tree","x":919,"y":21,"endX":969,"endY":71,"coll":"box"},{"obj":"tree","x":2227,"y":1603,"endX":2277,"endY":1653,"coll":"box"},{"obj":"tree","x":1046,"y":1608,"endX":1096,"endY":1658,"coll":"box"},{"obj":"tree","x":2471,"y":1261,"endX":2521,"endY":1311,"coll":"box"},{"obj":"tree","x":2841,"y":2437,"endX":2891,"endY":2487,"coll":"box"},{"obj":"tree","x":2029,"y":2201,"endX":2079,"endY":2251,"coll":"box"},{"obj":"tree","x":1923,"y":2492,"endX":1973,"endY":2542,"coll":"box"},{"obj":"tree","x":2534,"y":2506,"endX":2584,"endY":2556,"coll":"box"},{"obj":"tree","x":1843,"y":845,"endX":1893,"endY":895,"coll":"box"},{"obj":"tree","x":467,"y":1615,"endX":517,"endY":1665,"coll":"box"},{"obj":"tree","x":1596,"y":2241,"endX":1646,"endY":2291,"coll":"box"},{"obj":"tree","x":1734,"y":2087,"endX":1784,"endY":2137,"coll":"box"},{"obj":"tree","x":1495,"y":1581,"endX":1545,"endY":1631,"coll":"box"},{"obj":"tree","x":2546,"y":697,"endX":2596,"endY":747,"coll":"box"},{"obj":"tree","x":2577,"y":889,"endX":2627,"endY":939,"coll":"box"},{"obj":"tree","x":2229,"y":372,"endX":2279,"endY":422,"coll":"box"},{"obj":"tree","x":2710,"y":346,"endX":2760,"endY":396,"coll":"box"},{"obj":"tree","x":1013,"y":966,"endX":1063,"endY":1016,"coll":"box"},{"obj":"tree","x":1081,"y":648,"endX":1131,"endY":698,"coll":"box"},{"obj":"tree","x":980,"y":391,"endX":1030,"endY":441,"coll":"box"},{"obj":"tree","x":707,"y":863,"endX":757,"endY":913,"coll":"box"}]';
                    
var map = JSON.parse(mapJson);     

var colorsArray = ['F17171','EE4D4D','D64545','1abc9c','2ecc71','3498db','9b59b6','34495e','e74c3c','e67e22','f1c40f','f39c12','7f8c8d','8e44ad','27ae60','2980b9', 'FEA47F', '25CCF7', '1B9CFC', 'F97F51', '2C3A47', '3B3B98', 'FC427B', 'D6A2E8'];

//html res
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/map.html', function(req, res){
  res.sendFile(__dirname + '/public/map.html');
});

//js res
app.get('/js/logic.js', function(req, res){
  res.sendFile(__dirname + '/public/js/logic.js');
});
app.get('/js/worker.js', function(req, res){
  res.sendFile(__dirname + '/public/js/worker.js');
});
app.get('/js/globalVarAndSettings.js', function(req, res){
  res.sendFile(__dirname + '/public/js/globalVarAndSettings.js');
});
app.get('/js/keyEvent.js', function(req, res){
  res.sendFile(__dirname + '/public/js/keyEvent.js');
});

//img res
app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname + '/public/favicon.ico');
});
app.get('/img/med.png', function(req, res){
  res.sendFile(__dirname + '/public/img/med.png');
});
app.get('/img/logo.png', function(req, res){
  res.sendFile(__dirname + '/public/img/logo.png');
});
app.get('/img/bush.png', function(req, res){
  res.sendFile(__dirname + '/public/img/bush.png');
});
app.get('/img/skins/cap1.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap1.png');
});
app.get('/img/skins/cap2.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap2.png');
});
app.get('/img/skins/cap3.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap3.png');
});
app.get('/img/skins/cap4.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap4.png');
});
app.get('/img/skins/cap5.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap5.png');
});
app.get('/img/skins/cap6.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap6.png');
});
app.get('/img/skins/cap7.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap7.png');
});
app.get('/img/skins/cap8.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/cap8.png');
});

app.get('/img/skins/hands1.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/hands1.png');
});
app.get('/img/skins/hands2.png', function(req, res){
  res.sendFile(__dirname + '/public/img/skins/hands2.png');
});


app.get('/img/al.png', function(req, res){
  res.sendFile(__dirname + '/public/img/al.png');
});
app.get('/img/ar.png', function(req, res){
  res.sendFile(__dirname + '/public/img/ar.png');
});
app.get('/img/point.png', function(req, res){
  res.sendFile(__dirname + '/public/img/point.png');
});
app.get('/img/fon.png', function(req, res){
  res.sendFile(__dirname + '/public/img/fon.png');
});
app.get('/img/tree.png', function(req, res){
  res.sendFile(__dirname + '/public/img/tree.png');
});
app.get('/img/stone.png', function(req, res){
  res.sendFile(__dirname + '/public/img/stone.png');
});
app.get('/img/blood.png', function(req, res){
  res.sendFile(__dirname + '/public/img/blood.png');
});
app.get('/img/bloodScreen.png', function(req, res){
  res.sendFile(__dirname + '/public/img/bloodScreen.png');
});
app.get('/img/control.png', function(req, res){
  res.sendFile(__dirname + '/public/img/control.png');
});

io.on('connection', function(socket){
    socket.on('bullet', function(msg){
        socket.broadcast.emit('bullet', msg);
    });
    socket.on('key', function(msg){
        keyPressed[socket.id] = JSON.parse(msg);
    });
    socket.on('hit', function(msg){
        if (players[socket.id] && players[msg]) {
            playersInfo[socket.id].hp = playersInfo[socket.id].hp - Math.floor(playersInfo[msg].damage * (1 - (0.15 * playersInfo[socket.id].armor)/(1 + 0.15 * playersInfo[socket.id].armor)));
            turnChangeStat[socket.id] = 1;
            if (playersInfo[socket.id].hp <= 0) {

//                console.log('Death player: ' + socket.id);
//                console.log('Kill him: ' + msg);
                playersInfo[msg].points =  playersInfo[msg].points + 1;
                playersInfo[msg].kill++;
                playersInfo[msg].level++;
                turnChangeStat[msg] = 1;

                delete players[socket.id];
                delete playersInfo[socket.id];
                socket.emit('stopGame',1);
            }
        }
        
    });    
    socket.on('addStat', function(msg){
        if (!playersInfo[socket.id]) {return;}
        
        if (playersInfo[socket.id].points > 0) {
            if(msg == 'damage') {
                playersInfo[socket.id].damage += 5;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'armor') {
                playersInfo[socket.id].armor += 1;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'rapidFire' && playersInfo[socket.id].rf < 50) {
                playersInfo[socket.id].rf += 1;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'maxHP') {
                playersInfo[socket.id].maxHP += 10;
                playersInfo[socket.id].hp += 10;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'teleport') {
                playersInfo[socket.id].teleport += 1;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'invis') {
                playersInfo[socket.id].invis += 1;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            } else if(msg == 'shield') {
                playersInfo[socket.id].shield += 1;
                playersInfo[socket.id].points = playersInfo[socket.id].points - 1;
            }
            turnChangeStat[socket.id] = 1;
        }
    });
    socket.on('angle', function(data){
        if (players[socket.id]) {
            players[socket.id].angle = data;
        }
    });
    socket.on('ability', function(msg){
        data = JSON.parse(msg);
        if (data.ability == 'teleport') {
            var accesTp = 1;
            for (var objMap in map) {
            if (map[objMap].coll == 'circle') {
                var distance = Math.sqrt((Math.pow(map[objMap].x-data.x,2) + Math.pow(map[objMap].y-data.y,2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    accesTp = 0;
                }
            } else if(map[objMap].coll == 'box') {
                if ((data.x + personRadius) > map[objMap].x && (data.x - personRadius) < map[objMap].endX && (data.y + personRadius) > map[objMap].y && (data.y -  personRadius) < map[objMap].endY) {
                    accesTp = 0;
                }
            }
        } 
            
            if (data.x + personRadius > mapSize || data.x + personRadius < 0 || data.y + personRadius > mapSize || data.y + personRadius < 0){
                accesTp = 0;
            }
            
            if (accesTp == 1) {
                players[socket.id].x = data.x;
                players[socket.id].y = data.y;
            }
        }
        if (data.ability == 'invis') {
            if (playersInfo[socket.id].invis) {
                var timeInvis = 25*playersInfo[socket.id].invis;
                io.sockets.emit('useAbility',JSON.stringify({id:socket.id,ability:'invis',time:timeInvis}));
                //console.log({id:socket.id,ability:'invis',time:timeInvis});
            }
        }
        if (data.ability == 'shield') {
            if (playersInfo[socket.id].shield) {
                var timeShiled = 10*playersInfo[socket.id].shield;
                io.sockets.emit('useAbility',JSON.stringify({id:socket.id,ability:'shield',time:timeShiled}));
                //console.log({id:socket.id,ability:'invis',time:timeInvis});
            }
        }
        
    }); 
    
    socket.on('connection',function(data){
        
        startInfoPlayer = JSON.parse(data);
        
        var startPostion = Array();
        startPostion =  startPostition();
        
        
        //console.log("\x1b[32m",'New player: ' + startInfoPlayer.name);
        var color = colorsArray[getRandom(15,0)];
        playersInfo[socket.id] = {color:color,name:startInfoPlayer.name,points:2,kill:0,hp:50,armor:1,damage:20,rf:1,maxHP:50,level:1,skin:startInfoPlayer.skin,teleport:0,invis:0,shield:0};
        //players[socket.id] = {color:color,x:startPostion['x'],y:startPostion['y'],angle:0,hp:50,armor:1,damage:20,rf:1,maxHP:50,point:2};
        players[socket.id] = {x:startPostion['x'],y:startPostion['y'],angle:0};
        keyPressed[socket.id] = {rightPressed:false,leftPressed:false,upPressed:false,downPressed:false};
        
        
        //Отправляем нужную инфо игроку при старте
        
        var tmpArr = [];
        for (var OtherPlayersInfo in playersInfo) {
            tmpArr.push({id:OtherPlayersInfo,skin:playersInfo[OtherPlayersInfo].skin});
        }
        var tmpStartMainInfo = {main:{id:socket.id,color:color},otherPlayers:tmpArr};
        //tmpStartMainInfo['otherPlayers'] = tmpArr;
        socket.emit('start',JSON.stringify(tmpStartMainInfo));
        
        
        //Разашлем всем информацию о игроках
        var tmpSartInfoPlayers = {id:socket.id,skin:startInfoPlayer.skin};
        io.sockets.emit('newPlayer',JSON.stringify(tmpSartInfoPlayers));
        
        turnChangeStat[socket.id] = 1;
    })
    socket.on('disconnect', function () {
//        console.log("\x1b[31m",'Player out ' + socket.id);
//        console.log("\x1b[0m",'');
//        players.splice(players.indexOf(socket.id), 1);
        delete players[socket.id];
        delete playersInfo[socket.id];
        delete turnChangeStat[socket.id];
  });
});

function tic() {

    for (var player in players) {
        
        var rightAccesStep = 1;
        var leftAccesStep = 1;
        var upAccesStep = 1;
        var downAccesStep = 1;
    
        for (var objMap in map) {

            if (map[objMap].coll == 'circle') {
                var distance = Math.sqrt((Math.pow(map[objMap].x-(players[player].x+speedPerson),2) + Math.pow(map[objMap].y-players[player].y,2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    rightAccesStep = 0;
                }
                distance = Math.sqrt((Math.pow(map[objMap].x-(players[player].x-speedPerson),2) + Math.pow(map[objMap].y-players[player].y,2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    leftAccesStep = 0;
                }
                distance = Math.sqrt((Math.pow(map[objMap].x-players[player].x,2) + Math.pow(map[objMap].y-(players[player].y - speedPerson),2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    upAccesStep = 0;
                }
                distance = Math.sqrt((Math.pow(map[objMap].x-players[player].x,2) + Math.pow(map[objMap].y-(players[player].y + speedPerson),2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    downAccesStep = 0;
                }
                
            } else if(map[objMap].coll == 'box') {
                if ((players[player].x + personRadius + speedPerson) > map[objMap].x && (players[player].x - personRadius) < map[objMap].endX && (players[player].y + personRadius) > map[objMap].y && (players[player].y -  personRadius) < map[objMap].endY) {
                    rightAccesStep = 0;
                }

                if ((players[player].x  + personRadius) > map[objMap].x && (players[player].x - personRadius - speedPerson) < map[objMap].endX && (players[player].y + personRadius) > map[objMap].y && (players[player].y -  personRadius) < map[objMap].endY) {
                    leftAccesStep = 0;
                }

                if ((players[player].x  + personRadius) > map[objMap].x && (players[player].x - personRadius) < map[objMap].endX && (players[player].y + personRadius) > map[objMap].y && (players[player].y - personRadius - speedPerson) < map[objMap].endY) {
                    upAccesStep = 0;
                }

                if ((players[player].x  + personRadius)> map[objMap].x && (players[player].x - personRadius) < map[objMap].endX && (players[player].y + personRadius + speedPerson) > map[objMap].y && (players[player].y -  personRadius) < map[objMap].endY) {
                    downAccesStep = 0;
                }
            }
        } 
        
        if(keyPressed[player].rightPressed && !keyPressed[player].leftPressed) {
            sP = speedPerson;
            if(keyPressed[player].upPressed || keyPressed[player].downPressed) {
                sP = speedPerson/1.4;
            }
            
            if (players[player].x + personRadius < mapSize && rightAccesStep){
                players[player].x += sP;
            }
        }

        if(keyPressed[player].leftPressed && !keyPressed[player].rightPressed) {
            i = speedPerson;
            if(keyPressed[player].upPressed || keyPressed[player].downPressed) {
                i = speedPerson/1.4;
            }
            if (players[player].x - personRadius > 0 && leftAccesStep) {
                players[player].x += -i;
            }
        }

        if(keyPressed[player].upPressed && !keyPressed[player].downPressed) {
            i = speedPerson;
            if(keyPressed[player].rightPressed || keyPressed[player].leftPressed) {
                i = speedPerson/1.4;
            }
            if (players[player].y - personRadius > 0 && upAccesStep) {
                players[player].y += -i;
            }
        }

        if(keyPressed[player].downPressed && !keyPressed[player].upPressed) {
            i = speedPerson;
            if(keyPressed[player].rightPressed || keyPressed[player].leftPressed) {
                i = speedPerson/1.4;
            }
            if (players[player].y + personRadius < mapSize && downAccesStep) {
                players[player].y += i;
            }
        }
        airDrop.forEach(function(item,iDrop,arr){
            if (((airDrop[iDrop].x + 5) > (players[player].x - 20)) && ((airDrop[iDrop].x + 5) < (players[player].x + 20)) && ((airDrop[iDrop].y + 5) > (players[player].y - 20)) && ((airDrop[iDrop].y + 5) < (players[player].y + 20))) {
                takeDrop(player,iDrop);
                
            }
        });
    }
    
    io.sockets.emit('updatePosition',JSON.stringify(players));
    
     changeStats();
}
setInterval(tic, 20);

function takeDrop(playerId,i) {
    if(airDrop[i].obj == 'medKit'){
        var tmpHP = playersInfo[playerId].hp + 20;
        if (tmpHP>playersInfo[playerId].maxHP) {
            playersInfo[playerId].hp = playersInfo[playerId].maxHP;
        } else {
            playersInfo[playerId].hp += 20;
        }
    } else if (airDrop[i].obj == 'point') {
        playersInfo[playerId].points++;
        playersInfo[playerId].level++;
    }
    var tmpAirDrop = {id:airDrop[i].id,delete:1};
    io.sockets.emit('addDrop',JSON.stringify(tmpAirDrop));
    airDrop.splice(i,1);
    turnChangeStat[playerId] = 1;
}

function addDrop() {
    idDrop++;
    xDropPosition = getRandom(mapSize,0);
    yDropPosition = getRandom(mapSize,0);
    var obj = 'medKit';
    if (getRandom(0,10) > 3) {
        obj = 'medKit';
    } else {
        obj = 'point';
    }
    airDrop.push({id:idDrop,delete:0,obj:obj,x:xDropPosition,y:yDropPosition});
    var tmpAirDrop = {id:idDrop,delete:0,obj:obj,x:xDropPosition,y:yDropPosition};
    io.sockets.emit('addDrop',JSON.stringify(tmpAirDrop));
    if (airDrop.length>20) {
        tmpAirDropDelete = {id:airDrop[0].id,delete:1};
        io.sockets.emit('addDrop',JSON.stringify(tmpAirDropDelete));
        airDrop.splice(airDrop[0],1);
    }
    //console.log('drop' + idDrop);
}
setInterval(addDrop, 10000);

function sortArr(arr) {
  return arr.points;
}

function statistics(){
    
    var statistic = Array();
    
    for (var player in playersInfo) { 
        statistic.push({name:playersInfo[player].name,level:playersInfo[player].level,kill:playersInfo[player].kill});
    }
    
    statistic.sort(function (a, b) {
      if (a.point > b.point) {
        return -1;
      }
      if (a.point < b.point) {
        return 1;
      }
      return 0;
    });
    
    io.sockets.emit('statistic',JSON.stringify(statistic));
}
setInterval(statistics, 1000);

function startPostition() {
    var accesPosition = true;
    var accesTmp = true;
    var startPostion = Array();
    startPostion['x'] = getRandom(mapSize,0);
    startPostion['y'] = getRandom(mapSize,0);
    while(accesTmp) {
        for (var objMap in map) {
            if (map[objMap].coll == 'circle') {
                var distance = Math.sqrt((Math.pow(map[objMap].x-startPostion['x'],2) + Math.pow(map[objMap].y-startPostion['y'],2)));
                if (distance<(map[objMap].rad + personRadius)) {
                    accesPosition = false;
                } 
            } else if(map[objMap].coll == 'box') {
                if (startPostion['x'] + personRadius > map[objMap].x && (startPostion['x'] - personRadius) < map[objMap].endX && (startPostion['y'] + personRadius) > map[objMap].y && (startPostion['y'] -  personRadius) < map[objMap].endY) {
                    accesPosition = false;
                }
            }
        }
        
        if (accesPosition) {
            accesTmp = false;
            
            return startPostion;
        }
        
    }
}

function changeStats() {
    for (var playerId in turnChangeStat) {
        io.to(playerId).emit('changeStat',JSON.stringify(playersInfo[playerId]));
        delete turnChangeStat[playerId];
    }
}

function getRandom(max,min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}    


var symbolLoading = '-';
function statConsole() {
    console.clear();
    console.log('*********************');
    console.log('Online:' + Object.keys(players).length);
    console.log(symbolLoading);
    
    
    switch(symbolLoading) {
        case '-':
            symbolLoading = "\\";
        break;
        case "\\":
            symbolLoading = '|';
        break;
        case '|':
            symbolLoading = '/';
        break;
        case '/':
            symbolLoading = '-';
        break;
    }
}

setInterval(statConsole, 100);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
