var suite = {};
var TOTAL_NOTES = 38;
var MAX_LENGTH = 590;
var MIN_LENGTH = MAX_LENGTH * Math.pow(HALF_STEP_MULTIPLIER, TOTAL_NOTES - 1);
var SHOW_FRAMERATE = true;
var UPDATE_INTERVAL = 33;
var MIDI_MAP = {
    "36": 0,
    "37": 1,
    "38": 2,
    "39": 3,
    "40": 4,
    "41": 5,
    "42": 6,
    "43": 7,
    "44": 8,
    "45": 9,
    "46": 10,
    "47": 11,
    "48": 12,
    "49": 13,
    "50": 14,
    "51": 15,
    "52": 16,
    "53": 17,
    "54": 18,
    "55": 19,
    "56": 20,
    "57": 21,
    "58": 22,
    "59": 23,
    "60": 24,
    "61": 25,
    "62": 26,
    "63": 27,
    "64": 28,
    "65": 29,
    "66": 30,
    "67": 31,
    "68": 32,
    "69": 33,
    "70": 34,
    "71": 35,
    "72": 36
};

soundManager.url = "/lib/swf/"
soundManager.flashVersion = 9;
soundManager.debugMode = false;


soundManager.onready(function() {
    suite.indNoteLd = 0;
    suite.smLoadSound(0);
});

suite.smLoadSound = function(count) {
    var d = count < 10 ? "0" : ""; //If the audio is less than 10 then add 0 at the front
    var b = "audio"
    var sound = soundManager.createSound({
        id: "note" + count,
        url: b + "/harp_" + d + count + ".mp3",
        autoLoad: true,
        multiShot: true,
        multiShotEvents: false,
        onload: function() {
            this.play();
            console.log("ahcInd:")
            suite.smLoadedSnd(this["ahcInd"]) 
        }
    });
    sound.ahcInd = count;
}

suite.smLoadedSnd = function(count) { // if audio is loaded
    suite.indNoteLd = count;
    if (suite.indNoteLd >= TOTAL_NOTES - 1) {
        suite.smLoadedAll();
    } else {
        suite.indNoteLd++;
        suite.smLoadSound(suite.indNoteLd);
    }
};

suite.smLoadedAll = function() { //when all note is ready
    suite.soundAvailable = true;
    suite.soundReady = true;
    suite.everythingIsReady()
};

suite.everythingIsReady = function() {
    if(suite.ready) {
        return
    }
    suite.ready = true;
    suite.machine.doneLoading();
};

suite.initMidiMap = function() {
    suite.arrMidiMap = new Array();
    var a;
    for (key in MIDI_MAP) {
        a = parseInt(key);
        suite.arrMidiMap[a] = MIDI_MAP[key];
    }
};

//
suite.init = function() { 
    suite.ready = false;
    suite.initMidiMap();
    // suite.urlVersion = parseInt(getQueryVariable("v"));
    window.addEventListener("resize", rsize, false);
    document.addEventListener("mousemove", function(a) {
        mouseX = a.pageX;
        mouseY = a.pageY;
    }, false);
    document.addEventListener("mousedown", function(a) {
        mousePressed = true;
        if (suite.machine.mouseDown != undefined) {
            suite.machine.mouseDown(a)
        }
        a.preventDefault() //该方法将通知 Web 浏览器不要执行与事件关联的默认动作
    }, false);
    document.addEventListener("mouseup", function(a) {
        mousePressed = false;
        if (suite.machine.mouseUp != undefined) {
            suite.machine.mouseUp(a)
        }
    }, false);
    suite.canvasEl = document.getElementById("main-canvas");
    suite.canvasObj = suite.canvasEl.getContext("2d");
    suite.machine = new Machine(suite.canvasObj);
    // suite.indNoteLd = 0;
    rsize();
    suite.machine.build();
    // suite.machine.beginLoading();
    // setInterval(updateLoop, UPDATE_INTERVAL);
};

init = function() {
    suite.init();
}

var rsize = function() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (!suite.machine != null) {
        suite.machine.rsize();
    }  
};
