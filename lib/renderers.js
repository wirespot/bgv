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
 * A collection of definitions used to render frame components on the canvas.
 *
 * @see Calculators Also read the explanations over there.
 * @see Bike.renderBike See how the renderer definitions are used.
 *
 * @tutorial The definitions must be located under the 'renderers' property. The
 * names of the definitions and the return value of function 'f' are not used
 * for anything. The render definitions are only called once each, and are
 * expected to draw something. These definitions are used after the calculators,
 * and after the correctors.
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
                    this.values.gravitySpot,
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
                    this.values.bottomBracket,
                    this.values.seatTubeEnd,
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
                    this.values.bottomBracket,
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
                Draw.dashedLine(this.values.bottomBracket, this.values.ttlSpot);
                Draw.dashedLine(this.values.headTop, this.values.ttlSpot);
            }
        }],
        stack: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.dashedLine(this.values.bottomBracket,
                    [this.values.bottomBracket[0], this.values.headTop[1]]
                );
            }
        }],
        reach: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.dashedLine(this.values.headTop,
                    [this.values.bottomBracket[0], this.values.headTop[1]]
                );
            }
        }],
        headTop: [{
            dependencies: [
                ['values', 'headTop']
            ],
            f: function () {
                Draw.pixel(this.values.headTop);
            }
        }
        ],
        headBottom: [{
            dependencies: [
                ['values', 'headBottom']
            ],
            f: function () {
                Draw.pixel(this.values.headBottom);
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
                    this.values.headTop,
                    this.values.headBottom,
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
                    this.values.steererTop,
                    this.values.headBottom,
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
                    this.values.rearWheelHub,
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
                    this.values.bottomBracket,
                    this.values.rearWheelHub,
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
                    this.values.rearWheelHub,
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
                    this.values.rearWheelHub,
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
                Draw.line(this.values.headBottom, this.values.frontWheelHub);
            }
        }],
        frontWheelHubOffset: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHubOffset'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(this.values.headBottom, this.values.frontWheelHubOffset);
                Draw.line(this.values.frontWheelHubOffset, this.values.frontWheelHub);
            }
        }],
        fork: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(this.values.headBottom, this.values.frontWheelHub);
            }
        }],
        forkTrail: [{
            dependencies: [
                ['values', 'frontWheelHub'],
                ['values', 'frontWheelHubOffset'],
                ['values', 'forkTrailSpot'],
                ['values', 'rearContactPatch']
            ],
            f: function () {
                Draw.dashedLine(
                    this.values.forkTrailSpot,
                    [this.values.frontWheelHub[0], this.values.rearContactPatch[1]]
                );
                Draw.dashedLine(
                    this.values.forkTrailSpot,
                    this.values.frontWheelHubOffset
                );
                Draw.dashedLine(
                    this.values.frontWheelHub,
                    [this.values.frontWheelHub[0], this.values.rearContactPatch[1]]
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
                    this.values.frontWheelHub,
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
                    this.values.frontWheelHub,
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
                    this.values.frontWheelHub,
                    Util.zoomApply(this.Def.wheel / 2 + this.Def.tire)
                );
            }
        }]
    }

};
