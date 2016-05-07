// Generic 2-dimensional vector, with various operations

function Vector( x, y ) {
    this.x = x;
    this.y = y;
}

function polar_vector( mag, angle ) {
    return new Vector( mag * Math.sin(angle), mag * Math.cos(angle));
}

Vector.prototype.toString = function () {
    return "[" + this.x + ", " + this.y + " : " + this.magnitude() + " | " + this.angle() + "]";
}

Vector.prototype.clone = function () {
    return new Vector( this.x, this.y );
}

Vector.prototype.dot_product = function ( other ) {
    return this.x*other.x + this.y*other.y;
}

Vector.prototype.squared = function () {
    return this.dot_product(this);
}

Vector.prototype.magnitude = function () {
    return Math.sqrt( this.squared() );
}

Vector.prototype.angle = function () {
    return Math.atan2(this.x, this.y);
}

Vector.prototype.is_null = function () {
    return this.x == 0 && this.y == 0;
}

Vector.prototype.zero = function () {
    this.x = 0;
    this.y = 0;
    return this;
}

Vector.prototype.add = function ( other ) {
    this.x += other.x;
    this.y += other.y;
    return this;
}

Vector.prototype.add_scaled = function ( other, scale ) {
    this.x += other.x * scale;
    this.y += other.y * scale;
    return this;
}

Vector.prototype.subtract = function ( other ) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
}

Vector.prototype.scale = function ( scale ) {
    this.x *= scale;
    this.y *= scale;
    return this;
}

Vector.prototype.scale_down = function ( scale ) {
    this.x /= scale;
    this.y /= scale;
    return this;
}


Vector.prototype.unit = function () {
    return this.clone().scale_down( this.magnitude() );
}

Vector.prototype.normal = function () {
    return new Vector( -this.y, this.x );
}

Vector.prototype.difference = function(other) {
    return this.clone().subtract( other );
}

Vector.prototype.distance_from = function(other) {
    return this.difference(other).magnitude();
}