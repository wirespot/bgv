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
 * Main control code for the application.
 *
 * Usually consists solely of instantiating new Bike objects with parameters
 * combined from Definitions sets.
 */

// Keep the code inside a dom:loaded event hook, so we're sure that all JS files
// have loaded and the canvas was instantiated.
document.observe("dom:loaded", function() {
//Log.setVerbosity(Log.LEVEL_DEBUG);
/*
     var ktm = new Bike(Object
        .combine(Definitions.head118)
        .combine(Definitions.seat318)
        .combine(Definitions.wheel29er)
        .combine(Definitions.crankSuntour)
        .combine(Definitions.ktm_lc_w51)
        .combine(Definitions.forkSteerer26)
        .combine(Definitions.forkSurlyOgre)
    );

*/
/*
    var comm = new Bike(Object
        .combine(Definitions.head118)
        .combine(Definitions.seat318)
        .combine(Definitions.wheel29er)
        .combine(Definitions.crankSuntour)
        .combine(Definitions.commencal_up29)
        .combine(Definitions.forkSteerer26)
    , ktm, 'bb');
);

*/
/*
    var konaXL = new Bike(
        Object
            .combine(Definitions.head118)
            .combine(Definitions.wheelRoad)
            .combine(Definitions.kona_red_xl)
            .combine({labels: false})
    );

    var konaXS = new Bike(
        Object
            .combine(Definitions.head118)
            .combine(Definitions.wheelRoad)
            .combine(Definitions.kona_red_xs)
            .combine({labels: false})
    , konaXL, 'bb');
*/

    var jamis = new Bike(
        Object
            .combine(Definitions.head1)
            .combine(Definitions.wheel26er)
            .combine(Definitions.jamis)
            .combine({labels: true})
    );

/*
         var cobia = new Bike(Object
             .combine(Definitions.head118)
             .combine(Definitions.seat318)
             .combine(Definitions.wheel29er)
             .combine(Definitions.crankSuntour)
             .combine(Definitions.forkSteerer26)
             .combine(Definitions.cobia_29er_race)
         , ktm, 'bb');

         var spec = new Bike(Object
             .combine(Definitions.head118)
             .combine(Definitions.seat318)
             .combine(Definitions.wheel29er)
             .combine(Definitions.crankSuntour)
             .combine(Definitions.forkSteerer26)
             .combine(Definitions.specialized_hsd29)
         , ktm, 'bb');

         var cobalt2 = new Bike(Object
             .combine(Definitions.head118)
             .combine(Definitions.seat318)
             .combine(Definitions.wheel29er)
             .combine(Definitions.crankSuntour)
             .combine(Definitions.forkSteerer26)
             .combine(Definitions.cobalt_2wM)
         , ktm, 'bb');
    */

});
