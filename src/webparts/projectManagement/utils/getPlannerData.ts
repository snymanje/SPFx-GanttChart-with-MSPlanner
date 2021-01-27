import "@pnp/graph/presets/all";
import { graph } from "@pnp/graph";
import "@pnp/graph/planner";

import { dateDiffInDays } from "../utils/days";

export const GetPlannerdata =  async (planId, data, day: number, today: number) => {
      const tasks = await graph.planner.plans
        .getById(planId)
        .tasks();

      const allTasks = tasks.map(async (task) => {
        const {
          assignments,
          startDateTime,
          dueDateTime,
          title,
          bucketId
        } = task;
        const primaryOwner = Object.keys(assignments)[
          Object.keys(assignments).length - 1
        ];

        const { displayName } = await graph.users.getById(primaryOwner)();
        const { name: bucketName } = await graph.planner.buckets.getById(bucketId)();

        return {
          assignedTo: displayName,
          bucket: bucketName,  
          parent: displayName,
          start:
            today +
            dateDiffInDays(new Date(), new Date(startDateTime)) * day,
          end:
            today + dateDiffInDays(new Date(), new Date(dueDateTime)) * day,
          id: title,
          name: title,
          owner: displayName
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
        // Sorting A to Z
        return a.name < b.name ? -1 : 1;
      });
      
      const finaldata = sorted.filter(data => {
        return data.bucket !== "To do" && data.bucket !== "Completed"
      })
      return finaldata;
}