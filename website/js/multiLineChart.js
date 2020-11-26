// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 70, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });

var duration = 250;
var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;


// Adds the svg canvas
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 4000)
    .attr("height", height + margin.top + margin.bottom + 4000)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ") scale(2)");

// Get the data
d3.csv("data/stocks copy 2.csv", function (error, data) {
    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function (d) { return d.symbol; })
        .entries(data);

    var color = d3.scale.category10();   // set the colour scale
    legendSpace = width / dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function (d, i) {

        svg.append("path")
            .attr("class", "line")
            .style("stroke", function () { // Add the colours dynamically
                return d.color = color(d.key);
            })
            .attr("id", 'tag' + d.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values))

        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace / 2) + i * legendSpace)  // space legend
            .attr("y", height + (margin.bottom / 2) + 5)
            .attr("class", "legendMultiLine")    // style the legend
            .style("fill", function () { // Add the colours dynamically
                return d.color = color(d.key);
            })
            .on("click", function () {
                // Determine if current line is visible 
                var active = d.active ? false : true,
                    newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            })
            .text(d.key);

    });

    //adding dots to the line
    // let lines = svg.append('g')
    //     .attr('class', 'priceline');

    // /* Add circles in the line */
    // lines.selectAll("circle-group")
    //     .data(data).enter()
    //     .append("g")
    //     .style("fill", (d, i) => color(i))
    //     .selectAll("circle")
    //     .data(d => d.symbol).enter()
    //     .append("g")
    //     .attr("class", "circle")
    //     .on("mouseover", function (d) {
    //         console.log(d)
    //         d3.select(this)
    //             .style("cursor", "pointer")
    //             .append("text")
    //             .attr("class", "text")
    //             .text(`${d.price}`)
    //             .attr("x", d => x(d.date))
    //             .attr("y", d => y(d.price));
    //     })
    //     .on("mouseout", function (d) {
    //         d3.select(this)
    //             .style("cursor", "none")
    //             .transition()
    //             .duration(duration)
    //             .selectAll(".text").remove();
    //     })
    //     .append("circle")
    //     .attr("cx", d => x(d.date))
    //     .attr("cy", d => y(d.price))
    //     .attr("r", circleRadius)
    //     .style('opacity', circleOpacity)
    //     .on("mouseover", function (d) {
    //         d3.select(this)
    //             .transition()
    //             .duration(duration)
    //             .attr("r", circleRadiusHover);
    //     })
    //     .on("mouseout", function (d) {
    //         d3.select(this)
    //             .transition()
    //             .duration(duration)
    //             .attr("r", circleRadius);
    //     });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});