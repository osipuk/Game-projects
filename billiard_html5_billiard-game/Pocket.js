// Pockets are where balls are potted!

function Pocket( x, y, radius ) {
    this.position = new Vector(x,y);
    this.radius = radius;
}

Pocket.prototype.draw = function (ctx) {
    ctx.save();
    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.arc( this.position.x, this.position.y, this.radius, 0, Math.PI*2, true );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
