var table;
var draw_id = null;
var classes = new Array(
        "ball",
        "Cushion",
        "Game",
        "Pocket",
        "Polygon",
        "Shot",
        "Table",
        "Vector",
		"load"
);

/*var i;
for (i=0; i<classes.length; ++i) {
  document.write( "<script type='text/javascript' src='" + classes[i] + ".js'></script>" );
  console.log(i)
}*/

var shot_enable = false;
function init_pool_table(name){
	   div = document.getElementById(name);
     canvas_name = name + "_canvas";
    if (draw_id) {
        clearInterval( draw_id );
    } 
/*    div = document.getElementById(name);
    canvas_name = name + "_canvas";*/
    function set_drawing_context() {
		if(isAndroid || isIDevice|| isPlaybook|| isTouchPad){
			height  = 650;
			width = 750;
			if( (window.innerWidth   < 750) &&(window.innerWidth  > 300)&&
				(window.innerHeight  < 650) &&(window.innerHeight   > 300) &&(window.innerWidth > window.innerHeight * 1.2 ))
			{
				
				
				height =  window.innerHeight ;
				width =  height *  fixwidth /fixheight ;	

			}
			else{
				height  = 650;
				width = 750;
			}
			tblwidth = orign_table_width* height / fixheight
			
			tblheight = orign_table_height * height / fixheight
	
			tblleft =  orign_table_left * height / fixheight
			tbltop =  orign_table_top * height / fixheight
		
			ball_scale = table_scale/17;
			
			fontscale = (tblheight / tblwidth)* 40;
			
		}
		else{
			height  = 650;
			width = 750;
			if( (window.innerWidth   < 750) &&(window.innerWidth  > 300)&&
				(window.innerHeight  < 650) &&(window.innerHeight   > 300) &&(window.innerWidth > window.innerHeight * 1.2 ))
			{
				

				height =  window.innerHeight ;
				width =  height *  fixwidth /fixheight ;	

			}
			else{
				height  = 650;
				width = 750;
			}
			tblwidth = orign_table_width* height / fixheight
			tblheight = orign_table_height * height / fixheight
	
			tblleft =  orign_table_left * height / fixheight
			tbltop =  orign_table_top * height / fixheight
		
			ball_scale = table_scale/17;
			
			fontscale = (tblheight / tblwidth)* 40;
		}
		canvas_left = -(width/2)/(tblheight);canvas_right = -canvas_left;canvas_top =  -(height/2)/(tblheight);canvas_bottom = -canvas_top;
		table_left = ( tblleft - width/2 )/tblheight;table_top =  ( tbltop - height/2 )/tblheight;	table_right = (tblwidth + tblleft  - width/2 )/tblheight;
		table_bottom_end = (tblheight + tbltop  - height/2 )/tblheight;	table_bottom = 0.85 *table_bottom_end ;
		
		
		cueball_limit = table_left /2;
		blackpostion = {x:table_left /2,y:table_bottom/2 }
		
		startimg_width = canvas_right * 0.46;startimg_height = canvas_bottom * 0.2;startimg_first_x = canvas_left;startimg_first_y = canvas_bottom - startimg_height;	
		
		tiltle_width = canvas_right * 0.6;title_left = canvas_left * 0.3;title_top = canvas_top * 0.81;	title_height = canvas_bottom * 0.13;	
		 pool_width =  canvas_right * 0.6 ; pool_left = canvas_left * 0.3 ; pool_height = canvas_bottom * 0.1; pool_top = canvas_bottom * 0.7;	
	
		alertimg_left = table_left * 0.5;	alertimg_top = table_top * 0.5 ;alertimg_width = table_right ;alertimg_height = (table_bottom_end ) ;
		 
		okimg_left = alertimg_left * 0.4 ;okimg_top = -alertimg_top * 0.5;okimg_width =  alertimg_width * 0.4;okimg_height = alertimg_height * 0.2;
		
		
		scoreimg_width = canvas_right * 0.42;	scoreimg_height =  canvas_bottom * 0.2;scoreimg_first_x = canvas_right * 0.96 - scoreimg_width
		scoreimg_first_y = canvas_bottom - startimg_height;
		
		stateshowimg_width = scoreimg_first_x - startimg_width - startimg_first_x;	stateshowimg_height =  canvas_bottom * 0.12
		stateshowimg_first_x =startimg_width + startimg_first_x;	stateshowimg_first_y =  canvas_bottom - stateshowimg_height;
		
		helpimg_width = canvas_right * 0.25;helpimg_height = canvas_bottom * 0.1;helpimg_first_x = canvas_left * 0.95 ;helpimg_first_y =  canvas_top * 0.98 ;

		 timeleft_x = canvas_right * 0.86;	 timeleft_y =  canvas_top * 0.93;
	
		  outer = ball_scale * pocket_scale * Math.SQRT2  ;

			div = document.getElementById(name);
		canvas_name = name + "_canvas";
		 div.innerHTML = "";
         canvas_html = "<canvas";
        canvas_html += " id=" + canvas_name;
        canvas_html += " width=" + width;
        canvas_html += " height=" + height;
        canvas_html += ">Sorry, your browser doesn't appear to support the HTML-5 Canvas</canvas>";
        div.innerHTML = canvas_html;

         canvas = document.getElementById("pool_table_canvas");
		
        if (!canvas) return;
		
         ctx = canvas.getContext("2d");
        if (!ctx) return;
//			canvas.width = width;
//		canvas.height = height;


		ctx.drawImage(loadimage, loadimg_left, loadimg_top, loadimg_width, loadimg_height);
				
		ctx.fillStyle = "#fff";
		ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,loadimg_width * 0.8,loadimg_height * 0.1);
		ctx.strokeStyle = "#fff";
		ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,loadimg_width * 0.8,loadimg_height * 0.1);

		ctx.fillStyle = "blue";
		ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,  loadimg_width * 0.75  ,loadimg_height * 0.1);

	    ctx.translate( width/2 , height/2 );
        ctx.scale(tblheight, tblheight );

        if (!table) {
            table = new Table();
            table.initialize( game );
        }

    
        table.ctx = ctx;
        var canvas_offset = new Vector(canvas.offsetLeft + width/2,canvas.offsetTop + height/2 );

        function mouse_vec(evt) {
			
			var touchObj ;
			if((evt.type == 'touchstart')||(evt.type == 'touchend')||(evt.type == 'touchmove')){
					touchObj= evt.touches[0];
					if(evt.type == 'touchend'){
						
						 touchObj = evt.changedTouches[0];
					
					}
				var vec = new Vector( touchObj.pageX + window.scrollX, touchObj.pageY + window.scrollY );
			}
			else if((evt.type == 'mousedown')||(evt.type == 'mouseup')||(evt.type == 'mousemove')){
				var vec = new Vector( evt.clientX + window.scrollX, evt.clientY + window.scrollY );
			}
			
            
            vec.subtract( canvas_offset );
            vec.scale_down( tblheight  );

            return vec;
        }

        function mouse_down(evt) {
		//	if(gamestate == "ready")return;
      
			
			evt.stopPropagation();
			evt.preventDefault();
        }

        function mouse_up(evt) {
			var vec = mouse_vec(evt);
			
			checkinput(vec);  
			if(gamestate == "start"){
				 if (table.ball_in_hand) {					
					var cue_ball = table.cue_ball;
					cue_ball.position = vec;
					
					if(vec. x > cueball_limit + cue_ball.radius ){
						cue_ball.position.x = cueball_limit + cue_ball.radius;
						}
						
					if ( cue_ball.is_valid_location(table) ){
						  if(!show_targetting_line){
								show_targetimg = true;
						  }
						table.ball_in_hand = 0;
						shot_enable = true;
						table.begin_shot( mouse_vec(evt) );				
					 }					
				 }
				 else{
					 if(show_whitline != show_targetting_line){
						show_whitline = show_targetting_line
					 }
					 else{
						if(shot_enable){
							table.commit_shot( vec );
							shot_enable = false;
							
						}
						else{
							if(table.begin_shot( mouse_vec(evt) )){	shot_enable = true;}							
						}
					 }
				}
			}
			         
			evt.stopPropagation();
			evt.preventDefault();
        }

        function mouse_move(evt) {
			if(gamestate != "start")return;
            var vec = mouse_vec(evt);
            if (table.ball_in_hand) {
				whiteball_move = true;

				 table.cue_ball.cueball_location(vec);
            }
            else {
				whiteball_move = false;
                table.adjust_shot( vec );
            }
			evt.stopPropagation();
			evt.preventDefault();
        }

		if(isAndroid || isIDevice|| isPlaybook|| isTouchPad){
			canvas.addEventListener( 'touchstart', mouse_down, false );
			canvas.addEventListener( 'touchend', mouse_up, false );
			canvas.addEventListener( 'touchmove', mouse_move, false );
		
		}
		else{
			canvas.addEventListener( 'mousedown', mouse_down, false );
			canvas.addEventListener( 'mouseup', mouse_up, false );
			canvas.addEventListener( 'mousemove', mouse_move, false );
		}
    }

    set_drawing_context();

    if (table) {
        window.onresize = set_drawing_context;
        function draw_fn() {	
			
            table.draw();	
//		if(table.update_id != null)alert(table.update_id);
            if (table.is_stable() && table.update_id != null) {		
			
                clearInterval( table.update_id );
                table.update_id = null;
                table.game.shot_complete();
            }
        }
		
		function checkinput(vec){		
			 if((vec.x > startimg_first_x)&&(vec.x < startimg_first_x + startimg_width )
				&&(vec.y > startimg_first_y)&&(vec.y < startimg_first_y + startimg_height)){
			//	 if(table.shot) return false;				
				 if(gamestate == "start"){		
					gamestate = "quit";
					table.statewave = true;
					table.state_waveindex = 0;
					table.shot = null;
					displayscore = 0;					
					clearInterval( table.update_id );
					table.update_id = null;		
				
					return true;
				}
				else if(gamestate == "ready"){
					gamestate = "start";		
					setTimeout (function(){lifecycle_count();},1000);
					table.initball();
					table.statewave = true;
					table.state_waveindex = 0;
					
					return true;
				}
				
			}
			else if((vec.x > helpimg_first_x)&&(vec.x < helpimg_first_x + helpimg_width )
				&&(vec.y > helpimg_first_y)&&(vec.y < helpimg_first_y + helpimg_height)){				
				 if(show_targetimg){
						show_targetimg = false;
						show_targetting_line = true;
						return;
				}
			}
			else if((vec.x > okimg_left)&&(vec.x < okimg_left + okimg_width )
				&&(vec.y > okimg_top)&&(vec.y < okimg_top + okimg_height)){				
				 if((gamestate == "dead")||(gamestate == "success")||(gamestate == "quit")){		
						table.deleteball();
						return;
				}
			}
			
		}
        draw_id = setInterval( draw_fn, 1000/25 );		

		function lifecycle_count(){
		//	alert(erasetime)
			erasetime++;
			if((erasetime  < lifecycle )&&(gamestate == "start")){
				setTimeout (function(){lifecycle_count();},1000);
			}
			else if(erasetime  >=  lifecycle){			
					table.shot = null;
					displayscore = totalscore + bonus;
					
					 if(show_targetting_line){
						displayscore = totalscore  /2 + bonus;
					
					 }
					 else{
						displayscore = totalscore + bonus;
					}
					
					gamestate = "dead";					
					clearInterval( table.update_id );
                	table.update_id = null;
				
				
			}
		}
    }
}