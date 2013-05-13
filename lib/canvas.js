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

var CanvasClass = Class.create(
    {
        initialize: function () {
            this.object = $('canvas');
            if (!this.object) {
                die("Canvas element not found, aborting.");
            }
            this.width = this.object.getWidth();
            this.height = this.object.getHeight();
            this.center = [
                Util.toInt(this.width / 2),
                Util.toInt(this.height / 2)
            ];
            this.context = this.object.getContext("2d");
        }
    });
var Canvas = new CanvasClass;
