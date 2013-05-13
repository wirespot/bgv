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

/**
 * 2D drawing primitive wrappers for more convenient use.
 */

var DrawingClass = Class.create(
    {
        initialize: function(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.context;
        },
        // draw a filled disc at given coordinates and radius
        disc: function (point, radius) {
            this.ctx.beginPath();
            this.ctx.arc(point[0], point[1], radius, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
        },
        // draw an empty circle at given coordinates and radius
        circle: function (point, radius) {
            this.ctx.beginPath();
            this.ctx.arc(point[0], point[1], radius, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.stroke();
        },
        // draw a rectangle starting at given coordinates and given width/height
        rect: function (point, width, height) {
            this.ctx.beginPath();
            this.ctx.rect(point[0], point[1], width, height);
            this.ctx.closePath();
            this.ctx.fill();
        },
        // draw a pixel at given coordinates (in fact a 1x1 rectangle)
        pixel: function (point) {
            this.rect(point[0], point[1], 1, 1);
        },
        // draw a line between two given coordinate sets
        line: function (pointA, pointB) {
            this.ctx.beginPath();
            this.ctx.moveTo(pointA[0], pointA[1]);
            this.ctx.lineTo(pointB[0], pointB[1]);
            this.ctx.stroke();
        },
        // draw a tilted rectangle of given thickness with the ends centered
        // at the given coordinate sets
        rectXY: function (pointA, pointB, thickness) {
            // find rectangle data
            var d = thickness / 2;
            var rads = Util.angleBetweenPoints(pointA, pointB);
            // find corners
            var c1 = Util.findPoint(pointA, d, rads - Math.PI/2);
            var c2 = Util.findPoint(pointA, d, rads + Math.PI/2);
            var c3 = Util.findPoint(pointB, d, rads - Math.PI/2);
            var c4 = Util.findPoint(pointB, d, rads + Math.PI/2);
            // draw
            this.ctx.beginPath();
            this.ctx.moveTo(c1[0], c1[1]);
            this.ctx.lineTo(c2[0], c2[1]);
            this.ctx.lineTo(c4[0], c4[1]);
            this.ctx.lineTo(c3[0], c3[1]);
            this.ctx.closePath();
            this.ctx.fill();
        },
        // paint over the entire canvas using the set background color
        clear: function() {
            this.ctx.fillStyle = Settings.background;
            this.rect([0, 0], this.canvas.width, this.canvas.height);
        },
        // the last vertical position used for legend text
        legendLastPosition: 0,
        // add a text to the legend
        legendAppend: function(text) {
            this.ctx.font = 'bold 12px Courier New';
            this.ctx.textAlign = 'left';
            this.legendLastPosition += 12;
            this.ctx.fillText(text, 5, this.legendLastPosition);
        },
        // mark the center of the canvas
        markCenter: function () {
            this.ctx.fillStyle = Settings.baseColor;
            this.disc(Canvas.center, Settings.center_radius);
        }
    });

// initialize the wrapper and do some preliminary housework
var Draw = new DrawingClass(Canvas);
Draw.clear();
Draw.markCenter();
