// A shot represents a player's turn, from the initial strike of the
// (cue) ball to when the table returns to when all balls are stationary

function Shot( game, ball, point ) {
    this.ball = ball;
    this.start = point;
//	this.point = point;
    this.strength = 0;
    this.angle = point.angle();
    this.game = game;
//    game.begin_shot( this );
}

Shot.prototype.adjust = function ( point ) {
    point.subtract( this.start );
    this.angle = point.angle();
    this.strength = point.magnitude() ;	
    if ( this.strength > .4 ) this.strength = .4;
}

Shot.prototype.commit = function ( point ) {
    this.adjust( point );
    var ball = this.ball;

    var velocity = polar_vector( this.strength* 1.2 * -strength_scaling, this.angle );
    var off_center = this.start.difference(ball.position).scale_down( ball.radius );

    var spin_speed = velocity.unit().dot_product( off_center );
    var spin = velocity.unit().scale( spin_speed );
    if (velocity.is_null()) spin.zero();
    var side = polar_vector( this.strength * masse_scaling, this.angle + Math.PI/2).dot_product( off_center);

    ball.impulse( velocity, spin, side );
    
    this.game.ball_struck();
}
Shot.prototype.is_valid_location = function(){
	var strength = this.strength * strength_scaling/10;
	if(strength < this.ball.radius)return false;
	else 
		return true;
	
}
Shot.prototype.draw = function ( ctx ) {

    var strength = this.strength * strength_scaling/10;

    if (strength < 1) {
		
		// rotation angle is specified in radians

		
			ctx.save(); 	
		ctx.translate( this.start.x + strength * Math.sin( this.angle ),(this.start.y + strength * Math.cos( this.angle ) ) );

		ctx.rotate(-this.angle +  Math.PI / 2)
	 	ctx.beginPath();
		ctx.drawImage(bgimages["pointer"], 0,-0.015,0.7,0.03);
		ctx.closePath();	
		ctx.restore(); 
    }

    if (show_targetting_line) {
		
        var cue_ball = this.ball.position;
		var height;
        ctx.strokeStyle = white;		
        ctx.lineWidth = 0.004;
        ctx.beginPath();
		var axisY = cue_ball.y - 2  * Math.cos( this.angle );
		var axisX = cue_ball.x -2 *  Math.sin( this.angle );
		
		var posX = axisX;
		var posY = axisY;
			//Math.abs
		if(posY < table_top + outer * 1.5){	
			posY = table_top + outer * 1.5;
			posX  =  cue_ball.x + (axisX - cue_ball.x) /  (axisY -cue_ball.y) * ( posY-cue_ball.y);
			
		}	
		else if(posY > table_bottom- outer * 1.5){

			posY = table_bottom - outer * 1.5;
			posX  =  cue_ball.x + (axisX - cue_ball.x) /  (axisY -cue_ball.y) *  ( posY-cue_ball.y);
		}	

		if(posX < table_left+ outer * 1.5){
			posX = table_left+ outer * 1.5
			posY = cue_ball.y + (axisY - cue_ball.y) /  (axisX -cue_ball.x) * ( posX-cue_ball.x);
		}
		else if(posX > table_right - outer){
			posX = table_right - outer * 1.5
			posY = cue_ball.y + (axisY - cue_ball.y) /  (axisX -cue_ball.x) * ( posX-cue_ball.x);
		}	
        ctx.moveTo( cue_ball.x, cue_ball.y );		
        ctx.lineTo(posX, posY );	
        ctx.closePath();
        ctx.stroke();
    }
}
