$(function () { 
	//alert("JavaScript is ready!");
	$("#testingarea").html("jQuery is ready");
	
/*
	var result = Formula.NORMSDIST(1, true);
	$("#testingarea").append("<br />" + result);
	
	var d1 = [];
	for(var i = 0; i < 1; i += 0.05) {
		d1.push([i, Formula.NORMSDIST(i, true)]);
	}*/
	var result_x = brownian_path(0.2);
	var result_y = brownian_path(0.2);
	var toPlot = [];
	for(var i = 1; i < result_x.length; i++) {
		toPlot.push([result_x[i], result_y[i]]);
	}
	console.log(toPlot);
	$("#plot-holder").html("bridge: " + result_x[1]);
	$.plot($("#plot-holder"), [ toPlot ]);
	
	function nextG(F, rho) {
		var G = F + 1;
		console.log("G: " + G);
		var MAX = Math.pow(2, 50);
		var U = 1 - 2*(1 - Formula.NORMSDIST((rho*(Math.pow(Math.log(G), 0.5))), true));  //TODO: check log or ln?
		console.log("U: " + U);
		var D = (1-1/rho/(Math.pow(Math.log(G), 0.5))/(rho*rho/2-1)*Math.pow(G, 1-rho*rho/2))*U;
		console.log("D: " + D);
		var V = Math.random();
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
		bridge[1] = Formula.NORMSINV(Math.random())/Math.sqrt(Math.pow(2, L));
		console.log("bridge:" + bridge[1]);
		
		for(var i = 2; i <= Math.pow(2, L); i++) {
			bridge[i*Math.pow(2, (K-L))] = bridge[(i-1)*Math.pow(2,(K-L))] + Formula.NORMSINV(Math.random())/Math.sqrt(Math.pow(2, L));
		}
		console.log(bridge);
		console.log("K:" + K + "; L: " + L);
		
		var k1 = 1;
		var flag = 0;
		for(var i = L; i <= K-1; i++) {
			for(var k = 1; k <= Math.pow(2, i) - 1; k++) {
				if(k+Math.pow(2, i) < Gseries[k1]) {
					flag = 1;
				}
			}
		}
		console.log("flag: " + flag);
		return bridge;
	}
});