// JavaScript Document
// The "Game" represents the game-state: 4 different games are
// currently supported


function Game() {}
function Game_ctor( game, name, table ) {
    game.name = name;
    game.table = table;

}

Game.prototype.create_ball = function ( x,y, color, name,number ) {
    var radius = ball_scale;
    var ysep = (1 + rack_ball_spacing) * radius * 1;
    var xsep = (1 + rack_ball_spacing) * radius * Math.sqrt(3);
    var table = this.table;

    var Dx = x*xsep + radius * rack_ball_spacing * (Math.random() - 0.5);
    var Dy =   y*ysep + radius * rack_ball_spacing * (Math.random() - 0.5) - 0.03;

    var ball = new Ball( table_left/2 - Dx, Dy, radius, color, name,number );
    table.balls.push( ball );
    return ball;
}


Game.prototype.begin_shot = function ( shot ) {

    this.current_shot = shot;
}

Game.prototype.ball_struck = function () {
    this.first_collision = null;
    this.cushion_since_first_collision = false;
    this.potted_balls = new Array();
    this.off_table_balls = new Array();
    this.potted_cue_ball = false;
    this.required_first_contact = false;
}

Game.prototype.collision = function ( ball1, ball2 ) {
    if (!this.first_collision) {
        var cue_ball = this.table.cue_ball;
        if (ball1 == cue_ball) {
            this.first_collision = ball2;
        }
        else if (ball2 == cue_ball) {
            this.first_collision = ball1;
        }
    }
}

Game.prototype.cushion = function ( ball, cushion ) {
    if (this.first_collision) {
        this.cushion_since_first_collision = true;
    }
}

Game.prototype.potted = function ( ball ) {
    var cue_ball = this.table.cue_ball;
    if ( ball == cue_ball) {
        this.potted_cue_ball = true;

    }
    else {
      
        this.potted_balls.push( ball );

        this.cushion_since_first_collision = true;
    }
}

Game.prototype.replace_balls = function ( balls ) {
    for (i in balls) {
        this.table.replace_ball( balls[i] );
    }
}

Game.prototype.replace_off_table_balls = function () {
    this.replace_balls( this.off_table_balls );
}

Game.prototype.replace_potted_balls = function () {
    this.replace_balls( this.potted_balls );
}

Game.prototype.first_contact_ok = function (ball) {
    var req = this.required_first_contact;
    return !req || req==ball.name;
}

Game.prototype.get_shot_error = function () {

    var table = this.table;
    var error = "";

    if (this.potted_cue_ball) {
        error = "You potted the cue ball";
        var cue_ball = table.cue_ball;
		 cue_ball.velocity.zero();
        cue_ball.spin.zero();
        table.balls.push( cue_ball );
    }
    return error;
}

Game.prototype.shot_complete = function () {

    var error = this.get_shot_error();
    var table = this.table;

    if (error) {
        this.replace_potted_balls();
        table.ball_in_hand = 1;

    }

    this.replace_off_table_balls();

}


function Game_ball( table ) { Game_ctor( this, "8 Ball", table ); }

//status_message

Game_ball.prototype = new Game();


Game_ball.prototype.create_balls = function ( radius ) {

    this.create_ball( -13,  0, yellow, "particolor",2 );//   2

    this.create_ball( -14,  1, red, "singlecolor",1 );//y    1
    this.create_ball( -14, -1, blue, "particolor" ,3);//3

    this.create_ball( -15,  2, fuchion, "particolor",4 );//4
    this.create_ball( -15,  0, black, "eight",8 );
    this.create_ball( -15, -2, blue, "singlecolor",11 );//y  11

    this.create_ball( -16,  3, fuchion, "singlecolor",12 );//y  12
    this.create_ball( -16,  1, darkgreen, "particolor",5 );//5
    this.create_ball( -16, -1, yellow, "singlecolor",10 );//y 10
    this.create_ball( -16, -3, orange, "particolor",6 );//6

    this.create_ball( -17,  4, red, "particolor" ,9);//9
    this.create_ball( -17,  2, brown, "singlecolor",15 );//y   15
    this.create_ball( -17,  0, darkgreen, "singlecolor",13 );//y  13
    this.create_ball( -17, -2, brown, "particolor",7 );//    7
    this.create_ball( -17, -4, orange, "singlecolor",14 );//y  14
	

}
Game_ball.prototype.super_ball_struck = Game.prototype.ball_struck;
Game_ball.prototype.ball_struck = function () {
    this.super_ball_struck();

}

Game_ball.prototype.shot_complete = function () {

    var error = this.get_shot_error();
    var table = this.table;
	if (error) {
        this.replace_potted_balls();
        table.ball_in_hand = 1;
		

    }

		if(this.potted_balls.length > 0){
			 totalscore  +=  this.potted_balls.length * perscore * 2 ;
			 bonus  +=  this.potted_balls.length * perscore  ;
			 potballs ++;
			 if(potballs == 16){
				 gamestate = "succes";
				 if(show_targetting_line){
					 	displayscore = bonus + (lifecycle - erasetime + totalscore  )/2
					
				 }
				 else{
					 displayscore = bonus + (lifecycle - erasetime + totalscore  )
				}			 
				 return;
			 }		 
		}
		 else{
			  totalscore  -=  perscore ;
			  current_cuenum--;		 
			  diedball_num ++;	
		}		
		if(current_cuenum == 0) { 
			gamestate = "dead";
			table.shot = null;			
			 if(show_targetting_line){
					 if(totalscore > 0)
							displayscore = totalscore  /2 + bonus;
					  else
					  		displayscore = totalscore * 2 + bonus;
					
			 }
			 else{
				displayscore = totalscore + bonus
			}
		
			clearInterval( table.update_id );
			table.update_id = null;
			
			/*table.deleteball();*/
			return;
		}
	 this.replace_off_table_balls();
	 if (!error) {
		var cue_ball = this.table.cue_ball;
		var point = new Vector(cue_ball.x,cue_ball.y);
		if(table.begin_shot( point )){	shot_enable = true;}
	 }
	
}



