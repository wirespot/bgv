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
        // alignToBike to other bike, if any
        if (typeof(alignToBike) === 'object') {
            this.alignToBike(alignToBike, alignToPart);
        }
        else {
            this.centerCore();
        }
        // draw bike
        this.render();
        //console.log('bike done');
    },

    checkWheelBase: function () {
        // check we got both spots
        if (!this.isCoordinate(this.values['frontContactPatch'])) return;
        if (!this.isCoordinate(this.values['rearContactPatch'])) return;
        var f = this.values['frontContactPatch'];
        var r = this.values['rearContactPatch'];
        // see if they're not level
        var diff = Util.diff(f[0], f[1], r[0], r[1]);
        if (0 === diff[1]) return false;
        // find angle of rotation using contact patches diffs
        var rotAngle = Math.atan(diff[1] / diff[0]);
        var rotInvCos = 1 - Math.cos(rotAngle);
        var sideAngle = (Math.PI - rotAngle) / 2;
        // level all locations by rotating around rear contact patch
        for (prop in this.values) {
            if (!this.values.hasOwnProperty(prop)
                || !this.isCoordinate(this.values[prop])
                || prop == 'rearContactPatch'
            ) {
                continue;
            }
            var p = this.values[prop];
            var distance = Util.distance(r[0], r[1], p[0], p[1]);
            var pDiff = Util.diff(r[0], r[1], p[0], p[1]);
            var origAngle = Math.atan(pDiff[1] / pDiff[0]);
            var newAngle = origAngle - rotAngle;
            var n = [
                r[0] + distance * Math.cos(newAngle),
                r[1] + distance * Math.sin(newAngle)
            ];
            this.values[prop] = n;
        }
        this.Def['wheel_base'] = Util.unfactor(this.values.frontWheelHub[0] - this.values.rearWheelHub[0]);
        //FIXME: old wheel base comparison
        console.log(this.Def.name + ': Rear wheel not level with front by ' + diff[1] + 'px'
            + ', adjusted angle by ' + Util.deg(rotAngle) + ' deg'
            + ', new wheel base is ' + this.Def['wheel_base'] + 'mm.');
        return true;
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

    calculateCenter: function () {
        // determine actual center by parsing all coordinates and finding max and min
        var minX = this.values.gravitySpot[0];
        var maxX = this.values.gravitySpot[0];
        var minY = this.values.gravitySpot[1];
        var maxY = this.values.gravitySpot[1];
        for (prop in this.values) {
            if (this.values.hasOwnProperty(prop)
                && this.isCoordinate(this.values[prop])
                ) {
                maxX = Math.max(maxX, this.values[prop][0]);
                minX = Math.min(minX, this.values[prop][0]);
                maxY = Math.max(maxY, this.values[prop][1]);
                minY = Math.min(minY, this.values[prop][1]);
            }
        }
        this.values.centerSpot = [
            Util.toInt(minX + (maxX - minX) / 2),
            Util.toInt(minY + (maxY - minY) / 2)
        ];
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
        // print the name
        Draw.legendAppend(this.Def.description);
    },

    alignToBike: function (otherBike, partCode) {
        partCode = partCode || '';
        switch (partCode) {
            case 'front':
                this.alignToBikeHor(otherBike, 'frontWheelHub');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
            case 'rear':
                this.alignToBikeHor(otherBike, 'rearWheelHub');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
            case 'head':
                this.alignToBikeHor(otherBike, 'headTop');
                this.alignToBikeVert(otherBike, 'headTop');
                break;
            case 'bb':
            default:
                this.alignToBikeHor(otherBike, 'bottomBracket');
                this.alignToBikeVert(otherBike, 'rearContactPatch');
                break;
        }
    },

    alignToBikeHor: function(otherBike, targetPart) {
        this.alignToBikeGeneric(otherBike, targetPart, 0);
    },

    alignToBikeVert: function(otherBike, targetPart) {
        this.alignToBikeGeneric(otherBike, targetPart, 1);
    },

    alignToBikeGeneric: function(otherBike, targetPart, index) {
        // establish delta
        var other = otherBike.values[targetPart];
        if (!this.isCoordinate(other)) return;
        var local = this.values[targetPart];
        if (!this.isCoordinate(local)) return;
        var delta = other[index] - local[index];
        // apply delta to local values
        this.deltaMap(delta, index);
    },

    align: function (where, what) {
        var part = this.values[what];
        if (!this.isCoordinate(part)) return;
        this.deltaMap(where[0] - part[0], 0);
        this.deltaMap(where[1] - part[1], 1);
    },

    deltaMap: function (delta, index) {
        if (0 === delta) return;
        for (prop in this.values) {
            if (this.values.hasOwnProperty(prop)
                && this.isCoordinate(this.values[prop])
                ) {
                this.values[prop][index] += delta;
            }
        }
    },

    centerCore: function () {
        this.calculateCenter();
        this.align(Canvas.center, 'centerSpot');
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
