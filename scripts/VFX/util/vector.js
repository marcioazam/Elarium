// https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js#L146
export class Vector {
    /**
     * @remarks
     * Creates a new instance of an abstract vector.
     *
     * @param x
     * X component of the vector.
     * @param y
     * Y component of the vector.
     * @param z
     * Z component of the vector.
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * @remarks
     * Compares this vector and another vector to one another.
     *
     * @param other
     * Other vector to compare this vector to.
     * @returns
     * True if the two vectors are equal.
     */
    static equals(x, y) {
        return ((x.x === y.x) &&
            (x.y === y.y) &&
            (x.z === y.z));
    }
    /**
     * @remarks
     * Returns the length of this vector.
     *
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * @remarks
     * Returns the squared length of this vector.
     *
     */
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * @remarks
     * Returns this vector as a normalized vector.
     *
     */
    normalized() {
        return Vector.divideScalar(this, this.length() || 1);
    }
    /**
     * @remarks
     * Returns the addition of these vectors.
     *
     */
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    /**
     * @remarks
     * Returns the length of this vector.
     *
     */
    static getLength(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    }
    /**
     * @remarks
     * Returns the cross product of these two vectors.
     *
     */
    static cross(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        return new Vector(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
    }
    /**
     * @remarks
     * Returns the distance between two vectors.
     *
     */
    static distance(a, b) {
        return Math.sqrt(this.distanceSquared(a, b));
    }
    /**
     * @remarks
     * Returns the squared distance between two vectors.
     *
     */
    static distanceSquared(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }
    /**
     * @remarks
     * Returns the component-wise division of these vectors.
     *
     * @throws This function can throw errors.
     */
    static divide(a, b) {
        return new Vector(a.x / b.x, a.y / b.y, a.z / b.z);
    }
    /**
     * @remarks
     * Returns the component-wise division of a vector.
     *
     * @throws This function can throw errors.
     */
    static divideScalar(a, scalar) {
        return this.multiplyScalar(a, 1 / scalar);
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    /**
     * @remarks
     * Returns the linear interpolation between a and b using t as
     * the control.
     *
     */
    static lerp(a, b, t) {
        return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
    }
    /**
     * @remarks
     * Returns a vector that is made from the largest components of
     * two vectors.
     *
     */
    static max(a, b) {
        return new Vector(Math.max(a.x, b.y), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    /**
     * @remarks
     * Returns a vector that is made from the smallest components
     * of two vectors.
     *
     */
    static min(a, b) {
        return new Vector(Math.min(a.x, b.y), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    /**
     * @remarks
     * Returns the component-wise product of these vectors.
     *
     */
    static multiply(a, b) {
        return new Vector(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    /**
     * @remarks
     * Returns the component-wise division of these vectors.
     *
     * @throws This function can throw errors.
     */
    static multiplyScalar(a, scalar) {
        return new Vector(a.x * scalar, a.y * scalar, a.z * scalar);
    }
    /**
     * @remarks
     * Returns the subtraction of these vectors.
     *
     */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static centeredXZ(a) {
        return new Vector(Math.floor(a.x) + 0.5, a.y, Math.floor(a.z) + 0.5);
    }
    toString() {
        return `${this.x.toString()} ${this.y.toString()} ${this.z.toString()}`;
    }
}
/**
 * @remarks
 * A constant vector that represents (0, 0, -1).
 *
 */
Vector.back = new Vector(0, 0, -1);
/**
 * @remarks
 * A constant vector that represents (0, -1, 0).
 *
 */
Vector.down = new Vector(0, -1, 0);
/**
 * @remarks
 * A constant vector that represents (0, 0, 1).
 *
 */
Vector.forward = new Vector(0, 0, 1);
/**
 * @remarks
 * A constant vector that represents (-1, 0, 0).
 *
 */
Vector.left = new Vector(-1, 0, 0);
/**
 * @remarks
 * A constant vector that represents (1, 1, 1).
 *
 */
Vector.one = new Vector(1, 1, 1);
/**
 * @remarks
 * A constant vector that represents (1, 0, 0).
 *
 */
Vector.right = new Vector(1, 0, 0);
/**
 * @remarks
 * A constant vector that represents (0, 1, 0).
 *
 */
Vector.up = new Vector(0, 1, 0);
/**
 * @remarks
 * A constant vector that represents (0, 0, 0).
 *
 */
Vector.zero = new Vector(0, 0, 0);
//# sourceMappingURL=vector.js.map