import "@pnp/graph/presets/all";
import { graph } from "@pnp/graph";
import "@pnp/graph/planner";

import { dateDiffInDays } from "../utils/days";

import { IPlannerData } from "../components/Index";

export const GetPlannerdata = async (
  planId: string,
  data: IPlannerData[],
  day: number,
  today: number,
  excludedBuckets: string
) => {
  const tasks = await graph.planner.plans.getById(planId).tasks();

  const assignToLookup = {};
  const bucketsLookup = {};

  const allTasks: IPlannerData[] = [];
  for await (const task of tasks) {
    const { assignments, startDateTime, dueDateTime, title, bucketId } = task;
    const primaryOwnerId = Object.keys(assignments)[
      Object.keys(assignments).length - 1
    ];

    if (!assignToLookup[primaryOwnerId]) {
      const { displayName } = await graph.users.getById(primaryOwnerId)();
      assignToLookup[primaryOwnerId] = { displayName: displayName };
    }

    if (!bucketsLookup[bucketId]) {
      const { name: bucketName } = await graph.planner.buckets.getById(
        bucketId
      )();
      bucketsLookup[bucketId] = { bucketName };
    }

    const { displayName } = assignToLookup[primaryOwnerId] || "unknown owner";
    const { bucketName } = bucketsLookup[bucketId] || "unknown bucket";

    allTasks.push({
      assignedTo: displayName,
      bucket: bucketName,
      parent: displayName,
      start: today + dateDiffInDays(new Date(), new Date(startDateTime)) * day,
      end: today + dateDiffInDays(new Date(), new Date(dueDateTime)) * day,
      id: title,
      name: title,
      owner: displayName,
      collapsed: false,
    });
  }

  const assignToList = [];
  const owners = allTasks.map((owner) => owner.assignedTo);
  new Set(owners).forEach((owner) => {
    assignToList.push({
      name: owner,
      id: owner,
      owner: owner,
    });
  });

  const sortedArr: IPlannerData[] = [
    ...data,
    ...assignToList,
    ...allTasks,
  ].sort((a, b) => (a.name < b.name ? -1 : 1));

  const filteredBuckets = sortedArr.filter((data) => {
    const exlBuckets = excludedBuckets
      .split(",")
      .map((bucket) => bucket.trim());

    return !exlBuckets.includes(data.bucket);
  });

  return filteredBuckets;
};
