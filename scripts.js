// define margins
var margin = {top: 50, right: 50, bottom: 150, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// initiate x scale
var x = d3.scaleTime()
  .rangeRound([0, width]);

// initiate y scale
var y = d3.scaleLinear()
  .rangeRound([height, 0]);

// initiate x-axis
var xAxis = d3.axisBottom(x);

// initiate y-axis
var yAxis = d3.axisLeft(y)
  .tickFormat(function(d) { return "$ " + d; });

// initiate tooltip
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// initiate chart
var chart = d3.select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// import json
d3.json("./GDP-data.json", function(error, data) {
  if (error) throw error;

  var description = data.description;
  data = data.data;

  var barWidth = Math.floor(width / data.length) + 1;

  // append description
  chart.append("text")
    .attr("class", "description")
    .attr("x",  width / 2 )
    .attr("y",  height + margin.top + 20)
    .style("text-anchor", "middle")
    .text(description);

  // convert date strings to JS date
  data.forEach(function(d) {
    d[0] = new Date(Date.parse(d[0]));
    d[1] = +d[1];
  });

  // complete x-scale
  x.domain([data[0][0], data[data.length-1][0]]);

  // complete y-scale
  y.domain([0, d3.max(data, function(d) {
    return d[1];
  })]);

  // append x-axis
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // append x-axis label
  chart.append("text")
    .attr("x", width / 2 )
    .attr("y", height + ((margin.top / 4) * 3))
    .style("text-anchor", "middle")
    .text("Date");

  // append y-axis
  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // append y-axis label
  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (height / 2))
    .attr("y", 5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("US GDP in Billions");

  // define months label
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // append bars
  chart.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[0]); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return height - y(d[1]); })
    .attr("width", barWidth)
    .on("mousemove", function(d) {
      tooltip
        .style("left", d3.event.pageX - 80 + "px")
        .style("top", d3.event.pageY - 80 + "px")
        .style("display", "inline-block")
        .html("<div><strong>$ " + d[1].toFixed(2) + " Billion</strong></div><div>" + months[d[0].getMonth()] + " " + d[0].getFullYear() + "</div>");
    })
    .on("mouseout", function() { tooltip.style("display", "none"); });
});
