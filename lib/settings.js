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
 * Collection of application-wide settings, mostly drawing defaults.
 */

var Settings = {
    background: 'rgba(255, 255, 255, 1)', // used for canvas background
    baseColor: 'rgba(0, 0, 0, 0.5)', // used for base stuff such as canvas center marker
    zoom_factor: 0.56, // pixels-per-mm factor
    bb_radius: 34, // used to draw the bottom bracket, 68mm typical diameter
    center_radius: 5, // used to draw the center markers
    hub_radius: 20, // used to draw the hubs
    head_to_steerer: 0.60, // factor of steerer thickness raported to head
    END: null
};