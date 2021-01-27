import * as React from "react";

import Chartt from "./chart";
import { GetPlannerdata } from "../../utils/getPlannerData";

const Chart = () => {
  const [data, setData] = React.useState([]);

  let today: Date = new Date();
  const day = 1000 * 60 * 60 * 24;

  // Set to 00:00:00:000 today
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);

  React.useEffect(() => {
    // Self invoking async function
    (async () => {
      const plannerData = await GetPlannerdata(
        "eIgWi8Rmw0-DKaO6-AMaZ2UAHW3O",
        data,
        day,
        today.getTime()
      );
      setData(plannerData);
    })();
  }, []);

  return (
    <div>
      <Chartt data={data} day={day} today={today.getTime()} title={"Intelligent Automation Project Management"} />
    </div>
  );
};

export default Chart;
