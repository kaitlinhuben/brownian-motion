//=============================================================================
// Main js for Brownian motion simulator
// Algorithms - Jose Blanchet
// Implementation - Kaitlin Huben
// (c) Kaitlin Huben 2013
//=============================================================================
$(function () {
	//-------------------------------------------------------------------------
	// set up everything visually
	//-------------------------------------------------------------------------
	/* empty out javascript error message */
	$("#plot-holder").html(" ");
	
	/* set up refresh button */
	$("#refresh").button();
	
	/* set up randomness button options */
	$("#random-options-holder").buttonset();
	
	/* set up dimension button options */
	$("#dimension-options-holder").buttonset();
	
	/* set up tooltip message as dialog */
	$( "#random-dialog-message" ).dialog({
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
		//show loading gif
		$("#loading").css("display", "block");
		
		//run simulation - slight time delay to let loading gif show up
		window.setTimeout(function() {	runSimulation(e); }, 50);
		
		//hide loading gif - done in function
		//window.setTimeout(function() { $("#loading").css("display", "none"); }, 500);
	}
	
	//-------------------------------------------------------------------------
	// set up GET and HTTP stuff for connection to RANDOM.org
	//-------------------------------------------------------------------------
	$("#testing-get").click(function() {
		//var data = sendRequest();
		//alert(data);
	});
});