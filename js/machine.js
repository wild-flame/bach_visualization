// THREAD parameters
var TOTAL_THREADS = 8;
var NUBS = 4;

// WHEEL parameters
var WHEEL_RADIUS = 172;
var WHEEL_RADIUS_SQUARED = Math.pow(WHEEL_RADIUS, 2);
var WHEEL_CIRCUMFERENCE = Math.PI * WHEEL_RADIUS_SQUARED;
var WHEEL_QUARTER_SEG = Math.sqrt(2 * WHEEL_RADIUS_SQUARED);

// 
var HEIGHT_ALL_THREADS = WHEEL_QUARTER_SEG;

// LOADING 
// var THREAD_LOADER = 0;
//
var TIME_BETWEEN_LOAD = 0.25;
var LOAD_TIME_OVERALL = 12.5;

// NOTE_UNIT
var NOTE_UNIT = 2;

// CLEAR_RECT
var CLEAR_RECT_MARG = 50;

// FPS_BACKGROUND 
// var FPS_BACKGROUND = 2;

var Machine = function(canvasObj) {
    this.cv = canvasObj;

    this.arrThreads = new Array();
    this.arrLength = new Array();
    this.arrNubs = new Array(NUBS);
    this.arrPitchStart = new Array(TOTAL_THREADS);

    // this.rSpd = 0;
    // this.rSpdAvg = 0;
    // this.fAvg = 5;

    this.setTempo(BPM_NORM);  

    // this.rSpdGrab = 0.4;
    //
    this.xp0;
    this.yp0;
    this.xp1;
    this.yp1;
    this.pt0 = new Point();
    this.pt1 = new Point();

    this.isFirstRun = true;
    this.wasResized = false;
    // this.isHodingNub = false;
    // this.nubOver = null;
    // this.indGroup = 0;
    // this.ctGrab = 0;
    // this.pluckMax = 2;
    this.indThreadLoader = 0;

    this.isIntro = true;
    this.isIntroDone = false;

    this.noteSondRdPrev = 0;
    this.threadsInPlace = false;
    // this.isInBackground = false;

    this.xbLimitMin = -MAX_LENGTH * 0.5;
    this.xbLimitMax = MAX_LENGTH * 0.5;
    this.ybLimitMin = -HEIGHT_ALL_THREADS * 0.5;
    this.ybLimitMax = HEIGHT_ALL_THREADS * 0.5;
    this.xbMin = this.xbLimitMin;
    this.xbMax = this.xbLimitMax;
    this.ybMin = this.ybLimitMin;
    this.ybMax = this.ybLimitMax;

    this.init()
}

Machine.prototype.init = function() {
    this.elmLoader = document.getElementById("loader");
    this.elmAbout = document.getElementById("about");
};

Machine.prototype.build = function() {
    this.setOrigin(); //设置起点
    var curTLength = MAX_LENGTH; 
    for (var e = 0; e < TOTAL_NOTES; e++) {
        this.arrLength[e] = curTLength;
        curTLength *= HALF_STEP_MULTIPLIER
    }
    var g, h, threadColor, c;
    var j = WHEEL_QUARTER_SEG / TOTAL_THREADS;
    var a = (TOTAL_THREADS / 2) * j - 0.5 * j;
    for (var e = 0; e < TOTAL_THREADS; e++) {
        this.arrPitchStart[e] = suite.arrMidiMap[SONG_DATA_ARRAY[e]];
        threadColor = "#FFFFFF";
        h = 3;
        var c = -1;
        var b = new Thread(a, c, h, threadColor, e, this.cv); // a: y position, c = -1, h = 3
        // var Thread = function(yPostion, pitchInd, str, hex, ind, canvas) 
        a = a - j;
        this.arrThreads.push(b)
    }
    this.wheel0 = new Wheel(WHEEL_RADIUS, 0, 0, this.cv); //第一个wheel
    this.wheel1 = new Wheel(-WHEEL_RADIUS, 0, 1, this.cv); //第二个weeel
    this.arrNubs[0] = this.wheel0.nub0 = new Nub(0, 0, suite.machine, this.wheel0, this.cv); //第一个球
    this.arrNubs[1] = this.wheel0.nub1 = new Nub(1, 1, suite.machine, this.wheel0, this.cv); //第二个球
    this.arrNubs[2] = this.wheel1.nub0 = new Nub(0, 2, suite.machine, this.wheel1, this.cv); //第三个球
    this.arrNubs[3] = this.wheel1.nub1 = new Nub(1, 3, suite.machine, this.wheel1, this.cv); //第四个球

    this.cv.globalCompositeOperation = "lighter";


    this.arrNubs[0].enter();
};

Machine.prototype.beginLoading = function() {
    this.tFrame0 = this.tSong0 = this.tNotes0 = this.tLoadPrev = this.tLoading0 = this.t0 = (new Date()).getTime() / 1000;
    this.ctFrame = 0;
    this.xp0 = this.getUserX();
    this.yp0 = this.getUserY();
};

Machine.prototype.doneLoading = function() {
    if (!SHOW_FRAMERATE) {
        this.elmLoader.style.display = "none";
    }
};

Machine.prototype.exitLoading = function() {
    this.isIntro = false;
    for (var a = 0; a < this.arrNubs.length; a++) {
        this.arrNubs[a].exitLoader();
    }
    this.updThreads();
};

Machine.prototype.getUserX = function() {
    return mouseX - this.xo;
};

Machine.prototype.getUserY = function() {
    return mouseY - this.yo;
};

Machine.prototype.incrLoad = function() {
    var l;
    if (this.rLoad > 0.15) {
        l = this.arrNubs[2];
        if (!l.hasEntered) {
            l.enter()
        }
        l = this.arrNubs[0];
        if (!l.hasEntered) {
            l.enter()
        }
    }
    if (this.rLoad > 0.85) {
        l = this.arrNubs[1];
        if (!l.hasEntered) {
            l.enter()
        }
    }
    if (this.rLoad > 0.97) {
        l = this.arrNubs[3];
        if (!l.hasEntered) {
            l.enter()
        }
    }
    var j = 0.4;
    var h = 0.8;
    var e;
    if (this.rLoad < j) {
        e = 0
    } else {
        e = (this.rLoad - j) / (h - j);
        if (e > 1) {
            e = 1
        }
    }
    var k = e * TOTAL_THREADS;
    var d = Math.floor((Math.random() * 0.999) * k);
    var a, m, b;
    var f = 0;
    for (var g = 0; g < TOTAL_THREADS; g++) {
        if (g > k) {
            break
        }
        a = this.arrPitchStart[d];
        b = this.arrThreads[d];
        if (b.pitchInd == a) {
            d = (d + 1) % TOTAL_THREADS;
            f++
        } else {
                var c;
                if (k == 0) {
                    c = 1
                } else {
                    c = 1 + Math.round(Math.random() * 2)
                }
                off = Math.floor(lerp(-3, 0, this.rLoad));
                m = b.pitchInd + c + off;
                if (m < 0) {
                    m = 0
                }
                if (m > a) {
                    m = a
                }
                if ((suite.indNoteLd > 0) && (suite.indNoteLd - 1 >= m)) {
                    b.setTargetPitch(m);
                    break
                }
            }
    }
    if ((f == TOTAL_THREADS) && !this.threadsInPlace) {
        this.threadsInPlace = true
    }
    if (this.threadsInPlace && suite.soundReady && this.rLoad >= 1 && !this.isIntroDone) {
        console.log("isIntroDone true!");
        this.isIntroDone = true
    }
};Machine.prototype.setTempo = function(a) {
    this.bpm = a;
    this.bps = a / 60
};

Machine.prototype.setGroup = function(indGroup) { 
    this.indGroup = indGroup;
    for (var a = 0; a< this.arrThreads.length; a++) {
        var b = SONG_DATA_ARRAY[this.indGroup + a];
        if (b == -1) {
            pitch = -1
        } else {
            pitch = suite.arrMidiMap[b];
        }
        this.arrThreads[a].setTargetPitch(pitch);
    }
};

Machine.prototype.upd = function() { //update
    this.xbMin = this.xbLimitMin;
    this.xbMax = this.xbLimitMax;
    this.ybMin = this.ybLimitMin;
    this.ybMax = this.ybLimitMax;
    if (SHOW_FRAMERATE) {
        this.updFramerate();
    }
    if (this.isIntro) {
        this.updLoading();
    }
    this.updTime();
    this.updPos();
    this.updWheels(); //update wheels
    // this.cv.clearRect(this.xo + this.xbMin - CLEAR_RECT_MARG, this.yo + this.ybMin - CLEAR_RECT_MARG, this.xbMax - this.xbMin + CLEAR_RECT_MARG * 2, this.ybMax - this.ybMin + CLEAR_RECT_MARG * 2); //clear screen
    this.cv.clearRect(0,0,window.innerWidth,window.innerHeight);
    this.updateAndRedrawThreads(); //琴弦
    this.redrawNubs(); //球
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

Machine.prototype.updPos = function() {
    this.xp1 = this.getUserX();
    this.yp1 = this.getUserY();
    this.xp1 = this.getUserX();
    this.yp1 = this.getUserY();
    this.pt0.x = this.xp0;
    this.pt0.y = this.yp0;
    this.pt1.x = this.xp1;
    this.pt1.y = this.yp1;
    this.dx = this.xp1 - this.xp0;
    this.dy = this.yp1 - this.yp0;
    this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    // this.isMouseMoving = (this.dist > 0.2);
    this.spd = this.dist / this.elapFrame;
    // this.rSpd = lim((this.spd - MOUSE_SPEED_MIN) / (MOUSE_SPEED_MAX - MOUSE_SPEED_MIN), 0, 1);
    // this.rSpdAvg = (this.rSpdAvg * (this.fAvg - 1) / this.fAvg) + (this.rSpd * (1 / this.fAvg));
    this.xp0 = this.xp1;
    this.yp0 = this.yp1
}

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
    this.incrLoad();
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
        //if (this.noteSongRd != this.noteSongRdPrev) {
        if (this.isIntroDone) {
            if ((this.noteSongRdPrev < this.nextNoteBreak) && (this.noteSongRd >= this.nextNoteBreak)) {
                var a = this.beatSong % 1;
                var b = a / this.bps;
                this.tSong0 = this.tNotes0 = this.t1 - b;
                this.exitLoading()
            }
            //		}
            //	this.noteSongRdPrev = this.noteSongRd
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

Machine.prototype.redrawNubs = function() {
    this.wheel0.nub0.redraw();
    this.wheel0.nub1.redraw();
    this.wheel1.nub0.redraw();
    this.wheel1.nub1.redraw()
};

Machine.prototype.updThreads = function() {
    for (var a = 0; a< this.arrThreads.length; a++) {
        this.arrThreads[a].upd()
    }
};

Machine.prototype.redrawThreads = function() {
    for (var a = 0; a < this.arrThreads.length; a++) {
        this.arrThreads[a].redraw();
    }
};

Machine.prototype.updateAndRedrawThreads = function() {
    for (var a = 0; a < this.arrThreads.length; a++) {
        this.arrThreads[a].upd();
        this.arrThreads[a].redraw()
    }
};

Machine.prototype.setOrigin = function() { 
    this.xo = Math.round(this.width / 2);
    this.yo = Math.round(this.height / 2)
};

Machine.prototype.xAsRatio = function(a) {
    a = lim(a, 0, this.width);
    return a / this.width;
};

Machine.prototype.checkMoving = function() {
    var b = 0;
    for (var a = 0; a < this.arrThreads.length; a++) {
        if (this.arrThreads[a].isOsc) {
            b++
        }
    }
};
