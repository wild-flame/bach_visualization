var Wheel = function(wheelRadius, yp, ind, canvas) {
    this.ind = ind;
    this.xp = wheelRadius;
    this.yp = yp;
    this.setRot(Math.PI * 0.25);
    var d = this.ind == 0 ? 1 : -1;
    this.rotSpd = d * 0.035;
    this.cv = canvas;
    this.init()
};

Wheel.prototype.init = function() {
    this.m = suite.machine
};

Wheel.prototype.upd = function() {
    this.sinAng = Math.sin(this.rot);
    this.cosAng = Math.cos(this.rot);
    this.nub0.upd();
    this.nub1.upd()
};

Wheel.prototype.setRot = function(a) {
    this.rot = a
};

Wheel.prototype.redraw = function() {
    this.nub0.redraw();
    this.nub1.redraw()
};
