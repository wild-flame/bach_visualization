var suite = {};
var TOTAL_NOTES = 38;
var SHOW_FRAMERATE = false;

soundManager.url = "/lib/swf/"
soundManager.flashVersion = 9;
// soundManager.debugMode = true;

suite.canvasEl = document.getElementById("main-canvas");
suite.canvasObj = suite.canvasEl.getContext("2d");
suite.machine = new Machine(suite.canvasObj);

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

// suite.indNoteLd = 0;
