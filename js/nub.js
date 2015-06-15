var RAD_NORM = 6;
// var RAD_OVER = 15;
// var RAD_GRAB = 10;
var RAD_EASE = 0.4;

var ORBIT_LOADER = 35;

// var EASE_ORBIT_GRAB = 0.2;
// var EASE_ORBIT_FOLLOW = 0.02;
// var EASE_ORBIT_RESTORE = 0.02;
// var EASE_CENTER_GRAB = 0.3;
// var EASE_CENTER_RESTORE = 0.015;
// var EASE_CENTER_FOLLOW_MIN = 0.04;
// var EASE_CENTER_FOLLOW_MAX = 0.01;
//
var EASE_ORBIT_LOADER = 0.003; // 
var EASE_CENTER_LOADER = 0.03;
// EASE_ORBIT_EXIT_LOADER = 0.1;
// EASE_CENTER_EXIT_LOADER = 0.1;
//
var PLUCK_FRAME_MAX = 2;

// var TRAIL_OPAC_MIN = 0.04;
// var TRAIL_OPAC_MAX = 0.5;
// var TRAIL_FADEOUT = 0.6;
// var TRAIL_PTS = 24;
// var TRAIL_SAMPLE = 4;

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
    this.radTarg = RAD_NORM;
    // this.scaleRat = 0；

    this.velX = 0;
    this.velY = 0;

    this.dampVel = 0.93;
    // this.arrTrail = new Array(TRAIL_PTS);

    this.frameCt = this.indAll;
    this.spd = 0;

    this.hasEntered = false;

    this.init();
};

Nub.prototype.init = function() {
    this.m = this.machine;
};

Nub.prototype.upd = function() {
    if (!this.hasEntered) {
        return
    }
    this.updPos();
    this.updInteract();
}

Nub.prototype.updInteract = function() {
    if (this.isFirstRun) {
        this.isFirstRun = false;
        return;
    }
    if (this.spd > SPD_IGNORE_MAX) {
        return;
    }
    var a, c, d;
    var f = 0;
    for (var b = 0; b < this.m.arrThreads.length; b++) {
        d = this.m.arrThreads[b];
        var e = lineIntersect(this.pt0, this.pt1, d.pt0, d.pt1);
        if (e == null) {
            continue
        }
        a = e.x;
        c = e.y;
        if ((!d.isGrabbed) && (!isNaN(a)) && (!isNaN(c))) {
            if (this.spd > SPD_GRAB) {
                d.pluck(a, c, true, this);
                f++;
                if (f > PLUCK_FRAME_MAX) {
                    break
                }
            } else {
                d.grab(a, c, true, this);
                break
            }
        }
    }
};

Nub.prototype.updPos = function() {
    this.t1 = (new Date()).getTime() / 1000;
    var c = this.t1 - this.t0;
    this.t0 = this.t1;
    this.velX *= this.dampVel;
    this.velY *= this.dampVel;
    if(Math.abs(this.velX) < 0.5) {
        this.velX = 0;
    }
    if(Math.abs(this.velY) < 0.5) {
        this.velY = 0;
    }
    this.xpv = this.xp0 + this.velX;
    this.ypv = this.yp0 + this.velY;
    if (this.rad != this.radTarg) {
        var e = (this.radTarg - this.rad);
        if(Math.abs(e) < 1) {
            this.rad = this.radTarg;
        } else {
            this.rad += e * RAD_EASE;
        }
    }
    if (Math.abs(this.velX) > 0 || Math.abs(this.velY) > 0) {
        this.isTossing = true;
    } else {
        this.isTossing = false;
    }
    if (this.isTossing) {
        this.setPos(this.xpv, this,ypv);
        this.xpOrbit = this.xpv;
        this.ypOrbit = this.ypv;
        this.orbit = 0;
    } else {
        //TODO:Holding nub and mouse over
        this.xpOrbitTarg = this.wheel.xp;
        this.ypOrbitTarg = this.wheel.yp;
        var b = this.orbitTarg;
        if (this.orbit != b) {
            this.orbit = (b - this.orbit) * this.easeOrbit + this.orbit; // (b + this.orbit(1-this.easeOrbit)
            if (Math.abs(this.orbitTarg - this.orbit) < 1) {
                this.orbit = this.orbitTarg;
            }
        }
        if (this.xpOrbit != this.xpOrbitTarg) {
            this.xpOrbit += (this.xpOrbitTarg - this.xpOrbit) * this.easeCenter;
            if (Math.abs(this.xpOrbitTarg - this.xpOrbit) < 1) {
                this.xpOrbit = this.xpOrbitTarg
            }
        }
        if (this.ypOrbit != this.ypOrbitTarg) {
            this.ypOrbit += (this.ypOrbitTarg - this.ypOrbit) * this.easeCenter;
            if (Math.abs(this.ypOrbitTarg - this.ypOrbit) < 1) {
                this.ypOrbit = this.ypOrbitTarg
            }
        }
        if (this.ind == 0) {
            this.xpw = this.xpOrbit + this.wheel.cosAng * this.orbit;
            this.ypw = this.ypOrbit + this.wheel.sinAng * this.orbit
        } else {
            this.xpw = this.xpOrbit - this.wheel.cosAng * this.orbit;
            this.ypw = this.ypOrbit - this.wheel.sinAng * this.orbit
        }
        this.setPos(this.xpw, this.ypw);
    }
    this.dx = this.xp1 - this.xp0;
    this.dy = this.yp1 - this.yp0;
    this.pt0.x = this.xp0;
    this.pt0.y = this.yp0;
    this.pt1.x = this.xp1;
    this.pt1.y = this.yp1;
    this.xp0 = this.xp1;
    this.yp0 = this.yp1;
    this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.spd = this.dist;
    //TODO:trail
    this.frameCt++;
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

Nub.prototype.redraw = function() {
    if (!this.hasEntered) {
        return
    }
    this.cv.beginPath();
    this.cv.fillStyle = "#FFFFFF";
    this.cv.arc(this.xp1 + this.m.xo, this.yp1 + this.m.yo, this.rad, 0, 2 * Math.PI);
    this.cv.fill();
    this.cv.closePath();
    var d, m, c, k, b, h, l, a, j, o, e, n;
    if (this.machine.isInBackground) {
        return
    }

    // TODO:Draw trails

};

Nub.prototype.setPos = function(a, b) {
    this.xp1 = a;
    this.yp1 = b;
}
