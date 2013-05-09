/*
head top
    reach       head top
bb
    stack
head bottom
    HT length
    HT angle
front hub
    fork length
    fork offset
rear hub
    bb drop
    chainstay length
toe overlap
    crank length
    typical half pedal
    foot pedal overshoot
    wheel size
    tire size
*/
var SETTINGS = {
    background: 'rgba(255, 255, 255, 1)',
    factor: 0.5, // pixels-per-mm factor
    bb_radius: 20,
    hub_radius: 15,
    head_to_steerer: 0.68, // factor of steerer thickness raported to head
    END: null
};
var DATASETS = {
    ktm_lc_w51: {
        color: 'rgba(255, 0, 0, 0.75)',
        reach: 380,
        stack: 610,
        head_size: 28.575, // 1 1/8"
        head_tube: 137,
        head_angle: 70.5,
        fork_length: 468,
        fork_offset: 43,
        fork_steerer: 260,
        bb_drop: 55,
        chainstay: 440,
        crank_arm: 175,
        wheel: 622,
        tire: 60,
        handle_rise: 20,
        handle_pull: 50,
        END: null
    },
    cobalt_2wS: {
        color: 'rgba(0, 0, 255, 0.75)',
        reach: 381,
        stack: 582,
        head_size: 28.575, // 1 1/8"
        head_tube: 100,
        head_angle: 70.3,
        fork_length: 469,
        fork_offset: 42,
        fork_steerer: 260,
        bb_drop: 60,
        chainstay: 440,
        crank_arm: 175,
        wheel: 622,
        tire: 60,
        handle_rise: 20,
        handle_pull: 50,
        END: null
    },
    END: null
};

document.observe("dom:loaded", function() {
    var S = SETTINGS;
    // initialization
    S.canvas = $('canvas');
    if (!S.canvas) return;
    S.width = S.canvas.getWidth();
    S.height = S.canvas.getHeight();
    S.center = [
        Util.toInt(S.width / 2),
        Util.toInt(S.height / 2)
    ];
    S.ctx = S.canvas.getContext("2d");
    // fill canvas background
    S.ctx.fillStyle = S.background;
    Draw.rect(S.ctx, 0, 0, S.width, S.height);
    // drawBike
    drawBike('ktm_lc_w51');
    drawBike('cobalt_2wS');
});

function drawBike(set) {
    var S = SETTINGS;
    var D = DATASETS[set];
    if (!D) return;
    // set colors
    S.ctx.fillStyle = D.color;
    S.ctx.strokeStyle = D.color;
    // bb is at bottom-right of the reach/stack box
    var bb = [
        S.center[0] - Util.factor(Util.toInt(D.reach / 2)),
        S.center[1] + Util.factor(Util.toInt(D.stack / 2))
    ];
    Draw.disc(S.ctx, bb[0], bb[1], Util.factor(S.bb_radius));
    // head top is at top-right of the reach/stack box
    var ht = [
        S.center[0] + Util.factor(Util.toInt(D.reach / 2)),
        S.center[1] - Util.factor(Util.toInt(D.stack / 2))
    ];
    Draw.pixel(S.ctx, ht[0], ht[1]);
    // draw stack and reach
    Draw.line(S.ctx, bb[0], bb[1], bb[0], ht[1]);
    Draw.line(S.ctx, bb[0], ht[1], ht[0], ht[1]);
    // head bottom is found using head angle and tube
    var hb = [
        ht[0] + Util.toInt(Math.cos(Util.rad(D.head_angle)) * Util.factor(D.head_tube)),
        ht[1] + Util.toInt(Math.sin(Util.rad(D.head_angle)) * Util.factor(D.head_tube))
    ];
    Draw.pixel(S.ctx, hb[0], hb[1]);
    // steerer top is found using head tube bottom, head angle, and steerer length
    var st = Util.afar(hb[0], hb[1], Util.factor(D.fork_steerer), Util.rad(D.head_angle - 180));
    Draw.rectXY(S.ctx, st[0], st[1], hb[0], hb[1], Util.factor(D.head_size * S.head_to_steerer));
    // draw head tube using top, bottom and its size (thickness)
    Draw.rectXY(S.ctx, ht[0], ht[1], hb[0], hb[1], Util.factor(D.head_size));
    // rear wheel hub
    var rwh = [
        bb[0] - Util.factor(Util.tri3rd(D.chainstay, D.bb_drop)),
        bb[1] - Util.factor(D.bb_drop)
    ];
    Draw.rectXY(S.ctx, bb[0], bb[1], rwh[0], rwh[1], 4);
    Draw.disc(S.ctx, rwh[0], rwh[1], Util.factor(S.hub_radius));
    // rear wheel
    Draw.circle(S.ctx, rwh[0], rwh[1], Util.factor(D.wheel / 2));
    Draw.circle(S.ctx, rwh[0], rwh[1], Util.factor(D.wheel / 2 + D.tire));
    // front hub
    var fork_straight = Util.factor(Util.tri3rd(D.fork_length, D.fork_offset));
    var fwh_straight = Util.afar(hb[0], hb[1], fork_straight, Util.rad(D.head_angle));
    Draw.line(S.ctx, hb[0], hb[1], fwh_straight[0], fwh_straight[1]);
    var fwh = Util.afar(fwh_straight[0], fwh_straight[1], Util.factor(D.fork_offset), Util.rad(D.head_angle - 90));
    Draw.line(S.ctx, fwh_straight[0], fwh_straight[1], fwh[0], fwh[1]);
    Draw.disc(S.ctx, fwh[0], fwh[1], Util.factor(S.hub_radius));
    // front wheel
    Draw.circle(S.ctx, fwh[0], fwh[1], Util.factor(D.wheel / 2));
    Draw.circle(S.ctx, fwh[0], fwh[1], Util.factor(D.wheel / 2 + D.tire));
}

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
        return this.toInt(x * SETTINGS.factor);
    },
    afar: function (x, y, d, a) {
        var xn = x + Util.toInt(d * Math.cos(a));
        var yn = y + Util.toInt(d * Math.sin(a));
        return [xn, yn];
    },
    angle: function (x1, y1, x2, y2) {
        return Math.atan((y2 - y1) / (x2 - x1));
    },
    tri3rd: function (hypo, small) {
        return Math.sin(Math.acos(small / hypo)) * hypo;
    }
};

var Draw = {
    disc: function (ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    },
    circle: function (ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();
    },
    rect: function (ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    },
    pixel: function (ctx, x, y) {
        this.rect(ctx, x, y, 1, 1);
    },
    line: function (ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    rectXY: function (ctx, x1, y1, x2, y2, w) {
        var d = w / 2;
        var rads = Util.angle(x1, y1, x2, y2);

        var c1 = Util.afar(x1, y1, d, rads - Math.PI/2);
        var c2 = Util.afar(x1, y1, d, rads + Math.PI/2);
        var c3 = Util.afar(x2, y2, d, rads - Math.PI/2);
        var c4 = Util.afar(x2, y2, d, rads + Math.PI/2);

        ctx.beginPath();
        ctx.moveTo(c1[0], c1[1]);
        ctx.lineTo(c2[0], c2[1]);
        ctx.lineTo(c4[0], c4[1]);
        ctx.lineTo(c3[0], c3[1]);
        ctx.closePath();
        ctx.fill();
    }
};


