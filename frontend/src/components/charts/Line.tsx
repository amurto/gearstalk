import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import ChartLabel from "./ChartLabel";

interface Props {
  data: any[]
}

const Line: React.FC<Props> = ({ data }) => {
    useEffect(() => {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      // Themes end
      // Create chart instance
      let chart = am4core.create("lineDiv", am4charts.XYChart);
      // // Add data
      chart.data = data;
      // Set input format for the dates
      // Create axes
      let valueAxis1 = chart.xAxes.push(new am4charts.ValueAxis());
      // eslint-disable-next-line
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis1.title.text = "Total Frames";
      valueAxis.title.text = "Total Number Of People In Each Frame";
      // Create series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.valueX = "date";
      series.tooltipText = "{value}";
      series.strokeWidth = 2;
      series.minBulletDistance = 15;
      // Drop-shaped tooltips
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";
      // Make bullets grow on hover
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#fff");
      let bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;
      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = valueAxis1;
      chart.cursor.snapToSeries = series;
      // Create vertical scrollbar and place it before the value axis
      chart.scrollbarY = new am4core.Scrollbar();
      chart.scrollbarY.parent = chart.leftAxesContainer;
      chart.scrollbarY.toBack();
      // Create a horizontal scrollbar with previe and place it underneath the date axis
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      valueAxis1.start = 0.00;
      valueAxis1.keepSelection = true;
  
      return () => {
        chart.dispose();
      };
    }, [data]);
    return (
      <div style={{ maxWidth: "100vw", overflowX: "auto", textAlign: "center" }}>
        <ChartLabel>
          The graph shows how crowded the area is, at a specific time frame.
        </ChartLabel>
        <div style={{ width: "1200px", height: "400px", display: "inline-block" }} id="lineDiv" />
      </div>
    );
  };

export default Line;
