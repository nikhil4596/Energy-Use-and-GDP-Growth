var slider = document.getElementById('slider');
var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x);


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end");

svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", -45)
    .attr("x", -2*height/5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

var current_year = 1995;

d3.csv("Dataset/AlternativeV2.csv", function(error, data) {
    draw(data)
    slider.addEventListener("change", function () {
        document.getElementById('value').innerHTML = slider.value;
        current_year = slider.value;
        console.log(current_year);
        console.log(data);
        draw(data);
    });
});

function draw(data) {


    data.sort(function (a, b) {
        return b[current_year] - a[current_year];
    });
    data = data.slice(0, 20);
    x.domain(data.map(function(d) { return d.Code; }));
    y.domain([0, 100]);

    svg.select(".x.axis").transition().duration(500).call(xAxis);
    svg.select(".y.axis").transition().duration(500).call(yAxis);

    var bars = svg.selectAll(".bar").data(data, function(d) { return d.Code; });

    bars.exit()
        .transition()
        .duration(500)
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", y(0))
        .attr("height", height - y(0));

    bars.transition().duration(500).attr("x", function(d) { return x(d.Code); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(parseFloat(d[current_year])); })
        .attr("height", function(d) { return height - y(parseFloat(d[current_year])); });

}
