var bgimages = null;
bgimages = {};

var displayscore = 0;var gamestate = "ready";//start,dead,succes,quit
var totalscore = 0;var perscore = 5;var bonus  = 0;var hitnum = 0;var missnum = 0;var cuenum = 12;
var current_cuenum = cuenum;var diedball_num = 0;var statewave = false;var potballs = 0;var lifecycle = 240;var erasetime = 0;

var white = "#ffffff";var black = "#000000";var gray = "#808080";var cyan = "#00ffff";var  absgreen = "#00FF00";var red = "#ff0000";var yellow = "#ffff00";
var green = "#00ff00";var orange = "#ffa000";var darkgreen = "#008000";var brown = "#808040";var fuchion = "#FF00FF";var blue = "#0000ff";var purple = "#ff00ff";
var gold = "#ffff80";

var cueball_limit;var blackpostion = null;

var show_targetting_line = 0;var show_targetimg = false;var whiteball_move = false;

var game = "8 Ball";

var table_scale = 0.45;var ball_scale = table_scale/12;var pocket_scale = 1.6;var rack_ball_spacing = 0.01;

var fixwidth = 4167;var fixheight = 3611;
var orign_table_left = 382;var  orign_table_top = 672;var  orign_table_right = 3724;var  orign_table_bottom = 2916;
var orign_table_width = orign_table_right -  orign_table_left;var orign_table_height = orign_table_bottom - orign_table_top;

var skimming_friction = 1/300;
var rolling_threshold = skimming_friction * 10;//friction rate!
var rolling_friction = skimming_friction / 15;
var static_threshold = rolling_friction * 18;



var strength_scaling = 2.5;var masse_scaling = 1;

var alertimg_left;var alertimg_top;var alertimg_width;var alertimg_height;
var okimg_left;var okimg_top;var okimg_width;var okimg_height;

var startimg_width = 0.4;var startimg_height = 0.21;var startimg_first_x = - 1.4;var startimg_first_y = 0.9;



var scoreimg_width = 0.5;var scoreimg_height = 0.21;var scoreimg_first_x =1;var scoreimg_first_y = 0.9;

var stateshowimg_width = scoreimg_first_x - startimg_width - startimg_first_x ;var stateshowimg_height = 0.15;
var stateshowimg_first_x =startimg_width + startimg_first_x;var stateshowimg_first_y = 0.96;
var helpimg_width = 0;var helpimg_height= 0;var helpimg_first_x= 0;var helpimg_first_y = 0;
var tiltle_width = 1276;var title_left = 1444;var title_height;var title_top;
var pool_width ;var pool_left ;var pool_height;var pool_top;
var timeleft_x = 0;var timeleft_y = 0;
var tblwidth;var tblheight;var tblleft;var tbltop;var width;var height;
var canvas_left;var canvas_right;var canvas_top;var canvas_bottom;
var table_left;var table_right;var table_top;var table_bottom;var fontscale; 
var outer;
var div;
var canvas_html ;
var canvas_name
var canvas;
var ctx;
var isAndroid=(/android/gi).test(navigator.appVersion);
var isIDevice=(/iphone|ipad/gi).test(navigator.appVersion);
var isPlaybook=(/playbook/gi).test(navigator.appVersion);
var isTouchPad=(/hp-tablet/gi).test(navigator.appVersion);

var loadimg_height,loadimg_width,loadimg_left,loadimg_top;
var loadimage = new Image();
var show_whitline = false ;
height  = 650;
width = 750;
if( (window.innerWidth   < 750) &&(window.innerWidth  > 300)&&
	(window.innerHeight  < 650) &&(window.innerHeight   > 300) &&(window.innerWidth > window.innerHeight * 1.2 ))
{
	
	width =  window.innerWidth ;
	height =  width *  fixheight /fixwidth ;	

}
else{
	height  = 650;
	width = 750;
}

function loadResource(name){
	MultiStepLoader( [
			[ "audio", function(cb, i) {
			
			AudioManager.load({
				'back'   : 'sound/back',
				'shot'   : 'sound/shot',
			}, function() {
				cb(i); } ) 
			
			} ],
		
		[ "bgimages", function(cb, i) {
			LoadImages(bgimages, {		
			Environment:"images/Environment.png",
			show_shottarget:"images/help.png",
			table: "images/table_02.png",
			title:"images/poolmaster.png",
		
			shootpool:"images/ShootPool.png",
			pot: "images/pot.png",
			pointer: "images/pointer.png",
			popup: "images/alert.png",
			ok: "images/ok.png",
			}, function() {
				cb(i); } ) } ],
	
	
	], 
		function() {	
			init_pool_table(name);
			try{
				AudioManager.loop("back");
				AudioManager.play("back");
			}catch(e){ }
			
		}
	);
	
}

		
function Start(name)
{		

		div = document.getElementById(name);
		canvas_name = name + "_canvas";
		div.innerHTML = "";
		canvas_html = "<canvas";
		canvas_html += " id=" + canvas_name;
		canvas_html += " width=" + width;
		canvas_html += " height=" + height;
		canvas_html += ">Sorry, your browser doesn't appear to support the HTML-5 Canvas</canvas>";
		div.innerHTML = canvas_html;
		canvas = document.getElementById(canvas_name);
		if (!canvas) return;
		ctx = canvas.getContext("2d");
		if (!ctx) return;
	//	var loadimage = new Image();
		loadimage.src = "images/preloader.png";
		loadimage.onload = function(){
			loadResource(name);
		}


		
		
}
function LoadImages(images, sources, callback) {
    var loadedImages = 0;
    var numImages = 0;
//	var loadimg_height,loadimg_width,loadimg_left,loadimg_top;
	loadimg_left = width * 2 / 5;
	loadimg_top = height * 2 / 5;
	loadimg_width = width / 5;
	loadimg_height = height / 5;
    for (var src in sources){
		
		++numImages;
	}
	var loadlength =loadimg_width * 0.8 / numImages;
    for (var src in sources) {
		var a= src;
        images[src] = new Image();
		// Set up a callback to track how many images have been loaded  loadimage
        images[src].onload = function(){
				loadedImages++;				
			//	ctx.fillStyle = '#000';
//				ctx.fillRect( loadimg_left, loadimg_top, loadimg_width, loadimg_height );
				ctx.drawImage(loadimage, loadimg_left, loadimg_top, loadimg_width, loadimg_height);
				
				ctx.fillStyle = "#fff";
				ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,loadimg_width * 0.8,loadimg_height * 0.1);
				ctx.strokeStyle = "#fff";
				ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,loadimg_width * 0.8,loadimg_height * 0.1);

				ctx.fillStyle = "blue";
				ctx.fillRect(loadimg_left + loadimg_width * 0.1,loadimg_top + loadimg_height * 0.7 ,  loadlength * loadedImages - 10  ,loadimg_height * 0.1);
				if (loadedImages >= numImages) {				
					callback();
				}
        };
		images[src].onerror = images[src].onload; // Not a terribly sophisticated error handler. :)
		images[src].onabort = images[src].onload; 

        images[src].src = sources[src]; // Trigger the image load
    }
}
function MultiStepLoader(loadSteps, finale)
{
//	alert(loadSteps.length)
	if (loadSteps.length == 0)
	{
		finale();
		return;
	}
	var startTime = Date.now()
	var stepsCompleted = 0;
	var loadlength = 800/ loadSteps.length;
	for (var i = 0; i < loadSteps.length; ++i)
	{
		var stepFunc = loadSteps[i][1];
		stepFunc(LoaderInternalCallback, i);
	}
		
	function LoaderInternalCallback(i)
	{
	//	window.console && window.console.log("Load step completed: " + loadSteps[i][0] + " in " + (Date.now() - startTime).toString() + " ms" );
	//	alert("Load step completed: " + loadSteps[i][0] + " in " + (Date.now() - startTime).toString() + " ms" );
		
		++stepsCompleted;
		if (stepsCompleted >= loadSteps.length)
		{

			finale();
		}
	}	
}

