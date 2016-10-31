var sfile = "data/statedata.csv",
	cfile = "data/countydata.csv",
    stateidlist = [],
	countyidlist = [],
	indicatorsList = [],
	sindicators = {},
	cindicators = {},
	states = {},
	stateNames = ['Alabama', 'Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','llinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

Papa.parse(sfile, {
	download: true,
	header: true,
	dynamicTyping: true,
	skipEmptyLines: true,
	complete: function(results){
		for(var i= 1; i < results.meta['fields'].length; i++){
			stateidlist.push(results.meta['fields'][i]);
			temp={"name":stateNames[i-1]}
    		states[results.meta['fields'][i]]=temp;
		}
		for(var row = 0; row < results.data.length; row++){
			var record = results.data[row];
			var sindicator = {
				name: record.id 
			}
			indicatorsList.push(record.id);
			sindicators[sindicator.name]= sindicator;
			for(var i= 1; i < results.meta['fields'].length; i++){
				var stateid = results.meta['fields'][i];
				var value = record[stateid];
				sindicator[stateid] = value;
			}		
		}
	console.log(sindicators)
	}
});

Papa.parse(cfile, {
	download: true,
	header: true,
	dynamicTyping: true,
	skipEmptyLines: true,
	complete: function(results){
		for(var i= 1; i < results.meta['fields'].length; i++){
			countyidlist.push(results.meta['fields'][i]);
		}
		for(var row = 0; row < results.data.length; row++){
			var record = results.data[row];
			var cindicator = {
				name: record.id 
			}
			cindicators[cindicator.name]= cindicator;
			for(var i= 1; i < results.meta['fields'].length; i++){
				var countyid = results.meta['fields'][i];
				var value = record[countyid];
				cindicator[countyid] = value;
			}		
		}
	console.log(cindicators)
	}
});


// on click colors the state and adds non-duplicate IDs and names to respective arrays
function stateSelect(d) {
	if (d3.event.defaultPrevented) return;//this line prevents selection if dragging took place
	if(state_sel.includes(d.id)){
		state_sel.splice(state_sel.indexOf(d.id),1)
		console.log(state_sel);
	}
    else{
    	state_sel.push(d.id)
		console.log(state_sel);
	}
	color_states()
}

function countySelect(d) {
	if (d3.event.defaultPrevented) return;
    if(county_sel.includes(d.id)){
		county_sel.splice(county_sel.indexOf(d.id),1)
		console.log(county_sel);
	}
    else{
		for (var i = 0; i < countyidlist.length; i++) {
    		if (countyidlist[i] == d.id) {
       			county_sel.push(d.id)
    		}
		}
    	console.log(county_sel);	
	}
	color_counties()
}

function color_states(){
	d3.selectAll(".state").style("opacity",1).style("stroke-width",0.2)
	if(state_sel.length>0){
		d3.selectAll(".state").style("opacity",0.65).style("stroke-width",0.2)
		for(i=0;i<state_sel.length;i++){
			d3.select("#state"+state_sel[i]).style("opacity",1).style("stroke","black").style("stroke-width",2)
		}
	}
	else{ 
		d3.selectAll(".state").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	}
	d3.selectAll(".state")
		.on("mouseover",function(){
			var indicator = document.getElementById("choropleth").value;
			var name=states[d3.select(this).attr("id").slice(5)].name
			d3.select(this).style("opacity",1).style("stroke","black").style("stroke-width",1);
			tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);
			if (indicator === "null"){		
            	tooltip.html(name)	
			}
			if (indicator === "B01003_001E"){
				tooltip.html(name + "<br/> Total population: " +numberWithCommas(sindicators[indicator][d3.select(this).attr("id").slice(5)]))
			}
			if (indicator === "B01002_001E"){
				tooltip.html(name + "<br/> Median Age: " + sindicators[indicator][d3.select(this).attr("id").slice(5)] + " years old")
			}
			if (indicator === "B01002_002E"){
				tooltip.html(name + "<br/> Median Age - Male: " + sindicators[indicator][d3.select(this).attr("id").slice(5)] + " years old")
			}
			if (indicator === "B01002_003E"){
				tooltip.html(name + "<br/> Median Age - Female: " + sindicators[indicator][d3.select(this).attr("id").slice(5)] + " years old")
			}
			if (indicator === "B19013_001E"){
				tooltip.html(name + "<br/> Median Household Income: $" +numberWithCommas(sindicators[indicator][d3.select(this).attr("id").slice(5)]))
			}
			if (indicator === "B19301_001E"){
				tooltip.html(name + "<br/> Per Capita Income: $" +numberWithCommas(sindicators[indicator][d3.select(this).attr("id").slice(5)]))
			}
			if (indicator === "B08303_005E"){
				tooltip.html(name + ": " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Workers 16 years and over who did not work at home")
			}
			if (indicator === "B08303_010E"){
				tooltip.html(name + ": " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Workers 16 years and over who did not work at home")
			}
			if (indicator === "B17002_004E"){
				tooltip.html(name + "<br/> Poverty Rate: " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Population with an income to poverty ratio of 1.00 or below")
			}
			if (indicator === "B17002_002E"){
				tooltip.html(name + "<br/> Severe Poverty Rate: " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Population with an income to poverty ratio of 0.50 or below")
			}
		})
		 .on("mousemove", function () {
        tooltip
            .style("top", (d3.event.pageY + 16) + "px")
            .style("left", (d3.event.pageX + 16) + "px");
    })
		.on("mouseout",function(){
			tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
            color_states()
		})
}


function color_counties(){
	d3.selectAll(".state").style("opacity",1).style("stroke-width",0.2)
	d3.selectAll(".county").style("opacity",1).style("stroke-width",0.2)
	if(county_sel.length>0){
		d3.selectAll(".state").style("opacity",0.1).style("stroke-width",0.2)
		d3.selectAll(".county").style("opacity",0.65).style("stroke-width",0.2)
		for(i=0;i<county_sel.length;i++){
			d3.select("#county"+county_sel[i]).style("opacity",1).style("stroke","black").style("stroke-width",1)
		}
	}
	else{ 
		d3.selectAll(".county").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	}
	d3.selectAll(".county")
		.on("mouseover", function(d){
            for (var i = 0; i < countyidlist.length; i++) {
                if (countyidlist[i] == d.id) {
                    d3.select("#county"+ d.id)
						var indicator = document.getElementById("choropleth").value;
						var name= "County: " + d.id;
						d3.select(this).style("opacity",1).style("stroke","black").style("stroke-width",1);
						tooltip.transition()		
							.duration(200)		
							.style("opacity", .9);
						if (indicator === "null"){		
							tooltip.html(name)	
						}
						if (indicator === "B01003_001E"){
							tooltip.html(name + "<br/> Total population: " +numberWithCommas(cindicators[indicator][d.id]))
						}
						if (indicator === "B01002_001E"){
							tooltip.html(name + "<br/> Median Age: " + cindicators[indicator][d.id] + " years old")
						}
						if (indicator === "B01002_002E"){
							tooltip.html(name + "<br/> Median Age - Male: " + cindicators[indicator][d.id] + " years old")
						}
						if (indicator === "B01002_003E"){
							tooltip.html(name + "<br/> Median Age - Female: " + cindicators[indicator][d.id] + " years old")
						}
						if (indicator === "B19013_001E"){
							tooltip.html(name + "<br/> Median Household Income: $" +numberWithCommas(cindicators[indicator][d.id]))
						}
						if (indicator === "B19301_001E"){
							tooltip.html(name + "<br/> Per Capita Income: $" +numberWithCommas(cindicators[indicator][d.id]))
						}
						if (indicator === "B08303_005E"){
							tooltip.html(name + ": " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Workers 16 years and over who did not work at home")
						}
						if (indicator === "B08303_010E"){
							tooltip.html(name + ": " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Workers 16 years and over who did not work at home")
						}
						if (indicator === "B17002_004E"){
							tooltip.html(name + "<br/> Poverty Rate: " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Population with an income to poverty ratio of 1.00 or below")
						}
						if (indicator === "B17002_002E"){
							tooltip.html(name + "<br/> Severe Poverty Rate: " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Population with an income to poverty ratio of 0.50 or below")
						}
					}
				}
			})
		.on("mousemove", function () {
			tooltip
				.style("top", (d3.event.pageY + 16) + "px")
				.style("left", (d3.event.pageX + 16) + "px");
		})
		.on("mouseout",function(){
			tooltip.transition()		
				.duration(500)		
				.style("opacity", 0);	
			color_counties()
		})
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

function work(){

	var x = document.getElementById("choropleth").value;

	if(x === "null"){
		for(i=0;i<=no_states;i++){
			d3.select("#state"+stateidlist[i]).style("fill", "#969696")
	}
		for(i=0;i<=no_counties;i++){
			d3.select("#county"+countyidlist[i]).style("fill", "#969696")
		}
	}else{

	var smax=0;
	var smin=5000000;
	for(i=0;i<=no_states;i++){
		
		var temp= sindicators[x][stateidlist[i]];

		if(smax<temp)smax=temp;
		
		if(smin>temp)smin=temp;
	}
	console.log("minimum state value is:"+smin)
	console.log("maximum state value is:"+smax)
	var range=smax-smin;

	var colorScale = [];

	if (x === "B01003_001E"){
		colorScale = ["#fff7ec", "#7f0000"];
	}
	if (x === "B01002_001E"){
		colorScale = ["#fff7fb", "#014636"];
	}
	if (x === "B01002_002E"){
		colorScale = ["#fff7fb", "#023858"];
	}
	if (x === "B01002_003E"){
		colorScale = ["#f7f4f9", "#67001f"];
	}
	if (x === "B19013_001E"){
		colorScale = ["#ffffe5", "#662506"];
	}
	if (x === "B19301_001E"){
		colorScale = ["#ffffe5", "#004529"];
	}
	if (x === "B08303_005E"){
		colorScale = ["#f7fcfd", "#4d004b"];
	}
	if (x === "B08303_010E"){
		colorScale = ["#fff5f0", "#67000d"];
	}
	if (x === "B17002_004E"){
		colorScale = ["#ffffcc", "#800026"];
	}
	if (x === "B17002_002E"){
		colorScale = ["#f7fcf0", "#084081"];
	}

	
	var linearScale = d3.scale.linear()
		.domain([smin,smax])
		.range(colorScale);

	for(i=0;i<=no_states;i++){
		d3.select("#state"+stateidlist[i])
			.style("fill", linearScale(sindicators[x][stateidlist[i]]))
	}

	var cmax=0;
	var cmin=5000000;

	for(i=1;i<=no_counties;i++){

		var temp= cindicators[x][countyidlist[i]];
		if(cmax<temp)cmax=temp;
		
		if(cmin>temp)cmin=temp;
	}
	console.log("minimum county value is:"+cmin)
	console.log("maximum county value is:"+cmax)
	var range=cmax-cmin;

	var linearScale = d3.scale.linear()
		.domain([cmin,cmax])
		.range(colorScale);
		
	for(i=1;i<=no_counties;i++){

		d3.select("#county"+countyidlist[i]).style("fill", linearScale(cindicators[x][countyidlist[i]]))
	}
	}     
}
//Code for legend, this needs a lot of work...
/*function stateLegend(){

	var x = document.getElementById("choropleth").value;

	if(x === "null") return;

	var smax=0;
	var smin=5000000;
	for(i=0;i<=no_states;i++){
		
		var temp= parseInt(sindicators[x][stateidlist[i]]);

		if(smax<temp)smax=temp;
		
		if(smin>temp)smin=temp;
	}
	var range=smax-smin;

	var linearScale = d3.scale.linear()
		.domain([smin,smax])
		.range(["#fff7fb", "#023858"]);

	var w = 140, h = 400;

	var key = d3.select("#legend")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	var legend = key
		.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "100%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

	legend
		.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "#023858")
		.attr("stop-opacity", 1);

	legend
		.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "#fff7fb")
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("width", 40)
		.attr("height", 300)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0,10)");

	var y = d3.scale.linear()
		.range([300, 0])
		.domain([1, 100]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");

	key.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(41,10)")
		.call(yAxis).append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 30).attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("axis title");

	console.log("worked")
}

function countyLegend(){

	var x = document.getElementById("choropleth").value;

	if(x === "null") return;

	var cmax=0;
	var cmin=5000000;

	for(i=1;i<=no_counties;i++){

		var temp=parseInt(cindicators[x][countyidlist[i]]);
		if(cmax<temp)cmax=temp;
		
		if(cmin>temp)cmin=temp;
	}

	var range=cmax-cmin;

	var linearScale = d3.scale.linear()
		.domain([cmin,cmax])
		.range(["#fff7fb", "#023858"]);
		
	var key = d3.select("#stateMap")
		.attr("width", w)
		.attr("height", h);

	var w = 140, h = 400;

	var legend = key
		.append("defs")
		.append("svg:linearGradient")
		.attr("id", "gradient")
		.attr("x1", "100%")
		.attr("y1", "0%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

	legend
		.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "#023858")
		.attr("stop-opacity", 1);

	legend
		.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "#fff7fb")
		.attr("stop-opacity", 1);

	key.append("rect")
		.attr("width", 40)
		.attr("height", 300)
		.style("fill", "url(#gradient)")
		.attr("transform", "translate(0,10)");

	var y = d3.scale.linear()
		.range([300, 0])
		.domain([1, 100]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("right");

	key.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(41,10)")
		.call(yAxis).append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 30).attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("axis title");

	console.log("worked")
}*/