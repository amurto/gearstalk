import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import ChartLabel from "./ChartLabel";
interface Props {
  data: any[];
}
const Toggle: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("toggleDiv", am4charts.ChordDiagram);

    // colors of main characters
    chart.colors.saturation = 0.45;
    chart.colors.step = 3;
    var colors = {
      Rachel: chart.colors.next(),
      Monica: chart.colors.next(),
      Phoebe: chart.colors.next(),
      Ross: chart.colors.next(),
      Joey: chart.colors.next(),
      Chandler: chart.colors.next(),
    };

    // data was provided by: https://www.reddit.com/user/notrudedude

    chart.data = data;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 80;
    chart.endAngle = chart.startAngle + 360;
    chart.sortBy = "value";
    chart.fontSize = 10;

    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = "color";
    nodeTemplate.tooltipText = "Total {name}'s : {total}";

    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on("over", function (event) {
      var node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
          dataItem.link.isHover = true;
          dataItem.toNode.isHover = true;
        }
      });
      node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
          dataItem.link.isHover = true;
          dataItem.fromNode.label.isHover = true;
        }
      });

      node.label.isHover = true;
    });

    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on("out", function (event) {
      var node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
          dataItem.link.isHover = false;
          dataItem.toNode.isHover = false;
        }
      });
      node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
          dataItem.link.isHover = false;
          dataItem.fromNode.label.isHover = false;
        }
      });

      node.label.isHover = false;
    });

    var label = nodeTemplate.label;
    label.relativeRotation = 90;

    label.fillOpacity = 0.4;
    let labelHS = label.states.create("hover");
    labelHS.properties.fillOpacity = 1;

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
    nodeTemplate.adapter.add("fill", function (fill, target) {
      let node = target;
      let counters = {};
      let mainChar = false;
      node.incomingDataItems.each(function (dataItem) {
        if (colors[dataItem.toName]) {
          mainChar = true;
        }

        if (isNaN(counters[dataItem.fromName])) {
          counters[dataItem.fromName] = dataItem.value;
        } else {
          counters[dataItem.fromName] += dataItem.value;
        }
      });
      if (mainChar) {
        return fill;
      }

      // let count = 0;
      // let color;
      let biggest = 0;
      let biggestName;

      for (var name in counters) {
        if (counters[name] > biggest) {
          biggestName = name;
          biggest = counters[name];
        }
      }
      if (colors[biggestName]) {
        fill = colors[biggestName];
      }

      return fill;
    });

    // link template
    var linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.15;
    linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";

    var hoverState = linkTemplate.states.create("hover");
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;

    // data credit label
    var creditLabel = chart.chartContainer.createChild(am4core.TextLink);
    creditLabel.text = "gearStalk";
    creditLabel.url = "";
    creditLabel.y = am4core.percent(99);
    creditLabel.x = am4core.percent(99);
    creditLabel.horizontalCenter = "right";
    creditLabel.verticalCenter = "bottom";

    var titleImage = chart.chartContainer.createChild(am4core.Image);
    titleImage.href = "";
    titleImage.x = 30;
    titleImage.y = 30;
    titleImage.width = 200;
    titleImage.height = 200;

    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <div style={{ maxWidth: "90vw", overflowX: "auto", textAlign: "center" }}>
      <ChartLabel>
        The chart illustrates the correlation between a particular type of clothing and their respective colors.
      </ChartLabel>
      <div
        style={{ width: "600px", height: "400px", display: "inline-block" }}
        id="toggleDiv"
      />
    </div>
  );
};

export default Toggle;
