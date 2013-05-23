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
 * A collection of objects used to correct bike definitions: fill-in missing
 * values that can be calculated, compensate for level tilt etc.
 *
 * @see Calculators Organized identically, see the explanations over there.
 * @see Util.zoomUndo You will have to undo the zoom for most values.
 * @see Bike.correctBikeDefs The function that runs the correctors.
 *
 * @tutorial Corrector definitions are run through only once each. The name of
 * each definition is expected to match the target bike definition property and
 * will be used to set this.Def values. The return value of function 'f' is the
 * value that will be set. Correctors are run after calculators and after level
 * tilt, but before renderers. Another round of calculators will be run if any
 * corrector successfully changed a definition, to catch up on any previously
 * missing values. PLEASE REMEMBER that most values will have to have their zoom
 * reversed.
 */

var Correctors = {
    correctors: {
        name: [{
            dependencies: [],
            f: function () {
                if ('undefined' == typeof(this.Def.name)) {
                    return 'NO_NAME';
                }
                return null;
            }
        }],
        description: [{
            dependencies: [],
            f: function () {
                if ('undefined' == typeof(this.Def.description)) {
                    return 'NO DESCRIPTION';
                }
                return null;
            }
        }],
        color: [{
            dependencies: [],
            f: function () {
                if ('undefined' == typeof(this.Def.color)) {
                    return 'rgba('
                        + parseInt(Math.random() * 255)
                        + ', '
                        + parseInt(Math.random() * 255)
                        + ', '
                        + parseInt(Math.random() * 255)
                        + ', 0.75)';
                }
                return null;
            }
        }],
        stack: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.bottomBracket,
                    [this.values.bottomBracket[0], this.values.headTop[1]]
                ));
            }
        }],
        reach: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.headTop,
                    [this.values.bottomBracket[0], this.values.headTop[1]]
                ));
            }
        }],
        head_tube: [{
            fixed: true,
            dependencies: [
                ['values', 'headTop'],
                ['values', 'headBottom']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.headTop, this.values.headBottom
                ));
            }
        }],
        head_angle: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'headBottom']
            ],
            f: function () {
                return Util.radToDeg(Util.angleBetweenPoints(
                    this.values.headTop, this.values.headBottom
                ));
            }
        }],
        bb_drop: [{
            dependencies: [
                ['values', 'rearWheelHub'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(
                    this.values.bottomBracket[1] - this.values.rearWheelHub[1]
                );
            }
        }, {
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(
                    this.values.bottomBracket[1] - this.values.frontWheelHub[1]
                );
            }
        }, {
            dependencies: [
                ['Def', 'bb_height'],
                ['Def', 'wheel'],
                ['Def', 'tire']
            ],
            f: function () {
                Log.warn('Calculating BB drop from BB height. Please note that this correct ONLY if you used the tires that came with the bicycle.');
                return this.Def.tire + this.Def.wheel / 2 - this.Def.bb_height;
            }
        }, {
            dependencies: [
                ['Def', 'chainstay'],
                ['Def', 'wheel_base'],
                ['Def', 'front_center']
            ],
            f: function () {
                var cos = (Math.pow(this.Def.wheel_base, 2)
                    + Math.pow(this.Def.chainstay, 2)
                    - Math.pow(this.Def.front_center, 2))
                    / (2 * this.Def.chainstay * this.Def.wheel_base);
                var angle = Math.acos(cos);
                return Math.sin(angle) * this.Def.chainstay;
            }
        }],
        chainstay: [{
            fixed: true,
            dependencies: [
                ['values', 'rearWheelHub'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                   this.values.rearWheelHub, this.values.bottomBracket
                ));
            }
        }],
        seat_tube: [{
            fixed: true,
            dependencies: [
                ['values', 'seatTubeEnd'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.bottomBracket, this.values.seatTubeEnd
                ));
            }
        }],
        seat_angle: [{
            dependencies: [
                ['values', 'seatTubeEnd'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                return Util.radToDeg(Util.angleBetweenPoints(
                    this.values.seatTubeEnd, this.values.bottomBracket
                ));
            }
        }],
        top_tube_length: [{
            dependencies: [
                ['values', 'ttlSpot'],
                ['values', 'headTop']
            ],
            f: function () {
                return Util.zoomUndo(this.values.headTop[0] - this.values.ttlSpot[0]);
            }
        }],
        wheel_base: [{
            fixed: true,
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                return Util.zoomUndo(this.values.frontWheelHub[0] - this.values.rearWheelHub[0])
            }
        }],
        fork_length: [{
            fixed: true,
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'headBottom']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.frontWheelHub, this.values.headBottom
                ));
            }
        }],
        fork_offset: [{
            fixed: true,
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'frontWheelHubOffset']
            ],
            f: function () {
                return Util.zoomUndo(Util.absoluteDistanceBetweenPoints(
                    this.values.frontWheelHub, this.values.frontWheelHubOffset
                ));
            }
        }],
        fork_straight: [{
            dependencies: [
                ['Def', 'fork_length'],
                ['Def', 'fork_offset']
            ],
            f: function () {
                return Util.zoomApply(Util.rightTriangleLeg(this.Def.fork_length, this.Def.fork_offset));
            }
        }/*, {
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub'],
                ['Def', 'head_angle'],
                ['Def', 'fork_length']
            ],
            f: function () {
                var fork_angle = Util.angleBetweenPoints(
                    this.values.headBottom, this.values.frontWheelHub);
                var angle = Util.degToRad(this.Def.head_angle) - fork_angle;
                return Util.zoomApply(this.Def.fork_length) * Math.cos(angle);
            }
        }*/],
        fork_trail: [{
            dependencies: [
                ['values', 'forkTrailSpot'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                return Util.zoomUndo(
                    this.values.forkTrailSpot[0] - this.values.frontWheelHub[0]
                );
            }
        }],
        fork_steerer: [{
            fixed: true,
            dependencies: [],
            f: function () {
                if ('undefined' == typeof(this.Def.fork_steerer)) {
                    return 260;
                }
                return null;
            }
        }]
    }
};