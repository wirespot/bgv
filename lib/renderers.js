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
 * A collection of objects used to render frame components on the canvas.
 *
 * @see Calculators Organized identically, see the explanations over there.
 */

var Renderers = {

    renderers: {
        gravitySpot: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'gravitySpot']
            ],
            f: function () {
                Draw.disc(
                    this.values.gravitySpot[0], this.values.gravitySpot[1],
                    Settings.center_radius
                );
            }
        }],
        seatTube: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'seatTubeEnd']
            ],
            f: function () {
                Draw.rectXY(
                    this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.seatTubeEnd[0], this.values.seatTubeEnd[1],
                    this.Def.seat_size ? Util.zoomApply(this.Def.seat_size) : 4
                );
            }
        }],
        bottomBracket: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                Draw.disc(
                    this.values.bottomBracket[0], this.values.bottomBracket[1],
                    Util.zoomApply(Settings.bb_radius)
                );
            }
        }],
        ttl: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'bottomBracket'],
                ['values', 'ttlSpot']
            ],
            f: function () {
                Draw.line(
                    this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.ttlSpot[0], this.values.ttlSpot[1]
                );
                Draw.line(
                    this.values.headTop[0], this.values.headTop[1],
                    this.values.ttlSpot[0], this.values.ttlSpot[1]
                );
            }
        }],
        stack: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.line(
                    this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.bottomBracket[0], this.values.headTop[1]
                );
            }
        }],
        reach: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.line(
                    this.values.bottomBracket[0], this.values.headTop[1],
                    this.values.headTop[0], this.values.headTop[1]
                );
            }
        }],
        headTop: [{
            dependencies: [
                ['values', 'headTop']
            ],
            f: function () {
                Draw.pixel(this.values.headTop[0], this.values.headTop[1]);
            }
        }
        ],
        headBottom: [{
            dependencies: [
                ['values', 'headBottom']
            ],
            f: function () {
                Draw.pixel(this.values.headBottom[0], this.values.headBottom[1]);
            }
        }
        ],
        head: [{
            dependencies: [
                ['Def', 'head_size'],
                ['values', 'headTop'],
                ['values', 'headBottom']
            ],
            f: function () {
                Draw.rectXY(
                    this.values.headTop[0], this.values.headTop[1],
                    this.values.headBottom[0], this.values.headBottom[1],
                    Util.zoomApply(this.Def.head_size)
                );
            }
        }
        ],
        steererTop: [{
            dependencies: [
                ['Def', 'head_size'],
                [Settings, 'head_to_steerer'],
                ['values', 'steererTop'],
                ['values', 'headBottom']
            ],
            f: function () {
                Draw.rectXY(
                    this.values.steererTop[0], this.values.steererTop[1],
                    this.values.headBottom[0], this.values.headBottom[1],
                    Util.zoomApply(this.Def.head_size * Settings.head_to_steerer)
                );
            }
        }],
        rearWheelHub: [{
            dependencies: [
                [Settings, 'hub_radius'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.disc(
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.zoomApply(Settings.hub_radius)
                );
            }
        }],
        chainstay: [{
            dependencies: [
                ['Def', 'head_size'],
                ['Def', 'seat_size'],
                ['values', 'bottomBracket'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.rectXY(
                    this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.zoomApply(this.Def.seat_size ? this.Def.seat_size : this.Def.head_size)
                );
            }
        }],
        rearWheel: [{
            dependencies: [
                ['Def', 'wheel'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.circle(
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.zoomApply(this.Def.wheel / 2)
                );
            }
        }],
        rearTire: [{
            dependencies: [
                ['Def', 'wheel'],
                ['Def', 'tire'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.circle(
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.zoomApply(this.Def.wheel / 2 + this.Def.tire)
                );
            }
        }],
        forkStraight: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(
                    this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]
                );
            }
        }],
        frontWheelHubOffset: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHubOffset'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(
                    this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHubOffset[0], this.values.frontWheelHubOffset[1]
                );
                Draw.line(
                    this.values.frontWheelHubOffset[0], this.values.frontWheelHubOffset[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]
                );
            }
        }],
        fork: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(
                    this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]
                );
            }
        }],
        frontWheelHub: [{
            dependencies: [
                [Settings, 'hub_radius'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.disc(
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.zoomApply(Settings.hub_radius)
                );
            }
        }],
        frontWheel: [{
            dependencies: [
                ['Def', 'wheel'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.circle(
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.zoomApply(this.Def.wheel / 2)
                );
            }
        }],
        frontTire: [{
            dependencies: [
                ['Def', 'wheel'],
                ['Def', 'tire'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.circle(
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.zoomApply(this.Def.wheel / 2 + this.Def.tire)
                );
            }
        }]
    }

};
