// JavaScript Document
// A cushion is used to stop a ball moving off the table: when a ball
// collides with a cushion its velocity will be reversed.

function Cushion( x, y, direction, depth,length ) {
    var p = new Polygon( new Vector(x,y) );
    var sqrt2 = Math.SQRT2;
    var pi = Math.PI;



    p.line( depth* 2, direction + Math.PI* 0.25 );
    p.line( 1 - length * depth/sqrt2, direction );
    p.line( depth* 2 , direction - Math.PI* 0.25);

    this.polygon = p;
}

Cushion.prototype.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = green;
    this.polygon.draw(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

Cushion.prototype.ball_impact_vector = function (ball) {

    var points = this.polygon.points; // length == 4
    var i;

    for (i=0; i<points.length; i++) {
        var sep = points[i].difference( ball.position );
        if (sep.magnitude() <= ball.radius) {
            return sep.unit();
        }
    }

    for (i=1; i<points.length; i++) {
        var impact = this.impact_in_line( points[i-1], points[i], ball );
        if (impact) {
            return impact;
        }
    }

    return null;
}

Cushion.prototype.impact_in_line = function ( start, end, ball) {
    var ball_from_start = ball.position.difference( start );
    var line_from_start = end.difference( start );

    var length = line_from_start.magnitude();
    var unit = line_from_start.unit();
    var normal = unit.normal();

    var d1 = ball_from_start.dot_product( unit );

    if ( d1 < 0 ) return null;
    if ( d1 > length * 1.1 ) return null;

    var d2 = Math.abs(ball_from_start.dot_product( normal ));
    if ( d2 > ball.radius * 1.2 ) return null;
//	console.log(normal)
    return normal;
}
