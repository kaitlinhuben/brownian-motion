//=============================================================================
// Main mathematical js for Brownian motion simulator
// Algorithms - Jose Blanchet
// Implementation - Kaitlin Huben
// (c) Kaitlin Huben 2013
//=============================================================================

/* Run simulation with precision e and update plot to show results */
function runSimulation(e) {
	if(useRandomNumbers && !haveRandomNumbers) {
		alert("Sorry, we couldn't connect to RANDOM.org for numbers. Error: " + randomNumbers[0]);
		$("#loading").css("display", "none");
	} else {
	// simulate Brownian path twice, once to get coordinates for
	// the x direction and once for the y direction
	var result_x = brownian_path(e); 
	var result_y = brownian_path(e);
	
	// create new array to store pairs of points to be graphed
	var toPlot = [];
	
	// if different number of points in x and y, something went wrong
	if(result_x.length != result_y.length) {
		$("#plot-holder").html("Oops, something went wrong in our calculations!");
	} 
	// otherwise, can go ahead and plot
	else {
		// push points to array to plot
		for(var i = 1; i < result_x.length; i++) {
			toPlot.push([result_x[i], result_y[i]]);
		}
		console.log(toPlot);
		
		var min_value = Number.MAX_VALUE;
		var max_value = -1 * Number.MAX_VALUE;
		for(var i = 1; i < result_x.length; i++) {
			if(result_x[i] < min_value) { min_value = result_x[i]; }
			if(result_y[i] < min_value) { min_value = result_y[i]; }
			
			if(result_x[i] > max_value) { max_value = result_x[i]; }
			if(result_y[i] > max_value) { max_value = result_y[i]; }
		}
		console.log("Min: " + min_value);
		console.log("Max: " + max_value);
		
		// set options
		var options = {
			//make sure x and y axes have same min/max
			xaxis: {
				min: min_value,
				max: max_value
			},
			yaxis: {
				min: min_value,
				max: max_value
			},
			
			//make the line thinner
			series: {
				lines: {
					lineWidth: 1
				}
			},
			
			colors: ["#2779aa"]
		};
		
		// plot the pairs of points (using flot.js)
		$.plot($("#plot-holder"), [ toPlot ], options);
		
		// update the title to show current precision and other options
		var title = "Precision: " + e + " (";
		if($("#pseudo-option").prop("checked")) {
			title += "pseudorandom";
		} else if($("#prerand-option").prop("checked")) {
			title += "pre-generated random";
		} else if($("#liverand-option").prop("checked")) {
			title += "live-generated random";
		}
		title += ")";
		$("#result-title").html(title);
		
		//hide loading gif once done
		window.setTimeout(function() { $("#loading").css("display", "none"); }, 50);
	}
	}
}

/* Run simulation with precision e and update plot to show results */
function run3dSimulation(e) {
	if(useRandomNumbers && !haveRandomNumbers) {
		alert("Sorry, we couldn't connect to RANDOM.org for numbers. Error: " + randomNumbers[0]);
		$("#loading").css("display", "none");
	} else {
	// simulate Brownian path twice, once to get coordinates for
	// the x direction and once for the y direction
	var result_x = brownian_path(e); 
	var result_y = brownian_path(e);
	var result_z = brownian_path(e);
	
	// create new array to store pairs of points to be graphed
	// also variable names
	var toPlot = [];
	var varArray = [];
	
	// if different number of points in x and y, something went wrong
	if(result_x.length != result_y.length || result_x.length != result_z.length || result_y.length != result_z.length) {
		$("#plot-holder").html("Oops, something went wrong in our calculations!");
	} 
	// otherwise, can go ahead and plot
	else {
		// push points to array to plot
		for(var i = 1; i < result_x.length; i++) {
			toPlot.push([result_x[i], result_y[i], result_z[i]]);
			varArray.push(i);
		}
		console.log(toPlot);
		
		// graph canvas
		var cx1 = new CanvasXpress('canvas1',
          {
            'y' : {
              'vars' : varArray,
              'smps' : ['X', 'Y', 'Z'],
              'data' : toPlot
            }
          },
          {'colors' : ['rgb(39,121,170)'],
		  'disableMenu': true,
		  'graphType': 'Scatter3D',
		  'scatterType' : 'line',
          'xAxis': ['X'],
          'yAxis': ['Y'],
          'zAxis': ['Z']}
        );
		
		// recenter canvas
		var canvasWidth = $("#canvas1").width();
		var contentWidth = $("#content").width();
		var marginLeft = (contentWidth - canvasWidth) / 2;
		$("#container-canvas1").css("margin-left", marginLeft + "px");
		
		
		// update the title to show current precision and other options
		var title = "Precision: " + e + " (";
		if($("#pseudo-option").prop("checked")) {
			title += "pseudorandom";
		} else if($("#prerand-option").prop("checked")) {
			title += "pre-generated random";
		} else if($("#liverand-option").prop("checked")) {
			title += "live-generated random";
		}
		title += ")";
		$("#result-title").html(title);
		
		//hide loading gif once done
		window.setTimeout(function() { $("#loading").css("display", "none"); }, 50);
	}
	}
}

/* Simulate a Brownian path on the time interval [0,1] with given precision e */
function brownian_path(e) {
	var L = 1;
	
	while(2/Math.log(2)*(Math.sqrt(Math.log(L)/Math.log(2))+2/Math.log(2))/Math.sqrt(Math.pow(2, L)) > e) {
		L = L + 1;
	}
	
	var G1=nextG(Math.pow(2, L) , 2); 
	console.log("G1: "+G1);
	var Gseries = new Array();
	Gseries.push(0);
	Gseries.push(G1);
	console.log(Gseries);
	var numG = 0;
	
	while(G1 < Number.POSITIVE_INFINITY) {
		numG = numG + 1;
		Gseries.push(G1);
		console.log(Gseries);
		F = G1;
		G1 = nextG(F, 2);
	}
	
	//if(numG == 0) { numG = numG + 1; }
	var K = Math.ceil(Math.log(Math.max(Gseries[numG]+1, Math.pow(2, L)))/Math.log(2));
	var M = Math.pow(2, K);
	
	var bridge = new Array(M);
	bridge[0] = 0;
	bridge[1] = Formula.NORMSINV(nextRand())/Math.sqrt(Math.pow(2, L));
	console.log("bridge:" + bridge[1]);
	
	for(var i = 2; i <= Math.pow(2, L); i++) {
		bridge[i*Math.pow(2, (K-L))] = bridge[(i-1)*Math.pow(2,(K-L))] + Formula.NORMSINV(nextRand())/Math.sqrt(Math.pow(2, L));
	}
	console.log(bridge);
	console.log("K:" + K + "; L: " + L);
	
	var k1 = 1;
	var flag = 0;
	var U = 0;
	var a = 0;
	for(var i = L; i <= K-1; i++) {
		for(var k = 1; k <= Math.pow(2, i) - 1; k++) {
			if(k+Math.pow(2, i) < Gseries[k1]) {
				flag = 1;
				while(flag) {
					U = Formula.NORMSINV(nextRand());
					if(Math.abs(U) < 2*Math.log((Math.log(Math.pow(2, i)+k)), 0.5)) {
						flag = 0;
					}
				}
				bridge[Math.pow(2, (K-i-1))*(2*k+1)]=(bridge[Math.pow(2, (K-i))*k]+bridge[Math.pow(2, (K-i))*(k+1)])/2 + Math.pow(2, (-(i+1)/2))*U;
			}
			else {
				k1 = k1+1;
				a = 2 * Math.pow(Math.log(k+Math.pow(2, i)), 0.5);
				flag = 1;
				while(flag) {
					U = ((-1) * Math.log(nextRand())) + a;
					if(nextRand() <= Math.exp((-1)*U*U/2 + U - a + a*a/2)) {
						flag = 0;
					}
				}
				if(nextRand() < 0.5) {
					bridge[Math.pow(2, (L-1-i))*(2*k+1)]=(bridge[Math.pow(2, (L-i))*k]+bridge[Math.pow(2, (L-i))*(k+1)])/2 + 2^(-(16+i+1)/2)*U;
				}
				else {
					bridge[Math.pow(2, (L-1-i))*(2*k+1)]=(bridge[Math.pow(2, (L-i))*k]+bridge[Math.pow(2, (L-i))*(k+1)])/2 - 2^(-(16+i+1)/2)*U;
				}
			}
		}
	}
	console.log("flag: " + flag);
	return bridge;
}

function nextG(F, rho) {
	var G = F + 1;
	console.log("G: " + G);
	var MAX = Math.pow(2, 50);
	var U = 1 - 2*(1 - Formula.NORMSDIST((rho*(Math.pow(Math.log(G), 0.5))), true)); 
	console.log("U: " + U);
	var D = (1-1/rho/(Math.pow(Math.log(G), 0.5))/(rho*rho/2-1)*Math.pow(G, 1-rho*rho/2))*U;
	console.log("D: " + D);
	var V = nextRand();
	console.log("V: " + V);
	
	for(G = F + 1; G <= MAX; G++) {
		if(U < V) {
			return G;
		}
		
		if(V < D){
			G = Number.POSITIVE_INFINITY;
			return G;
		}
		U = U * (1 - 2*(1 - Formula.NORMSDIST((rho*(Math.pow(Math.log(G), 0.5)))), true));
		D = (1-1/rho/(Math.pow(Math.log(G), 0.5))/(rho*rho/2-1)*Math.pow(G, 1-rho*rho/2))*U;
		
		console.log("G: " + G + ";  U: " + U + ";  D: " + D);
	}
	alert("Exceeds MAX");
}

/* gets the next random number, depending on whether using pseudorandom or true random
 * or pre-generated random
 * if true random, uses randomNumbers array
 * if pseudorandom, just returns Math.random()
 * if pre-generated random, use preArray
 */
function nextRand() {
	//check to see if supposed to use random numbers and if have them
	if(useRandomNumbers && haveRandomNumbers) {
		//if haven't used up random array yet, just return next number
		if(randIndex < numbersToRequest) {
			//increment randIndex for next time, return randIndex-1
			randIndex++;
			return randomNumbers[randIndex - 1];
		} 
		//otherwise need to send another GET request for more numbers
		//but that doesn't return in time, so start returning
		//pseudorandom choices of randomNumbers
		else {
			var index = Math.floor(Math.random() * 10000);
			return randomNumbers[index];
		}
	} 
	//check to see if supposed to use pre-generated random
	else if(usePreRandNumbers) {
		var index = Math.floor(Math.random() * 10000);
		return preArray[index];
	}
	//neither, so return pseudorandom number
	else {
		return Math.random();
	}
}