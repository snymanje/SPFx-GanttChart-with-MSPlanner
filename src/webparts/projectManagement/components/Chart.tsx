import * as React from "react";
import HighchartsReact from "highcharts-react-official";

// Import Highcharts
import * as Highcharts from "highcharts";
import highchartsGantt from "highcharts/modules/gantt";

highchartsGantt(Highcharts);

const Chart = ({ data, day, today, title, range }) => {
  // Utility functions
  let dateFormat = Highcharts.dateFormat;
  let defined = Highcharts.defined;
  let reduce = Highcharts.reduce;

  const options = {
    series: [
      {
        name: "Resource Manager",
        data: data,
      },
    ],
    tooltip: {
      pointFormatter: function () {
        let point = this;
        let format = "%e. %b";
        let options = point.options;
        let lines;

        lines = [
          {
            value: point.name,
            style: "font-weight: bold;",
          },
          {
            title: "Start",
            value: dateFormat(format, point.start),
          },
          {
            visible: !options.milestone,
            title: "End",
            value: dateFormat(format, point.end),
          },
          {
            title: "Owner",
            value: options.owner || "unassigned",
          },
        ];

        return reduce(
          lines,
          function (str, line) {
            var s = "",
              style = defined(line.style) ? line.style : "font-size: 0.8em;";
            if (line.visible !== false) {
              s =
                '<span style="' +
                style +
                '">' +
                (defined(line.title) ? line.title + ": " : "") +
                (defined(line.value) ? line.value : "") +
                "</span><br/>";
            }
            return str + s;
          },
          ""
        );
      },
    },
    title: {
      text: title,
    },
    xAxis: {
      currentDateIndicator: true,
      min: today - 3 * day,
      max: today + range * day,
      scrollbar: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: "94%", height: "100%", margin: "1rem auto" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={options}
      />
    </div>
  );
};

export { Chart };
