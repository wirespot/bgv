Object.prototype.combine = function (other) {
    var obj = {};
    for (prop in this) {
        if (!this.hasOwnProperty(prop)) continue;
        obj[prop] = this[prop];
    }
    for (prop in other) {
        if (!other.hasOwnProperty(prop)) continue;
        obj[prop] = other[prop];
    }
    return obj;
};

/**
 *
 */
var die = function () {
    console.log.apply(null, arguments);
    throw new Error();
};

/**
 *
 */
var Settings = {
    background: 'rgba(255, 255, 255, 1)',
    factor: 0.5, // pixels-per-mm factor
    bb_radius: 20,
    hub_radius: 15,
    head_to_steerer: 0.60, // factor of steerer thickness raported to head
    END: null
};

/**
 *
 */
var Util = {
    rad: function (x) {
        return x * (Math.PI / 180);
    },
    deg: function (x) {
        return x * (180 / Math.PI);
    },
    toInt: function (x) {
        return parseInt(Math.round(x, 10));
    },
    factor: function (x) {
        return this.toInt(x * Settings.factor);
    },
    afar: function (x, y, d, a) {
        var xn = x + this.toInt(d * Math.cos(a));
        var yn = y + this.toInt(d * Math.sin(a));
        return [xn, yn];
    },
    angle: function (x1, y1, x2, y2) {
        return Math.atan((y2 - y1) / (x2 - x1));
    },
    tri3rd: function (hypo, small) {
        return Math.sin(Math.acos(small / hypo)) * hypo;
    }
};

/**
 *
 */
var CanvasClass = Class.create(
    {
        initialize: function () {
            this.object = $('canvas');
            if (!this.object) {
                die("Canvas element not found, aborting.");
            }
            this.width = this.object.getWidth();
            this.height = this.object.getHeight();
            this.center = [
                Util.toInt(this.width / 2),
                Util.toInt(this.height / 2)
            ];
            this.context = this.object.getContext("2d");
        }
    });
var Canvas = new CanvasClass;

/**
 *
 */
var DrawingClass = Class.create(
    {
        initialize: function(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.context;
        },

        disc: function (x, y, r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
        },
        circle: function (x, y, r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.stroke();
        },
        rect: function (x, y, w, h) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            this.ctx.closePath();
            this.ctx.fill();
        },
        pixel: function (x, y) {
            this.rect(x, y, 1, 1);
        },
        line: function (x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        },
        rectXY: function (x1, y1, x2, y2, w) {
            var d = w / 2;
            var rads = Util.angle(x1, y1, x2, y2);

            var c1 = Util.afar(x1, y1, d, rads - Math.PI/2);
            var c2 = Util.afar(x1, y1, d, rads + Math.PI/2);
            var c3 = Util.afar(x2, y2, d, rads - Math.PI/2);
            var c4 = Util.afar(x2, y2, d, rads + Math.PI/2);

            this.ctx.beginPath();
            this.ctx.moveTo(c1[0], c1[1]);
            this.ctx.lineTo(c2[0], c2[1]);
            this.ctx.lineTo(c4[0], c4[1]);
            this.ctx.lineTo(c3[0], c3[1]);
            this.ctx.closePath();
            this.ctx.fill();
        },
        clear: function() {
            this.ctx.fillStyle = Settings.background;
            this.rect(0, 0, this.canvas.width, this.canvas.height);
        }
    });
var Draw = new DrawingClass(Canvas);
Draw.clear();