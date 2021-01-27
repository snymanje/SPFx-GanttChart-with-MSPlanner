import * as React from "react";
import HighchartsReact from "highcharts-react-official";

// Import Highcharts
import * as Highcharts from "highcharts";
import highchartsGantt from "highcharts/modules/gantt";

highchartsGantt(Highcharts);

const Chart = ({ data, day, today, title }) => {
  // Utility functions
  let dateFormat = Highcharts.dateFormat;
  let defined = Highcharts.defined;
  // isObject = Highcharts.isObject,
  let reduce = Highcharts.reduce;

  const options = {
    series: [
      {
        name: "Resource Manager",
        data: data,
        /* dataLabels: [{
            enabled: true,
            format: '<div style="width: 20px; height: 20px; overflow: hidden; border-radius: 50%; margin-left: -25px">' +
                '<img src="https://www.highcharts.com/images/employees2014/{point.assignee}.jpg" ' +
                'style="width: 30px; margin-left: -5px; margin-top: -2px"></div>',
            useHTML: true,
            align: 'left'
        }] */
      },
    ],
    tooltip: {
      pointFormatter: function () {
        var point = this,
          format = "%e. %b",
          options = point.options,
          //completed = options.completed,
          //amount = isObject(completed) ? completed.amount : completed,
          //status = (amount || 0) * 100 + "%",
          lines;

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
          /*         {
          title: "Completed",
          value: status,
        }, */
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
      max: today + 12 * day,     
      scrollbar: {
          enabled: true
      },
      
    },
/*     chart: {
      events: {
        render() {
          let chart = this;

          chart.series[0].points.forEach(point => {
            if (point.collapsed) {
              chart.series[0].points.forEach(p => {
                if (p.parent === point.id) {
                  if (p.visible) {
                    point.update({
                      collapsed: false
                    })
                  }
                }
              })
            } else if (point.collapsed === false) {
              chart.series[0].points.forEach(p => {
                if (p.parent === point.id) {
                  if (!p.visible) {
                    point.update({
                      collapsed: true
                    })
                  }
                }
              })
            }
          })
        }
      }
    }, */
  };

  return (
    <div style={{ width: "100%", height: "100%", margin: "1em auto" }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={options}
      />
    </div>
  );
};

export default Chart;
