var selected = []; 

// on click colors the state and adds non-duplicate IDs and names to respective arrays
function stateSelect(d) {
	if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false);
	}
    else{
	    d3.select(this).classed("selected", state = d);
	    selected.push(d.id)
	    console.log(selected); 
	}
}
function countySelect(d) {
    if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false);
	}
    else{
	    d3.select(this).classed("selected", state = d);
	    selected.push(d.id)
	    console.log(selected); 
	}
}