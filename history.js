printHistory = function (choice) {

	var currentdate = new Date();
	var day = currentdate.getDay();
	var month = currentdate.getMonth();

	var chosen = ""; var other = ""; var unit = "";
	if (choice == "c") {
		unit = "ppm";
		chosen = " CO2 levels (ppm)"
		other = "When can you breate in here? >410 ppm is bad."
	}
	else if (choice == "l") {
		unit = "lux";
		chosen = " Illuminance (Lux)";
		other = "When is it light outside?";
	}
	else {
		unit = "celsius";
		chosen = " Temperature (Celsius)";
		other = "When is it too hot in here?";
	}
	
	var allData = sensor.fullData;
	var text = "";
	var hours_val = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]];
	var hours_num = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]];
	var text2 = "";

	var days_val = [[0],[0],[0],[0],[0]];
	var days_num = [[0],[0],[0],[0],[0]];

	for (i = 0; i < allData.length; i++) {
		var dataDay = Number(allData[i].timestamp.split("T")[0].split("-")[2])
		var hour = allData[i].timestamp.split("T")[1].split(".")[0].split(':')[0];
    	
    	if (choice == "c") {
    		var value = Number(allData[i].c);
    	}
    	else if (choice == "l") {
    		var value = Number(allData[i].l);
    	}
    	else {
    		var value = Number(allData[i].t);
    	}
    	
    	hours_val[hour-1] = value + Number(hours_val[hour-1]);
    	hours_num[hour-1] = 1 + Number(hours_num[hour-1]);
    	if (hour == 12) {
    		days_val[dataDay-day+4] = value + Number(days_val[dataDay-day+4]);
			days_num[dataDay-day+4] = 1 + Number(days_num[dataDay-day+4]);
    	}	

	}
	hyper.log(days_num)
	hyper.log(days_val)

	var usefuldata = [];
	for (i = 0; i < 23; i++) {
		//text +=  Number(i+1) +": "+ Math.round(hours_val[i]/hours_num[i]) +  "<br>";
		usefuldata[i] = Math.round(hours_val[i]/hours_num[i]*10)/10;
	}
	var usefulfivedaydata = []; 
	for (i=0;i<5;i++){
		usefulfivedaydata[i] = Math.round(days_val[i]/days_num[i]*10)/10;
	}
	var lastdays = "<h2>Average value at 12 for last 5 days:</h2>";
	for (var i=0;i<5;i++){
		var today = Number(day) -Number(i);
		var temp_unit = unit;
		if (isNaN(usefulfivedaydata[4-i])) {
			usefulfivedaydata[4-i] = "data not sent from server";
			temp_unit = "";
		}
		else if (usefulfivedaydata[4-i] == undefined) {
			temp_unit = "";
			usefulfivedaydata[4-i] = "no data available yet";
		}
		lastdays += "<p>"+ today + "/" + month +" : " + usefulfivedaydata[4-i] + " " + temp_unit + "</p>";
	}


	document.getElementById("printHere").innerHTML= text + "<h1>"+chosen+"</h1><p>"+other+"</p><d3></d3><p> Time axis (hours)</p><br>" + lastdays;
	drawd3(usefuldata);
	hyper.log(usefulfivedaydata);

}

function drawd3(dataset) {
//Width and height
var mini = Math.min.apply(null, dataset)*0.9;
var maxi = Math.max.apply(null, dataset);
//var ratio = window.devicePixelRatio || 1;
var w = screen.width;
var h = screen.height * 0.4;
var padding = 40;
			var barPadding = 1;
	
	var xScale = d3.scale.linear()
		.domain([0, w])
		.range([padding, w - padding * 2]);

	var yScale = d3.scale.linear()
		.domain([mini, maxi])
		.range([h - padding, padding]);

	var timeScale = d3.scale.linear().domain([0,24]).range([padding, w - padding * 2]);
			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(timeScale)
							  .orient("bottom")
							  .ticks(12);
			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(5);
			//Create SVG element
			var svg = d3.select("d3")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return xScale(i * (w / dataset.length));
			   })
			   .attr("y", function(d) {
			   		return yScale(d);
			   })
			   .attr("width", ((w-2*padding) / dataset.length - barPadding))
			   .attr("height", function(d) {
			   		return h - padding - yScale(d);
			   })
			   .attr("fill", function(d) {
			   		value = (d-mini)/(maxi-mini);
			   		var hue=((1-value)*120).toString(10);
    				return ["hsl(",hue,",100%,50%)"].join("");
			   });
/*
			   svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		//return xScale(i*w);
			   		return xScale(i * (w / dataset.length) + (w / dataset.length - barPadding) / 2);
			   })
			   .attr("y", function(d) {
			   		return yScale(d) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black");
*/

			   			//Create X axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis);
			
			//Create Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis);
}