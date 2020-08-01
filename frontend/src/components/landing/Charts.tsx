import React, { useEffect } from 'react';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */

const WorldMap: React.FC = () => {
  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create("cctvChart", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;


    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    // Add image series
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText = "{title}";

    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3;
    circle.propertyFields.fill = "color";

    let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";


    circle2.events.on("inited", function(event){
      animateBullet(event.target);
    })


    function animateBullet(circle) {
        let animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 3000, am4core.ease.circleOut);
        animation.events.on("animationended", function(event){
          animateBullet(event.target.object);
        })
    }

    let colorSet = "#2563ff";

    imageSeries.data = [ {
      "title": "Brussels",
      "latitude": 50.8371,
      "longitude": 4.3676,
      "color":colorSet
    }, {
      "title": "Copenhagen",
      "latitude": 55.6763,
      "longitude": 12.5681,
      "color":colorSet
    }, {
      "title": "Paris",
      "latitude": 48.8567,
      "longitude": 2.3510,
      "color":colorSet
    }, {
      "title": "Reykjavik",
      "latitude": 64.1353,
      "longitude": -21.8952,
      "color":colorSet
    }, {
      "title": "Moscow",
      "latitude": 55.7558,
      "longitude": 37.6176,
      "color":colorSet
    }, {
      "title": "Madrid",
      "latitude": 40.4167,
      "longitude": -3.7033,
      "color":colorSet
    }, {
      "title": "London",
      "latitude": 51.5002,
      "longitude": -0.1262,
      "color":colorSet
    }, {
      "title": "Peking",
      "latitude": 39.9056,
      "longitude": 116.3958,
      "color":colorSet
    }, {
      "title": "New Delhi",
      "latitude": 28.6353,
      "longitude": 77.2250,
      "color":colorSet
    },{
      "title": "Mumbai",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "color":colorSet
    },{
      "title": "Kerala",
      "latitude": 10.8505,
      "longitude": 76.2711,
      "color":colorSet
    },{
      "title": "Banglore",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "color":colorSet
    }, {
      "title": "Tokyo",
      "latitude": 35.6785,
      "longitude": 139.6823,
      "color":colorSet
    }, {
      "title": "Ankara",
      "latitude": 39.9439,
      "longitude": 32.8560,
      "color":colorSet
    }, {
      "title": "Buenos Aires",
      "latitude": -34.6118,
      "longitude": -58.4173,
      "color":colorSet
    }, {
      "title": "Brasilia",
      "latitude": -15.7801,
      "longitude": -47.9292,
      "color":colorSet
    }, {
      "title": "Ottawa",
      "latitude": 45.4235,
      "longitude": -75.6979,
      "color":colorSet
    }, {
      "title": "Washington",
      "latitude": 38.8921,
      "longitude": -77.0241,
      "color":colorSet
    }, {
      "title": "Kinshasa",
      "latitude": -4.3369,
      "longitude": 15.3271,
      "color":colorSet
    }, {
      "title": "Cairo",
      "latitude": 30.0571,
      "longitude": 31.2272,
      "color":colorSet
    }, {
      "title": "Pretoria",
      "latitude": -25.7463,
      "longitude": 28.1876,
      "color":colorSet
    } ];

    return () => {
        chart.dispose();
    }
  }, [])

  return (
    <div style={{ width: "100%", height: '400px' }} id="cctvChart" />
  );
}


const PieChart: React.FC = () => {
  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("pieChart", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        feature: 'Blazer',
        detected: 201
      },
      {
        feature: 'Burkha',
        detected: 161
      },
      {
        feature: 'Chudidar',
        detected: 121
      },
      {
        feature: 'Long-pants',
        detected: 98
      },
      {
        feature: 'Saree',
        detected: 62
      },
      {
        feature: 'Kurta',
        detected: 42
      },
      {
        feature: 'Skirt',
        detected: 29
      },
      {
        feature: 'Strip-dress',
        detected: 18
      },
      {
        feature: 'shirt',
        detected: 12
      },
      {
        feature: 'Trousers',
        detected: 5
      }
    ];

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;

    chart.legend = new am4charts.Legend();

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "detected";
    series.dataFields.depthValue = "detected";
    series.dataFields.category = "feature";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;

    return () => {
      chart.dispose();
    }
  }, [])

  return (
    <div style={{ maxWidth: '90vw', overflowX: 'auto' }}>
      <div style={{ width: '600px', height: '400px' }} id="pieChart" />
    </div>
  );
}

export {
  PieChart,
  WorldMap,
};