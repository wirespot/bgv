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
 * The main library containing the bicycle logic.
 *
 * It mixes in calculator and renderer definitions.
 */

var Bike = Class.create(Calculators, Correctors, Renderers, Labels, {

    /**
     * Collection of dinamically calculated bicycle properties.
     */
    values: {},

    /**
     * Initialization code and main control logic.
     * @param bikeDef A combination of Definitions objects.
     * @param alignToBike [optional] Another Bike object, given for alignment purposes.
     * @param alignToPart [optional] Which part of the other bike to align to.
     *   Valid values are "front" [hub], "rear" [hub], "bb" (default) and "head".
     */
    initialize: function (bikeDef, alignToBike, alignToPart) {
        // clear internal members to avoid referential inheritance
        this.values = {};
        // record the bike definition
        if (typeof(bikeDef) !== 'object') {
            die('Bike definition is not an object:', bikeDef);
        }
        this.Def = bikeDef;
        // compute locations
        this.calculateValues();
        // wheel base level checker
        this.fixWheelBaseLevel();
        // align to another bike, if any given
        if (typeof(alignToBike) === 'object') {
            this.alignToBike(alignToBike, alignToPart);
        }
        // if no other bike given align to canvas center
        else {
            this.centerToCanvasCenter();
        }
        // perform def values corrections
        this.correctBikeDefs();
        // draw bike
        this.renderBike();
        if (typeof(alignToBike) !== 'object') {
            this.printLabels();
        }
        // all done
        console.log(this.Def.name + ': bike done.');
    },

    /**
     * Checks to see if both wheels make contact with the ground at the same
     * level. If they don't, it tilts the bike up or down using the rear tire
     * contact point as reference until the bike is level. PLEASE NOTE that this
     * process will redefine frame properties that rely on the horizontal or
     * vertical.
     *
     * @returns {boolean} Whether a tilt was performed or not.
     */
    fixWheelBaseLevel: function () {
        // check that both wheel contact spots are available
        if (!this.isCoordinate(this.values['frontContactPatch'])) return false;
        if (!this.isCoordinate(this.values['rearContactPatch'])) return false;
        // shorthand notation
        var front = this.values['frontContactPatch'];
        var rear = this.values['rearContactPatch'];
        // see if the spots are level
        var frontToRearDiffs = Util.coordinateDifferences(front, rear);
        if (0 === frontToRearDiffs[1]) return false;
        // find the angle of the tilt that needs to be performed to level wheels
        var tiltAngle = Math.atan(frontToRearDiffs[1] / frontToRearDiffs[0]);
        // go through all calculated locations
        for (prop in this.values) {
            // we only want "true" properties, which are coordinates, and which
            // are not the rear contact spot (which is to be used as rotational
            // reference)
            if (!this.values.hasOwnProperty(prop)
                || !this.isCoordinate(this.values[prop])
                || prop == 'rearContactPatch'
            ) {
                continue;
            }
            // calculate diffs, distance and tilt angle for each part in turn,
            // as compared to the reference rear ground point
            var part = this.values[prop];
            var distance = Util.absoluteDistanceBetweenPoints(rear, part);
            var partDiffs = Util.coordinateDifferences(rear, part);
            var originalAngle = Math.atan(partDiffs[1] / partDiffs[0]);
            var newAngle = originalAngle - tiltAngle;
            // overwrite the part coordinates
            this.values[prop] = [
                rear[0] + distance * Math.cos(newAngle),
                rear[1] + distance * Math.sin(newAngle)
            ];
        }
        // report that tilt happened
        console.log(this.Def.name + ': wheels not level, bike tilted by '
            + Util.radToDeg(tiltAngle) +'deg.');
        return true;
    },

    /**
     * Takes a 'dependencies' entry from a definition object (such as
     * calculators or renderers) and checks that all property path sets lead to
     * defined properties.
     * @param deps Array of sets of property path components.
     * @returns {boolean} Whether the target property is defined or not.
     */
    definitionDependencyCheck: function (deps) {
        // browse the dependency entries
        var depsCount = deps.length;
        for (var i = 0; i < depsCount; i++) {
            // grab the current set of path parts
            var pathParts = deps[i];
            // by default assume that the reference object is 'this'
            // and that all parts refer to it
            var referenceObject = this;
            var start = 0;
            // if the first part is an object use it as reference,
            // and consider parts starting from the next one
            if (typeof(pathParts[0]) == 'object') {
                referenceObject = pathParts[0];
                start = 1;
            }
            // browse all the parts
            var pathCount = pathParts.length;
            for (var j = start; j < pathCount; j++) {
                // if we run into an undefined property, game over
                if (typeof(referenceObject[pathParts[j]]) == 'undefined') {
                    return false;
                }
                // incrementally update the reference to the current property
                referenceObject = referenceObject[pathParts[j]];
            }
        }
        // no problems encountered so report all was fine
        return true;
    },

    /**
     * Run through a set of definitions (such as calculators or renderers),
     * check their dependencies and perform custom operations.
     * @param definitions A set of definitions.
     * @param skipDefFunc Function that tests whether this definition should
     *   be skipped. Receives as parameter the name of the definition.
     * @param depMetFunc Function performed when dependencies are met.
     *   Receives as parameters the name and the 'f' function of the definition.
     * @param defDoneFunc Function performed after running a definition, to
     *   determine if that definition was successful. Receives as parameter the
     *   name of the definition.
     * @param logPrefix Informative prefix prepended to console messages.
     */
    definitionsRun: function (definitions, skipDefFunc, depMetFunc, defDoneFunc, logPrefix) {
        // browse the definitions
        for (prop in definitions) {
            // we only want "real" direct properties,
            // and we expect them to be arrays
            if (!definitions.hasOwnProperty(prop)
                || !Object.isArray(definitions[prop])
                ) {
                continue;
            }
            // perform the skip test
            if ((skipDefFunc.bind(this))(prop)) {
                continue;
            }
            // browse through defs for this property
            var defs = definitions[prop];
            var defCount = defs.length;
            for (i = 0; i < defCount; i++) {
                // sanity checks
                if ('undefined' == typeof(defs[i]['dependencies'])) {
                    console.log(logPrefix + prop + ' is missing the dependencies array!');
                    continue;
                }
                if ('function' != typeof(defs[i]['f'])) {
                    console.log(logPrefix + prop + ' is missing the "f" function!');
                    continue;
                }
                // init log
                var logMessage = logPrefix + prop + ' def ' + i + ':';
                // check if all dependencies are met
                var depsMet = (this.definitionDependencyCheck.bind(this))(defs[i].dependencies);
                if (depsMet) {
                    // perform the custom function for dependencies met
                    (depMetFunc.bind(this))(prop, defs[i].f);
                    logMessage += ' deps met; ran;';
                    // test whether the definition has been done
                    if ((defDoneFunc.bind(this))(prop)) {
                        // if so, no need to try the rest of the definitions for this property
                        console.log(logMessage + ' done; skipping rest.');
                        break;
                    }
                    else {
                        console.log(logMessage + ' NOT done.');
                    }
                }
                else {
                    console.log(logMessage + ' deps NOT met.');
                }
            }
        }
    },

    /**
     * Fill-in the values by running through the calculator definitions.
     */
    calculateValues: function () {
        // run through all calculators repeatedly
        do {
            // init value marker
            var anyValuesCalculated = false;
            // run through all calculators once;
            // if any value was set we will be told by the return value
            this.definitionsRun(
                this.calculators,
                // the skip test is to skip values already calculated
                function (prop) { return (typeof(this.values[prop]) != 'undefined'); },
                // set a values entry with the same name as the calculator
                // using the 'f' function
                function (prop, f) {
                    var val = (f.bind(this))();
                    if (null !== val && 'undefined' != typeof(val)) {
                        this.values[prop] = val;
                        anyValuesCalculated = true;
                    }
                },
                // definition done means value is no longer undefined
                function (prop) { return (typeof(this.values[prop]) != 'undefined'); },
                // log prefix
                this.Def.name + ': calc: '
            );
        // keep running through calculators until a run fails to produce any value
        } while (anyValuesCalculated);
    },

    /**
     * Render the bike by running through the renderer definitions.
     */
    renderBike: function () {
        // set main color
        Canvas.context.fillStyle = this.Def.color;
        Canvas.context.strokeStyle = this.Def.color;
        // do a single run through all the renderers
        this.definitionsRun(
            this.renderers,
            // there is no skip test, all renderers are to be performed
            function (prop) { return false; },
            // use the 'f' function to draw
            function (prop, f) { (f.bind(this))(); },
            // definition is always done
            function (prop) { return true; },
            // log prefix
            this.Def.name + ': rend: '
        );
        // print the name on the legend
        Draw.legendAppend(String.fromCharCode(9632) + ' ' + this.Def.description);
    },

    /**
     * Render component prints.
     */
    printLabels: function () {
        // set main color
        Canvas.context.fillStyle = this.Def.color;
        Canvas.context.strokeStyle = this.Def.color;
        // do a single run through all the prints
        this.definitionsRun(
            this.labels,
            // there is no skip test, all renderers are to be performed
            function (prop) { return false; },
            // use the 'f' function to draw
            function (prop, f) { (f.bind(this))(); },
            // definition is always done
            function (prop) { return true; },
            // log prefix
            this.Def.name + ': prnt: '
        );
    },

    /**
     * Run all correctors, in order to fix bike definition values after a wheel
     * level tilt, or to supply missing values which can be calculated.
     */
    correctBikeDefs: function () {
        this.definitionsRun(
            this.correctors,
            // there is no skip test, all correctors are to be performed
            // TODO: if tilt did not take place, only fill-in missing values
            function (prop) { return false; },
            // use the 'f' function to reapply value
            function (prop, f) {
                var val = (f.bind(this))();
                // TODO: only report (or change log level) if delta(old, new) > threshold
                // TODO: threshold = (1 / zoom) for distances, ? for angles (tilt?)
                if (null !== val && 'undefined' != typeof(val)) {
                    if ('undefined' == typeof(this.Def[prop])) {
                        console.log(this.Def.name + ': corr: ' + prop
                            + ' was missing, calculated as ' + val + '.');
                    }
                    else if (val != this.Def[prop]) {
                        console.log(this.Def.name + ': corr: ' + prop
                            + ' corrected to ' + val + ', replaces previous'
                            + ' ' + this.Def[prop] + '.'
                        );
                    }
                    this.Def[prop] = val;
                }
            },
            // definition done means value is no longer undefined
            function (prop) { return (typeof(this.Def[prop]) != 'undefined'); },
            // log prefix
            this.Def.name + ': corr: '
        );
    },

    /**
     * Determine the actual center of the drawn bike area by parsing all
     * coordinates and finding the extreme boundaries.
     */
    calculateBikeCenter: function () {
        var startPoint = this.values['bottomBracket'];
        if (typeof(startPoint) == 'undefined') return;
        // init boundaries to the gravity spot, which is most likely to be
        // somewhere in the middle
        var minX = startPoint[0];
        var maxX = startPoint[0];
        var minY = startPoint[1];
        var maxY = startPoint[1];
        // browse the calculated values
        for (prop in this.values) {
            // only use real direct properties
            // which are also coordinates
            if (this.values.hasOwnProperty(prop)
                && this.isCoordinate(this.values[prop])
            ) {
                // update boundaries
                maxX = Math.max(maxX, this.values[prop][0]);
                minX = Math.min(minX, this.values[prop][0]);
                maxY = Math.max(maxY, this.values[prop][1]);
                minY = Math.min(minY, this.values[prop][1]);
            }
        }
        // place the center spot at the middle of the boundaries
        this.values.centerSpot = [
            Util.toInt(minX + (maxX - minX) / 2),
            Util.toInt(minY + (maxY - minY) / 2)
        ];
    },

    /**
     * Perform custom alignment of this bike to another one.
     * @param otherBike Another Bike object.
     * @param partCode Keyword indicating to which part of the other bike to align.
     */
    alignToBike: function (otherBike, partCode) {
        partCode = partCode || '';
        switch (partCode) {
            // align front hubs horizontally and wheel ground contacts vertically
            case 'front':
                this.alignToBikeHor(otherBike, 'frontWheelHub');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
            // align rear hubs horizontally and wheel ground contacts vertically
            case 'rear':
                this.alignToBikeHor(otherBike, 'rearWheelHub');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
            // overlay head tube top side both vertically and horizontally
            case 'head':
                this.alignToBikeHor(otherBike, 'headTop');
                this.alignToBikeVert(otherBike, 'headTop');
                break;
            // align bottom brackets horizontally and wheel ground contacts vertically
            case 'bb':
            default:
                this.alignToBikeHor(otherBike, 'bottomBracket');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
        }
    },

    /**
     * Wrapper which indicates that all horizontal coordinates are to be aligned.
     * @see alignToBikeGeneric
     * @param otherBike Another Bike object.
     * @param otherReferencePart Value property name to use as reference.
     */
    alignToBikeHor: function(otherBike, otherReferencePart) {
        this.alignToBikeGeneric(otherBike, otherReferencePart, 0);
    },

    /**
     * Wrapper which indicates that all vertical coordinates are to be aligned.
     * @see alignToBikeGeneric
     * @param otherBike Another Bike object.
     * @param otherReferencePart Value property name to use as reference.
     */
    alignToBikeVert: function(otherBike, otherReferencePart) {
        this.alignToBikeGeneric(otherBike, otherReferencePart, 1);
    },

    /**
     * Wrapper which calculates the delta between the reference part of the
     * other bike and the corresponding part in this bike, then runs a mapping
     * function that applies the delta to all coordinates of this bike.
     * @see deltaMap Mapping function that actually applies the delta.
     * @param otherBike Another Bike object.
     * @param otherReferencePart Value property name to use as reference.
     * @param index Coordinate to change (0 is horizontal, 1 is vertical).
     */
    alignToBikeGeneric: function(otherBike, otherReferencePart, index) {
        // sanity checks
        var other = otherBike.values[otherReferencePart];
        if (!this.isCoordinate(other)) return;
        var local = this.values[otherReferencePart];
        if (!this.isCoordinate(local)) return;
        // calculate delta
        var delta = other[index] - local[index];
        // apply delta to local values
        this.deltaMap(delta, index);
    },

    /**
     * Align all this bike's coordinates to a given coordinate pair.
     * @param where Array of two coordinate numbers.
     * @param what Name of the value property that will overlap the target coordinates.
     */
    align: function (where, what) {
        // grab the indicated part
        var part = this.values[what];
        if (!this.isCoordinate(part)) return;
        // shift all coordinates using the difference between the reference
        // coordinates and the targeted part
        this.deltaMap(where[0] - part[0], 0);
        this.deltaMap(where[1] - part[1], 1);
    },

    /**
     * Apply a shift delta value to all the calculated values of this bike.
     * @param delta The shift difference.
     * @param index The coordinate index to modify (0 = horizontal, 1 = vertical).
     */
    deltaMap: function (delta, index) {
        // no sense in doing this for zero delta
        if (0 === delta) return;
        // browse all values
        for (prop in this.values) {
            // we only want real direct properties,
            // and only if they are coordinates
            if (this.values.hasOwnProperty(prop)
                && this.isCoordinate(this.values[prop])
            ) {
                // apply the delta
                this.values[prop][index] += delta;
            }
        }
    },

    /**
     * Center this bike's central spot over the canvas center.
     */
    centerToCanvasCenter: function () {
        this.calculateBikeCenter();
        this.align(Canvas.center, 'centerSpot');
    },

    /**
     * Determine whether a given value name is a coordinate set.
     * @param valueName The name of the value.
     * @returns {boolean} True if it's a coordinate set, false if not.
     */
    isCoordinate: function (valueName) {
        // value must be defined and an array with two entries
        if (typeof(valueName) == 'undefined'
            || !Object.isArray(valueName)
            || valueName.length != 2
        ) {
            return false;
        }
        return true;
    },

    END: null
});
