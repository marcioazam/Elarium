export class Vector {
    /**
     * @param {number|{x: number, y: number, z: number}|Vector} xOrRes
     * @param {number} [y]
     * @param {number} [z]
     */
    constructor(xOrRes, y, z) {
        if (typeof xOrRes === 'number' && y !== undefined && z !== undefined) {
            this.x = xOrRes;
            this.y = y;
            this.z = z;
        } else if (typeof xOrRes === 'object') {
            this.x = xOrRes.x;
            this.y = xOrRes.y;
            this.z = xOrRes.z;
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} res
     * @returns {Vector}
     */
    static create(res) {
        return new Vector(res);
    }

    /**
     * @returns {Vector}
     */
    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    /**
     * @returns {number}
     */
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    add(a) {
        if (typeof a === 'object') {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        } else if (typeof a === 'number') {
            this.x += a;
            this.y += a;
            this.z += a;
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    subtract(a) {
        if (typeof a === 'object') {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        } else if (typeof a === 'number') {
            this.x -= a;
            this.y -= a;
            this.z -= a;
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    multiply(a) {
        if (typeof a === 'object') {
            this.x *= a.x;
            this.y *= a.y;
            this.z *= a.z;
        } else if (typeof a === 'number') {
            this.x *= a;
            this.y *= a;
            this.z *= a;
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    divide(a) {
        if (typeof a === 'object') {
            this.x /= a.x;
            this.y /= a.y;
            this.z /= a.z;
        } else if (typeof a === 'number') {
            this.x /= a;
            this.y /= a;
            this.z /= a;
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {number}
     */
    distance(a) {
        let res = {
            x: this.x,
            y: this.y,
            z: this.z
        };
        if (typeof a === 'object') {
            res.x -= a.x;
            res.y -= a.y;
            res.z -= a.z;
        } else if (typeof a === 'number') {
            res.x -= a;
            res.y -= a;
            res.z -= a;
        } else {
            throw new Error('Invalid arguments');
        }
        return Math.sqrt(Math.pow(res.x, 2) + Math.pow(res.y, 2) + Math.pow(res.z, 2));
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    max(a) {
        if (typeof a === 'object') {
            this.x = Math.max(this.x, a.x);
            this.y = Math.max(this.y, a.y);
            this.z = Math.max(this.z, a.z);
        } else if (typeof a === 'number') {
            this.x = Math.max(this.x, a);
            this.y = Math.max(this.y, a);
            this.z = Math.max(this.z, a);
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector|number} a
     * @returns {Vector}
     */
    min(a) {
        if (typeof a === 'object') {
            this.x = Math.min(this.x, a.x);
            this.y = Math.min(this.y, a.y);
            this.z = Math.min(this.z, a.z);
        } else if (typeof a === 'number') {
            this.x = Math.min(this.x, a);
            this.y = Math.min(this.y, a);
            this.z = Math.min(this.z, a);
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * @returns {Vector}
     */
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
        return this;
    }

    /**
     * @returns {number}
     */
    getMax() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    /**
     * @returns {number}
     */
    getMin() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    /**
     * @returns {Vector}
     */
    normalize() {
        let max = this.clone().abs().getMax();
        return this.divide(max);
    }

    /**
     * @returns {Vector}
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    /**
     * @returns {Vector}
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }

    /**
     * @returns {Vector}
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    /**
     * @returns {Object}
     */
    toRotation(){
        let x = Math.atan2(-this.y, Math.sqrt(this.x * this.x + this.z * this.z))* 180 / Math.PI;
        let y = -Math.atan2(-this.x, -this.z)* 180 / Math.PI + 180;
        if(y > 180) y = -(360 - y);
        return { x: x, y: y };
    }

    // Static methods

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector|number} b
     * @returns {Vector}
     */
    static add(a, b) {
        if (typeof b === 'number') {
            let res = {
                x: a.x + b,
                y: a.y + b,
                z: a.z + b
            };
            return new Vector(res);
        } else if (typeof b === 'object') {
            let res = {
                x: a.x + b.x,
                y: a.y + b.y,
                z: a.z + b.z
            };
            return new Vector(res);
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector} b
     * @returns {Vector}
     */
    static min(a, b) {
        let res = {
            x: Math.min(a.x, b.x),
            y: Math.min(a.y, b.y),
            z: Math.min(a.z, b.x)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector} b
     * @returns {Vector}
     */
    static max(a, b) {
        let res = {
            x: Math.max(a.x, b.x),
            y: Math.max(a.y, b.y),
            z: Math.max(a.z, b.x)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector} b
     * @returns {Vector}
     */
    static subtract(a, b) {
        if (typeof b === 'number') {
            let res = {
                x: a.x - b,
                y: a.y - b,
                z: a.z - b
            };
            return new Vector(res);
        } else if (typeof b === 'object') {
            let res = {
                x: a.x - b.x,
                y: a.y - b.y,
                z: a.z - b.z
            };
            return new Vector(res);
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector|number} b
     * @returns {Vector}
     */
    static multiply(a, b) {
        if (typeof b === 'number') {
            let res = {
                x: a.x * b,
                y: a.y * b,
                z: a.z * b
            };
            return new Vector(res);
        } else if (typeof b === 'object') {
            let res = {
                x: a.x * b.x,
                y: a.y * b.y,
                z: a.z * b.z
            };
            return new Vector(res);
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector|number} b
     * @returns {Vector}
     */
    static divide(a, b) {
        if (typeof b === 'number') {
            let res = {
                x: a.x / b,
                y: a.y / b,
                z: a.z / b
            };
            return new Vector(res);
        } else if (typeof b === 'object') {
            let res = {
                x: a.x / b.x,
                y: a.y / b.y,
                z: a.z / b.z
            };
            return new Vector(res);
        } else {
            throw new Error('Invalid arguments');
        }
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector} b
     * @param {number} c
     * @returns {Vector}
     */
    static mix(a, b, c) {
        let res = {
            x: (a.x * (1-c)) + (b.x * c),
            y: (a.y * (1-c)) + (b.y * c),
            z: (a.z * (1-c)) + (b.z * c)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @param {{x: number, y: number, z: number}|Vector} b
     * @returns {number}
     */
    static distance(a, b) {
        let res = {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        };
        let dist = Math.sqrt(Math.pow(res.x, 2) + Math.pow(res.y, 2) + Math.pow(res.z, 2));
        return dist;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} res
     * @returns {number}
     */
    static getLength(res) {
        let dist = Math.sqrt(Math.pow(res.x, 2) + Math.pow(res.y, 2) + Math.pow(res.z, 2));
        return dist;
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {Vector}
     */
    static normalize(a) {
        let max = Vector.abs(a).getMax();
        let b = {
            x: a.x / max,
            y: a.y / max,
            z: a.z / max
        };
        return new Vector(b);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {Vector}
     */
    static abs(a) {
        let res = {
            x: Math.abs(a.x),
            y: Math.abs(a.y),
            z: Math.abs(a.z)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {Vector}
     */
    static round(a) {
        let res = {
            x: Math.round(a.x),
            y: Math.round(a.y),
            z: Math.round(a.z)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {Vector}
     */
    static ceil(a) {
        let res = {
            x: Math.ceil(a.x),
            y: Math.ceil(a.y),
            z: Math.aceilbs(a.z)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {Vector}
     */
    static floor(a) {
        let res = {
            x: Math.floor(a.x),
            y: Math.floor(a.y),
            z: Math.floor(a.z)
        };
        return new Vector(res);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {number}
     */
    static getMax(a) {
        return Math.max(Math.max(a.x, a.y), a.z);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} a
     * @returns {number}
     */
    static getMin(a) {
        return Math.min(Math.min(a.x, a.y), a.z);
    }

    /**
     * @param {{x: number, y: number, z: number}|Vector} vector
     * @returns {Object}
     */

    static toRotation(vector){
        let x = Math.atan2(-vector.y, Math.sqrt(vector.x * vector.x + vector.z * vector.z))* 180 / Math.PI;
        let y = -Math.atan2(-vector.x, -vector.z)* 180 / Math.PI + 180;
        if(y > 180) y = -(360 - y);
        return { x: x, y: y };
    }
}
