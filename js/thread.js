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
}

Thread.prototype.init = function() {
    this.m = suite.machine;
    this.updPos();
}

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
