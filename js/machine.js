// THREAD parameters
var HALF_STEP_MULTIPLIER = 0.94921875;
var TOTAL_THREADS = 8;
var NUBS = 4;

// WHEEL parameters
var WHEEL_RADIUS = 172;
var WHEEL_RADIUS_SQUARED = Math.pow(WHEEL_RADIUS, 2);
var WHEEL_CIRCUMFERENCE = Math.PI * WHEEL_RADIUS_SQUARED;
var WHEEL_QUARTER_SEG = Math.sqrt(2 * WHEEL_RADIUS_SQUARED);

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
    // TODO:NUBS
};
    

Machine.prototype.doneLoading = function() {
    if (!SHOW_FRAMERATE) {
        this.elmLoader.style.display = "none";
    }
};

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


