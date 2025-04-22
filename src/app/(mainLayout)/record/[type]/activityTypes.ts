export type ActivityType = {
  title: string;
  icon: string;
  id: "yama" | "tabi" | "tsuri";
};

const activityTypes: ActivityType[] = [
  { title: "山行記録", icon: "🏔️", id: "yama" },
  { title: "旅行記録", icon: "✈️", id: "tabi" },
  { title: "釣行記録", icon: "🎣", id: "tsuri" },
];

export default activityTypes;
