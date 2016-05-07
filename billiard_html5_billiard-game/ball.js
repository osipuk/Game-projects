// The "Ball" class represents a pool ball, and its position and motion on the table


function Ball( x, y, radius, color, name,number ) {
    this.position = new Vector(x,y);
    this.velocity = new Vector(0,0);
    this.spin = new Vector(0,0);
    this.side = 0;
    this.acceleration = new Vector(0,0);
    this.radius = radius;
    this.color = color;
    this.name = name;
	this.number = number
}

Ball.prototype.is_stable = function () {
	
    return this.velocity.is_null() && this.spin.is_null();
}

Ball.prototype.draw = function (ctx) {
    ctx.save();	

	if(this.name == "particolor"){
		 ctx.fillStyle = "#FFFFFF";
		 ctx.beginPath();
   		 ctx.arc( this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true );
		
   		 ctx.closePath();
		 ctx.fill();
		var grad = ctx.createRadialGradient(this.position.x - this.radius / 3  ,this.position.y - this.radius / 3, 
										this.radius/6, this.position.x,this.position.y , this.radius);

		grad.addColorStop(0,"#FFFFFF"); 

		grad.addColorStop(1,this.color); 
	
    	ctx.fillStyle = grad;
   		 ctx.beginPath();
   		 ctx.arc( this.position.x, this.position.y, this.radius,-Math.PI * 0.05, Math.PI * 0.55, true );

   		 ctx.closePath();
   		 ctx.fill();
		 
		 ctx.fillStyle = "#FFFFFF";
		 ctx.beginPath();
   		 ctx.arc( this.position.x, this.position.y, this.radius,-Math.PI * 0.45, -Math.PI * 1.05  , true );
		 
   		 ctx.closePath();
		 ctx.fill();
	}
	else{
		var grad = ctx.createRadialGradient(this.position.x - this.radius / 3  ,this.position.y - this.radius / 3, 
										this.radius/6, this.position.x,this.position.y , this.radius);

		grad.addColorStop(0,"#FFFFFF"); 

		grad.addColorStop(1,this.color); 
	
    	ctx.fillStyle = grad;
		
   		 ctx.beginPath();
   		 ctx.arc( this.position.x, this.position.y, this.radius, 0, Math.PI*2, true );
   		 ctx.closePath();
   		 ctx.fill();
	}


    if (this.color == gold) {
		ctx.fillStyle = white;
		ctx.beginPath();
		ctx.arc( this.position.x, this.position.y, this.radius/2.5, 0, Math.PI*2, true );
		ctx.closePath();
		ctx.fill();
    }

    ctx.restore();
}

Ball.prototype.impulse = function ( velocity, spin, side ) {
    this.velocity = velocity;
    this.spin = spin;
    this.side = side;
}

Ball.prototype.speed = function () {
    return this.velocity.magnitude();
}

Ball.prototype.ground_velocity = function () {
    return this.velocity.difference(this.spin);
}

Ball.prototype.angle = function() {
    return this.velocity.angle();
}

Ball.prototype.begin_update = function () {
    this.prev_cushion = this.this_cushion;
    this.this_cushion = null;
    this.position.add_scaled( this.velocity, ball_scale );
    this.acceleration.zero();
}

Ball.prototype.end_update = function ( table ) {
    if (this.position.x < table_left
	    || this.position.x > table_right
	    || this.position.y < table_top
	    || this.position.y > table_bottom
       ) {
			table.game.off_table_balls.push(this);
			this.velocity.zero();
			this.spin.zero();
    }
    else
    {
		this.velocity.add( this.acceleration );
    }
}

Ball.prototype.resolve_cushion_impact = function ( impact ) {
    var speed = impact.dot_product( this.velocity );
    if (speed > 0) {
        this.velocity.add_scaled( impact, -1.5*speed );
    }
	else if (speed <= 0) {
        this.velocity.add_scaled( impact, -0.01);
    }

    this.acceleration.add_scaled( impact.normal(), this.side );

    // reduce energy
    this.velocity.scale(0.9);
    this.side /= 2;
    this.spin.scale_down( 2 );

}

Ball.prototype.do_cushion = function ( table ) {

    if (this.velocity.is_null()) return null;
    for (i in table.cushions) {
		var cushion = table.cushions[i];
        var impact = cushion.ball_impact_vector(this);
        if (impact) {
	  		//  if (cushion != this.prev_cushion) {
			//	  alert("")
					this.resolve_cushion_impact(impact);
	  	//	  }
	 		   this.this_cushion = cushion;
        	    return cushion;
        }
    }
    return null;
}

Ball.prototype.do_friction = function () {
    var velocity = this.ground_velocity();

    var swerve = this.spin.normal().scale( this.side );
    if (swerve.magnitude() > rolling_threshold) {
        velocity.add_scaled(swerve, 30);
        this.side -= rolling_friction * (this.side > 0 ? 1 : -1);
    }

    var speed = velocity.magnitude();
    var acc;

    if (speed > rolling_threshold) {
        acc = skimming_friction;
    }
    else if (speed > static_threshold) {		
        acc = rolling_friction;
        this.spin.zero();
        this.side -= skimming_friction * (this.side > 0 ? 1 : -1);
    }
    else {
        if (this.velocity.magnitude() < static_threshold){ this.velocity.zero();/*alert("")*/}
        if (this.spin.magnitude() < static_threshold) this.spin.zero();
        acc = 0;
    }

    if (acc != 0) {
        this.acceleration.add_scaled( velocity.unit(), -acc );
        this.spin.add_scaled( velocity.unit(), acc );
    }
}
//potted_balls
Ball.prototype.do_collision = function ( other ) {

    if (this.velocity.is_null()){ return false;}

    var separation = this.position.difference( other.position );
    var distance = separation.magnitude();
    if (distance > this.radius * 2) return false;

    var collision_unit = separation.unit();
    var collision_speed = collision_unit.dot_product( this.velocity );

    if (collision_speed < 0) {
        this.acceleration.add_scaled( collision_unit, -collision_speed  );
        other.acceleration.add_scaled( collision_unit, collision_speed  );
    }

    return true;
}

Ball.prototype.is_potted = function (pockets) {
    for (p in pockets) {
        var sep = this.position.distance_from( pockets[p].position );
        if (sep < /*this.radius/2 + */pockets[p].radius) return true;
    }
    return false;
}
Ball.prototype.pottrd_draw = function () {
    for (p in pockets) {
        var sep = this.position.distance_from( pockets[p].position );
        if (sep < /*this.radius/2 + */pockets[p].radius) return true;
    }
    return false;
}

Ball.prototype.find_overlapping_ball = function ( balls ) {
    for (i in balls) {
        var other = balls[i];
        if (this != other ) {
            var sep = this.position.distance_from( other.position );
            if (sep <= this.radius + other.radius) return other;
        }
    }
    return null;
}

Ball.prototype.is_valid_location = function ( table ) {
    if ( this.position.x < table_left){
		return false;
	}
    if ( this.position.x > table_right) {
		return false;
	}
    if ( this.position.y < table_top) {
		return false;
	}
		
    if ( this.position.y > table_bottom) {
		
		return false;
	}
    if ( this.find_overlapping_ball( table.balls ) ) return false;

    for (i in table.cushions) {
		var impact = table.cushions[i].ball_impact_vector(this);
		if (impact){
			return false;
		}
    }

    if (this.is_potted( table.pockets )) return false;

    return true;
}
Ball.prototype.cueball_location  = function ( vec ) {
	
		this.position.x = vec.x;
		this.position.y = vec.y;
		var outer = ball_scale * pocket_scale * 2.2 ;
		
		 if (this.position.x < table_left  + outer + this.radius  || this.position.x > cueball_limit  + this.radius ||
			 this.position.y < table_top + outer + this.radius || this.position.y > table_bottom - outer- this.radius) {
			 
				if (this.position.x < table_left  + outer + this.radius){
					this.position.x = table_left  + outer + this.radius
				}
				else if (this.position.x > cueball_limit  + this.radius){
					this.position.x = cueball_limit + this.radius
				}
				
				if (this.position.y < table_top + outer + this.radius){
					this.position.y =  table_top + outer + this.radius
				}
				else if ( this.position.y > table_bottom - outer- this.radius){
					this.position.y = table_bottom - outer- this.radius
				}
		}
}