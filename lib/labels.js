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
 * A collection of definitions used to render text prints next to components.
 *
 * @see Calculators Also read the explanations over there.
 * @see Bike.printLabels See how the print definitions are used.
 *
 * @tutorial The definitions must be located under the 'labels' property. The
 * names of the definitions and the return value of function 'f' are not used
 * for anything. The label definitions are only called once each, and are
 * expected to draw something. These definitions are used after the calculators,
 * after the correctors and after the renderers.
 */

var Labels = {

    labels: {
        top_tube_length: [{
            dependencies: [
                ['Def', 'top_tube_length'],
                ['values', 'headTop'],
                ['values', 'ttlSpot']
            ],
            f: function () {
                var deltaX = 0;
                if (this.values.seatTubeEnd[1] < this.values.headTop[1]) {
                    deltaX = (typeof(this.Def.seat_size) != 'undefined'
                        ? Util.zoomApply(this.Def.seat_size) / 2
                        : Settings.labels_pad_vertical);
                }
                Draw.label('TOP TUBE LENGTH ' + Util.toInt(this.Def.top_tube_length) + 'mm',
                    this.values.ttlSpot[0] + Settings.labels_pad_vertical + deltaX,
                    this.values.headTop[1] - Settings.labels_pad_vertical,
                    Util.degToRad(0), 'left');
            }
        }],
        stack: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'bottomBracket'],
                ['Def', 'stack']
            ],
            f: function () {
                Draw.label('STACK ' + Util.toInt(this.Def.stack) + 'mm',
                    this.values.bottomBracket[0] + Settings.labels_pad_vertical,
                    this.values.bottomBracket[1]
                        - Util.zoomApply(Settings.bb_radius)
                        - Settings.labels_font_size,
                    Util.degToRad(90), 'right');
            }
        }],
        reach: [{
            dependencies: [
                ['Def', 'reach'],
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.label('REACH ' + Util.toInt(this.Def.reach) + 'mm',
                    this.values.bottomBracket[0] + Settings.labels_pad_vertical,
                    this.values.headTop[1] + Settings.labels_font_size,
                    Util.degToRad(0), 'left');
            }
        }],
        fork_offset: [{
            dependencies: [
                [Settings, 'hub_radius'],
                ['Def', 'head_angle'],
                ['Def', 'fork_offset'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                var angle = Util.degToRad(this.Def.head_angle - 90);
                var point = Util.findPoint(this.values.frontWheelHub,
                    Util.zoomApply(Settings.hub_radius) + Settings.labels_pad_vertical,
                    angle
                );
                Draw.label('OFFSET ' + Util.toInt(this.Def.fork_offset) + 'mm',
                    point[0],
                    point[1] + Settings.labels_pad_vertical,
                    angle, 'left');
            }
        }],
        chainstay: [{
            dependencies: [
                ['Def', 'bb_drop'],
                ['Def', 'chainstay'],
                ['values', 'rearWheelHub'],
                [Settings, 'hub_radius']
            ],
            f: function () {
                var angle = Math.asin(this.Def.bb_drop / this.Def.chainstay);
                Draw.label('CHAINSTAY ' + Util.toInt(this.Def.chainstay) + 'mm',
                    this.values.rearWheelHub[0] + Settings.labels_pad_horizontal,
                    this.values.rearWheelHub[1] - Util.zoomApply(Settings.hub_radius),
                    angle, 'left');
            }
        }],
        tire: [{
            dependencies: [
                ['values', 'rearContactPatch'],
                ['Def', 'tire']
            ],
            f: function () {
                Draw.label('TIRE ' + Util.toInt(this.Def.tire) + 'mm',
                    this.values.rearContactPatch[0]
                        + Settings.labels_font_size,
                    this.values.rearContactPatch[1]
                        - Util.zoomApply(this.Def.tire)
                        - Settings.labels_pad_horizontal,
                    -Math.PI / 2, 'left');
            }
        }],
        wheel: [{
            dependencies: [
                ['values', 'rearWheelHub'],
                ['values', 'rearContactPatch'],
                ['Def', 'wheel'],
                [Settings, 'hub_radius']
            ],
            f: function () {
                Draw.label('WHEEL ' + Util.toInt(this.Def.wheel) + 'mm',
                    this.values.rearContactPatch[0]
                        - Settings.labels_pad_vertical,
                    this.values.rearWheelHub[1]
                        + Util.zoomApply(Settings.hub_radius)
                        + Settings.labels_pad_horizontal,
                    -Math.PI / 2, 'right');
            }
        }],
        fork_length: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub'],
                [Settings, 'hub_radius'],
                ['Def', 'fork_length']
            ],
            f: function () {
                var angle = Util.angleBetweenPoints(this.values.headBottom, this.values.frontWheelHub);
                var point = Util.findPoint(this.values.frontWheelHub,
                    Util.zoomApply(Settings.hub_radius) + Settings.labels_pad_horizontal,
                    Math.PI + angle
                );
                Draw.label('AXLE TO CROWN ' + Util.toInt(this.Def.fork_length) + 'mm',
                    point[0] + Settings.labels_pad_horizontal,
                    point[1] + Settings.labels_pad_vertical,
                    angle, 'right');
            }
        }],
        fork_trail: [{
            dependencies: [
                ['Def', 'fork_trail'],
                ['values', 'frontContactPatch']
            ],
            f: function () {
                Draw.label('TRAIL ' + Util.toInt(this.Def.fork_trail) + 'mm',
                    this.values.frontContactPatch[0],
                    this.values.frontContactPatch[1] + Settings.labels_font_size,
                    Util.degToRad(0), 'left');
            }
        }],
        seat_tube: [{
            dependencies: [
                ['Def', 'seat_angle'],
                ['values', 'seatTubeEnd'],
                ['values', 'ttlSpot']
            ],
            f: function () {
                var padding = Settings.labels_pad_vertical
                    + (typeof(this.Def.seat_size) != 'undefined'
                        ? Util.zoomApply(this.Def.seat_size) / 2
                        : Settings.labels_pad_vertical);
                var point = Util.findPoint(this.values.seatTubeEnd,
                    padding, Util.degToRad(this.Def.seat_angle - 90)
                );
                var clash = Util.findPoint(this.values.seatTubeEnd,
                    padding + Settings.labels_font_size + Settings.labels_pad_vertical,
                    Util.degToRad(this.Def.seat_angle - 90)
                );
                if (clash[1] < this.values.ttlSpot[1]) {
                    point = Util.findPoint(point,
                        this.values.ttlSpot[1] - clash[1],
                        Util.degToRad(this.Def.seat_angle)
                    );
                }
                Draw.label('SEAT TUBE ' + Util.toInt(this.Def.seat_tube) + 'mm',
                    point[0], point[1],
                    Util.degToRad(this.Def.seat_angle), 'left');
            }
        }],
        seat_angle: [{
            dependencies: [
                ['Def', 'seat_angle'],
                ['values', 'ttlSpot']
            ],
            f: function () {
                var delta = Settings.labels_font_size
                    + (typeof(this.Def.seat_size) != 'undefined'
                        ? Util.zoomApply(this.Def.seat_size) / 2
                        : Settings.labels_pad_vertical);
                var point = Util.findPoint(this.values.seatTubeEnd,
                    delta, Util.degToRad(this.Def.seat_angle + 90)
                );
                Draw.label(
                    String.fromCharCode(8738) + ' '
                        + Util.fixedFormat(this.Def.seat_angle, 2)
                        + String.fromCharCode(176),
                    point[0], point[1],
                    Util.degToRad(this.Def.seat_angle), 'left');
            }
        }],
        head_tube: [{
            dependencies: [
                ['Def', 'head_tube'],
                ['Def', 'head_angle'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.label('HEAD ' + Util.toInt(this.Def.head_tube) + 'mm',
                    this.values.headTop[0] + Settings.labels_font_size,
                    this.values.headTop[1],
                    Util.degToRad(this.Def.head_angle), 'left');
                Draw.label(
                    String.fromCharCode(8738) + ' '
                        + Util.fixedFormat(this.Def.head_angle, 2)
                        + String.fromCharCode(176),
                    this.values.headTop[0]
                        - Settings.labels_font_size - Settings.labels_pad_horizontal,
                    this.values.headTop[1]
                        + Settings.labels_font_size,
                    Util.degToRad(this.Def.head_angle), 'left');
            }
        }],
        wheel_base: [{
            dependencies: [
                ['Def', 'wheel_base'],
                ['values', 'rearContactPatch']
            ],
            f: function () {
                Draw.label('WHEEL BASE ' + Util.toInt(this.Def.wheel_base) + 'mm',
                    this.values.rearContactPatch[0],
                    this.values.rearContactPatch[1] + Settings.labels_font_size,
                    Util.degToRad(0), 'left');
            }
        }]
    }

};