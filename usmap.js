var width = 960,
    height = 550;

var semaphore = 0;
var projection = d3.geo.albersUsa()
    .scale(750)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

d3.json("uscounties.json", function(error, us) {
    if (error) return console.error(error);
    console.log(us);
    var stateMap = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom()
        .scaleExtent([.8, 5])
        .on("zoom", function () {
            if(d3.event.scale>=1.5 && semaphore==0){
                semaphore=1
                d3.selectAll(".county").attr("visibility","visible")
                d3.selectAll(".county-boundary").attr("visibility","visible")
            }

            if(d3.event.scale<1.4 && semaphore==1){
                semaphore=0
                d3.selectAll(".county").attr("visibility","hidden")
                d3.selectAll(".county-boundary").attr("visibility","hidden")
            }

        stateMap.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
    .call(d3.behavior.drag())
    .on("drag", dragged)
    .append("g");
    stateMap.selectAll(".state")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("class", function(d) { return "state " + d.id; })
        .attr("d", path)
        .on("click", stateSelect)

    stateMap.selectAll(".county")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("visibility","hidden")
        .attr("class", function(d) { return "county " + d.id; })
        .attr("d", path)
        .on("click", countySelect)
    
    stateMap.append("path")
        .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b;}))
        .attr("d", path)
        .attr("visibility","hidden")
        .attr("class", "county-boundary");
    
    stateMap.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b;}))
        .attr("d", path)
        .attr("class", "state-boundary");

    stateMap.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a === b;}))
        .attr("d", path)
        .attr("class", "state-boundary exterior");
    });

function dragged(d) {
  d[0] = d3.event.x, d[1] = d3.event.y;
  if (this.nextSibling) this.parentNode.appendChild(this);
  d3.select(this).attr("transform", "translate(" + d + ")");
}
