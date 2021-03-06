var lerp = function(e, d, f) {
    return e + (d - e) * f
};
var lim = function(d, b, a) {
    if (d < b) {
        return b
    } else {
        if (d >= a) {
            return a
        } else {
            return d
        }
    }
};
var norm = function(d, e, b) {
    return (d - e) / (b - e)
};
var sign = function(a) {
    if (a >= 0) {
        return 1
    } else {
        return -1
    }
};
var lerpColor = function(e, d, i) {
    var j = lerp(e[0], d[0], i);
    var h = lerp(e[1], d[1], i);
    var g = lerp(e[2], d[2], i);
    var f = lerp(e[3], d[3], i);
    return [j, h, g, f]
};

function rgbToHex(b) {
    var a = /rgba?\((\d+), (\d+), (\d+)/.exec(c);
                    return a ? "#" + (a[1] << 16 | a[2] << 8 | a[3]).toString(16) : c
}
function hex2rgb(e) {
    if (e.charAt(0) == "#") {
        e = e.slice(1)
    }
    e = e.toUpperCase();
    var d = "0123456789ABCDEF";
    var f = new Array(3);
    var a = 0;
    var h, g;
    for (var b = 0; b < 6; b += 2) {
        h = d.indexOf(e.charAt(b));
        g = d.indexOf(e.charAt(b + 1));
        f[a] = (h * 16) + g;
        a++
    }
        return (f)
}
var getRgb = function(d) {
    var f = Math.round(d[0]);
    var e = Math.round(d[1]);
    var a = Math.round(d[2]);
    return "rgb(" + f + "," + e + "," + a + ")"
};
var lineIntersect = function(e, b, o, n) {
    var i, d, a, l, k, g, f;
    d = b.y - e.y;
    a = n.y - o.y;
    l = e.x - b.x;
    k = o.x - n.x;
    g = b.x * e.y - e.x * b.y;
    f = n.x * o.y - o.x * n.y;
    var h = d * k - a * l;
    if (h == 0) {
        return null
    }
    var j = (l * f - k * g) / h;
    var m = (a * g - d * f) / h;
    if (Math.pow(j - b.x, 2) + Math.pow(m - b.y, 2) > Math.pow(e.x - b.x, 2) + Math.pow(e.y - b.y, 2)) {
        return null
    }
    if (Math.pow(j - e.x, 2) + Math.pow(m - e.y, 2) > Math.pow(e.x - b.x, 2) + Math.pow(e.y - b.y, 2)) {
        return null
    }
    if (Math.pow(j - n.x, 2) + Math.pow(m - n.y, 2) > Math.pow(o.x - n.x, 2) + Math.pow(o.y - n.y, 2)) {
        return null
    }
    if (Math.pow(j - o.x, 2) + Math.pow(m - o.y, 2) > Math.pow(o.x - n.x, 2) + Math.pow(o.y - n.y, 2)) {
        return null
    }
    return new Point(j, m)
};

var Point = function(b, a) {
    this.x = b;
    this.y = a
};
Point.prototype.setX = function(a) {
    this.x = a
};
Point.prototype.setY = function(a) {
    this.y = a
};

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '<br>';
        }
    }
    return str;
}
