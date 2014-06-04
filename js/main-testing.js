$(function () { 
	//alert("JavaScript is ready!");
	$("#testingarea").html("jQuery is ready");
	
	var result = Formula.NORMSDIST(1, true);
	$("#testingarea").append("<br />" + result);
	
	var d1 = [];
	for(var i = 0; i < 1; i += 0.05) {
		d1.push([i, Formula.NORMSDIST(i, true)]);
	}
/*
    // for (var i = 0; i < 14; i += 0.5)
        // d1.push([i, Math.sin(i)]);
// 
    // var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
// 
    // // a null signifies separate line segments
    // var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];*/

    
    console.log(d1);
    /*
    console.log(d2);
        console.log(d3);*/
    
    
    // $.plot($("#plot-holder"), [ d1, d2, d3 ]);
    $.plot($("#plot-holder"), [ d1 ]);
});