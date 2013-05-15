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
 * Various utility functions (mostly trigonometry and algebra helpers).
 */

var Util = {
    // transform degrees to radians
    degToRad: function (x) {
        return x * (Math.PI / 180);
    },
    // transform radians to degrees
    radToDeg: function (x) {
        return x * (180 / Math.PI);
    },
    // cast to integer
    toInt: function (x) {
        return parseInt(Math.round(x));
    },
    // reduce dimensions by the zoom factor
    zoomApply: function (x) {
        return this.toInt(x * Settings.zoom_factor);
    },
    // undo the zoom factor
    zoomUndo: function (x) {
        return this.toInt(x / Settings.zoom_factor);
    },
    // finds a point starting from a given one, at a certain distance and angle
    findPoint: function (point, d, a) {
        return [
            point[0] + d * Math.cos(a),
            point[1] + d * Math.sin(a)
        ];
    },
    // calculate the angle for the line passing through two given points
    angleBetweenPoints: function (pointA, pointB) {
        if (pointB[0] == pointA[0]) {
            if (pointB[1] < pointA[1]) return Math.PI / 2;
            if (pointB[1] > pointA[1]) return -1 * Math.PI / 2;
            if (pointB[1] == pointA[1]) return NaN;
        }
        return Math.atan((pointB[1] - pointA[1]) / (pointB[0] - pointA[0]));
    },
    // calculate the absolute distance between two given points
    absoluteDistanceBetweenPoints: function (pointA, pointB) {
        if (pointA[0] == pointB[0]) return Math.abs(pointA[1] - pointB[1]);
        if (pointA[1] == pointB[1]) return Math.abs(pointA[0] - pointB[0]);
        return Math.sqrt(
            Math.pow(pointA[0] - pointB[0], 2)
                + Math.pow(pointA[1] - pointB[1], 2)
        );
    },
    // calculate the leg of a right triangle using the hypotenuse and other leg
    rightTriangleLeg: function (hypo, leg) {
        return Math.sqrt(Math.pow(hypo, 2) - Math.pow(leg, 2));
    },
    // return the differences between two X and Y coordinate sets
    coordinateDifferences: function (pointA, pointB) {
        return [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    },
    // solve equations of the form a * x^2 + b * x + c = 0
    quadraticSolver: function (a, b, c) {
        var discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return [null, null];
        var discriminantRoot = Math.sqrt(discriminant);
        var x1 = (-1 * b - discriminantRoot) / (2 * a);
        if (0 == discriminant) return [x1, null];
        var x2 = (-1 * b + discriminantRoot) / (2 * a);
        return [x1, x2];
    },
    // find max value in a given array
    maxArrayValue: function (arr) {
        if (!Object.isArray(arr)) return NaN;
        return Math.max.apply(this, arr);
    }
};
