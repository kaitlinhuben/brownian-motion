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
	
	/* set up refresh button */
	//$("#refresh").button();
	
	/* set up randomness button options */
	$("#random-options-holder").buttonset();
	
	/* set up dimension button options */
	$("#dimension-options-holder").buttonset();
	
	/* set up tooltip messages as dialog */
	$( "#random-dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      },
	  autoOpen: false
    });
	$( "#dimension-dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      },
	  autoOpen: false
    });

	/* have dialog open when clicked */
	$("#randomness-tooltip").click(function(){
		$("#random-dialog-message").dialog("open");
	});
	$("#dimensionality-tooltip").click(function(){
		$("#dimension-dialog-message").dialog("open");
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
		if($("#2D-option").prop("checked")) {
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
			window.setTimeout(function() { runSimulation(e); }, timeout);
			
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

});