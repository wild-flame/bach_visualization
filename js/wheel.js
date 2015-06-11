var Wheel = function(wheelRadius, yp, ind, canvas) {
    this.ind = ind;
    this.xp = wheelRadius;
    this.yp = yp;
//  this.rot = MATH.PI * 0.25;
    var d = this.ind == 0 ? 1 : -1;
    this.rotSpd = d * 0.035;
    this.cv = canvas;
    this.init()
};

Wheel.prototype.init = function() {
    this.m = suite.machine
};

