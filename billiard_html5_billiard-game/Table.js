// A table is where the action occurs


function Table () {
    this.update_id = null;
    this.shot = null;
};
Table.prototype.initialize = function ( game ) {

	this.shotbegin_wavedraw = false;
	this.shotend_wavedraw = false;
	this.shotbegin_waveindex = 0;
	this.shotend_waveindex = 0;
	this.statewave = false;
	this.state_waveindex = 0;
	this.wavedraw = false;	
    this.balls = new Array();
    this.pockets = new Array();
    this.cushions = new Array();
	this.pottedballs = new Array();
	//this.depth = ball_scale*pocket_scale * 1.1 ;
	this.depth =pocket_scale *  0.03;

	this.pockets.push(new Pocket( table_left + this.depth * 1.6 , table_top + this.depth * 2, this.depth * 0.8 ));
	this.pockets.push(new Pocket( table_left + this.depth * 1.6 ,  table_bottom - this.depth * 2, this.depth * 0.8 ));
	this.pockets.push(new Pocket( table_left * 0.02   , table_top + this.depth * 1.3, this.depth  * 0.8));
	this.pockets.push(new Pocket( table_left * 0.02 ,  table_bottom - this.depth * 1.3, this.depth* 0.8 ));
	this.pockets.push(new Pocket( table_right -  this.depth * 1.6, table_top + this.depth * 2 , this.depth * 0.8));
	this.pockets.push(new Pocket( table_right -  this.depth * 1.6,  table_bottom- this.depth * 2, this.depth* 0.8 ));
	
	this.cushions.push( new Cushion( table_left + this.depth, table_bottom  , Math.PI/2, this.depth * 1.25 ,10.5));
	this.cushions.push( new Cushion( -this.depth * 0.6, table_bottom , Math.PI/2, this.depth* 1.25,10.5 ) );
	
	this.cushions.push( new Cushion(this.depth * 0.3, table_top, -Math.PI/2, this.depth* 1.25,10.5 ) );
	this.cushions.push( new Cushion(table_right - this.depth * 0.8,table_top, -Math.PI/2, this.depth* 1.25,10.5 ) );
	
	this.cushions.push( new Cushion(table_right, table_bottom - this.depth * 1.6 , Math.PI,this.depth * 1.15 ,10) );
	this.cushions.push( new Cushion( table_left, table_top  + this.depth * 1.6 , 0, this.depth * 1.15,10) );
    // cue ball
}
Table.prototype.initball = function (  ) {
	this.cue_ball = new Ball( -.5, 0, ball_scale, white, "cue",16 );
    this.balls.push( this.cue_ball );
	
    this.ball_in_hand = 1;
 //   status_message( "game", game );  
   	this.game = new Game_ball( this );
    this.game.create_balls( ball_scale );
	
	 totalscore = 0;
	 perscore = 5;
	 hitnum = 0;
	 missnum = 0;
	 cuenum = 12;
	 current_cuenum = cuenum;
	 diedball_num = 0;
	 erasetime = 0;
	 gamestate = "start";
	whiteball_move = true;
	show_targetting_line = false;
	bonus  = 0;
	potballs = 0;
	show_targetimg = false;
	shot_enable = false;
	displayscore = 0;
	show_whitline = show_targetting_line;
	
}
Table.prototype.deleteball = function (  ) {
	this.cue_ball = null;
    this.balls = null;
	this.balls = new Array();
	this.pottedballs = null;
	this.pottedballs = new Array();
	  this.shot = null;
    this.ball_in_hand = 0;  
   	this.game =null;
	gamestate = "ready";	
	show_targetimg = false
	 totalscore = 0;
	 perscore = 5;
	 hitnum = 0;
	 missnum = 0;
	 cuenum = 12;
	 current_cuenum = cuenum;
	 diedball_num = 0;
	 erasetime = 0;
	 shot_enable = false;
 
}


Table.prototype.replace_ball = function ( ball ) {

    var x = -0.5;
    var direction = -1;
    var done = 0;
    count = 50;

    while (!done) {
        if (--count == 0) done = 1;
        if (direction == -1 && x < -1+ball.radius) {
            x = -0.5;
            direction = 1;
        }
        else if (direction == 1 && x > 1-ball.radius) {
            x = -0.5;
            // give up
            done = 1;
        }
        else {
            ball.position = new Vector( x, 0 );
            var other = ball.find_overlapping_ball( this.balls );
            if (other != null) {
                var Dy = other.position.y;
                var h = ball.radius + other.radius;
                var Dx = Math.sqrt( h*h - Dy*Dy ) + rack_ball_spacing;
                x = other.position.x + Dx * direction;
            }
            else {
                done = 1;
            }
        }
    }

    ball.position = new Vector( x, 0 );
    this.balls.push(ball);
}

Table.prototype.begin_shot = function ( point ) {

    if (!this.is_stable()){ return false;}

    var cue_ball = this.cue_ball;

    var D = point.difference( cue_ball.position );
    if ( D.squared() > cue_ball.radius *cue_ball.radius * 50 ) {/*alert ("error1");*/return false;}
	this.shotbegin_wavedraw = true;

    this.shot = new Shot( this.game, cue_ball,cue_ball.position /*point*/ );
	return true;
}


Table.prototype.adjust_shot = function ( point ) {
    if (this.shot) {
	//	this.shotend_wavedraw = true;
        this.shot.adjust( point );
    }
}

Table.prototype.commit_shot = function ( point ) {
	var check = false;
    if(this.shot) {	
			if(this.shot.is_valid_location())
			{
				try{
					AudioManager.play("shot");
				}catch(e){ }
			
				this.shot.commit( point );
				this.do_action();
				check = true;
				
			}
				
			this.shot = null;
    }
	return check;
//	this.shotend_wavedraw = false;
}

Table.prototype.draw = function () {
    var ctx = this.ctx;
	ctx.drawImage(bgimages["Environment"],canvas_left ,canvas_top,Math.abs(canvas_left) * 2, Math.abs(canvas_top) * 2);
	

	ctx.drawImage(bgimages["table"],table_left,  table_top, Math.abs( table_left) + table_right , Math.abs( table_top) + table_bottom);

    ctx.drawImage(bgimages["pot"],table_left , table_bottom ,Math.abs( table_left) + table_right,  table_bottom_end - table_bottom );
	  var live_radius = 0.015
		for(var i = 1; i <= cuenum/2; i++){
			ctx.fillStyle = white;
			ctx.beginPath();
			ctx.arc( stateshowimg_first_x + 0.2 +live_radius * (3 * i + 0.5) , stateshowimg_first_y + 4 * live_radius , live_radius, 0, Math.PI*2, true );
			ctx.closePath();
			ctx.fill();
		}	
		var firstx = stateshowimg_first_x + 0.2 +live_radius * (3 *  cuenum/2 + 0.5)
		for(var i = 0; i < diedball_num/2; i++){
			ctx.fillStyle = gray;
			ctx.beginPath();
			ctx.arc(firstx - live_radius * (3 *  i )  , stateshowimg_first_y +4 * live_radius , live_radius, 0, Math.PI*2, true );
			ctx.closePath();
			ctx.fill();
		}
	//	diedball_num = 0;
		if(current_cuenum%2 == 1){
			ctx.fillStyle = white;
			ctx.beginPath();
			ctx.arc( stateshowimg_first_x + 0.2 +live_radius * (3 * (current_cuenum/2  + 0.5)+ 0.5 ) , stateshowimg_first_y + 4 * live_radius
			, live_radius, -Math.PI/2, -Math.PI * 3 / 2, true );
			ctx.closePath();
			ctx.fill();
		}
	
	 if(show_targetimg)			
		ctx.drawImage(bgimages["show_shottarget"],helpimg_first_x,helpimg_first_y,helpimg_width,helpimg_height);
//	current_cuenum
ctx.save();

	ctx.scale( 1/(tblheight),1/( tblheight) );
				ctx.fillStyle = "#000000";
				ctx.font = fontscale +"px   sans-serif";
				ctx.textAlign = "left";


	
	if(gamestate == "ready" ){
		ctx.fillText("New game" ,startimg_first_x *tblheight* 0.97,startimg_first_y *tblheight*1.2);

		
		ctx.fillText("Score:"   ,scoreimg_first_x *tblheight*1.17,scoreimg_first_y *tblheight*1.2);
	}
		
	else if(gamestate != "ready"){
		ctx.fillText("Quit game" ,startimg_first_x *tblheight* 0.97,startimg_first_y *tblheight*1.2);
		ctx.fillText("Score: " + totalscore ,scoreimg_first_x *tblheight* 1.17,scoreimg_first_y *tblheight*1.2);
		ctx.fillStyle = "#FFFFFF";
		ctx.font = fontscale * 0.6 +"px bold  sans-serif";
		ctx.fillText( bonus ,scoreimg_first_x * tblheight* 0.6,stateshowimg_first_y * tblheight * 1.1);
	}

	ctx.fillStyle = darkgreen
	ctx.font = fontscale * 0.8 +"px bold  sans-serif";
	ctx.fillText( (lifecycle -erasetime) ,timeleft_x * tblheight ,timeleft_y * tblheight);
	
	ctx.scale( tblheight, tblheight );
//	ctx.restore();
	if(this.statewave == true){
			for(i = 0; i < this.state_waveindex; i++ ){
					ctx.strokeStyle = darkgreen;
					ctx.lineWidth = 0.004;
				   ctx.beginPath(); 
					ctx.arc( startimg_first_x + startimg_width / 3 , startimg_first_y + startimg_height * 0.7 , 
							i/60  , 0, Math.PI * 2, true );
					ctx.closePath();		
					ctx.stroke();
			}		
			this.state_waveindex ++;
			if(this.state_waveindex > 5){
				this.statewave = false;
				this.state_waveindex = 0;
			}
	}
	
	if(gamestate != "ready"){
			for (ball in this.balls) {
				this.balls[ball].draw( ctx );
			}
			if(this.shotbegin_wavedraw == true){
				for(i = 0; i < this.shotbegin_waveindex; i++ ){
						ctx.strokeStyle = darkgreen;
						ctx.lineWidth = 0.004;
					   ctx.beginPath();
						ctx.arc(  this.cue_ball.position.x, this.cue_ball.position.y,i/60  , 0, Math.PI * 2, true );
						ctx.closePath();		
						ctx.stroke();
				}		
				this.shotbegin_waveindex ++;
				if(this.shotbegin_waveindex > 5){
					this.shotbegin_wavedraw = false;
					this.shotbegin_waveindex = 0;
				}
					
			}
			
	
			if(this.pottedballs.length > 0){
		
				var ball = this.pottedballs[0];
				ball.position.y  = table_bottom_end - 1.2 *  ball.radius;
				if( ball.position.x < table_right-  ball.radius ){
					ball.position.x  +=ball.radius/2;
				}
				else{
					ball.position.x =table_right -  ball.radius;
				}
				ball.draw(ctx);
				var i = 1;		
				while(i < this.pottedballs.length){
					 ball = this.pottedballs[i];
					if(this.pottedballs[i - 1].position.x  > table_left + ball.radius*3){
						ball.position.y  =table_bottom_end - 1.2 *  ball.radius;
						if( ball.position.x < table_right  - (2 * i + 1) * ball.radius ){
							ball.position.x  += ball.radius/2;
						}
						else{
							ball.position.x =  table_right - (2 * i + 1) * ball.radius;
						}
						ball.draw(ctx);
					}
					i++;
				}
			}
			if (this.shot) {
					this.shot.draw( ctx );
			}
			if(gamestate == "success"){
				ctx.drawImage(bgimages["popup"],alertimg_left , alertimg_top ,alertimg_width,  alertimg_height);
				ctx.drawImage(bgimages["ok"],okimg_left , okimg_top ,okimg_width,  okimg_height);
				ctx.scale( 1/(tblheight),1/( tblheight) );
				ctx.fillStyle = "#FFCC00";
				ctx.font = fontscale +"px   sans-serif";
				ctx.textAlign = "left";				
				ctx.fillText("Congratulations!",alertimg_left *tblheight * 0.8 , (alertimg_top + alertimg_height  * 0.3) * tblheight);
				ctx.fillText("Your scored    " + displayscore ,alertimg_left *tblheight  * 0.8 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 1.5  );
				ctx.fillText("Points    "  ,alertimg_left *tblheight  * 0.1 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 3  );
				ctx.fillText("Ok"  ,okimg_left *tblheight  * 0.3 , (okimg_top + okimg_height  * 0.7) *tblheight  );
				ctx.scale( tblheight, tblheight );
				
			}
			else if(gamestate == "dead"){
				ctx.drawImage(bgimages["popup"],alertimg_left , alertimg_top ,alertimg_width,  alertimg_height);
				ctx.drawImage(bgimages["ok"],okimg_left , okimg_top ,okimg_width,  okimg_height);
				ctx.scale( 1/(tblheight),1/( tblheight) );
				ctx.fillStyle = "#FFCC00";
				ctx.font = fontscale +"px   sans-serif";
				ctx.textAlign = "left";
				
				ctx.fillText("    No More Lives!!!",alertimg_left *tblheight * 0.8 , (alertimg_top + alertimg_height  * 0.3) * tblheight);
				ctx.fillText("Your scored    " + displayscore ,alertimg_left *tblheight  * 0.8 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 1.5  );
				ctx.fillText("Points    "  ,alertimg_left *tblheight  * 0.1 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 3  );
				ctx.fillText("Ok"  ,okimg_left *tblheight  * 0.3 , (okimg_top + okimg_height  * 0.7) *tblheight  );
				ctx.scale( tblheight, tblheight );
				
			}
			else if(gamestate == "quit"){
				ctx.drawImage(bgimages["popup"],alertimg_left , alertimg_top ,alertimg_width,  alertimg_height);
				ctx.drawImage(bgimages["ok"],okimg_left , okimg_top ,okimg_width,  okimg_height);
				ctx.scale( 1/(tblheight),1/( tblheight) );
				ctx.fillStyle = "#FFCC00";
				ctx.font = fontscale +"px   sans-serif";
				ctx.textAlign = "left";
				
				ctx.fillText("    You bailed out",alertimg_left *tblheight * 0.8 , (alertimg_top + alertimg_height  * 0.3) * tblheight);
				ctx.fillText("Your scored    " + displayscore ,alertimg_left *tblheight  * 0.8 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 1.5  );
				ctx.fillText("Points    "  ,alertimg_left *tblheight  * 0.1 , (alertimg_top + alertimg_height  * 0.3) *tblheight + fontscale * 3  );
				ctx.fillText("Ok"  ,okimg_left *tblheight  * 0.3 , (okimg_top + okimg_height  * 0.7) *tblheight  );
				ctx.scale( tblheight, tblheight );
				
			}
	} 
		
 	ctx.drawImage(bgimages["title"],title_left , title_top ,tiltle_width,  title_height);
	ctx.drawImage(bgimages["shootpool"],pool_left , pool_top ,pool_width,  pool_height);
}


Table.prototype.update = function () {
    for (i in this.balls) {
        this.balls[i].begin_update();
    }

    for (i in this.balls) {
        var ball_i = this.balls[i];
        for (j in this.balls) {
            if (i != j) {
                var ball_j = this.balls[j];
                if (ball_i.do_collision( ball_j )) {
                    this.game.collision( ball_i, ball_j );
                }
            }
        }
    }

    for (i in this.balls) {
        var ball = this.balls[i];
        var cushion = ball.do_cushion( this );
        if (cushion) {
            this.game.cushion( ball, cushion  );
        }
    }

    for (ball in this.balls) {
        this.balls[ball].do_friction();
    }

    for (ball in this.balls) {
        this.balls[ball].end_update(this);
    }

    var potted = new Array();
    for (i in this.balls) {
        var ball = this.balls[i];
        if (ball.is_potted( this.pockets )) {
            potted.push(i);
        }
    }

    while (potted.length) {//remove  potted ball from balls.
        var i = potted.shift();
   			
        var ball = this.balls[i];
		if(ball.color != white){
			ball.position.x = table_left - ball_scale * pocket_scale * Math.SQRT2 ;
			this.pottedballs.push(ball);
		}
//		else{    this.ball_in_hand = 1;}
        ball.velocity.zero();
        ball.spin.zero();
        this.game.potted( ball );
        this.balls[i] = this.balls[0];
        this.balls.shift();
    }
}
//potted_balls
Table.prototype.is_stable = function () {
    for (i in this.balls) {
        var ball = this.balls[i];
		
        if (!ball.is_stable()) {return false;}
    }
	
    return true;
}

Table.prototype.do_action = function () {

    var table = this;

    function update_fn() {
        table.update();
    }

    if (table.update_id == null) {
		
        table.update_id = setInterval( update_fn, 10 );
		
    }

}
