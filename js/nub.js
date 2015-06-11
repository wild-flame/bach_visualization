var RAD_NORM = 6;
var ORBIT_LOADER = 35;
var EASE_ORBIT_LOADER = 0.003;
var EASE_CENTER_LOADER = 0.03;

var Nub = function(ind,indAll, machine,wheel, canvas) {
    this.xp0;
    this.xp1; 
    this.yp0;
    this.yp1;
    this.xpw;
    this.ypw;
    this.pt0 = new Point();
    this.pt1 = new Point();
    this.wheel = wheel;
    this.machine = machine;
    this.ind = ind; 
    this.indAll = indAll;
    this.cv = canvas;
    this.xpOrbit = this.xpOrbitTarg = this.wheel.xp;
    this.ypOrbit = this.ypOrbitTarg = this.wheel.yp;
    this.orbit = this.orbitTarg = WHEEL_RADIUS;
    this.rad = RAD_NORM;
    // this.radTarg = RAD_NORM;
    // this.scaleRat = 0；
    this.velX = 0;
    this.velY = 0;
    this.hasEntered = false;

    this.init();
};

Nub.prototype.init = function() {
    this.m = this.machine;
};

Nub.prototype.enter = function() {
    this.hasEntered = true;
    this.isLoading = true;
    if (this.indAll == 0) {
        this.xpOrbit = -150;
        this.ypOrbit = this.m.height * 0.6;
        this.orbit = ORBIT_LOADER * 0.3
    } else if (this.indAll == 1) {
        this.xpOrbit = this.m.width * 1;
        this.ypOrbit = -this.m.height * 0.9;
        this.orbit = ORBIT_LOADER * 5.5
    } else if (this.indAll == 2) {
        this.xpOrbit = -this.m.width * 1.5;
        this.ypOrbit = this.m.height * 1;
        this.orbit = ORBIT_LOADER * 6
    } else if (this.indAll == 3) {
        this.xpOrbit = this.m.width * 1.2;
        this.ypOrbit = -this.m.height * 0.8;
        this.orbit = ORBIT_LOADER * 1.5
    }
    this.redTarg = RAD_NORM;
    this.orbitTarg = WHEEL_RADIUS;
    this.easeOrbit = EASE_ORBIT_LOADER;
    this.easeCenter = EASE_CENTER_LOADER;
}
