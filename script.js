var selected = []; 

// on click colors the state and adds non-duplicate IDs and names to respective arrays
function stateSelect(d) {
	if (d3.event.defaultPrevented) return;//this line prevents selection if dragging took place
	if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false);
		console.log(selected);
	}
    else{
	    d3.select(this).classed("selected", state = d);
	    selected.push(d.id)
	    console.log(selected); 
	}
}
function countySelect(d) {
	if (d3.event.defaultPrevented) return;
    if(selected.includes(d.id)){
		selected.splice(selected.indexOf(d.id),1)
		d3.select(this).classed("selected", false);
		console.log(selected);
	}
    else{
	    d3.select(this).classed("selected", state = d);
	    selected.push(d.id)
	    console.log(selected); 
	}
}