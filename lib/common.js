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
 * Application-wide common utilities.
 */

/**
 * Chainable function which mixes properties of the parent object with
 * properties of an object passed as parameter, into a fresh object.
 * PLEASE NOTE that properties are copied by reference and will basically be
 * shared between the three objects. Do not use this for anything more
 * complicated than setting collections.
 * @param other Any object.
 * @returns A fresh object, with properties from other and 'this' mixed in.
 */
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
 * Dump all parameters the logger, then simulate an exit.
 */
var die = function () {
    (Log.crit).apply(Log, arguments);
    window.stop();
};
