/**
 * Created by Nick on 7/23/2017.
 */
var svg2 = d3.select("#linechart svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg2.attr("width") - margin.left - margin.right,
    height = svg2.attr("height") - margin.top - margin.bottom,
    g = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var country;

var countriesGDP;

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .x(function (d) {
        return x(d.year);
    })
    .y(function (d) {
        return y(d.percentage);
    });

d3.csv("cleanGDPdata.csv", function (error, data) {
    if (error) throw error;
    countriesGDP = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {year: parseTime(d.Year), percentage: +d[id]};
            })
        };
    });
});

d3.csv("Dataset/AlternativeV2Line.csv", function (error, data) {
    if (error) throw error;
    var countries = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {year: parseTime(d.Year), percentage: +d[id]};
            })
        };
    });

    console.log(countries);
    x.domain([parseTime(1990), parseTime(1992)]);

    y.domain([
        d3.min(countries, function (c) {
            if (selectedCountries.includes(c.id)) {
                return d3.min(c.values, function (d) {
                    return d.percentage;
                });
            }
        }),
        d3.max(countries, function (c) {
            if (selectedCountries.includes(c.id)) {
                return d3.max(c.values, function (d) {
                    return d.percentage;
                });
            }
        })
    ]);

    z.domain(countries.map(function (c) {
        return c.id;
    }));
    var t = d3.transition()
        .duration(6000)
        .ease(d3.easeLinear);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Percent Growth");


    country = g.selectAll(".country")
        .data(countries)
        .enter().append("g")
        .attr("class", "country");

    drawCountryLine = function (countryName) {
        y.domain([
            d3.min(countries, function (c) {
                if (selectedCountries.includes(c.id)) {
                    return d3.min(c.values, function (d) {
                        return d.percentage;
                    });
                }
            }),
            d3.max(countries, function (c) {
                if (selectedCountries.includes(c.id)) {
                    return d3.max(c.values, function (d) {
                        return d.percentage;
                    });
                }
            })
        ]);
        if (current_year == null || current_year < 1991) {
            x.domain([parseTime(1990), parseTime(1991)]);
        } else {
            x.domain([parseTime(1990), parseTime(current_year)]);
        }

        d3.select(".axis--y").call(d3.axisLeft(y));
        d3.select(".axis--x").call(d3.axisBottom(x));
        country.selectAll("path").remove();
        country.selectAll("text").remove();
        country.selectAll("circle").remove();
        svg2.selectAll(".dot").remove();

        country.append("path")
            .attr("class", "line")
            .attr("d", function (d) {
                if (selectedCountries.includes(d.id)) {
                    return line(d.values.filter(function (s) {
                        if (current_year == null || current_year < 1991) {
                            return s.year <= parseTime(1991);
                        } else {
                            return s.year <= parseTime(current_year);
                        }
                    }));
                }
            })
            .attr("stroke-dasharray", function (d) {
                return this.getTotalLength()
            })
            .attr("stroke-dashoffset", function (d) {
                return this.getTotalLength()
            })
            .style("stroke", function (d) {
                return z(d.id);
            }).transition(t)
            .attr("stroke-dashoffset", 0);

        country.append("text")
            .datum(function (d) {
                let filteredVals = d.values.filter(function (s) {
                    if (current_year == null || current_year < 1991) {
                        return s.year <= parseTime(1991);
                    } else {
                        return s.year <= parseTime(current_year);
                    }
                });
                return {id: d.id, value: filteredVals[filteredVals.length - 1]};
            })
            .attr("transform", function (d) {
                return "translate(" + (x(d.value.year) + 10) + "," + y(d.value.percentage) + ")";
            })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function (d) {
                if (selectedCountries.includes(d.id)) {
                    return d.id;
                }
            });

        let filteredVals = countriesGDP.filter(function (s) {
            return selectedCountries.includes(s.id)
        });
        if (filteredVals !== undefined) {
            for (let i = 0; i <current_year - 1989; i++) {

                svg2.selectAll("dot")
                    .data(filteredVals)
                    .enter().append("circle")
                    .attr('class', 'dot')
                    .attr("r", function (d) {
                        // let gdpVals = countriesGDP.filter(function (s) {
                        //         return selectedCountries.includes(s.id);
                        // })
                        for (let x of d.values) {
                            if (x.year.toString() === parseTime(i + 1990).toString()) {
                                return 10 + (x.percentage);
                            }
                        }
                    })
                    .attr("cx", function (d) {
                        let filteredVals = d.values.filter(function (s) {
                            if (current_year == null || current_year < 1991) {
                                return s.year <= parseTime(1991);
                            } else {
                                return s.year <= parseTime(current_year);
                            }
                        });
                        // if (selectedCountries.includes(d.id)) {
                        return x(filteredVals[i].year) + 50;
                        // }
                    })
                    .attr("cy", function (d) {
                        let filteredVals2 = countries.filter(function (s) {
                            return s.id === d.id;
                        });
                        // console.log("Country :::::: " + filteredVals2[0].values);
                        filteredVals2 = filteredVals2[0].values.filter(function (s) {
                            if (current_year === null || current_year < 1991) {
                                return s.year <= parseTime(1991);
                            } else {
                                return s.year <= parseTime(current_year);
                            }
                        });
                        // console.log("THe cY value" + filteredVals2[filteredVals2.length - 1].percentage);
                        return y(filteredVals2[i].percentage) + 15;
                    })
                    .style("fill", function (d) {
                        return z(d.id);
                    });
            }
        }
    }
})


