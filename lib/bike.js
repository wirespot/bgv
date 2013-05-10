/**
 *
 */
var Bike = Class.create(
{
    Loc: {}, // locations; arrays with an X and an Y
    Dim: {}, // dimensions: integers or floats

    initialize: function (bikeDef, relBike, relPosition) {
        // clear internal members
        this.Loc = {};
        this.Dim = {};
        // bike definition
        if (typeof(bikeDef) !== 'object') {
            die('Bike definition is not an object:', bikeDef);
        }
        this.Def = bikeDef;
        // compute locations
        this.calculator();
        //FIXME: check if wheel base is level
        // align to relative bike, if any
        if (typeof(relBike) === 'object') {
            this.alignVert(relBike, 'frontWheelHub');
            switch (relPosition) {
                case 'front':
                    this.alignHor(relBike, 'frontWheelHub');
                    break;
                case 'rear':
                    this.alignHor(relBike, 'rearWheelHub');
                    break;
                default:
                    this.alignHor(relBike, 'bottomBracket');
                    break;
            }
        }
        // draw bike
        this.render();
    },

    alignHor: function(relBike, referenceLoc) {
        this.align(relBike, referenceLoc, 0);
    },

    alignVert: function(relBike, referenceLoc) {
        this.align(relBike, referenceLoc, 1);
    },

    align: function(relBike, referenceLoc, index) {
        if (relBike.Loc[referenceLoc][index] == this.Loc[referenceLoc][index]) {
            return;
        }
        var delta = this.Loc[referenceLoc][index] - relBike.Loc[referenceLoc][index];
        for (prop in this.Loc) {
            if (!this.Loc.hasOwnProperty(prop)) continue;
            this.Loc[prop][index] -= delta;
        }
    },

    calculator: function() {
        // bottomBracket is at bottom-right of the reach/stack box
        this.Loc.bottomBracket = [
            Canvas.center[0] - Util.factor(Util.toInt(this.Def.reach / 2)),
            Canvas.center[1] + Util.factor(Util.toInt(this.Def.stack / 2))
        ];
        // head top is at top-right of the reach/stack box
        this.Loc.headTop = [
            Canvas.center[0] + Util.factor(Util.toInt(this.Def.reach / 2)),
            Canvas.center[1] - Util.factor(Util.toInt(this.Def.stack / 2))
        ];
        // head bottom is found using head angle and tube
        this.Loc.headBottom = [
            this.Loc.headTop[0] + Util.toInt(
                Math.cos(Util.rad(this.Def.head_angle)) * Util.factor(this.Def.head_tube)
            ),
            this.Loc.headTop[1] + Util.toInt(
                Math.sin(Util.rad(this.Def.head_angle)) * Util.factor(this.Def.head_tube)
            )
        ];
        // steerer top is found using head tube bottom, head angle, and steerer length
        this.Loc.steererTop = Util.afar(this.Loc.headBottom[0], this.Loc.headBottom[1],
            Util.factor(this.Def.fork_steerer), Util.rad(this.Def.head_angle - 180)
        );
        // rear wheel hub
        this.Loc.rearWheelHub = [
            this.Loc.bottomBracket[0] - Util.factor(Util.tri3rd(this.Def.chainstay, this.Def.bb_drop)),
            this.Loc.bottomBracket[1] - Util.factor(this.Def.bb_drop)
        ];
        // front hub
        this.Dim.forkStraight = Util.factor(Util.tri3rd(this.Def.fork_length, this.Def.fork_offset));
        this.Loc.frontWheelHubOffset = Util.afar(this.Loc.headBottom[0], this.Loc.headBottom[1],
            this.Dim.forkStraight, Util.rad(this.Def.head_angle)
        );
        this.Loc.frontWheelHub = Util.afar(this.Loc.frontWheelHubOffset[0], this.Loc.frontWheelHubOffset[1],
            Util.factor(this.Def.fork_offset), Util.rad(this.Def.head_angle - 90)
        );
    },

    render: function () {
        // set main color
        Canvas.context.fillStyle = this.Def.color;
        Canvas.context.strokeStyle = this.Def.color;
        // bottom bracket
        Draw.disc(this.Loc.bottomBracket[0], this.Loc.bottomBracket[1], Util.factor(Settings.bb_radius));
        // head top
        Draw.pixel(this.Loc.headTop[0], this.Loc.headTop[1]);
        // draw stack and reach
        Draw.line(this.Loc.bottomBracket[0], this.Loc.bottomBracket[1], this.Loc.bottomBracket[0], this.Loc.headTop[1]);
        Draw.line(this.Loc.bottomBracket[0], this.Loc.headTop[1], this.Loc.headTop[0], this.Loc.headTop[1]);
        // head bottom
        Draw.pixel(this.Loc.headBottom[0], this.Loc.headBottom[1]);
        // steerer top
        Draw.rectXY(this.Loc.steererTop[0], this.Loc.steererTop[1], this.Loc.headBottom[0], this.Loc.headBottom[1], Util.factor(this.Def.head_size * Settings.head_to_steerer));
        // head tube
        Draw.rectXY(this.Loc.headTop[0], this.Loc.headTop[1], this.Loc.headBottom[0], this.Loc.headBottom[1], Util.factor(this.Def.head_size));
        // chainstay
        Draw.rectXY(this.Loc.bottomBracket[0], this.Loc.bottomBracket[1], this.Loc.rearWheelHub[0], this.Loc.rearWheelHub[1], 4);
        // rear wheel hub
        Draw.disc(this.Loc.rearWheelHub[0], this.Loc.rearWheelHub[1], Util.factor(Settings.hub_radius));
        // rear wheel
        Draw.circle(this.Loc.rearWheelHub[0], this.Loc.rearWheelHub[1], Util.factor(this.Def.wheel / 2));
        Draw.circle(this.Loc.rearWheelHub[0], this.Loc.rearWheelHub[1], Util.factor(this.Def.wheel / 2 + this.Def.tire));
        // fork straight and offset
        Draw.line(this.Loc.headBottom[0], this.Loc.headBottom[1],
            this.Loc.frontWheelHubOffset[0], this.Loc.frontWheelHubOffset[1]);
        Draw.line(this.Loc.frontWheelHubOffset[0], this.Loc.frontWheelHubOffset[1],
            this.Loc.frontWheelHub[0], this.Loc.frontWheelHub[1]);
        Draw.line(this.Loc.headBottom[0], this.Loc.headBottom[1],
            this.Loc.frontWheelHub[0], this.Loc.frontWheelHub[1]);
        // front hub
        Draw.disc(this.Loc.frontWheelHub[0], this.Loc.frontWheelHub[1], Util.factor(Settings.hub_radius));
        // front wheel
        Draw.circle(this.Loc.frontWheelHub[0], this.Loc.frontWheelHub[1], Util.factor(this.Def.wheel / 2));
        Draw.circle(this.Loc.frontWheelHub[0], this.Loc.frontWheelHub[1], Util.factor(this.Def.wheel / 2 + this.Def.tire));
    }
});
