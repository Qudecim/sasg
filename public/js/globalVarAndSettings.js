/////////////////////////////////////////////////////////////////////////////////////////////////
//Var settings

//inintialisation
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var socket = io(); 

//size map X,Y
var mapSize = 3000;

//main person radius
var personRadius  = 15;

var speedPerson = 6;

//speed bullets
var speedBullet = 30000;

//it is map (Json)
var mapJson = '[{"obj":"stone","x":1579,"y":2540,"rad":38,"coll":"circle"},{"obj":"stone","x":1596,"y":396,"rad":38,"coll":"circle"},{"obj":"stone","x":792,"y":2010,"rad":38,"coll":"circle"},{"obj":"stone","x":510,"y":1986,"rad":38,"coll":"circle"},{"obj":"stone","x":1014,"y":874,"rad":38,"coll":"circle"},{"obj":"stone","x":2410,"y":1643,"rad":38,"coll":"circle"},{"obj":"stone","x":2254,"y":837,"rad":38,"coll":"circle"},{"obj":"stone","x":1370,"y":2056,"rad":38,"coll":"circle"},{"obj":"stone","x":165,"y":55,"rad":38,"coll":"circle"},{"obj":"stone","x":434,"y":779,"rad":38,"coll":"circle"},{"obj":"stone","x":437,"y":2393,"rad":38,"coll":"circle"},{"obj":"stone","x":39,"y":1953,"rad":38,"coll":"circle"},{"obj":"stone","x":1133,"y":989,"rad":38,"coll":"circle"},{"obj":"stone","x":777,"y":1589,"rad":38,"coll":"circle"},{"obj":"stone","x":632,"y":2522,"rad":38,"coll":"circle"},{"obj":"stone","x":682,"y":479,"rad":38,"coll":"circle"},{"obj":"stone","x":2922,"y":1447,"rad":38,"coll":"circle"},{"obj":"stone","x":71,"y":1107,"rad":38,"coll":"circle"},{"obj":"stone","x":481,"y":2577,"rad":38,"coll":"circle"},{"obj":"stone","x":2810,"y":940,"rad":38,"coll":"circle"},{"obj":"stone","x":2484,"y":1866,"rad":38,"coll":"circle"},{"obj":"stone","x":2103,"y":2614,"rad":38,"coll":"circle"},{"obj":"stone","x":1063,"y":219,"rad":38,"coll":"circle"},{"obj":"stone","x":276,"y":1553,"rad":38,"coll":"circle"},{"obj":"stone","x":59,"y":1752,"rad":38,"coll":"circle"},{"obj":"bush","x":1197,"y":145,"coll":"none"},{"obj":"bush","x":1264,"y":1182,"coll":"none"},{"obj":"bush","x":1467,"y":2534,"coll":"none"},{"obj":"bush","x":934,"y":1557,"coll":"none"},{"obj":"bush","x":435,"y":926,"coll":"none"},{"obj":"bush","x":1682,"y":1723,"coll":"none"},{"obj":"bush","x":95,"y":348,"coll":"none"},{"obj":"bush","x":2530,"y":1828,"coll":"none"},{"obj":"bush","x":767,"y":1953,"coll":"none"},{"obj":"bush","x":1463,"y":774,"coll":"none"},{"obj":"bush","x":380,"y":131,"coll":"none"},{"obj":"bush","x":569,"y":1504,"coll":"none"},{"obj":"bush","x":1233,"y":2796,"coll":"none"},{"obj":"bush","x":2684,"y":48,"coll":"none"},{"obj":"bush","x":166,"y":2801,"coll":"none"},{"obj":"bush","x":997,"y":1849,"coll":"none"},{"obj":"bush","x":511,"y":1879,"coll":"none"},{"obj":"bush","x":406,"y":2691,"coll":"none"},{"obj":"bush","x":2956,"y":2170,"coll":"none"},{"obj":"bush","x":2820,"y":1465,"coll":"none"},{"obj":"tree","x":2914,"y":1966,"endX":2964,"endY":2016,"coll":"box"},{"obj":"tree","x":2578,"y":2637,"endX":2628,"endY":2687,"coll":"box"},{"obj":"tree","x":1648,"y":2557,"endX":1698,"endY":2607,"coll":"box"},{"obj":"tree","x":1437,"y":258,"endX":1487,"endY":308,"coll":"box"},{"obj":"tree","x":960,"y":1440,"endX":1010,"endY":1490,"coll":"box"},{"obj":"tree","x":471,"y":401,"endX":521,"endY":451,"coll":"box"},{"obj":"tree","x":684,"y":2673,"endX":734,"endY":2723,"coll":"box"},{"obj":"tree","x":215,"y":2562,"endX":265,"endY":2612,"coll":"box"},{"obj":"tree","x":1412,"y":131,"endX":1462,"endY":181,"coll":"box"},{"obj":"tree","x":132,"y":1918,"endX":182,"endY":1968,"coll":"box"},{"obj":"tree","x":1903,"y":399,"endX":1953,"endY":449,"coll":"box"},{"obj":"tree","x":467,"y":2507,"endX":517,"endY":2557,"coll":"box"},{"obj":"tree","x":27,"y":2701,"endX":77,"endY":2751,"coll":"box"},{"obj":"tree","x":919,"y":21,"endX":969,"endY":71,"coll":"box"},{"obj":"tree","x":2227,"y":1603,"endX":2277,"endY":1653,"coll":"box"},{"obj":"tree","x":1046,"y":1608,"endX":1096,"endY":1658,"coll":"box"},{"obj":"tree","x":2471,"y":1261,"endX":2521,"endY":1311,"coll":"box"},{"obj":"tree","x":2841,"y":2437,"endX":2891,"endY":2487,"coll":"box"},{"obj":"tree","x":2029,"y":2201,"endX":2079,"endY":2251,"coll":"box"},{"obj":"tree","x":1923,"y":2492,"endX":1973,"endY":2542,"coll":"box"},{"obj":"tree","x":2534,"y":2506,"endX":2584,"endY":2556,"coll":"box"},{"obj":"tree","x":1843,"y":845,"endX":1893,"endY":895,"coll":"box"},{"obj":"tree","x":467,"y":1615,"endX":517,"endY":1665,"coll":"box"},{"obj":"tree","x":1596,"y":2241,"endX":1646,"endY":2291,"coll":"box"},{"obj":"tree","x":1734,"y":2087,"endX":1784,"endY":2137,"coll":"box"},{"obj":"tree","x":1495,"y":1581,"endX":1545,"endY":1631,"coll":"box"},{"obj":"tree","x":2546,"y":697,"endX":2596,"endY":747,"coll":"box"},{"obj":"tree","x":2577,"y":889,"endX":2627,"endY":939,"coll":"box"},{"obj":"tree","x":2229,"y":372,"endX":2279,"endY":422,"coll":"box"},{"obj":"tree","x":2710,"y":346,"endX":2760,"endY":396,"coll":"box"},{"obj":"tree","x":1013,"y":966,"endX":1063,"endY":1016,"coll":"box"},{"obj":"tree","x":1081,"y":648,"endX":1131,"endY":698,"coll":"box"},{"obj":"tree","x":980,"y":391,"endX":1030,"endY":441,"coll":"box"},{"obj":"tree","x":707,"y":863,"endX":757,"endY":913,"coll":"box"}]';

//var mapJson = '[]';
//parse json
var map = JSON.parse(mapJson);  

//Переменная которорая определяет сколько пикселов прорисовывать за границей экрана
var drawingAbroad = 100;

//////////////////////////////////////////////////////////////////////////////////////////////////
//Global var

//variable does do game go
var game = false;

var learn = 0;
var learnTiming = 600;

//variable for check key down
var keyDownArr = {rightPressed:false,leftPressed:false,upPressed:false,downPressed:false};    
var tmpKeyDownArr = {rightPressed:false,leftPressed:false,upPressed:false,downPressed:false};    

//////////////////////////////////////////////////////////////////////////////////////////////////
//resourse for canvas

var imgMed = new Image();
imgMed.src = "/img/med.png";

var imgPoint = new Image();
imgPoint.src = "/img/point.png";  

var imgFon = new Image();
imgFon.src = "/img/fon.png"; 
                            
var imgTree = new Image();
imgTree.src = "/img/tree.png"; 
                    
var imgStone = new Image();
imgStone.src = "/img/stone.png";

var imgBush = new Image();
imgBush.src = "/img/bush.png";

var imglogo = new Image();
imglogo.src = "/img/logo.png";

var imgBlood = new Image();
imgBlood.src = "/img/blood.png";

var imgBloodScreen = new Image();
imgBloodScreen.src = "/img/bloodScreen.png";

var imgArrowL = new Image();
imgArrowL.src = "/img/al.png";
var imgArrowR = new Image();
imgArrowR.src = "/img/ar.png";

var imgControl = new Image();
imgControl.src = "/img/control.png";

//var imgCap1 = new Image();
//imgCap1.src = "/img/skins/cap1.png";

var skinArray = {};
skinArray["1"] =  new Image();
skinArray["1"].src = "/img/skins/cap1.png";
skinArray["2"] =  new Image();
skinArray["2"].src = "/img/skins/cap2.png";
skinArray["3"] =  new Image();
skinArray["3"].src = "/img/skins/cap3.png";
skinArray["4"] =  new Image();
skinArray["4"].src = "/img/skins/cap4.png";
skinArray["5"] =  new Image();
skinArray["5"].src = "/img/skins/cap5.png";
skinArray["6"] =  new Image();
skinArray["6"].src = "/img/skins/cap6.png";
skinArray["7"] =  new Image();
skinArray["7"].src = "/img/skins/cap7.png";
skinArray["8"] =  new Image();
skinArray["8"].src = "/img/skins/cap8.png";

var handsArray = {};
handsArray["1"] =  new Image();
handsArray["1"].src = "/img/skins/hands1.png";
handsArray["2"] =  new Image();
handsArray["2"].src = "/img/skins/hands2.png";