//=============================================================================
// Main js for Brownian motion simulator
// Algorithms - Jose Blanchet
// Implementation - Kaitlin Huben
// (c) Kaitlin Huben 2013
//=============================================================================

// variables for live random
var haveRandomNumbers = false;
var randomNumbers = ["404 Error"];
var randIndex = 0;
var numbersToRequest = 10000;
var useRandomNumbers = false;
// variable for pre-generated random
var usePreRandNumbers = false;

$(function () {
	//-------------------------------------------------------------------------
	// set up everything visually
	//-------------------------------------------------------------------------
	/* empty out javascript error message */
	$("#plot-holder").html(" ");
	
	// set up all bootstrap buttons
	$('.btn').button();
	

	/* have modal dialog open when clicked */
	$("#randomness-tooltip").click(function(){
		$('#randomness-tooltip-modal').modal({keyboard:true});
	});
	$("#dimensionality-tooltip").click(function(){
		$('#dimensions-tooltip-modal').modal({keyboard:true});
	});

	//-------------------------------------------------------------------------
	// simulation functions
	//-------------------------------------------------------------------------
	/* Run simulation on load with default precision of 0.2 */
	var precision = 0.2;
	runSimulationWithLoading(precision);

	/* Run simulation when Refresh button is clicked */
	$("#refresh").click(function() {
		var user_precision = $("#precision").val();	//TODO: error check on precision
		
		// if user-precision input was left blank, set to default 0.2
		if(user_precision == '') {
			user_precision = 0.2;
			runSimulationWithLoading(user_precision);
		}
		else {
			if(user_precision <= 0) {
				alert("Precision cannot be zero/negative. Please enter a different precision.");
			} else {
				runSimulationWithLoading(user_precision);
			}
		}
		
	});
	
	/* If user hits ENTER from input, simulate clicking Refresh button */
	$("#precision").keyup(function(event){
		if(event.keyCode == 13) {
			$("#refresh").click();
		}
	});
	
	/* run simulation with loading feedback for user */
	function runSimulationWithLoading(e) {
		var timeout = 50;
		//show loading gif
		$("#loading").css("display", "block");
		
		//check to see whether using live random, pre-generated 
		//random, or pseudorandom
		if($("#liverand-option").prop("checked")) {
			//if live random, set timeout so can send request
			timeout = 3000;
			sendRequest();
			useRandomNumbers = true;
			usePreRandNumbers = false;
		} else if($("#prerand-option").prop("checked")) {
			usePreRandNumbers = true;
			useRandomNumbers = false;
		} else {
			useRandomNumbers = false;
			usePreRandNumbers = false;
		}

		//run simulation - slight time delay to let loading gif show up
		//or possibly also to get more random numbers
		//which simulation dependent on whether 2d or 3d
		if($("#2D-option").prop("checked") || $("#1D-option").prop("checked")) {
			//show 2d plot holder
			$("#plot-holder").css("display", "block");
			
			//rename container-canvas1 (created by canvasXpress) to canvas1
			//for next time using 3D
			if($("#container-canvas1").length) {
				$("#container-canvas1").attr("id", "canvas1");
			}
			
			// hide 3d plot holder
			$("#3d-plot-holder").css("display", "none");
			
			//run simulation
			if($("#2D-option").prop("checked")) {
				window.setTimeout(function() { runSimulation(e); }, timeout);
			} else if($("#1D-option").prop("checked")) {
				window.setTimeout(function() { run1DSimulation(e); }, timeout);
			}
		} else if($("#3D-option").prop("checked")){
			//remove container-canvas1 if needed
			$("#container-canvas1").remove();
			
			//remove old canvas
			$("#canvas1").remove();
			
			//add new canvas
			$("#3d-plot-holder").append("<canvas id='canvas1' width='600' height='600' style=\"display:block;\"></canvas>");
			
			//show 3d plot
			$("#3d-plot-holder").css("display", "block");
			
			//hide 2d plot
			$("#plot-holder").css("display", "none");
			
			//run 3d simulation
			window.setTimeout(function() { run3dSimulation(e); }, timeout);
		}
		
		//hide loading gif - done in function
		//window.setTimeout(function() { $("#loading").css("display", "none"); }, 500);
	}
	
	$('#precision').show();
	$('#precision-no-change-2D').hide(); 
	$('#precision-no-change-3D').hide(); 
	$('#liverand-label').show();
	
	$('#1D-option-label').click(function(){
		$("#precision").val("");
		$("#precision").removeAttr("readonly");
		$('#precision-no-change-2D').hide(); 
		$('#precision-no-change-2D').hide(); 
		$("#precision").show();
		$('#liverand-label').show();
	});
	$('#2D-option-label').click(function(){
		$("#precision").val("0.2");
		$("#precision").attr("readonly", "readonly");
		$("#precision").hide();
		$('#precision-no-change-3D').hide();
		$('#liverand-label').hide();		
		$('#precision-no-change-2D').show(); 
	});
	$('#3D-option-label').click(function(){
		$("#precision").val("0.8");
		$("#precision").attr("readonly", "readonly");
		$("#precision").hide();
		$('#precision-no-change-2D').hide(); 
		$('#liverand-label').hide();
		$('#precision-no-change-3D').show(); 
	});
});