var clutter = []; 
var selected = []; //array to store unique ids of selected regions
var clutterN = []; 
var selectedNames = []; //array to store unique names of selected regions

var width = 960,
    height = 500;

var stateMap = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", function () {
        stateMap.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
    .append("g");
    //creates svg as stateMap and allows users pan and zoom behavior

d3.json("usstates.json", function(error, us) {
    if (error) return console.error(error);
    console.log(us);
    //gets json data and draws map or displays error if json loading fails
    var subunits = topojson.feature(us, us.objects.states);

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    stateMap.append("path")
        .datum(subunits)
        .attr("d", path);

    stateMap.selectAll(".state")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("class", function(d) { return "state " + d.id; })
        .attr("d", path)
        .on("click", click);

    stateMap.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b;}))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    stateMap.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a === b;}))
        .attr("d", path)
        .attr("class", "subunit-boundary exterior");

});

// on click colors the state and adds non-duplicate IDs and names to respective arrays
function click(d) {
    d3.select(this).classed("selected", state = d);
    clutter.push(state.id.slice(2,4));
    selected = $.unique(clutter); //this gets rid of duplicates
    clutterN.push(state.properties.name);
    selectedNames = $.unique(clutterN); 
    console.log(selected, selectedNames); 
}

var countyMap = d3.select("#county").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("uscounties.json", function(error, us) {
    if (error) return console.error(error);

    var subunits = topojson.feature(us, us.objects.counties);

    var projection = d3.geo.albersUsa()
        .scale(750)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    countyMap.append("path")
        .datum(subunits)
        .attr("d", path);

    countyMap.selectAll(".county")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("class", function(d) { return "county " + d.id; })
        .attr("d", path);

    countyMap.append("path")
        .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b;}))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    countyMap.append("path")
        .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a === b;}))
        .attr("d", path)
        .attr("class", "subunit-boundary exterior");

});