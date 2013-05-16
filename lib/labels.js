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
 * @see FIXME See how the print definitions are used.
 *
 * @tutorial The definitions must be located under the 'prints' property. The
 * names of the definitions and the return value of function 'f' are not used
 * for anything. The print definitions are only called once each, and are
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
                Draw.partText('TOP TUBE LENGTH ' + this.Def.top_tube_length + 'mm',
                    this.values.ttlSpot[0] + Settings.labels_pad_vertical,
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
                Draw.partText('STACK ' + this.Def.stack + 'mm',
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
                Draw.partText('REACH ' + this.Def.reach + 'mm',
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
                Draw.partText('OFFSET ' + this.Def.fork_offset + 'mm',
                    this.values.frontWheelHub[0]
                        + Util.zoomApply(Settings.hub_radius)
                        + Settings.labels_pad_horizontal,
                    this.values.frontWheelHub[1],
                    Util.degToRad(this.Def.head_angle - 90), 'left');
            }
        }],
        fork_trail: [{
            dependencies: [
                ['Def', 'fork_trail'],
                ['values', 'frontContactPatch']
            ],
            f: function () {
                Draw.partText('TRAIL ' + this.Def.fork_trail + 'mm',
                    this.values.frontContactPatch[0],
                    this.values.frontContactPatch[1] + Settings.labels_font_size,
                    Util.degToRad(0), 'left');
            }
        }],
        wheel_base: [{
            dependencies: [
                ['Def', 'wheel_base'],
                ['values', 'rearContactPatch']
            ],
            f: function () {
                Draw.partText('WHEEL BASE ' + this.Def.wheel_base + 'mm',
                    this.values.rearContactPatch[0],
                    this.values.rearContactPatch[1] + Settings.labels_font_size,
                    Util.degToRad(0), 'left');
            }
        }]
    }

};