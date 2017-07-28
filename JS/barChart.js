/**
 * Created by nikhil on 7/14/2017.
 */
var dataset = "Dataset/AlternativeV2.csv";
selectedCountries = [];
selectedCountryCodes = [];
drawCountryLine;

window.onload = function() {
    chart(dataset);
};

$('#alternativeEnergy').click(function () {
    console.log("Switch to Alternate");
    selectedCountries = [];
    selectedCountryCodes = [];
    drawCountryLine("");
    $('#alternativeEnergy').attr("class", "active");
    $('#renewableEnergy').attr("class", "inactive");
    $('#gdpGrowth').attr("class", "inactive");
    dataset = "dataset/AlternativeV2.csv";
    chart("dataset/AlternativeV2.csv");
});
$('#renewableEnergy').click(function () {
    console.log("Switch to Renewable");
    selectedCountries = [];
    selectedCountryCodes = [];
    drawCountryLine("");
    $('#alternativeEnergy').attr("class", "inactive");
    $('#renewableEnergy').attr("class", "active");
    $('#gdpGrowth').attr("class", "inactive");
    dataset = "dataset/CleanRenewableV2.csv";
    chart("dataset/CleanRenewableV2.csv");
});

$('#gdpGrowth').click(function () {
    console.log("Switch to GDP");
    selectedCountries = [];
    selectedCountryCodes = [];
    drawCountryLine("");
    $('#alternativeEnergy').attr("class", "inactive");
    $('#renewableEnergy').attr("class", "inactive");
    $('#gdpGrowth').attr("class", "active");
    dataset = "dataset/CleanGDPdata.csv";
    chart("dataset/CleanGDPdata.csv");
});

$('#animate').click(function () {
    chart(dataset);
})
var current_year = 1995;
var svg = d3.select("#barCH svg"),
    margin = {top: 0, right: 20, bottom: 120, left: 20},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var xB = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    yB = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom(xB);

var yAxis = d3.axisLeft(yB);


var slider = document.getElementById('slider');

function chart(dataset) {
    d3.csv(dataset,function (error, data) {
        if (error) throw error;
        drawBars(data);
        slider.addEventListener("change", function () {
            document.getElementById('value').innerHTML = slider.value;
            current_year = slider.value;
            updateBars(data);
            drawCountryLine("all");
        });
    });
}

var count = 50;
function  drawBars(data) {

    svg.selectAll("*").remove();
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) {
        return b[current_year] - a[current_year];
    });
    data = data.slice(0, count);
    xB.domain(data.map(function (d) { return d.Country; }));
    yB.domain([0,d3.max(data, function(d) { return parseFloat(d[current_year]); })]);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - 20) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-65)")
        .attr("y", -0   )
        .attr("x", -10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    g.append("g")
        .attr("class", "y axis")
        .call(yAxis.ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xB(d.Country);
        })
        .attr("y", function (d) {
            return yB(d[current_year]);
        })
        .attr("width", xB.bandwidth())
        .attr("height", function (d) {
            return (height - 20) - yB(d[current_year]);
        });

    svg.selectAll("rect")
        // .on("mouseover", function (d) {
        // console.log(d3.select(this).attr("x"));
        //
        // })
        .on("click", function (d) {
            if (d.Selected === undefined) {
                selectedCountries.push(d.Country);
                selectedCountryCodes.push(d.Code);
                d3.select(this).style("fill","red");
                drawCountryLine(d.Country);
                d.Selected = true;
            } else if (d.Selected === false) {
                d3.select(this).style("fill","red");
                selectedCountries.push(d.Country);
                selectedCountryCodes.push(d.Code);
                drawCountryLine(d.Country);
                d.Selected = true;
            } else if (d.Selected === true) {
                d.Selected = false;
                d3.select(this).style("fill","steelblue");
                selectedCountries.splice(selectedCountries.indexOf(d.Country),1);
                selectedCountryCodes.splice(selectedCountryCodes.indexOf(d.Code),1);
                drawCountryLine(d.Country);
            }

            $.event.trigger({
                type:"barChartUpdated",
                selectedCountryCodes :selectedCountryCodes
            });

            // console.log(selectedCountryCodes);
            console.log(selectedCountries);
        });

    g.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (-28) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Frequency (% Total)");
}

function updateBars(data) {

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.sort(function (a, b) {
        return b[current_year] - a[current_year];
    });
    data = data.slice(0, count);

    xB.domain(data.map(function (d) { return d.Country; }));
    // yB.domain([0, 100]);
    yB.domain([0,d3.max(data, function(d) { return parseFloat(d[current_year]); })]);


    svg.select(".x.axis").transition().duration(500).call(xAxis)
        .attr("transform", "translate(0," + (height - 20) + ")")
        .selectAll("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-65)")
            .attr("y", 0)
            .attr("x", -10)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end");

    svg.select(".y.axis").transition().duration(500).call(yAxis);


    var bars = svg.select("g").selectAll("rect").data(data);
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", yB(0))
        .attr("height", height - yB(0))
        .style('fill-opacity', 1e-6)
        .remove();
    bars.enter().append("rect");
    bars.transition()
        .duration(500)
        .attr("class", "bar")
        .attr("x", function (d) {
            return xB(d.Country);
        })
        .attr("y", function (d) {
            return yB(d[current_year]);
        })
        .attr("width", xB.bandwidth())
        .attr("height", function (d) {
            return (height - 20) - yB(d[current_year]);
        })
        .style("fill", function (d) {
            if (d.Selected === true) {
                return "red";
            } else {
                return "steelblue";
            }
        });

        svg.selectAll("rect")
        // .on("mouseover", function (d) {
        // console.log(d3.select(this).attr("x"));
        //
        // })
            .on("click", function (d) {
                if (d.Selected === undefined) {
                    selectedCountries.push(d.Country);
                    selectedCountryCodes.push(d.Code);
                    d3.select(this).style("fill","red");
                    drawCountryLine(d.Country);
                    d.Selected = true;
                } else if (d.Selected === false) {
                    d3.select(this).style("fill","red");
                    selectedCountries.push(d.Country);
                    selectedCountryCodes.push(d.Code);
                    drawCountryLine(d.Country);
                    d.Selected = true;
                } else if (d.Selected === true) {
                    d.Selected = false;
                    d3.select(this).style("fill","steelblue");
                    selectedCountries.splice(selectedCountries.indexOf(d.Country),1);
                    selectedCountryCodes.splice(selectedCountryCodes.indexOf(d.Code),1);
                    drawCountryLine(d.Country);
                }

                $.event.trigger({
                    type:"barChartUpdated",
                    selectedCountryCodes :selectedCountryCodes
                });

                // console.log(selectedCountryCodes);
                console.log(selectedCountries);
            });

}



// function add data that appear in barchart to table
// function drawTable(data) {
//     d3.csv(data,function (data) {
//         var columns = ['country','value1','value2','value3']
//         tabulate(data,columns)
//     })
// }
// var tabulate = function (data,columns) {
//     var table = d3.select('#tabular').append('table')
//     var thead = table.append('thead')
//     var tbody = table.append('tbody')
//
//     thead.append('tr')
//         .selectAll('th')
//         .data(columns)
//         .enter()
//         .append('th')
//         .text(function (d) { return d })
//
//     var rows = tbody.selectAll('tr')
//         .data(data)
//         .enter()
//         .append('tr')
//
//     var cells = rows.selectAll('td')
//         .data(function(row) {
//             return columns.map(function (column) {
//                 return { column: column, value: row[column] }
//             })
//         })
//         .enter()
//         .append('td')
//         .text(function (d) { return d.value })
//
//     return table;
// }

// function drawTable(datasetname) {
//     d3.text(datasetname, function(data) {
//         var parsedCSV = d3.csvParseRows(data);
//
//         var container = d3.select("#tabular")
//             .append("table")
//
//             .selectAll("tr")
//             .data(parsedCSV).enter()
//             .append("tr")
//
//             .selectAll("td")
//             .data(function(d) { return d; }).enter()
//             .append("td")
//             .text(function(d) { return d; });
//     });
// }
// console.log("TABLE DATA:");
// console.log(dataset);
//
// drawTable(dataset);
