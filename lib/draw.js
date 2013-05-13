/**
 * This file is part of Bicycle Geometry Visualiser (BGV).
 *
 * BGV is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BGV is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BGV.  If not, see <http://www.gnu.org/licenses/>.
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
        },
        legendLast: 0,
        legendAppend: function(text) {
            this.ctx.font = 'bold 12px Courier New';
            this.ctx.textAlign = 'left';
            this.legendLast += 12;
            this.ctx.fillText(text, 5, this.legendLast);
        },
        markCenter: function () {
            this.ctx.fillStyle = Settings.baseColor;
            this.disc(Canvas.center[0], Canvas.center[1], Settings.center_radius);
        }
    });
var Draw = new DrawingClass(Canvas);
Draw.clear();
Draw.markCenter();
