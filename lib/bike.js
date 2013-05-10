var Bike = Class.create({

    values: {},

    calculators: {
        bottomBracket: [
            {
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
            }
        ],
        headTop: [
            {
                dependencies: [
                    ['values', 'bottomBracket'],
                    ['Def', 'reach'],
                    ['Def', 'stack']
                ],
                f: function () {
                    return [
                        Canvas.center[0] + Util.factor(Util.toInt(this.Def.reach / 2)),
                        Canvas.center[1] - Util.factor(Util.toInt(this.Def.stack / 2))
                    ];
                }
            }
        ],
        headBottom: [
            {
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
            }
        ],
        steererTop: [
            {
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
            }
        ],
        rearWheelHub: [
            {
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
            }
        ],
        forkStraight: [
            {
                dependencies: [
                    ['Def', 'fork_length'],
                    ['Def', 'fork_offset']
                ],
                f: function () {
                    return Util.factor(Util.tri3rd(this.Def.fork_length, this.Def.fork_offset));
                }
            }
        ],
        frontWheelHubOffset: [
            {
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
            },
            {
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
            }
        ],
        frontWheelHub: [
            {
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
            },
            {
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
            }
        ]
    },

    renderers: {
        bottomBracket: [{
            dependencies: [
                [Settings, 'bb_radius'],
                ['values', 'bottomBracket']
            ],
            f: function () {
                Draw.disc(this.values.bottomBracket[0], this.values.bottomBracket[1], Util.factor(Settings.bb_radius));
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
                ['values', 'bottomBracket'],
                ['values', 'rearWheelHub']
            ],
            f: function () {
                Draw.rectXY(this.values.bottomBracket[0], this.values.bottomBracket[1],
                    this.values.rearWheelHub[0], this.values.rearWheelHub[1],
                    Util.factor(this.Def.head_size / 3)
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
    },

    initialize: function (bikeDef, relBike, relPosition) {
        // clear internal members to avoid referential inheritance
        this.values = {};
        // bike definition
        if (typeof(bikeDef) !== 'object') {
            die('Bike definition is not an object:', bikeDef);
        }
        this.Def = bikeDef;
        // compute locations
        this.calculate();
        //FIXME: check if wheel base is level
        // align to relative bike, if any
        if (typeof(relBike) === 'object') {
            this.alignVert(relBike, 'frontWheelHub');
            switch (relPosition) {
                case 'front':
                    this.alignHoriz(relBike, 'frontWheelHub');
                    break;
                case 'rear':
                    this.alignHoriz(relBike, 'rearWheelHub');
                    break;
                default:
                    this.alignHoriz(relBike, 'bottomBracket');
                    break;
            }
        }
        // draw bike
        this.render();
        console.log('done');
    },

    dependencyCheck: function (deps) {
        var depsCount = deps.length;
        for (var i = 0; i < depsCount; i++) {
            var path = deps[i];
            var start = 0;
            var base = this;
            if (typeof(path[0]) == 'object') {
                start = 1;
                base = path[0];
            }
            var pathCount = path.length;
            for (var j = start; j < pathCount; j++) {
                if (typeof(base[path[j]]) == 'undefined') {
                    return false;
                }
                base = base[path[j]];
            }
        }
        return true;
    },

    dependencyRun: function (definitions, depMetFunc, skipTestFunc, prefix) {
        var anyValues = false;
        for (prop in definitions) {
            // skip indirect properties
            if (!definitions.hasOwnProperty(prop)
                || !Object.isArray(definitions[prop])
                ) {
                continue;
            }
            // skip test
            if (skipTestFunc(this.values[prop])) {
                continue;
            }
            // browse through defs for this property
            var defs = definitions[prop];
            var defCount = defs.length;
            for (i = 0; i < defCount; i++) {
                // check if all dependencies met
                var depsMet = (this.dependencyCheck.bind(this))(defs[i].dependencies);
                // if deps met we can calculate the value
                if (depsMet) {
                    (depMetFunc.bind(this))(defs[i].f);
                    anyValues = true;
                    console.log(prefix, prop, 'deps met on def', i, this.values[prop]);
                    break; // no need to try the rest of the defs
                }
                else {
                    console.log(prefix, prop, 'deps NOT met on def', i);
                }
            }
        }
        return anyValues;
    },

    calculate: function () {
        var anyValuesCalculated = false;
        do {
            anyValuesCalculated =
                this.dependencyRun(
                    this.calculators,
                    function (f) {
                        this.values[prop] = (f.bind(this))();
                    },
                    function (x) {
                        return (typeof(x) != 'undefined');
                    },
                    'calc'
                );
        } while (anyValuesCalculated);
    },

    render: function () {
        // set main color
        Canvas.context.fillStyle = this.Def.color;
        Canvas.context.strokeStyle = this.Def.color;
        // render all parts
        this.dependencyRun(
            this.renderers,
            function (f) {
                (f.bind(this))();
            },
            function (x) {
                return false;
            },
            'rend'
        );
    },

    alignHoriz: function(relBike, referenceLoc) {
        this.align(relBike, referenceLoc, 0);
    },

    alignVert: function(relBike, referenceLoc) {
        this.align(relBike, referenceLoc, 1);
    },

    align: function(relBike, referenceLoc, index) {
        var ref = relBike.values[referenceLoc];
        if (typeof(ref) == 'undefined'
            || !Object.isArray(ref)
            || ref.length != 2
            ) {
            return;
        }
        var loc = this.values[referenceLoc];
        if (typeof(loc) == 'undefined'
            || !Object.isArray(loc)
            || loc.length != 2
            ) {
            return;
        }
        if (ref[index] == loc[index]) {
            return;
        }
        loc[index] -= loc[index] - ref[index];
    },

    END: null
});
