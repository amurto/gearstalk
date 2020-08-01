import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import ChartLabel from "./ChartLabel";
interface Props {
  data: any[];
}
const Bar: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("ChartDiv", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "Clothing";
    // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //   if (target.dataItem && target.dataItem.index & 2 == 2) {
    //     return dy + 25;
    //   }
    //   return dy;
    // });

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Total Number Of Clothing";
    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value1";
    series.dataFields.categoryX = "category";
    series.name = "Lables";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    // }); // end am4core.ready()

    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <div style={{ maxWidth: "100vw", overflowX: "auto", textAlign: "center" }}>
      <ChartLabel>
          The chart illustrates the number of people wearing a particular type of clothing
      </ChartLabel>
      <div
        style={{ width: "600px", height: "400px", display: "inline-block" }}
        id="ChartDiv"
      />
    </div>
  );
};

export default Bar;
