var SLACK_LONG = 10;
var SLACK_SHORT = 10;
var DISTANCE_INSTANT_GRAB = 8;
var CURVATURE_RATIO = 0.45;
var OSCILLATION_SPEED_LOW_NOTES = 1.2;
var OSCILLATION_SPEED_HIGH_NOTES = 3;
var MINIMUM_AMPLITUDE = 7;
var AMPLITUDE_DAMPEN_LOW_NOTES = 0.92;
var AMPLITUDE_DAMPEN_HIGH_NOTES = 0.87;
var VOLUME_MIN = 0.5;
var VOLUME_MAX = 0.7;
var PAN_LEFT = -0.3;
var PAN_RIGHT = 0.3;

/*============== INITIALIZE ===============*/
var Thread = function(f, pitchInd, str, hex, ind, canvas) {  // f: y position
    this.pt0 = new Point(0, 0);
    this.pt1 = new Point(0, 0);
    this.yp0 = this.yp1 = f;
    this.pitchInd = pitchInd;
    this.len = 0;
    this.xMid;
    this.yMid;
    this.xc;
    this.yc;
    this.xg;
    this.yg;
    this.xgi;
    this.ygi;
    this.xg1;
    this.yg1;
    this.xg0;
    this.yg0;
    this.xd;
    this.yd;
    this.dx;
    this.dy;
    this.ambPxMin = 3;
    this.freq;
    this.ampDamp;
    this.distMax;
    this.distPerp;
    this.rGrab;
    this.rHalf;
    this.ang;
    this.angPerp;
    this.len;
    this.dx0;
    this.dy0;
    this.dx1;
    this.dy1;
    this.dist0;
    this.dist1;
    this.dxBez0;
    this.dyBez0;
    this.dxBez1;
    this.dyBez1;
    this.ind = ind;
    this.str = str;
    this.hex = hex;
    this.col = hex2rgb(this.hex);
    this.t = 0;
    this.ampStart;
    this.amp;
    this.ampMax;
    this.rStrength;
    this.isUpdOn = false;
    this.oscDir;
    this.isGrabbed = false;
    this.isOsc = false;
    this.isFirstOsc = false;
    this.isShifting = false;
    this.carGrab = null;
    this.cv = canvas;
    this.init()
};

Thread.prototype.init = function() {
    this.m = suite.machine;
    this.updPos();
}

/*============== UPDATE ===============*/


Thread.prototype.upd = function() {
    if (this.isShifting) {
        this.updShifting()
    }
    if (this.isGrabbed) {
        this.updGrab()
    } else {
        if (this.isOsc) {
            this.updOsc()
        }
    }
};
Thread.prototype.updOsc = function() {
    if (this.isFirstOsc) {
        var f = 0.8;
        var a = this.xg1 - this.xg;
        var b = this.yg1 - this.yg;
        this.xg += a * f;
        this.yg += b * f;
        if ((Math.abs(a) < 2) && (Math.abs(b) < 2)) {
            this.t = 0;
            this.oscDir = 1;
            this.isFirstOsc = false;
            var e = sign(a);
            var d = sign(this.sinAng);
            if (e != d) {
                this.oscDir *= -1
            }
        }
    } else {
        this.t += this.freq * this.oscDir;
        var g = Math.sin(this.t);
        this.amp *= this.ampDamp;
        this.xc = this.xMid + g * this.sinAng * this.amp;
        this.yc = this.yMid - g * this.cosAng * this.amp;
        if (this.amp <= 0.15) {
            this.amp = 0;
            this.isOsc = false;
            // this.m.checkMoving()
        }
    }
};

Thread.prototype.grab = function(b, c, d, a) {
    if (!d) {
        this.carGrab = null
    } else {
        this.carGrab = a;
        this.carGrab.thrGrab = this
    }
    this.xgi = this.xg = b;
    this.ygi = this.yg = c;
    this.isGrabbed = true;
    this.m.ctGrab++;
    this.updGrab()
};

Thread.prototype.drop = function() {
    this.m.ctGrab--;
    this.isGrabbed = false;
    this.xc = this.xMid;
    this.yc = this.yMid;
    this.amp = this.rStrength * this.ampMax;
    if (this.carGrab != null) {
        this.carGrab.thrGrab = null;
        this.carGrab = null
    } else {}
    var a = this.m.xAsRatio(this.xg + this.xo);
    this.playNote(this.rStrength, a);
    this.startOsc()
};

Thread.prototype.updGrab = function() {
    if (this.carGrab != null) {
        var b = this.carGrab.xp1;
        var h = this.carGrab.yp1
    } else {
        var b = this.m.getUserX();
        var h = this.m.getUserY()
    }
    var i = b - this.xp0;
    var c = h - this.yp0;
    var g = Math.atan2(c, i);
    var e = this.ang - g;
    var d = Math.sqrt(i * i + c * c);
    this.distPerp = d * Math.sin(e);
    var f = d * Math.cos(e);
    this.rGrab = lim(f / this.len, 0, 1);
    if (this.rGrab <= 0.5) {
        this.rHalf = this.rGrab / 0.5
    } else {
        this.rHalf = 1 - (this.rGrab - 0.5) / 0.5
    }
    var a = this.distMax * this.rHalf;
    this.rStrength = lim(Math.abs(this.distPerp) / this.distMax, 0, 1);
    if (Math.abs(this.distPerp) > a) {
        this.drop()
    } else {
        this.xg = b;
        this.yg = h
    }
};

Thread.prototype.updShifting = function() {
    var b = 0.2;
    var a =(this.lenTarg - this.len) * b;
    if (Math.abs(a) < 1) {
        this.setLength(this.lenTarg);
        this.isShifting = false;
    } else {
        this.setLength(this.len + a);
    }
};

Thread.prototype.updPos = function() {
    this.xp0 = -this.len / 2; //pt0 左端点
    this.xp1 = this.len / 2; //pt1 右端点
    this.pt0.setX(this.xp0); 
    this.pt0.setY(this.yp0);
    this.pt1.setX(this.xp1);
    this.pt1.setY(this.yp1);
    this.dx = this.xp1 - this.xp0; // 水平距离
    this.dy = this.yp1 - this.yp0; // 竖直距离
    this.xMid = this.xp0 + this.dx * 0.5; //中点 
    this.yMid = this.yp0 + this.dy * 0.5; //中点
    this.ang = Math.atan2(this.dy, this.dx); //角度
    this.angPerp = Math.PI / 2 - this.ang;
    this.xc = this.xMid;
    this.yc = this.yMid;
    this.distMax = lerp(SLACK_SHORT, SLACK_LONG, (this.len - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)); //可以拉长的最大高度
    this.freq = lerp(OSCILLATION_SPEED_LOW_NOTES, OSCILLATION_SPEED_HIGH_NOTES, this.rPitch); //振动频率
    this.ampDamp = lerp(AMPLITUDE_DAMPEN_LOW_NOTES, AMPLITUDE_DAMPEN_HIGH_NOTES, this.rPitch); //振动锐减
    this.ampMax = this.distMax;
    this.sinAng = Math.sin(this.ang);
    this.cosAng = Math.cos(this.ang);
    this.sinPerp = Math.sin(this.angPerp);
    this.cosPerp = Math.cos(this.angPerp)
}

Thread.prototype.redraw = function() { //重新绘制琴弦
    if (this.len == 0) {
        return
    }
    this.xo = this.m.xo;
    this.yo = this.m.yo;
    if (isNaN(this.xp1)) {
        return
    }
    this.cv.beginPath();
    this.cv.lineCap = "round";
    this.cv.strokeStyle = this.hex;
    this.cv.lineWidth = this.str;
    if (this.isGrabbed || this.isFirstOsc) {
        this.xd = this.xg;
        this.yd = this.yg
    } else {
        this.xd = this.xc;
        this.yd = this.yc
    }
    if (isNaN(this.xd)) {
        return
    }
    this.dx0 = this.xd - this.xp0;
    this.dy0 = this.yd - this.yp0;
    this.dx1 = this.xp1 - this.xd;
    this.dy1 = this.yp1 - this.yd;
    this.dist0 = Math.sqrt(this.dx0 * this.dx0 + this.dy0 * this.dy0);
    this.dist1 = Math.sqrt(this.dx1 * this.dx1 + this.dy1 * this.dy1);
    this.dxBez0 = CURVATURE_RATIO * this.dist0 * this.cosAng;
    this.dyBez0 = CURVATURE_RATIO * this.dist0 * this.sinAng;
    this.dxBez1 = CURVATURE_RATIO * this.dist1 * this.cosAng;
    this.dyBez1 = CURVATURE_RATIO * this.dist1 * this.sinAng;
    this.cv.moveTo(this.xp0 + this.xo, this.yp0 + this.yo);
    this.cv.bezierCurveTo(this.xd - this.dxBez0 + this.xo, this.yd - this.dyBez0 + this.yo, this.xd + this.dxBez1 + this.xo, this.yd + this.dyBez1 + this.yo, this.xp1 + this.xo, this.yp1 + this.yo);
    this.cv.stroke();
    this.cv.closePath()
};

Thread.prototype.pluck = function(g, c, m, l) {
    this.xgi = this.xg = g;
    this.ygi = this.yg = c;
    var f = this.m.getUserX();
    var k = this.m.getUserY();
    var n = f - this.xp0;
    var i = k - this.yp0;
    var h = this.xgi - this.xp0;
    var e = this.ygi - this.yp0;
    var j = Math.sqrt(n * n + i * i);
    this.rGrab = lim(j / this.len, 0, 1);
    if (this.rGrab <= 0.5) {
        this.rHalf = this.rGrab / 0.5;
    } else {
        this.rHalf = 1 - (this.rGrab - 0.5) / 0.5;
    }
    var b = this.distMax * this.rHalf;
    var a = m ? 1 : this.m.getSpdAvg();
    this.distPerp = (1 - a) * b;
    if (m) {
        this.rStrength = 1;
    } else {
        this.rStrength = lim(Math.abs(this.distPerp) / this.distMax, 0, 1);
    }
    if (this.distPerp < this.ampPxMin) {
        this.distPerp = this.ampPxMin
    }
    this.xg = this.xgi + this.distPerp * this.cosPerp;
    this.yg = this.ygi + this.distPerp * this.sinPerp;
    this.xc = this.xMid;
    this.yc = this.yMid;
    if (this.isOsc) {
        this.rStrength = lim((this.rStrength * 0.5) + (this.amp / this.ampMax), 0, 1);
        this.amp = this.rStrength * this.ampMax;
    } else {
        this.amp = this.rStrength * this.ampMax;
        this.startOsc();
    }
    var d = this.m.xAsRatio(g);
    this.playNote(this.rStrength, d, false);
};

Thread.prototype.startOsc = function() {
    this.xg1 = this.xp0 + this.rGrab * this.dx;
    this.yg1 = this.yp0 + this.rGrab * this.dy;
    this.xg0 = this.xg;
    this.yg0 = this.yg;
    this.t = 0;
    this.isFirstOsc = this.isOsc = true
};

Thread.prototype.playNote = function(c, a) {
    if (this.pitchInd == -1) {
        return
    }
    var b = this.pitchInd < 10 ? "0" : "";
    suite.smPlayNote(this.pitchInd, VOLUME_MIN + c * (VOLUME_MAX - VOLUME_MIN), PAN_LEFT + a * (PAN_RIGHT - PAN_LEFT))
};

/*============== METHOD ===============*/

Thread.prototype.setTargetPitch = function(a) {
    if (a == -1) {
        this.pitchInd = -1;
        var b = 0;
    } else {
        this.pitchInd = a;
        this.rPitch = this.pitchInd / (TOTAL_NOTES - 1);
        var b = this.m.arrLength[this.pitchInd];
    }
    if (b != this.len) {
        this.easeToLength(b);
    }
};

Thread.prototype.setLength = function(a) {
    this.len = a;
    this.updPos()
};

Thread.prototype.easeToLength = function(a) {
    this.isShifting = true;
    this.lenTarg = a
};


