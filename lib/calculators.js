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
 * A collection of objects used to calculate frame locations and dimensions.
 *
 * @tutorial The objects must be located under the calculators property. Each
 * object has a name suggestive of a bike part location or dimension. Each
 * object consists of an array of one or more calculator definitions, which will
 * be tried in the order they are defined. Each definition must have a
 * 'dependencies' array, where each entry is an array of property names which
 * form a path to a property which is expected to exist under 'this' in order
 * to satisfy the dependency. If the first entry in the path is an object, the
 * properties will be searched for under that object instead of 'this'. All
 * dependencies must be satisfied in order for the calculator to be used. The
 * actual calculator is defined inside the 'f' function and is expected to
 * return a dimension (a number) or a coordinate (array of two numbers).
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
        }/*, {
            dependencies: [
                ['values', 'frontWheelHub'],
                ['Def', 'head_angle'],
                ['Def', 'head_tube']

                ['values', 'bottomBracket'],
                ['Def', 'seat_angle'],
                ['Def', 'top_tube_length'],
                ['Def', 'fork_length'],
            ],
            f: function () {
                //d = L - E ( Direction vector of ray, from start to end )
                //f = E - C ( Vector from center sphere to ray start )
                // a = d.Dot( d ) ;
                // b = 2*f.Dot( d ) ;
                // c = f.Dot( f ) - r*r ;

 here are some vb codes:
 circle: (x-a)^2+(y-b)^2=r^2
 line: y=mx+c

 m = (y2-y1)/(x2-x1)
 c = (-m * x1 + y1)

 aprim = (1 + m ^ 2)
 bprim = 2 * m * (c - b) - 2 * a
 cprim = a ^ 2 + (c - b) ^ 2 - r ^ 2

                                //FIXME: find bb to ttlSpot distance
                                var sol = Util.quadraticSolver(
                                    1,
                                    2 * (
                                        (this.values.bottomBracket[0] + Util.zoomApply(this.Def.top_tube_length))
                                            * Math.cos(Util.degToRad(this.Def.seat_angle))
                                        + this.values.bottomBracket[1]
                                            * Math.sin(Util.degToRad(this.Def.seat_angle))
                                        ),
                                    Math.pow((this.values.bottomBracket[0] + Util.zoomApply(this.Def.top_tube_length)), 2)
                                        + Math.pow(this.values.bottomBracket[1], 2)
                                        - 1 / (Math.pow(Util.zoomApply(this.Def.fork_length), 2))
                                );
                // find search circle center
                var searchCircleCenter = Util.findPoint(
                    this.values.frontWheelHub,
                    Util.zoomApply(this.Def.head_tube),
                    Util.degToRad(this.Def.head_angle - 180)
                );
                return null;
            }
        }                */
        ],
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
