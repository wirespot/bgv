var Calculators = {

    calculators: {
        bottomBracket: [{
            dependencies: [
                [Canvas, 'center'],
                ['Def', 'reach'],
                ['Def', 'stack']
            ],
            f: function () {
                return [
                    Canvas.center[0] - Util.factor(Util.toInt(this.Def.reach / 2)),
                    Canvas.center[1] + Util.factor(Util.toInt(this.Def.stack / 2))
                ];
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

var Renderers = {

    renderers: {
        gravitySpot: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'gravitySpot']
            ],
            f: function () {
                Draw.disc(this.values.gravitySpot[0], this.values.gravitySpot[1], Settings.center_radius);
            }
        }],
        seatTube: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'seatTubeEnd']
            ],
            f: function () {
                Draw.rectXY(this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.seatTubeEnd[0], this.values.seatTubeEnd[1],
                    this.Def.seat_size ? Util.factor(this.Def.seat_size) : 4);
            }
        }],
        bottomBracket: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                Draw.disc(this.values.bottomBracket[0], this.values.bottomBracket[1],
                    Util.factor(Settings.bb_radius));
            }
        }],
        ttl: [{
            dependencies: [
                ['values', 'headTop'],
                ['values', 'bottomBracket'],
                ['values', 'ttlSpot']
            ],
            f: function () {
                Draw.line(this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.ttlSpot[0], this.values.ttlSpot[1]);
                Draw.line(this.values.headTop[0], this.values.headTop[1],
                    this.values.ttlSpot[0], this.values.ttlSpot[1]);
            }
        }],
        stack: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.line(this.values.bottomBracket[0], this.values.bottomBracket[1], this.values.bottomBracket[0], this.values.headTop[1]);
            }
        }],
        reach: [{
            dependencies: [
                ['values', 'bottomBracket'],
                ['values', 'headTop']
            ],
            f: function () {
                Draw.line(this.values.bottomBracket[0], this.values.headTop[1], this.values.headTop[0], this.values.headTop[1]);
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
                Draw.rectXY(this.values.headTop[0], this.values.headTop[1],
                    this.values.headBottom[0], this.values.headBottom[1],
                    Util.factor(this.Def.head_size)
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
                Draw.rectXY(this.values.steererTop[0], this.values.steererTop[1],
                    this.values.headBottom[0], this.values.headBottom[1],
                    Util.factor(this.Def.head_size * Settings.head_to_steerer)
                );
            }
        }],
        rearWheelHub: [{
            dependencies: [
                [Settings, 'hub_radius'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.disc(this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.factor(Settings.hub_radius));
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
                Draw.rectXY(this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.factor(this.Def.seat_size ? this.Def.seat_size : this.Def.head_size)
                );
            }
        }],
        rearWheel: [{
            dependencies: [
                ['Def', 'wheel'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.circle(this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.factor(this.Def.wheel / 2));
            }
        }],
        rearTire: [{
            dependencies: [
                ['Def', 'wheel'],
                ['Def', 'tire'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.circle(this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.factor(this.Def.wheel / 2 + this.Def.tire));
            }
        }],
        forkStraight: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]);
            }
        }],
        frontWheelHubOffset: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHubOffset'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHubOffset[0], this.values.frontWheelHubOffset[1]);
                Draw.line(this.values.frontWheelHubOffset[0], this.values.frontWheelHubOffset[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]);
            }
        }],
        fork: [{
            dependencies: [
                ['values', 'headBottom'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.line(this.values.headBottom[0], this.values.headBottom[1],
                    this.values.frontWheelHub[0], this.values.frontWheelHub[1]);
            }
        }],
        frontWheelHub: [{
            dependencies: [
                [Settings, 'hub_radius'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.disc(this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.factor(Settings.hub_radius));
            }
        }],
        frontWheel: [{
            dependencies: [
                ['Def', 'wheel'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.circle(this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.factor(this.Def.wheel / 2));
            }
        }],
        frontTire: [{
            dependencies: [
                ['Def', 'wheel'],
                ['Def', 'tire'],
                ['values', 'frontWheelHub']
            ],
            f: function () {
                Draw.circle(this.values.frontWheelHub[0], this.values.frontWheelHub[1],
                    Util.factor(this.Def.wheel / 2 + this.Def.tire));
            }
        }]
    }

};