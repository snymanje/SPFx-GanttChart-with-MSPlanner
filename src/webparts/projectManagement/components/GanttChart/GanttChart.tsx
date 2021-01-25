import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

// Import pnpjs
import { sp } from "@pnp/sp/presets/all";
import { dateDiffInDays } from "../../utils/days";
import Chartt from "./chart";

const Chart = () => {
  const [data, setData] = React.useState([]);
  const [range, setRange] = React.useState(18);

  React.useEffect(() => {
    let today: Date = new Date();
    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    const newToday = today.getTime();
    const day = 1000 * 60 * 60 * 24;

    const getItems = async () => {
      const items = await sp.web.lists
        .getByTitle("IntelligentAutomationPM")
        .items.select(
          "Id",
          "Title",
          "AssignedTo/ID",
          "AssignedTo/Title",
          "AssignedTo/EMail",
          "Progress",
          "Completed",
          "DueDate",
          "StartDate",
          "Priority",
          "Description",
          "Category",
          "Dependency/Title",
          "Dependency/ID"
        )
        .expand("AssignedTo", "Dependency")
        .getAll();

      const tempdata = [];
      const owners = items.map((owner) => owner.AssignedTo.Title);
      new Set(owners).forEach((owner) => {
        const { AssignedTo } = items.find((item) =>
          item.AssignedTo.Title === owner ? item : undefined
        );

        tempdata.push({
          name: owner,
          id: owner,
          owner: owner,
          assignee: AssignedTo.EMail.replace(".", "_").replace(".", "_").replace("@", "_"),
        });
      });

      const tasks = [];
      items.map((item) =>
        tasks.push({
          name: item.Title,
          parent: item.AssignedTo.Title,
          id: item.Title,
          dependency: item.Dependency ? item.Dependency.Title : undefined,
          start:
            newToday +
            dateDiffInDays(new Date(), new Date(item.StartDate)) * day,
          end:
            newToday + dateDiffInDays(new Date(), new Date(item.DueDate)) * day,
          completed: {
            amount: item.Completed / 100 || 0,
          },
          assignee: item.AssignedTo.EMail.replace(".", "_").replace(".", "_").replace(
            "@",
            "_"
          ),
          owner: item.AssignedTo.Title,
        })
      );

      const sortedArray = [...data, ...tempdata, ...tasks];
      const sorted = sortedArray.sort((a, b) => {
        // Sorting high to low
        return a.name < b.name ? -1 : 1;
        // Sorting low to high
        // return a.price > b.price;
      });
      setData(sorted);
    };

    getItems();
  }, []);

  const updateRange = (days) => {
    setRange(days) 
  }

/*   React.useEffect(() => {
   console.log('New range', range);
}, [range]); */
 
  return (
    <div
      style={{ width: "100%" }} >
      <Chartt data={data} dateRange={range} />
    </div>
    
  );
};

export default Chart;

  {/* <div style={{ width: "100%", height: "100%", margin: "1em auto" }} >
      <Button variant="primary" size="sm" onClick={() => updateRange(14)}>
        2w
      </Button>{" "}
      <Button variant="secondary" size="sm" onClick={() => updateRange(30)}>
        1m
      </Button>{" "}
      <Button variant="secondary" size="sm" onClick={() => updateRange(90)}>
        3m
      </Button>      
    </div> */}
