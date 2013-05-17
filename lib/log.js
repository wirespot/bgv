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

var LoggerClass = Class.create({
    level: null,
    initialize: function () {
        this.setLevel(this.LEVEL_INFO);
    },
    setLevel: function (level) {
        this.level = level;
    },
    log: function () {
        if (arguments[0] >= this.level) {
            console.log.apply(null, arguments[1]);
        }
    },
    LEVEL_DEBUG: 0,
    debug: function () {
        this.log.apply(this, [this.LEVEL_DEBUG, arguments]);
    },
    LEVEL_INFO: 1,
    info: function () {
        this.log.apply(this, [this.LEVEL_INFO, arguments]);
    },
    LEVEL_WARN: 2,
    warn: function () {
        this.log.apply(this, [this.LEVEL_WARN, arguments]);
    },
    LEVEL_CRIT: 3,
    crit: function () {
        this.log.apply(this, [this.LEVEL_CRIT, arguments]);
    }

});
var Log = new LoggerClass();
