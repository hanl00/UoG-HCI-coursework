    // Defining dimensions
	var margin = { top: 35, right: 0, bottom: 30, left: 40 };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
		
   // Creating SVG container
    var chart = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 500)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    // http://bl.ocks.org/zanarmstrong/raw/05c1e95bf7aa16c4768e/
    var parseDate = d3.time.format("%Y-%m");
    var displayDate = d3.time.format("%b %y");
    var displayValue = d3.format(",.0f");
    
    // Ordinal scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .5);

    var y = d3.scale.linear()
        .range([height, height - 200]);

    var line = d3.svg.line()
        .x(function(d) { return x(d.name); })
        .y(function(d) { return y(d.value); });
    
    var g = chart.append("g")
    	.attr("transform", "translate(50, 0)")
		
	chart.append("g")
	    .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x);
	  
    chart.append("g")
	    .attr("class", "y axis")
        .call(y);

    // Importing and processing data
    d3.json("data/dataset.json", function(data) {
        // Pre-processing
        data.forEach(function(d) {
          d.value;// = +d.value;
          d["date"] = parseDate.parse(d["date"]);
        });

        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

      	// Creating circle element for each element
      	g.selectAll("circle").data(data).enter().append("circle")
     			.attr("cx", function(d) { return x(d.name);})
          .attr("cy", function(d) { return y(d.value); })
          .attr("r", 10)
          .style("fill","grey")
        
        	// Treating mouseover event
      		.on("mouseover", function(d) {
          	// Changing style of the circle and defining transition 
            d3.select(this).transition().duration(500)
              .style("fill", "red")
              .attr("r", 20)
            	.style("font-size", 24);
          
          	// Displaying data value above circle
          	g.append("text")
            	.attr("x", function() { return x(d.name) - 5})
            	.attr("y", function() { return y(d.value) - 30})
            	.text(function() { return d.value})
            	.attr("id", "text_id")
            
            // Creating line between circle and axis
            g.append("line")
            	.attr("x1", function() { return x(d.name)})
            	.attr("y1", function() { return y(d.value)})
            	.attr("x2", function() { return x(d.name)})
            	.attr("y2", height)
            	.style("stroke-dasharray","5,5")
            	.style("stroke","black");
            
          })
        	// Treating mouseout event
          .on("mouseout", function(d) {
          	// Putting style back to default values
            d3.select(this)
              .transition().duration(500)
              .style("fill", "grey")
              .attr("r", 10)
              .style("font-size", 12)
            
            // Deleting extra elements
            d3.select("#text_id").remove();
            d3.selectAll("line").remove();
           
          });

      	// Displaying x values
        chart.selectAll("text").data(data).enter()
         .append("text")
          .text(function(d, i) { return displayDate(d.date); })
          .attr("y", 420)
          .attr("x", function(d) { return x(d.name); })
          .style("font-size", 10)
          .style("font-family", "monospace");

      	
      	// Creating paths
        g.selectAll("path").data([data]).enter().append("path")
          //.attr("class", ".line")
          .attr("d", line)
		  .attr("fill", "none")
		  .attr("stroke", "black")
		  .attr("stroke-width", 1.5);

        
      
    });