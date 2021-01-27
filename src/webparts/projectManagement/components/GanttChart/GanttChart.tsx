import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import Chartt from "./chart";
import { GetPlannerdata } from "../../utils/getPlannerData";

const Chart = () => {
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
        //throw new Error("Error occured")
        const plannerData = await GetPlannerdata(
          "eIgWi8Rmw0-DKaO6-AMaZ2UAHW3O",
          data,
          day,
          today.getTime()
        );
        setData(plannerData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {error ? (
        <div className="d-flex justify-content-center">
          <Alert variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
              {error}
            </p>
          </Alert>
        </div>
      ) : loading ? (
        <div className="d-flex justify-content-center">
          <Button variant="light" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-2"
            />
            Loading data from Planner...please wait.
          </Button>
        </div>
      ) : (
        <Chartt
          data={data}
          day={day}
          today={today.getTime()}
          title={"Intelligent Automation Project Management"}
        />
      )}
    </div>
  );
};

export default Chart;
