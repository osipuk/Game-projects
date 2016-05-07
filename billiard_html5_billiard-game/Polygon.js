// Generic polygon is a collection of points (which can be drawn to a context)

function Polygon (start) {
    this.points = new Array();
    this.points.push(start);
}

Polygon.prototype.move = function( length, angle ) {
    var vec = polar_vector( length, angle );
    return this.points[ this.points.length - 1].add(vec);
};

Polygon.prototype.line = function( length, angle ) {
    var p = this.points.pop();
    this.points.push(p);
    this.points.push(p.clone());
    return this.move( length, angle );
};

Polygon.prototype.draw = function (ctx) {
    var points = this.points;
    var i = 0;
    var p = points[0];
    ctx.beginPath();
    ctx.moveTo( p.x, p.y );
    for (i=1; i<points.length; ++i) {
        p = points[i];
        ctx.lineTo( p.x, p.y );
    }
    ctx.closePath();
}
