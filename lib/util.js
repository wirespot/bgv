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
    unfactor: function (x) {
        return this.toInt(x / Settings.factor);
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
    },
    distance: function (x1, y1, x2, y2) {
        if (x1 == x2) return Math.abs(y1 - y2);
        if (y1 == y2) return Math.abs(x1 - x2);
        return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
    },
    diff: function (x1, y1, x2, y2) {
        return [x2 - x1, y2 - y1];
    }
};
