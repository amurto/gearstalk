import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
const Donut: React.FC = () => {
  useEffect(() => {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end
    let chart = am4core.create("donutChart", am4charts.PieChart);

    // Add data
    chart.data = [
      {
        label: "Red",
        amount: 501.9,
      },
      {
        label: "Blue",
        amount: 301.9,
      },
      {
        label: "Green",
        amount: 201.1,
      },
      {
        label: "Yellow",
        amount: 165.8,
      },
      {
        label: "Orange",
        amount: 139.9,
      },
      {
        label: "Black",
        amount: 128.3,
      },
      {
        label: "Light Blue",
        amount: 99,
      },
      {
        label: "Light Green",
        amount: 60,
      },
      {
        label: "Purple",
        amount: 50,
      },
    ];

    // Set inner radius
    chart.innerRadius = am4core.percent(50);

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.colors.list = [
      am4core.color("#fc1722"), // red
      am4core.color("#260ceb"), // blue
      am4core.color("#48b811"), // green
      am4core.color("#fcef30"), // yellow
      am4core.color("#fa8b1b"), // orange
      am4core.color("#000000"), // light blue
      am4core.color("#19e6fc"), // light blue
      am4core.color("#36ff33"), // light green
      am4core.color("#e838ff"), // purple
    ];
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "label";
    // pieSeries.alignLabels = false;
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div style={{ maxWidth: "80vw", overflowX: "auto", textAlign: "center" }}>
      <div
        style={{ width: "400px", height: "300px", display: "inline-block" }}
        id="donutChart"
      />
    </div>
  );
};

export default Donut;
