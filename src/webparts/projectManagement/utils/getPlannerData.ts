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

  const assignToLookup = JSON.parse(localStorage.getItem("assignToList")) || {};
  const bucketsLookup = JSON.parse(localStorage.getItem("bucketList")) || {};

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
      start: startDateTime
        ? today + dateDiffInDays(new Date(), new Date(startDateTime)) * day
        : today,
      end: dueDateTime
        ? today + (dateDiffInDays(new Date(), new Date(dueDateTime)) + 1) * day
        : today + 3 * day,
      id: title,
      name: title,
      owner: displayName,
      collapsed: false,
    });
  }

  localStorage.setItem("bucketList", JSON.stringify(bucketsLookup));
  localStorage.setItem("assignToList", JSON.stringify(assignToLookup));

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
