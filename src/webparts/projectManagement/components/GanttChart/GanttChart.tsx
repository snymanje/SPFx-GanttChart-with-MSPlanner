import * as React from "react";

// Import pnpjs
import { sp } from "@pnp/sp/presets/all";
import "@pnp/graph/presets/all";
import { graph } from "@pnp/graph";
import "@pnp/graph/planner";
import { dateDiffInDays } from "../../utils/days";
import Chartt from "./chart";
import { Groups } from "@pnp/graph/presets/all";

const Chart = () => {
  const [data, setData] = React.useState([]);

  let today: Date = new Date();
  let day = 1000 * 60 * 60 * 24;
  // Set to 00:00:00:000 today
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  const newToday = today.getTime();

  React.useEffect(() => {
    console.log("Start: ", new Date());
    const plans = async () => {
      const tasks = await graph.planner.plans
        .getById("eIgWi8Rmw0-DKaO6-AMaZ2UAHW3O")
        .tasks();

      const allTasks = tasks.map(async (task) => {
        const {
          assignments,
          completedDateTime,
          startDateTime,
          dueDateTime,
          title,
          bucketId
        } = task;
        const primaryOwner = Object.keys(assignments)[
          Object.keys(assignments).length - 1
        ];

        const { displayName, mail } = await graph.users.getById(primaryOwner)();
        const { name: bucketName } = await graph.planner.buckets.getById(bucketId)();

        return {
          assignedTo: displayName,
          bucket: bucketName,  
          parent: displayName,
          start:
            newToday +
            dateDiffInDays(new Date(), new Date(startDateTime)) * day,
          end:
            newToday + dateDiffInDays(new Date(), new Date(dueDateTime)) * day,
          id: title,
          name: title,
        };
      });
      const results = await Promise.all(allTasks);

      const tempdata = [];
      const owners = results.map((owner) => owner.assignedTo);
      new Set(owners).forEach((owner) => {
        /*  const { assignedTo } = results.find((item) =>
          item.assignedTo === owner ? item : undefined
        ); */

        tempdata.push({
          name: owner,
          id: owner,
          owner: owner,
          /*   assignee: assignedEmail.replaceAll(".", "_").replace("@", "_"), */
        });
      });

      const sortedArray = [...data, ...tempdata, ...results];
      const sorted = sortedArray.sort((a, b) => {
        // Sorting high to low
        return a.name < b.name ? -1 : 1;
        // Sorting low to high
        // return a.price > b.price;
      });
      
      const finaldata = sorted.filter(data => {
        return data.bucket !== "To do" && data.bucket !== "Completed"
      })
      console.log(finaldata);
      setData(finaldata);

      //return results;
    };

    plans();
  }, []);

  return (
    <div>
      <Chartt data={data} day={day} today={newToday} />
    </div>
  );
};

export default Chart;
