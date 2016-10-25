
var selected = []; 
var no_states=52;
var no_counties=830;
var states={}
var counties={}
var request = new XMLHttpRequest();

// on click colors the state and adds non-duplicate IDs and names to respective arrays
function stateSelect(d) {
	console.log(d)
	if (d3.event.defaultPrevented) return;//this line prevents selection if dragging took place
	if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false)
		d3.select(this).classed("unselected", true)
		console.log(selected);
	}
    else{
		d3.select(this).classed("unselected", false)
	    d3.select(this).classed("selected", state = d);
		selected.push(d.id)
		console.log(selected);
		var others = d3.selectAll(".state")
		for (i=0; i<51; i++){		
			if(!(selected.includes(Number(others[0][i].id.slice(5))))){
				d3.select(others[0][i]).classed("unselected", true)
			}
		}
	}
}

function countySelect(d) {
	if (d3.event.defaultPrevented) return;
    if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false)
		d3.select(this).classed("unselected", true)
		console.log(selected);
	}
    else{
		d3.select(this).classed("unselected", false)
	    d3.select(this).classed("selected", county = d);
	    selected.push(d.id)
	    console.log(selected); 
		var others = d3.selectAll(".county")
		for (i=0; i<830; i++){		
			if(!(selected.includes(Number(others[0][i].id.slice(6))))){
				d3.select(others[0][i]).classed("unselected", true)
			}
		}
	}
}
//Loading Data
//Filling States
request.open("GET", "https://api.census.gov/data/2015/acs1?get=NAME,B01003_001E&for=state:*&key=", false);
request.send();
request=JSON.parse(request.response)

for(i=1;i<=no_states;i++){
	temp={"name":request[i][0],"counties":{}}
	states[request[i][2]]=temp
}

//Filling  Counties
request = new XMLHttpRequest();
request.open("GET", "https://api.census.gov/data/2015/acs1?get=NAME,B01003_001E&for=county:*&key=", false);
request.send();
request=JSON.parse(request.response)
for(i=1;i<=no_counties;i++){
	states[request[i][2]]["counties"][request[i][2]+request[i][3]]=request[i][0]
}
console.log(states)

function work(){
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
	console.log("minimum population is:"+minpop)
	console.log("maximum population is:"+maxpop)
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


	console.log(request.length)
	var maxpop=0
	var minpop=5000000
	for(i=1;i<=no_states;i++){
		//values I'm getting were of string datatype. I converted them to integer before comparing
		var temp=parseInt(request[i][1])
		if(maxpop<temp)maxpop=temp;
		
		if(minpop>temp)minpop=temp;
	}
	console.log("minimum population is:"+minpop)
	console.log("maximum population is:"+maxpop)
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