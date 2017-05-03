printHistory = function (choice) {
	var chosen = ""; var other = "";
	if (choice == "c") {
		chosen = " CO2 levels (ppm)"
		other = "When can you breate in here? >410 ppm is bad."
	}
	else if (choice == "l") {
		chosen = " Illuminance (Lux)";
		other = "When is it light outside?";
	}
	else {
		chosen = " Temperature (Celsius)";
		other = "When is it too hot in here?";
	}
	
	var allData = sensor.fullData;
	var text = "";
	var hours_val = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]];
	var hours_num = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]];
	var text2 = "";
	for (i = 0; i < allData.length; i++) {
		var hour = allData[i].timestamp.split("T")[1].split(".")[0].split(':')[0];
    	//var value = Math.round(100*allData[i].np/1500)
    	if (choice == "c") {
    		var value = Number(allData[i].c);
    	}
    	else if (choice == "l") {
    		var value = Number(allData[i].l);
    	}
    	else {
    		var value = Number(allData[i].t);
    	}
    	//text += value + " "+ hour + "<br>";
    	hours_val[hour-1] = value + Number(hours_val[hour-1]);
    	hours_num[hour-1] = 1 + Number(hours_num[hour-1]);
    	//hyper.log(allData[i].p)
	}
	//hyper.log(hours_val[1])
	//allData = '[{"c":"436","h":"15.2784","l":"3.0854","np":"1500","p":"102528.50","pp":"0","t":"30.4","timestamp":"2017-05-02T14:23:02.092Z"},{"c":"436","h":"15.4157","l":"3.0854","np":"1500","p":"102526.75","pp":"0","t":"30.2","timestamp":"2017-05-02T14:22:30.420Z"},{"c":"436","h":"15.5988","l":"3.1033","np":"1499","p":"102538.50","pp":"0","t":"30.0","timestamp":"2017-05-02T14:21:58.756Z"},{"c":"437","h":"15.7972","l":"3.1033","np":"1499","p":"102536.00","pp":"0","t":"29.9","timestamp":"2017-05-02T14:21:27.652Z"},{"c":"440","h":"15.6522","l":"3.1122","np":"1500","p":"102542.50","pp":"0","t":"29.8","timestamp":"2017-05-02T14:20:56.589Z"}]';
	//allData = JSON.parse(allData);
	var usefuldata = [];
	for (i = 0; i < 23; i++) {
		//text +=  Number(i+1) +": "+ Math.round(hours_val[i]/hours_num[i]) +  "<br>";
		usefuldata[i] = Math.round(hours_val[i]/hours_num[i]*10)/10;
	}

	document.getElementById("printHere").innerHTML= text + "<h1>"+chosen+"</h1><p>"+other+"</p><d3></d3><p> Time axis (hours)</p>";
	drawd3(usefuldata);
}

function drawd3(dataset) {
//Width and height
var mini = Math.min.apply(null, dataset)*0.9;
var maxi = Math.max.apply(null, dataset);
//var ratio = window.devicePixelRatio || 1;
var w = screen.width;
var h = screen.height * 0.4;
var padding = 40;
			//var w = 300;
			//var h = 400;
			var barPadding = 1;

			
			//var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
			//				11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
			
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
			   	//hyper.log(yScale(((d-mini)/(maxi-mini) * h)))
			   		return h - padding - yScale(d);
			   })
			   .attr("fill", function(d) {
			   		//var color;
			   		//if (d > 30) {color = "rgb(100,0,0)";}
			   		//else if (d>25) {color = "rgb(100,100,0)";}
			   		//else if (d > 20) {color = "rgb(0,100,100)";}
			   		//else {color = "rgb(0,0,100)";}
			   		//return color;
			   		value = (d-mini)/(maxi-mini);
			   		var hue=((1-value)*120).toString(10);
    				return ["hsl(",hue,",100%,50%)"].join("");
					//return "rgb(0, 0, " + ((d-20) * 30) + ")";
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