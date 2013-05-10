var Bike = Class.create(Calculators, Renderers, {

    values: {},

    initialize: function (bikeDef, alignToBike, alignToPart) {
        // clear internal members to avoid referential inheritance
        this.values = {};
        // bike definition
        if (typeof(bikeDef) !== 'object') {
            die('Bike definition is not an object:', bikeDef);
        }
        this.Def = bikeDef;
        // compute locations
        this.calculate();
        // check if wheel base is level
        this.checkWheelBase();
        // align to other bike, if any
        if (typeof(alignToBike) === 'object') {
            this.alignVert(alignToBike, 'frontWheelHub');
            switch (alignToPart) {
                case 'front':
                    this.alignHoriz(alignToBike, 'frontWheelHub');
                    break;
                case 'rear':
                    this.alignHoriz(alignToBike, 'rearWheelHub');
                    break;
                default:
                    this.alignHoriz(alignToBike, 'bottomBracket');
                    break;
            }
        }
        // draw bike
        this.render();
        //console.log('bike done');
    },

    checkWheelBase: function () {
        //FIXME: calculate and compare contact patches, not hubs!
        //FIXME: this way it will work even with different tires on front/rear
        // check we got both hubs
        if (!this.isCoordinate(this.values['frontWheelHub'])) return;
        if (!this.isCoordinate(this.values['rearWheelHub'])) return;
        // see if they're not level
        var delta = this.values['rearWheelHub'][1] - this.values['frontWheelHub'][1];
        if (0 === delta) return;
        console.log('Rear hub not level with front by', delta, 'px.');
        // FIXME: level all locations by rotating around rear contact patch
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
                    //console.log(prefix, prop, 'deps met on def', i, this.values[prop]);
                    break; // no need to try the rest of the defs
                }
                else {
                    //console.log(prefix, prop, 'deps NOT met on def', i);
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

    alignHoriz: function(otherBike, targetPart) {
        this.align(otherBike, targetPart, 0);
    },

    alignVert: function(otherBike, targetPart) {
        this.align(otherBike, targetPart, 1);
    },

    align: function(otherBike, targetPart, index) {
        // establish delta
        var other = otherBike.values[targetPart];
        if (!this.isCoordinate(other)) return;
        var local = this.values[targetPart];
        if (!this.isCoordinate(local)) return;
        var delta = local[index] - other[index];
        if (0 === delta) return;
        // apply delta to local values
        for (prop in this.values) {
            if (this.values.hasOwnProperty(prop)
                && this.isCoordinate(this.values[prop])
            ) {
                this.values[prop][index] -= delta;
            }
        }
    },

    isCoordinate: function (valueName) {
        if (typeof(valueName) == 'undefined'
            || !Object.isArray(valueName)
            || valueName.length != 2
        ) {
            return false;
        }
        return true;
    },

    END: null
});
