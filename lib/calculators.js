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
 * A collection of definitions used to calculate frame locations and dimensions.
 *
 * @tutorial The definitions must be located under the 'calculators' property.
 * Each definition has a name suggestive of a bike part location or dimension.
 * The names are relevant, because they are used to refer to values previously
 * calculated. Each named entry consists of an array of one or more calculator
 * definitions, which will be tried in the order they are defined. Each
 * definition must have a 'dependencies' array, where each entry is an array of
 * property names which form a path to a property that is expected to exist
 * under 'this' in order to satisfy the dependency. If the first entry in the
 * path is an object, the properties will be looked up under that object instead
 * of 'this'. All dependencies must be satisfied in order for the calculator to
 * be used. The actual calculator is defined inside the 'f' function and is
 * expected to return either a dimension (a number), a coordinate (array of two
 * numbers), or null if a value could not be computed for some reason. All
 * definitions are attempted several times, over and over, for as long as each
 * run produces at least one value; this way interdependencies are naturally
 * covered. The calculators are run before correctors and before renderers.
 *
 * @see Bike.calculateValues See how the calculator definitions are used.
 *
 * @example Inside an 'f' function you can have access to calculator-produced
 * values using this.values.calculatorName, and to bike definitions using
 * this.Def.property_name. Dependencies are expressed in the form
 * ['values', 'calculatorName'] and ['Def', 'property_name'], respectivelly.
 */

var Calculators = {

    calculators: {
        bottomBracket: [{
            dependencies: [
                [Canvas, 'center']
            ],
            f: function () {
                return Canvas.center;
            }
        }],
        seatTubeEnd: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['Def', 'seat_angle'],
                ['Def', 'seat_tube']
            ],
            f: function () {
                return [
                    this.values.bottomBracket[0] - Util.toInt(
                        Util.zoomApply(this.Def.seat_tube) * Math.cos(Util.degToRad(this.Def.seat_angle))),
                    this.values.bottomBracket[1] - Util.toInt(
                        Util.zoomApply(this.Def.seat_tube) * Math.sin(Util.degToRad(this.Def.seat_angle)))
                ];
            }
        }],
        headTop: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['Def', 'reach'],
                ['Def', 'stack']
            ],
            f: function () {
                return [
                    this.values.bottomBracket[0] + Util.zoomApply(this.Def.reach),
                    this.values.bottomBracket[1] - Util.zoomApply(this.Def.stack)
                ];
            }
        }, {
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'bottomBracket'],
                ['Def', 'head_angle'],
                ['Def', 'head_tube'],
                ['Def', 'seat_angle'],
                ['Def', 'fork_length'],
                ['Def', 'top_tube_length']
            ],
            f: function () {
                // head top can be found starting from front hub by following
                // the fork, then the head tube; since we know the head tube
                // length and angle, we eliminate it by going to a point
                // displaced from the hub by that length and angle; this will
                // be the center of the search circle with radius fork length;
                // the head top we are looking for is somewhere on this circle
                var circleCenter = Util.findPoint(
                    this.values.frontWheelHub,
                    Util.zoomApply(this.Def.head_tube),
                    Util.degToRad(this.Def.head_angle - 180)
                );
                // next, we define a point to the right of the bb, displaced by
                // the length of the tube top; the head top is somewhere on the
                // line that passes through this point at seat angle, at an
                // unknown distance h from the point we defined
                var linePoint = [
                    this.values.bottomBracket[0]
                        + Util.zoomApply(this.Def.top_tube_length),
                    this.values.bottomBracket[1]
                ];
                // now we use the intersection between that line and the circle
                // to determine that unknown distance h
                var Ax = linePoint[0];
                var Ay = linePoint[1];
                var Bx = circleCenter[0];
                var By = circleCenter[1];
                var R = Util.zoomApply(this.Def.fork_length);
                var beta = Util.degToRad(this.Def.seat_angle);
                var tan = Math.tan(beta);
                // define the parameters for a quadratic equation
                var a = Math.pow(1 / tan, 2) + 1;
                var b = 2 * (Bx - Ax) / tan
                    + 2 * (By - Ay);
                var c = Math.pow((Bx - Ax), 2)
                    + Math.pow((By - Ay), 2)
                    - Math.pow(R, 2);
                var solutions = Util.quadraticSolver(a, b, c);
                if (null === solutions[0] && null === solutions[1]) {
                    // sorry, no solutions;
                    // please double check your wheel base and fork length values
                    return null;
                }
                // the h we want is the bigger solution
                var h = Util.maxArrayValue(solutions);
                // apply h to the line equation to find the head coordinates
                return [Ax - h / tan, Ay - h];
            }
        }],
        ttlSpot: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'bottomBracket'],
                ['Def', 'seat_angle']
            ],
            f: function () {
                var val = [
                    this.values.bottomBracket[0] -
                        (this.values.bottomBracket[1] - this.values.headTop[1])
                            / Math.tan(Util.degToRad(this.Def.seat_angle)),
                    this.values.headTop[1]
                ];
                var ttl = Util.zoomUndo(this.values.headTop[0] - val[0]);
                if ('undefined' == typeof(this.Def.top_tube_length)) {
                    console.log(this.Def.name + ': top tube length calculated at '
                        + ttl + 'mm.');
                }
                else if (ttl != this.Def.top_tube_length) {
                    console.log(this.Def.name + ': calculated top tube length'
                        + ' ' + ttl + 'mm differs from defined value of'
                        + ' ' + this.Def.top_tube_length + 'mm, overwriting it.'
                    );
                }
                this.Def.top_tube_length = ttl;
                return val;
            }
        }, {
            dependencies: [
                ['values', 'headTop'],
                ['Def', 'top_tube_length']
            ],
            f: function () {
                return [
                    this.values.headTop[0] - Util.zoomApply(this.Def.top_tube_length),
                    this.values.headTop[1]
                ];
            }
        }],
        gravitySpot: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['Def', 'reach'],
                ['Def', 'stack']
            ],
            f: function () {
                return [
                    this.values.bottomBracket[0] + Util.zoomApply(Util.toInt(this.Def.reach / 2)),
                    this.values.bottomBracket[1] - Util.zoomApply(Util.toInt(this.Def.stack / 2))
                ];
            }
        }],
        headBottom: [{
            dependencies: [
                ['values', 'headTop'],
                ['Def', 'head_angle'],
                ['Def', 'head_tube']
            ],
            f: function () {
                return [
                    this.values.headTop[0] + Util.toInt(
                        Math.cos(Util.degToRad(this.Def.head_angle)) * Util.zoomApply(this.Def.head_tube)
                    ),
                    this.values.headTop[1] + Util.toInt(
                        Math.sin(Util.degToRad(this.Def.head_angle)) * Util.zoomApply(this.Def.head_tube)
                    )
                ];
            }
        }],
        steererTop: [{
            dependencies: [
                ['Def', 'fork_steerer'],
                ['Def', 'head_angle'],
                ['values', 'headBottom']
            ],
            f: function () {
                return Util.findPoint(
                    this.values.headBottom,
                    Util.zoomApply(this.Def.fork_steerer),
                    Util.degToRad(this.Def.head_angle - 180)
                );
            }
        }],
        rearWheelHub: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['Def', 'chainstay'],
                ['Def', 'bb_drop']
            ],
            f: function () {
                return [
                    this.values.bottomBracket[0] - Util.zoomApply(
                        Util.rightTriangleLeg(this.Def.chainstay, this.Def.bb_drop)
                    ),
                    this.values.bottomBracket[1] - Util.zoomApply(this.Def.bb_drop)
                ];
            }
        }],
        rearContactPatch: [{
            dependencies: [
                ['values', 'rearWheelHub'],
                ['Def', 'wheel'],
                ['Def', 'tire']
            ],
            f: function () {
                return [
                    this.values.rearWheelHub[0],
                    this.values.rearWheelHub[1] +
                        Util.zoomApply(this.Def.wheel / 2 + this.Def.tire)
                ];
            }
        }],
        forkStraight: [{
            dependencies: [
                ['Def', 'fork_length'],
                ['Def', 'fork_offset']
            ],
            f: function () {
                return Util.zoomApply(Util.rightTriangleLeg(this.Def.fork_length, this.Def.fork_offset));
            }
        }, {
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
                // TODO: right here we can also calculate fork_offset
                return Util.zoomApply(this.Def.fork_length) * Math.cos(angle);
            }
        }],
        frontWheelHubOffset: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'forkStraight'],
                ['Def', 'head_angle']
            ],
            f: function () {
                return Util.findPoint(
                    this.values.headBottom,
                    this.values.forkStraight,
                    Util.degToRad(this.Def.head_angle)
                );
            }
            }, {
            dependencies: [
                ['Def', 'fork_offset'],
                ['Def', 'head_angle'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                return Util.findPoint(
                    this.values.frontWheelHub,
                    Util.zoomApply(this.Def.fork_offset),
                    Util.degToRad(this.Def.head_angle + 90)
                );
            }
        }],
        frontWheelHub: [{
            dependencies: [
                ['values', 'frontWheelHubOffset'],
                ['Def', 'fork_offset'],
                ['Def', 'head_angle']
            ],
            f: function () {
                return Util.findPoint(
                    this.values.frontWheelHubOffset,
                    Util.zoomApply(this.Def.fork_offset),
                    Util.degToRad(this.Def.head_angle - 90)
                );
            }
        }, {
            dependencies: [
                ['values', 'rearWheelHub'],
                ['Def', 'wheel_base']
            ],
            f: function () {
                return [
                    this.values.rearWheelHub[0] + Util.zoomApply(this.Def.wheel_base),
                    this.values.rearWheelHub[1]
                ];
            }
        }],
        frontContactPatch: [{
            dependencies: [
                ['values', 'frontWheelHub'],
                ['Def', 'wheel'],
                ['Def', 'tire']
            ],
            f: function () {
                return [
                    this.values.frontWheelHub[0],
                    this.values.frontWheelHub[1] + Util.zoomApply(this.Def.wheel / 2 + this.Def.tire)
                ];
            }
        }]
    }

};
