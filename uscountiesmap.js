var countyMap = d3.select("#county").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("uscounties.json", function(error, us) {
    if (error) return console.error(error);
    console.log(us);

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