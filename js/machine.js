// THREAD parameters
var HALF_STEP_MULTIPLIER = 0.94921875;
var TOTAL_THREADS = 8;
var NUBS = 4;

// WHEEL parameters
var WHEEL_RADIUS = 172;
var WHEEL_RADIUS_SQUARED = Math.pow(WHEEL_RADIUS, 2);
var WHEEL_CIRCUMFERENCE = Math.PI * WHEEL_RADIUS_SQUARED;
var WHEEL_QUARTER_SEG = Math.sqrt(2 * WHEEL_RADIUS_SQUARED);

// LOADING 
var TIME_BETWEEN_LOAD = 0.25;
var LOAD_TIME_OVERALL = 12.5;

// NOTE_UNIT
var NOTE_UNIT = 2;
 

var Machine = function(canvasObj) {
    this.cv = canvasObj;

    this.arrThreads = new Array();
    this.arrLength = new Array();
    this.arrNubs = new Array(NUBS);
    this.arrPitchStart = new Array(TOTAL_THREADS);

    this.elmLoader = document.getElementById("loader");
    this.elmAbout = document.getElementById("about");
}

Machine.prototype.init = function() {
    // this.elmLoader = document.getElementById("loader");
    // this.elmAbout = document.getElementById("about");
};

Machine.prototype.build = function() {
    this.setOrigin(); //设置起点
    var f = MAX_LENGTH; 
    for (var e = 0; e < TOTAL_NOTES; e++) {
        this.arrLength[e] = f;
        f *= HALF_STEP_MULTIPLIER
    }
    var g, h, d, c;
    var j = WHEEL_QUARTER_SEG / TOTAL_THREADS;
    var a = (TOTAL_THREADS / 2) * j - 0.5 * j;
    for (var e = 0; e < TOTAL_THREADS; e++) {
        this.arrPitchStart[e] = suite.arrMidiMap[SONG_DATA_ARRAY[e]];
        d = "#FFFFFF";
        h = 3;
        var c = -1;
        var b = new Thread(a, c, h, d, e, this.cv); // a: y position, c = -1, h = 3
        a = a - j;
        this.arrThreads.push(b)
    }
    this.wheel0 = new Wheel(WHEEL_RADIUS, 0, 0, this.cv); //第一个wheel
    this.wheel1 = new Wheel(-WHEEL_RADIUS, 0, 1, this.cv); //第二个weeel
    this.arrNubs[0] = this.wheel0.nub0 = new Nub(0, 0, suite.machine, this.wheel0, this.cv); //第一个球
    this.arrNubs[1] = this.wheel0.nub1 = new Nub(1, 1, suite.machine, this.wheel0, this.cv); //第二个球
    this.arrNubs[2] = this.wheel1.nub0 = new Nub(0, 2, suite.machine, this.wheel1, this.cv); //第三个球
    this.arrNubs[3] = this.wheel1.nub1 = new Nub(1, 3, suite.machine, this.wheel1, this.cv); //第四个球

    this.arrNubs[0].enter();

};

Machine.prototype.beginLoading = function() {
    this.tFrame0 = this.tSong0 = this.tNotes0 = this.tLoadPrev = this.tLoading0 = this.t0 = (new Date()).getTime() / 1000;
    this.ctFrame = 0;
    this.xp0 = this.getUserX();
    this.yp0 = this.getUserY();
};

Machine.prototype.getUserX = function() {
    return mouseX - this.xo;
};

Machine.prototype.getUserY = function() {
    return mouseY - this.yo;
};

Machine.prototype.doneLoading = function() {
    if (!SHOW_FRAMERATE) {
        this.elmLoader.style.display = "none";
    }
};

Machine.prototype.upd = function() { //update
    // this.xbMin = this.xbLimitMin;
    // this.xbMax = this.xbLimitMax;
    // this.ybMin = this.ybLimitMin;
    // this.ybMax = this.ybLimitMax;
    if (SHOW_FRAMERATE) {
        this.updFramerate();
    }
    if (this.isIntro) {
        this.updLoading();
    }
    this.updTime();
    // this.updPos();
    this.updWheels(); //update wheels
    // this.cv.clearRect(this.xo + this.xbMin - CLEAR_RECT_MARG, this.yo + this.ybMin - CLEAR_RECT_MARG, this.xbMax - this.xbMin + CLEAR_RECT_MARG * 2, this.ybMax - this.ybMin + CLEAR_RECT_MARG * 2); //clear screen
    // this.updateAndRedrawThreads(); //琴弦
    // this.redrawNubs() //球
}

Machine.prototype.updFramerate = function() {
    this.tFrame1 = (new Date).getTime() / 1000;
    var a = this.tFrame1 - this.tFrame0;
    this.tFrame0 = this.tFrame1;
    this.ctFrame++;
    if(this.ctFrame % 5 == 0) {
        this.numFrame = Math.round(100 / a) / 100;
        this.elmLoader.innerHTML = '<span class="loading">' + this.numFrame + "</span> &nbsp; "
    }
};

Machine.prototype.updLoading = function() {
    var c;
    if (!suite.soundReady) {
        var a = Math.round(suite.indNoteLd / TOTAL_NOTES * 100);
        c = "Loading sound (" + a + "%)";
        this.elmLoader.innerHTML += '<span class="loading">' + c + "</span>"
    }
    this.tLoadCurr = (new Date).getTime() / 1000;
    var b = this.tLoadCurr - this.tLoadPrev;
    this.rLoad = (this.tLoadCurr - this.tLoading0) / LOAD_TIME_OVERALL;
    // TODO: this.incrLoad()
}

Machine.prototype.rsize = function() {
    this.wasResized = true;
    this.width = suite.canvasEl.width = window.innerWidth;
    this.height = suite.canvasEl.height = window.innerHeight;
    this.elmLoader.style.left = "20px";
    this.elmLoader.style.top = (this.height - 32) + "px";
    this.elmAbout.style.left = (this.width - 50) + "px";
    this.elmAbout.style.top = (this.height - 32) + "px";
    this.setOrigin()
};

Machine.prototype.setOrigin = function() { 
    this.xo = Math.round(this.width / 2);
    this.yo = Math.round(this.height / 2)
};

Machine.prototype.updTime = function() {
    this.t1 = (new Date()).getTime() / 1000;
    this.elapFrame = this.t1 - this.t0;
    this.t0 = this.t1;
    var d = 1 / this.elapFrame;
    this.elapSong = this.t1 - this.tSong0;
    this.beatSong = this.bps * this.elapSong;
    this.noteSong = this.beatSong * NOTE_UNIT;
    this.noteSongRd = Math.floor(this.noteSong);
    if (this.isIntro) {
        if (this.noteSongRd != this.noteSongRdPrev) {
            if (this.isIntroDone) {
                if ((this.noteSongRdPrev < this.nextNoteBreak) && (this.noteSongRd >= this.nextNoteBreak)) {
                    var a = this.beatSong % 1;
                    var b = a / this.bps;
                    this.tSong0 = this.tNotes0 = this.t1 - b;
                    this.exitLoading()
                }
            }
            this.noteSongRdPrev = this.noteSongRd
        }
    } else {
        if (this.noteSong > this.indGroup + TOTAL_THREADS) {
            this.tNotes0 = this.t1;
            var c = this.indGroup + TOTAL_THREADS;
            if (c >= TOTAL_NOTES_IN_SONG) {
                c = 0;
                this.tSong0 = this.t1
            }
            this.setGroup(c)
        }
    }
    this.nextNoteBreak = this.noteSongRd + (32 - (this.noteSongRd % 32))
};

Machine.prototype.updWheels = function() {
    var a;
    this.wheel0.setRot((Math.PI * (0.25 + (this.beatSong % 16) / 16 * 2)) % (2 * Math.PI));
    this.wheel1.setRot((Math.PI * (0.25 - (this.beatSong % 16) / 16 * 2)) % (2 * Math.PI));
    this.wheel0.upd();
    this.wheel1.upd()
};
