var sfile = "data/statedata.csv",
	cfile = "data/countydata.csv",
    stateidlist = [],
	countyidlist = [],
	indicatorsList = [],
	sindicators = {},
	cindicators = {},
	indicators = {},
	states = {},
	counties = {},
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
		 for(var i= 1; i < results.meta['fields'].length; i++){
            stateidlist.push(results.meta['fields'][i])
            indicators[results.meta['fields'][i]]={}
        }

        for(row = 0; row < results.data.length; row++){
            var record = results.data[row];
            for(j=0;j<51;j++){
                indicators[stateidlist[j]][record.id]=record[stateidlist[j]]
            }
        }
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
			temp={"name":countyNames[i-1]}
    		counties[results.meta['fields'][i]]=temp;
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
          	        if (indicator === "B06009_030E"){
				tooltip.html(name + "<br/> Foreign Born bachelor or higher degree rate: " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Population of Foreign Born with a bachelor or higher degree")
			}
        		if (indicator === "B06009_024E"){
				tooltip.html(name + "<br/> Native bachelor or higher degree rate: " + Number(Math.round((sindicators[indicator][d3.select(this).attr("id").slice(5)]*100) +'e2')+'e-2') + "% <br/> *Population of Native with a bachelor or higher degree")
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
						var name= counties[d.id].name;
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
                      				if (indicator === "B06009_030E"){
							tooltip.html(name + "<br/> Foreign Born bachelor or higher degree rate: " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Population of Foreign Born with a bachelor or higher degree")
						}
                 				if (indicator === "B06009_024E"){
							tooltip.html(name + "<br/> Native bachelor or higher degree rate: " + Number(Math.round((cindicators[indicator][d.id]*100) +'e2')+'e-2') + "% <br/> *Population of Native with a bachelor or higher degree")
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
        if (x === "B06009_030E"){
		colorScale = ["#fff7f3", "#49006a"];
	}
       if (x === "B06009_024E"){
		colorScale = ["#f7fcfd", "#00441b"];
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

function multiples(){

	var x = document.getElementById("choropleth").value;

	var queue = d3_queue.queue();
	var width = 210,
		height = 125;

	var projection = d3.geo.albersUsa()
	.scale(250)
	.translate([width/2, height/2]);
	
	var path = d3.geo.path()
	.projection(projection);

	var table = d3.select(".table").append("table");

	var data=[]
	var type=["< 100%", "100-149%", "=> 150%"]

	///////////////////////////////////IMPORTANT///////////////////////////////////////////////////////////////////////////
	///USE this section to push values inside a variable called 'data'........

	//when done, use the last line in this section to print the JSON string in the console

	for(j=0;j<51;j++){
	var k=0;
	var dataset="B01001_00"
		for(i=3;i<25;i++){
			var datas={}
			if(i>9){dataset="B01001_0"}
			
			if(i==8 || i==9 || i==13 || i==15 || i==17 || i>18){
			data[data.length-1].population+=indicators[stateidlist[j]][dataset+i+"E"]
			continue
			}

			datas["population"]=indicators[stateidlist[j]][dataset+i+"E"]
			datas["Place of Birth"]="In State"
			datas["type"]=type[k]
			k++
			if(k==3)k=0
			
			datas["fips"]=stateidlist[j]
			data.push(datas)
		}

	}

	for(j=0;j<51;j++){
		var k=0;
		var dataset="B01001_0"
		for(i=27;i<49;i++){
			var datas={}    
			if(i==32 || i==33 || i==37 || i==39 || i==41 || i>42){
			data[data.length-1].population+=indicators[stateidlist[j]][dataset+i+"E"]
			continue
			}

			datas["population"]=indicators[stateidlist[j]][dataset+i+"E"]
			datas["Place of Birth"]="Other State"
			datas["type"]=type[k]
			k++
			if(k==3)k=0
			
			datas["fips"]=stateidlist[j]
			data.push(datas)
		}

	}
	for(j=0;j<51;j++){
		var k=0;
		var dataset="B01001_0"
		for(i=27;i<49;i++){
			var datas={}    
			if(i==32 || i==33 || i==37 || i==39 || i==41 || i>42){
			data[data.length-1].population+=indicators[stateidlist[j]][dataset+i+"E"]
			continue
			}

			datas["population"]=indicators[stateidlist[j]][dataset+i+"E"]
			datas["Place of Birth"]="Native, Born Outside US"
			datas["type"]=type[k]
			k++
			if(k==3)k=0
			
			datas["fips"]=stateidlist[j]
			data.push(datas)
		}

	}
	for(j=0;j<51;j++){
		var k=0;
		var dataset="B01001_0"
		for(i=27;i<49;i++){
			var datas={}    
			if(i==32 || i==33 || i==37 || i==39 || i==41 || i>42){
			data[data.length-1].population+=indicators[stateidlist[j]][dataset+i+"E"]
			continue
			}

			datas["population"]=indicators[stateidlist[j]][dataset+i+"E"]
			datas["Place of Birth"]="Foreign Born"
			datas["type"]=type[k]
			k++
			if(k==3)k=0
			
			datas["fips"]=stateidlist[j]
			data.push(datas)
		}

	}
	console.log(JSON.stringify(data))////////////////////////////   TO PRINT JSON STRING IN CONSOLE



	//After printing, copy the string from the console and create a new file called 'data.json' and paste the contents which were copied

	//After doing so, comment this section. There is no use for it. The next line of code retrieves from the json file

	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(x === "B01003_001E"){
		queue
		.defer(d3.json, "uscounties.json")
		.defer(d3.json,"totalpop.json")
		.await(ready);

		function ready(error, us, data) {
		if (error) throw error;
		
		var nested = d3.nest()
			.key(function(d) { return d.gender; })
			.key(function(d) { return d.type; })
			.rollup(function(d) { return d3.map(d, function(d) { return d.fips; })})
			.entries(data);
		console.log(us.objects)
		var states = topojson.feature(us, us.objects.states);
		
		states.features
			.forEach(function(feature) {
			feature.properties.centroid = path.centroid(feature);
			});
		
		table.append("thead").selectAll("th")
			.data(["","Under 5","5-9","10-14","15-17","18-21","22-24","25-29","30-40","40-50","50-60","60+"])
			.enter().append("th")
			.text(function(d) { return d; });
			
		var tr = table.selectAll("tr")
			.data(nested, function(d) { return d.key; })
			.enter().append("tr");
			
		tr.append("td")
			.attr("class", "row-header")
			.text(function(d) { return d.key; });

		var td = tr.selectAll(".map").data(function(d) { return d.values; })
			.enter().append("td")
			.attr("class", "map");
		
		var canvases = td.append("canvas")
			.attr("width", width)
			.attr("height", height)
			.each(render);

		var colorScale = d3.scale.threshold()
					.domain([200000, 400000, 600000, 800000, 1000000, 1200000])
					.range(["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"]);

		d3.select(".loading-text").remove();
		
			function render(d) {
				var data = d.values;
				
				var context = d3.select(this).node().getContext("2d");
				
				var color = function(d) {
				if (data.has(d.id)) {
					var value = data.get(d.id).population;
					return value ? colorScale(value) : "#fff";
				}
				return "#fff";
				};

				// Want the maps to render sequentially. Use setTimeout to give the
				// browser a break in between drawing each map.
				window.setTimeout(function() {      
				drawMap(context, color);
				}, 500);
			}

			function drawMap(context, color) {
				path.context(context);
				context.strokeStyle = "#fff";
				context.lineWidth = 0.1;
				states.features.forEach(function(d) {
				context.beginPath()
				path(d);
				context.fillStyle = color(d);
				context.fill();
				context.stroke();
				});
			}
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
