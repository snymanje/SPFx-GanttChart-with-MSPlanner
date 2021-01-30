import * as React from "react";

import {
  MessageBar,
  MessageBarType,
  Spinner,
} from 'office-ui-fabric-react';

import Chartt from "./chart";
import { GetPlannerdata } from "../../utils/getPlannerData";

const Chart = ({ title, range, plannerId, excludedBuckets }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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
      try {
        // throw line below is for testing purposes only.
        // throw new Error("Error occured")
        const plannerData = await GetPlannerdata(
          plannerId,
          data,
          day,
          today.getTime(),
          excludedBuckets
        );
        setData(plannerData);
        setLoading(false);
      } catch (err) {
        plannerId ? setError(err.message) : setError("Please add your plan id to the property settings.")   
        console.log(err.message);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
          {error ? (
            <div className="">
              <MessageBar
                messageBarType={MessageBarType.error}
                isMultiline={false}
              >
                { error }
              </MessageBar>
            </div>
          ) : loading ? (
            <div style={{ marginTop: "5rem", marginBottom: '5rem' }}>
              <Spinner label="Loading data from Planner...please wait." ariaLive="assertive" labelPosition="right" />
            </div>
          ) : (
            <div >
              <Chartt
                range={range}
                title={title}
                data={data}
                day={day}
                today={today.getTime()}
              />
            </div>
          )}
        </div>
  );
};

export default Chart;
