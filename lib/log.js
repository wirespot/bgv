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
 * This is a logging framework which allows the rest of the code to log
 * messages at various verbosity levels.
 *
 * @this {Log}
 *
 * @requires console
 *
 * @property {function} setVerbosity Set the verbosity. Only messages with the
 *   level higher or equal than this will be shown.
 *
 * @property {function} debug Produce a debugging message (very verbose).
 * @property {function} info Produce an informative message about a relevant action.
 * @property {function} warn Produce message about an irregular situation.
 * @property {function} crit Produce message warning about a critical error.
 *
 * @property {int} LEVEL_DEBUG
 * @property {int} LEVEL_INFO
 * @property {int} LEVEL_WARN
 * @property {int} LEVEL_CRIT
 */
var Log = function () {
    // stop if the context was not bound to myself
    if (typeof(this) != 'function') return;
    // stop if we've already run through the code once
    if (typeof(this['hasInitialized']) != 'undefined') return;
    // immediately set the marker so nobody can enter anymore
    this.hasInitialized = true;
    // define possible log levels internally
    var LOG_LEVELS = ['debug', 'info', 'warn', 'crit'];
    // initialize current level
    var CURRENT_LEVEL = null;
    // main internal function which checks verbosity level and logs messages
    var log = function () {
        if (arguments[0] >= CURRENT_LEVEL) {
            console.log.apply(console, arguments[1]);
        }
    };
    // Keep a reference to 'this' named 'that', because there's no wrapping
    // object, so inside all the functions in the following loop 'this' will be
    // assigned to the top level object (Window), and this is easier than using
    // .bind() or .call() or .apply().
    var that = this;
    // Dynamically expose a method and a variable for each defined level
    // eg. for 'debug' this will create Log.debug() and Log.LEVEL_DEBUG.
    for (var i = 0, c = LOG_LEVELS.length; i < c; i++) {
        // Wrap the following block in an anonymous function which is called
        // instantly, in order for vars which depend on i to be set to the value
        // that i had when each loop ran (thanks to the scope of the anon
        // function), not the value i has later when the that[levelFunc]
        // function is called (which would always be the last value of the loop).
        // Please note that the same can be achieved easier by using the 'let'
        // keyword instead of 'var', but it's only available since JS 1.7.
        (function () {
            // create the level code variable eg. this.LEVEL_DEBUG = 0
            var levelCode = 'LEVEL_' + LOG_LEVELS[i].toUpperCase();
            that[levelCode] = i;
            // create the level-specific logger method eg. this.debug()
            var levelFunc = LOG_LEVELS[i];
            that[levelFunc] = function () {
                log.apply(that, [that[levelCode], arguments]);
            };
        })();
    }
    // expose a function which changes the verbosity level
    this.setVerbosity = function (level) {
        if (level < 0 || level > LOG_LEVELS.length - 1) {
            throw new Error("Attempted to set verbosity to invalid level (" + level + ").");
        }
        CURRENT_LEVEL = level;
    };
    // set a default verbosity level
    this.setVerbosity(this.LEVEL_INFO);
};
// first initialization run
Log.apply(Log);
