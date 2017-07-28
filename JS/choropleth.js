//SOme global variables
var current_year = 1990;
var map;
var format = function (d) {
    d = d / 1;
    return d3.format(',.02f')(d) + '%';
};


map = d3.geomap.choropleth()
    .geofile('vendor/d3.geomap-1.0.2/topojson/world/countries.json')
    .colors(colorbrewer.YlGnBu[9])
    .column(current_year.toString())
    .format(format)
    .legend(true)
    .unitId('Code');


d3.csv("Dataset/AlternativeV2.csv", function (error, data) {
        d3.select('#map')
            .datum(data)
            .call(map.draw, map);


    }
);
function updateMapWithBarChart(e){
    d3.selectAll(".unit").classed('red', false);
    selectedCountryCodes.forEach(function (e) {
        console.log(e);
        // console.log($(".unit-"+e));
        console.log(d3.select(".unit-"+e));
        d3.select(".unit-"+e).classed('red', true)
        // changeColorCountry(e);

    });
}

// console.log((d3.select(".unit-AFG")[0][0]).attr('class'));



// var targetCountry = $('.unit-'+e.currentTarget.value);
//
// if (targetCountry.hasClass('red')) {
//     targetCountry.removeClass('red');
// } else {
//     targetCountry.addClass('red');
// }

// foreach (selectedCountryCodes, function(i, v) {
//     console.log($(".unit-"+v));
//     $(".unit-"+v).addClass("red");
// })


function drawMap(currentYear, datasetName) {

    d3.select('#map').select('svg').transition().duration(50).remove();

    map = d3.geomap.choropleth()
        .geofile('vendor/d3.geomap-1.0.2/topojson/world/countries.json')
        .colors(colorbrewer.YlGnBu[9])
        .column(currentYear.toString())
        .format(format)
        .legend(true)
        .unitId('Code');

    d3.csv(datasetName, function (error, data) {
            d3.select('#map')
                .datum(data)
                .call(map.draw, map);
        }
    );


}

function updateMap(currentYear) {
    map.column(currentYear.toString()).update();
}

$('#alternativeEnergy').click(function () {
    console.log("ChoroplethMap switch to Alternate");
    drawMap(current_year, "dataset/AlternativeV2.csv");
});
$('#renewableEnergy').click(function () {
    console.log("ChoroplethMap switch to Renewable");
    drawMap(current_year, "dataset/CleanRenewableV2.csv");
});

$('#gdpGrowth').click(function () {
    console.log("ChoroplethMap switch to GDP");
    drawMap(current_year, "dataset/CleanGDPdata.csv");
});

$(document).on("barChartUpdated", updateMapWithBarChart);



slider.addEventListener("change", function () {
    updateMap(slider.value);
});
console.log("SELECTED COUNTRY CODE:");
console.log(selectedCountryCodes);

