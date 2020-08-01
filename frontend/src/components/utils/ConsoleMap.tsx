import React, { useState, useEffect, useContext } from "react";

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/indiaHigh";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "./LoadingSpinner";

/* Chart code */

const ConsoleMap: React.FC = () => {
  const colorSet = "#2563ff";
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const [mapData, setMapData] = useState<{ [key: string]: any }[]>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cctv/getcctv",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        let newData = responseData.map((r) => {
          return {
            title: r.sublocality,
            latitude: r.latitude,
            longitude: r.longitude,
            color: colorSet,
          };
        });
        setMapData(newData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMapData();
  }, [auth.token, sendRequest]);

  useEffect(() => {
    if (!mapData) return;
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create("indChart", am4maps.MapChart);

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

    circle2.events.on("inited", function (event) {
      animateBullet(event.target);
    });

    function animateBullet(circle) {
      let animation = circle.animate(
        [
          { property: "scale", from: 1, to: 5 },
          { property: "opacity", from: 1, to: 0 },
        ],
        3000,
        am4core.ease.circleOut
      );
      animation.events.on("animationended", function (event) {
        animateBullet(event.target.object);
      });
    }

    imageSeries.data = mapData || [];

    return () => {
      chart.dispose();
    };
  }, [mapData]);

  return (
    <React.Fragment>
      {isLoading ? (
        <div style={{ padding: "100px 0px" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div style={{ width: "100%", height: "400px" }} id="indChart" />
      )}
    </React.Fragment>
  );
};

export default ConsoleMap;
