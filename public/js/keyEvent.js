////////////////////////////////////////////////////////
//Key event

function keyDownHandler(e) {
    if (!game) {
        if (e.key == 'ArrowLeft') {
            if (personSkin-1==0) {
                personSkin = Object.keys(skinArray).length;
            } else {
                personSkin--; 
            }
            return;
        }
        if (e.key == 'ArrowRight') {
            if (personSkin==Object.keys(skinArray).length) {
                personSkin = 1;
            } else {
                personSkin++; 
            }
            return;
        }
        if (e.key != 'Backspace' && e.key != 'Shift' && e.key != 'Alt' && e.key != 'Control' && e.key != 'AltGraph' && e.key != 'Escape' && e.key != 'Enter') {
            personName += e.key;
        }
        if (e.key == 'Backspace') {
            personName = personName.substring(0, personName.length - 1);
        }
        if(e.key == 'Enter') {
            if (personName == '') {personName='GoodMan_' + randomInteger(0,4000);}
            if(personName.length>16) {personName = personName.slice(0,(personName.length-16)*-1)}
            startGame();
        }
    } else {
        
        tmpKeyDownArr = {rightPressed:keyDownArr['rightPressed'],leftPressed:keyDownArr['leftPressed'],upPressed:keyDownArr['upPressed'],downPressed:keyDownArr['downPressed']};
        
        if(e.key == "В" || e.key == "в" || e.key == "D" || e.key == "d" || e.key == "Right" || e.key == "ArrowRight") {
            keyDownArr['rightPressed'] = true;
        }
        else if(e.key == "ф" || e.key == "Ф" || e.key == "a" || e.key == "A" || e.key == "Left" || e.key == "ArrowLeft") {
            keyDownArr['leftPressed'] = true;
        }
        else if(e.key == "Ц" || e.key == "ц" || e.key == "W" || e.key == "w" || e.key == "Up" || e.key == "ArrowUp") {
            keyDownArr['upPressed'] = true;
        }
        else if(e.key == "ы" || e.key == "Ы" || e.key == "s" || e.key == "S" || e.key == "Down" || e.key == "ArrowDown") {
            keyDownArr['downPressed'] = true;
        }
        else if(e.key == "c" || e.key == "C" || e.key == "с" || e.key == "С") {
            useAbility('invis');
        }
        else if(e.key == " " || e.key == "Space") {
            useAbility('shield');
        }
        
    }
    
    if (tmpKeyDownArr['rightPressed'] != keyDownArr['rightPressed'] || tmpKeyDownArr['leftPressed']!=keyDownArr['leftPressed'] || tmpKeyDownArr['upPressed']!=keyDownArr['upPressed'] || tmpKeyDownArr['downPressed']!=keyDownArr['downPressed']) {
        socket.emit('key',JSON.stringify(keyDownArr));
    }
}

function keyUpHandler(e) {
    if(e.key == "В" || e.key == "в" || e.key == "D" || e.key == "d" || e.key == "Right" || e.key == "ArrowRight") {
        keyDownArr['rightPressed'] = false;
    }
    else if(e.key == "ф" || e.key == "Ф" || e.key == "a" || e.key == "A" || e.key == "Left" || e.key == "ArrowLeft") {
        keyDownArr['leftPressed'] = false;
    }
    else if(e.key == "ц" || e.key == "Ц" || e.key == "W" || e.key == "w" || e.key == "Up" || e.key == "ArrowUp") {
        keyDownArr['upPressed'] = false;
    }
    else if(e.key == "ы" || e.key == "Ы" || e.key == "s" || e.key == "S" || e.key == "Down" || e.key == "ArrowDown") {
        keyDownArr['downPressed'] = false;
    }
    socket.emit('key',JSON.stringify(keyDownArr));
}          
