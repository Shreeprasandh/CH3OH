export interface MonthImage {
  src: any;
  name: string;
  accentColor: string;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export const MONTH_DATA: MonthImage[] = [
  { src: require("../assets/calendar/1.jpg"), name: "January", accentColor: "#8B9A6E" },
  { src: require("../assets/calendar/2.jpg"), name: "February", accentColor: "#647348" },
  { src: require("../assets/calendar/3.jpg"), name: "March", accentColor: "#A4B289" },
  { src: require("../assets/calendar/4.jpg"), name: "April", accentColor: "#7A8A5E" },
  { src: require("../assets/calendar/5.jpg"), name: "May", accentColor: "#8B9A6E" },
  { src: require("../assets/calendar/6.jpg"), name: "June", accentColor: "#5E6E45" },
  { src: require("../assets/calendar/7.jpg"), name: "July", accentColor: "#78875B" },
  { src: require("../assets/calendar/8.jpg"), name: "August", accentColor: "#8B9A6E" },
  { src: require("../assets/calendar/9.jpg"), name: "September", accentColor: "#6F7E54" },
  { src: require("../assets/calendar/10.jpg"), name: "October", accentColor: "#984A3B" },
  { src: require("../assets/calendar/11.jpg"), name: "November", accentColor: "#586742" },
  { src: require("../assets/calendar/12.jpg"), name: "December", accentColor: "#8B9A6E" },
];
