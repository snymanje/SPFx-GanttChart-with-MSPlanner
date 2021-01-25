import * as React from "react";
import HighchartsReact from "highcharts-react-official";

// Import Highcharts
import * as Highcharts from "highcharts";
import highchartsGantt from "highcharts/modules/gantt";

highchartsGantt(Highcharts);

const Chart = ({ data, dateRange }) => {
 // const [options, setOptions] = React.useState({});
  console.log("new char range in chat comp", dateRange);

  let today: Date = new Date();
  // Set to 00:00:00:000 today
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  const newToday = today.getTime();
  const day = 1000 * 60 * 60 * 24;

  // Utility functions
  let dateFormat = Highcharts.dateFormat;
  let defined = Highcharts.defined;
  let isObject = Highcharts.isObject;
  let reduce = Highcharts.reduce;

  const options = {
      series: [
        {
          name: "Resource Manager",
          data: data,
          /* dataLabels: [
            {
              enabled: true,
              format:
                '<div style="width: 25px; height: 25px; overflow: hidden; border-radius: 50%; margin-left: -35px">' +
                '<img src="https://tfgonline-my.sharepoint.com/User%20Photos/Profile%20Pictures/{point.assignee}_MThumb.jpg" ' +
                'style="width: 30px; margin-left: -5px; margin-top: -2px"></div>',
              useHTML: true,
              align: "left",
            },
          ], */
        },
      ],
      tooltip: {
        pointFormatter: function () {
          var point = this,
            format = "%e. %b",
            options = point.options,
            completed = options.completed,
            amount = isObject(completed) ? completed.amount : completed,
            status = (amount || 0) * 100 + "%",
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
            {
              title: "Completed",
              value: status,
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
        text: "Intelligent Automation Project Management",
      },
      xAxis: {
        currentDateIndicator: true,
        min: newToday - 2 * day,
        max: newToday + 18 * day,
      },
    }

  /* React.useEffect(() => {
    setOptions({
      series: [
        {
          name: "Resource Manager",
          data: data,
          dataLabels: [
            {
              enabled: true,
              format:
                '<div style="width: 25px; height: 25px; overflow: hidden; border-radius: 50%; margin-left: -35px">' +
                '<img src="https://tfgonline-my.sharepoint.com/User%20Photos/Profile%20Pictures/{point.assignee}_MThumb.jpg" ' +
                'style="width: 30px; margin-left: -5px; margin-top: -2px"></div>',
              useHTML: true,
              align: "left",
            },
          ],
        },
      ],
      tooltip: {
        pointFormatter: function () {
          var point = this,
            format = "%e. %b",
            options = point.options,
            completed = options.completed,
            amount = isObject(completed) ? completed.amount : completed,
            status = (amount || 0) * 100 + "%",
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
            {
              title: "Completed",
              value: status,
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
        text: "Intelligent Automation Project Management",
      },
      xAxis: {
        currentDateIndicator: true,
        min: newToday - 2 * day,
        max: newToday + 18 * day,
      },
    });
  }, [dateRange]); */

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={options}
      />
    </div>
  );
};

export default Chart;
