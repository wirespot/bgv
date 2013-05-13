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
                        Util.factor(this.Def.seat_tube) * Math.cos(Util.rad(this.Def.seat_angle))),
                    this.values.bottomBracket[1] - Util.toInt(
                        Util.factor(this.Def.seat_tube) * Math.sin(Util.rad(this.Def.seat_angle)))
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
                    this.values.bottomBracket[0] + Util.factor(this.Def.reach),
                    this.values.bottomBracket[1] - Util.factor(this.Def.stack)
                ];
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
                            / Math.tan(Util.rad(this.Def.seat_angle)),
                    this.values.headTop[1]
                ];
                var ttl = Util.unfactor(this.values.headTop[0] - val[0]);
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
                    this.values.headTop[0] - Util.factor(this.Def.top_tube_length),
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
                    this.values.bottomBracket[0] + Util.factor(Util.toInt(this.Def.reach / 2)),
                    this.values.bottomBracket[1] - Util.factor(Util.toInt(this.Def.stack / 2))
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
                        Math.cos(Util.rad(this.Def.head_angle)) * Util.factor(this.Def.head_tube)
                    ),
                    this.values.headTop[1] + Util.toInt(
                        Math.sin(Util.rad(this.Def.head_angle)) * Util.factor(this.Def.head_tube)
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
                return Util.afar(this.values.headBottom[0], this.values.headBottom[1],
                    Util.factor(this.Def.fork_steerer), Util.rad(this.Def.head_angle - 180)
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
                    this.values.bottomBracket[0] - Util.factor(Util.tri3rd(this.Def.chainstay, this.Def.bb_drop)),
                    this.values.bottomBracket[1] - Util.factor(this.Def.bb_drop)
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
                    this.values.rearWheelHub[1] + Util.factor(this.Def.wheel / 2 + this.Def.tire)
                ];
            }
        }],
        forkStraight: [{
            dependencies: [
                ['Def', 'fork_length'],
                ['Def', 'fork_offset']
            ],
            f: function () {
                return Util.factor(Util.tri3rd(this.Def.fork_length, this.Def.fork_offset));
            }
        }],
        frontWheelHubOffset: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'forkStraight'],
                ['Def', 'head_angle']
            ],
            f: function () {
                return Util.afar(this.values.headBottom[0], this.values.headBottom[1],
                    this.values.forkStraight, Util.rad(this.Def.head_angle)
                );
            }
            }, {
            dependencies: [
                ['Def', 'fork_offset'],
                ['Def', 'head_angle'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                return Util.afar(this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.factor(this.Def.fork_offset), Util.rad(this.Def.head_angle + 90)
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
                return Util.afar(this.values.frontWheelHubOffset[0], this.values.frontWheelHubOffset[1],
                    Util.factor(this.Def.fork_offset), Util.rad(this.Def.head_angle - 90)
                );
            }
        }, {
            dependencies: [
                ['values', 'rearWheelHub'],
                ['Def', 'wheel_base']
            ],
            f: function () {
                return [
                    this.values.rearWheelHub[0] + Util.factor(this.Def.wheel_base),
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
                    this.values.frontWheelHub[1] + Util.factor(this.Def.wheel / 2 + this.Def.tire)
                ];
            }
        }]
    }

};
