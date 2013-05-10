var Bike = Class.create(Calculators, Renderers, {

    values: {},

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
