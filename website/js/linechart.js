
// Draw a line chart
//var svg = d3.select('svg'),
var svgGraph = d3.select('#mylines'),
  margin = { top: 20, right: 70, bottom: 30, left: 50 },
  //width = 960 - margin.left - margin.right,
  width = +svgGraph.attr('width') - margin.left - margin.right,
  //height = 500 - margin.top - margin.bottom,
  height = +svgGraph.attr('height') - margin.top - margin.bottom,
  g = svgGraph.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// Graph title
g.append('text')
  .attr('x', (width / 2))             
  .attr('y', 0 - (margin.top / 3))
  .attr('text-anchor', 'middle')  
  .style('font-size', '16px') 
  .text('Covid Statistics for selected region');
// Function to convert a string into a time
var parseTime = d3.time.format('%Y-%m-%d %H:%M').parse;
// Function to show specific time format
var formatTime = d3.time.format('%e %B');

// Set the X scale
var x = d3.time.scale().range([0, width], 0.5);
// Set the Y scale
var y = d3.scale.linear().range([height, 0]);
// Set the color scale
var color = d3.scale.category10();

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");

var line = d3.svg.line()
// .interpolate("basis")
.x(function(d) {
  return x(d.date);
})
.y(function(d) {
  return y(d.worth);
});




function deletee() { 
//d3.select("svgGraph").remove();
//d3.selectAll("svgGraph > *").remove();
svgGraph.selectAll('*').remove();
}

function update(mydata) {

deletee()

//var buttons = document.getElementsByClassName('button');
//var parent = this.parentNode;
//var buttonname = parent.getElementsByTagName("button");
//var buttonname = document.getElementById("mylines").value;

// Draw a line chart
//var svg = d3.select('svg'),
var svgGraph = d3.select('#mylines'),
  margin = { top: 20, right: 70, bottom: 30, left: 50 },
  //width = 960 - margin.left - margin.right,
  width = +svgGraph.attr('width') - margin.left - margin.right,
  //height = 500 - margin.top - margin.bottom,
  height = +svgGraph.attr('height') - margin.top - margin.bottom,
  g = svgGraph.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
// Graph title
g.append('text')
  .attr('x', (width / 2))             
  .attr('y', 0 - (margin.top / 3))
  .attr('text-anchor', 'middle')  
  .style('font-size', '16px') 
  .text('Evolution of various Covid statistics over time in different regions');










	
  // load the data
d3.json(mydata, function(error, data) {
  // Select the important columns
  color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "Time" && key !== "_id";
  }));
  // Correct the types
  data.forEach(function(d) {
    d.date = parseTime(d.Time);
  });
  console.log(data);
  /*
	  d3.select("body").selectAll("input")
	.data([11, 22, 33, 44])
	.enter()
	.append('label')
		.attr('for',function(d,i){ return 'a'+i; })
		.text(function(d) { return d; })
	.append("input")
		.attr("checked", true)
		.attr("type", "checkbox")
		.attr("id", function(d,i) { return 'a'+i; })
		.attr("onClick", "change(this)");
		
		
		d3.select("body").selectAll("input")
	.data([11, 22, 33, 44])
	.enter()
	.append("label")
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("id", function(d,i) { return i; })
	.attr("onClick", "change(this)")
	.attr("for", function(d,i) { return i; });
 */
d3.selectAll("label").text(function(d) { return d; });

  var currencies = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.date,
          worth: +d[name]
        };
      })
    };
  });
  console.log(currencies)
  // Set the X domain
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  // Set the Y domain
  y.domain([
    d3.min(currencies, function(c) {
      return d3.min(c.values, function(v) {
        return v.worth;
      });
    }),
    d3.max(currencies, function(c) {
      return d3.max(c.values, function(v) {
        return v.worth;
      });
    })
  ]);
  // Set the X axis
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  // Set the Y axis
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Covid Cases (%)");

  // Draw the lines
  var currency = g.selectAll(".currency")
    .data(currencies)
    .enter().append("g")
    .attr("class", "currency");

  currency.append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.values);
    })
    .style("stroke", function(d) {
      return color(d.name);
    });
  // Add the circles
  currency.append("g").selectAll("circle")
    .data(function(d){return d.values})
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("cx", function(dd){return x(dd.date)})
    .attr("cy", function(dd){return y(dd.worth)})
    .attr("fill", "none")
    .attr("stroke", function(d){return color(this.parentNode.__data__.name)});
  // Add label to the end of the line
  currency.append("text")
    .attr("class", "label")
    .datum(function (d) {
      return {
        name: d.name,
        value: d.values[d.values.length - 1]
      };
    })
    .attr("transform", function (d) {
      return "translate(" + x(d.value.date) + "," + y(d.value.worth) + ")";
    })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.name;
  });

// Add the mouse line
var mouseG = g.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(currencies)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function (d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "2px")
  .style("opacity", "0");

mousePerLine.append("text")
    .attr("class", "hover-text")
    .attr("dy", "-1em")
    .attr("transform", "translate(10,3)");

// Append a rect to catch mouse movements on canvas
mouseG.append('svg:rect') 
  .attr('width', width) 
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function () { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function () { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function () { // mouse moving over canvas
    var mouse = d3.mouse(this);

    d3.selectAll(".mouse-per-line")
      .attr("transform", function (d, i) {

        var xDate = x.invert(mouse[0]),
          bisect = d3.bisector(function (d) { return d.date; }).left;
        idx = bisect(d.values, xDate);

        d3.select(this).select('text')
          .text(y.invert(y(d.values[idx].worth)).toFixed(2));

        d3.select(".mouse-line")
          .attr("d", function () {
            var data = "M" + x(d.values[idx].date) + "," + height;
            data += " " + x(d.values[idx].date) + "," + 0;
            return data;
          });
        return "translate(" + x(d.values[idx].date) + "," + y(d.values[idx].worth) + ")";
      });
  });
    

});


};




function getVals(){
  // Get slider values
  var parent = this.parentNode;
  var slides = parent.getElementsByTagName("input");
  var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
		   
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
  // Neither slider will clip the other, so make sure we determine which is larger
  if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
  
  var displayElement = parent.getElementsByClassName("rangeValues")[0];
  
  var dayNumber1 = slide1%31
  var dayNumber2 = slide2%31
  var monthNumber1 = Math.floor(slide1/30)
  var monthNumber2 = Math.floor(slide2/30)
  var selectedMonth1 = months[monthNumber1];
  var selectedMonth2 = months[monthNumber2];
  
      //displayElement.innerHTML =dayNumber1 + " " + dayNumber2
	  displayElement.innerHTML = selectedMonth1 + " "+ dayNumber1 +" 2020    -     " + selectedMonth2 +" " +dayNumber2+" 2020";
}

window.onload = function(){
  // Initialize Sliders
  var sliderSections = document.getElementsByClassName("range-slider");
      for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
          if( sliders[y].type ==="range" ){
            sliders[y].oninput = getVals;
            // Manually trigger event first time to display values
            sliders[y].oninput();
          }
        }
      }
}