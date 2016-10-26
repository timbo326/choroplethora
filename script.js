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
    	county_sel.push(d.id)
    	console.log(county_sel);	
	}
	color_counties()
}

function color_states(){
	d3.selectAll(".state").style("opacity",1).style("stroke-width",0.2)
	if(state_sel.length>0){
		d3.selectAll(".state").style("opacity",0.2).style("stroke-width",0.2)
		for(i=0;i<state_sel.length;i++){
			d3.select("#state"+state_sel[i]).style("opacity",1).style("stroke","black").style("stroke-width",2)
		}
	}
	else{ 
		console.log("works")
		d3.selectAll(".state").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	}
	d3.selectAll(".state")
		.on("mouseover",function(){
			var name=states[d3.select(this).attr("id").slice(5)].name
			console.log(name)
			d3.select(this).style("opacity",1).style("stroke","black").style("stroke-width",2);
			tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(name)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
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
		d3.selectAll(".state").style("opacity",0.2).style("stroke-width",0.2)
		d3.selectAll(".county").style("opacity",0.2).style("stroke-width",0.2)
		for(i=0;i<county_sel.length;i++){
			d3.select("#county"+county_sel[i]).style("opacity",1).style("stroke","black").style("stroke-width",1)
		}
	}
	else{ 
		d3.selectAll(".county").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	}
	d3.selectAll(".county")
		.on("mouseover",function(){d3.select(this).style("opacity",1).style("stroke","black").style("stroke-width",1)})
		.on("mouseout",function(){color_counties()})
}


function work(){
	d3.selectAll(".state").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	d3.selectAll(".county").style("opacity",1).style("stroke",null).style("stroke-width",0.2)
	county_sel=[]
	state_sel=[]
	//trying to draw choropleth for state
	request = new XMLHttpRequest();
	request.open("GET", "https://api.census.gov/data/2015/acs1?get=NAME,B01003_001E&for=state:*&key=", false);
	request.send();
	request=JSON.parse(request.response)

	var maxpop=0
	var minpop=5000000
	for(i=1;i<=no_states;i++){
		//values I'm getting were of string datatype. I converted them to integer before comparing
		var temp=parseInt(request[i][1])
		if(maxpop<temp)maxpop=temp;
		
		if(minpop>temp)minpop=temp;
	}
	
	var range=maxpop-minpop
	var linearScale = d3.scale.linear()
		.domain([minpop,maxpop])
		.range([0,8]);

	for(i=1;i<=no_states;i++){
		d3.select("#state"+parseInt(request[i][2])).classed("q"+parseInt(linearScale(request[i][1])),true)
	}
	
	//drawing choropleth for counties
	request = new XMLHttpRequest();
	request.open("GET", "https://api.census.gov/data/2015/acs1?get=NAME,B01003_001E&for=county:*&key=", false);
	request.send();
	request=JSON.parse(request.response)

	var maxpop=0
	var minpop=5000000
	for(i=1;i<=no_states;i++){
		//values I'm getting were of string datatype. I converted them to integer before comparing
		var temp=parseInt(request[i][1])
		if(maxpop<temp)maxpop=temp;
		
		if(minpop>temp)minpop=temp;
	}
	var range=maxpop-minpop

	var linearScale = d3.scale.linear()
		.domain([minpop,maxpop])
		.range([0,8]);
		
	for(i=1;i<=no_counties;i++){
		d3.select("#county"+parseInt(request[i][2])+request[i][3]).classed("q"+parseInt(linearScale(request[i][1])),true)
	}
	console.log(temp)
}
//48043 in texas