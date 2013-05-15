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
 * Various object definitions that supply bike properties. The valid properties
 * and their meaning are described below.
 *
 * @tutorial Feel free to group properties under any name of your choosing. They
 * can describe a bike or various bike pieces. Putting individual pieces in
 * different objects can help you reuse them eg. using the same fork on two
 * different bikes. Please remember that, when combining objects, later
 * properties will override previous ones.
 *
 * @see Object.combine A function that can combine several objects into one.
 *
 * Here is a list of all valid properties. All lengths are to be given in mm,
 * all angles in degrees (360deg per circle). PLEASE NOTE that properties that
 * relate to the vertical or horizontal will be affected and re-defined during
 * level tilt if the wheels are not level for whatever reason (different tire
 * sizes in front vs. rear, a non-default fork etc.) Watch the console for
 * helpful messages regarding such cases.
 *
 * name: A short name used mainly to identify console messages about a certain
 *   bike. Recommended use only on bike definition objects.
 * description: Long bicycle description, will be shown in the legend.
 *   Recommended use only on bike definition objects.
 * color: The color used to draw the bicycle. A non-opaque alpha value is
 *   recommended, so you can see parts from several bikes even when overlapping.
 *   Please note that the color is only applied once, at the start of drawing a
 *   particular bike, so you will NOT be able to use different colors for each
 *   object.
 * reach: The frame "reach" ie. distance between the vertical coordinate of the
 *   bottom bracket and the vertical coordinate of the head-tube top side.
 * stack: The frame "stack" ie. distance between the horizontal coordinate of the
 *   bottom bracket and the horizontal coordinate of the head-tube top side.
 * head_tube: Head tube length.
 * head_angle: Angle that the head tube makes with the horizontal.
 * head_size: The thickness of the head tube.
 * bb_drop: Difference between the horizontal coordinate of the bottom bracket
 *   and the horizontal coordinate of the rear hub.
 * chainstay: Chain stay length.
 * seat_tube: Seat tube length (center to top).
 * seat_angle: Seat tube angle with the horizontal.
 * seat_size: Seat tube outer diameter (as used by post clamp and FD clamp).
 * top_tube_length: Horizontal distance between the head tube top side and the
 *   line of the seat tube. Also called "top tube effective" by manufacturers.
 *   This is NOT the actual top tube length (measured alongside the top tube).
 * wheel_base: Horizontal distance between the spots where the wheels make
 *   ground contact.
 * wheel: Size of the wheel. Typical sizes are 622 for 700C, 28" and 29",
 *   559 for 26", 584 for 27.5" aka 650B, 406 for 20" BMX. See this for more:
 *   http://sheldonbrown.com/tire-sizing.html#iso
 * tire: Size of the tire (in mm or ETRTO, or actual measured thickness).
 *   NOTE that currently you cannot specify a different size for front and rear,
 *   support for this will be added later.
 * fork_length: Distance between the front wheel hub and the head tube bottom
 *   side (the crown). Also known as axle-to-crown distance (ACD).
 * fork_offset: Distance between the front wheel hub and its projection on the
 *   line of the head tube. Also known as fork rake.
 * fork_trail: Distance between the projection of the front wheel hub on the
 *   ground and the place where the head tube line meets the ground.
 * fork_steerer: Length of the fork steerer shaft, measured from the base of the
 *   fork.
 * UNUSED properties: crank_arm, handle_rise, handle_pull.
 */

var Definitions = {

    ktm_lc_w51: {
        name: 'KTM',
        description: 'KTM Leggero Cross Women 51 2011',
        color: 'rgba(255, 0, 0, 0.75)',
        reach: 380,
        stack: 610,
        head_tube: 137,
        head_angle: 70.5,
        bb_drop: 55,
        chainstay: 440,
        seat_tube: 510,
        seat_angle: 73,
        seat_size: 31.8,
        top_tube_length: 565,
        END: null
    },

    commencal_up29: {
        name: 'Commencal',
        description: 'Commencal Velo Uptown CrMo 29er S 2013',
        color: 'rgba(100, 200, 0, 0.75)',
        head_tube: 110,
        head_angle: 69,
        seat_tube: 400,
        seat_angle: 73,
        top_tube_length: 570,
        wheel_base: 1080,
        chainstay: 450,
        bb_drop: 60,
        fork_length: 480,
        END: null
    },

    cobalt_2wS: {
        name: 'Cobalt S',
        description: 'Pinnacle Cobalt 2 Women S 2013',
        color: 'rgba(0, 0, 255, 0.75)',
        reach: 381,
        stack: 582,
        head_tube: 100,
        head_angle: 70.3,
        fork_length: 469,
        fork_offset: 42,
        bb_drop: 60,
        chainstay: 440,
        seat_tube: 400,
        seat_angle: 74.3,
        top_tube_length: 547,
        END: null
    },

    cobalt_2wM: {
        name: 'Cobalt M',
        description: 'Pinnacle Cobalt 2 Women M 2013',
        color: 'rgba(0, 0, 255, 0.75)',
        reach: 393,
        stack: 591,
        head_tube: 110,
        head_angle: 70.3,
        fork_length: 469,
        fork_offset: 42,
        bb_drop: 60,
        chainstay: 440,
        seat_tube: 430,
        seat_angle: 74.3,
        top_tube_length: 562,
        END: null
    },

    cobia_29er_race: {
        name: 'Cobia',
        description: 'Trek Cobia 29er Race M 15.5in 2013',
        color: 'rgba(0, 255, 0, 0.75)',
        reach: 386,
        stack: 602,
        head_tube: 103,
        head_angle: 69.3,
        fork_offset: 51,
        fork_trail: 83,
        bb_drop: 53,
        chainstay: 445,
        seat_tube: 394,
        seat_angle: 73,
        top_tube_length: 570,
        wheel_base: 1090,
        END: null
    },

    specialized_hsd29: {
        name: 'Specialized',
        description: 'Specialized Hardrock Disc Sport 29 15.5in 2013',
        color: 'rgba(180, 0, 255, 0.75)',
        reach: 395,
        stack: 622,
        head_tube: 100,
        head_angle: 70.5,
        bb_drop: 68.5,
        chainstay: 450,
        seat_tube: 394,
        seat_angle: 73,
        wheel_base: 1083,
        END: null
    },

    'seat318': {
        seat_size: 31.8,
        END: null
    },
    'head118': {
        head_size: 28.575, // 1 1/8"
        END: null
    },
    'wheel29er': {
        wheel: 622,
        tire: 55,
        END: null
    },
    'forkSteerer26': {
        fork_steerer: 260,
        END: null
    },
    'forkSurlyOgre': {
        fork_steerer: 260,
        fork_length: 468,
        fork_offset: 43,
        END: null
    },
    'crankSuntour': {
        crank_arm: 175,
        END: null
    },
    'handleFoo': {
        handle_rise: 20,
        handle_pull: 50,
        END: null
    },
    END: null
};
