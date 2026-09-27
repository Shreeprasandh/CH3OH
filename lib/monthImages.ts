export interface MonthImage {
  src: string;
  alt: string;
  accentColor: string;
  photographer: string;
}

/**
 * Monthly header imagery, accent themes, and metadata.
 * Images reside in `public/calendar/1.jpg` ... `public/calendar/12.jpg`
 */
export const MONTH_IMAGES: MonthImage[] = [
  { src: "/calendar/1.jpg", alt: "January Wall Calendar", accentColor: "#8B9A6E", photographer: "CH3OH Studio" },
  { src: "/calendar/2.jpg", alt: "February Wall Calendar", accentColor: "#647348", photographer: "CH3OH Studio" },
  { src: "/calendar/3.jpg", alt: "March Wall Calendar", accentColor: "#A4B289", photographer: "CH3OH Studio" },
  { src: "/calendar/4.jpg", alt: "April Wall Calendar", accentColor: "#7A8A5E", photographer: "CH3OH Studio" },
  { src: "/calendar/5.jpg", alt: "May Wall Calendar", accentColor: "#8B9A6E", photographer: "CH3OH Studio" },
  { src: "/calendar/6.jpg", alt: "June Wall Calendar", accentColor: "#5E6E45", photographer: "CH3OH Studio" },
  { src: "/calendar/7.jpg", alt: "July Wall Calendar", accentColor: "#78875B", photographer: "CH3OH Studio" },
  { src: "/calendar/8.jpg", alt: "August Wall Calendar", accentColor: "#8B9A6E", photographer: "CH3OH Studio" },
  { src: "/calendar/9.jpg", alt: "September Wall Calendar", accentColor: "#6F7E54", photographer: "CH3OH Studio" },
  { src: "/calendar/10.jpg", alt: "October Wall Calendar", accentColor: "#984A3B", photographer: "CH3OH Studio" },
  { src: "/calendar/11.jpg", alt: "November Wall Calendar", accentColor: "#586742", photographer: "CH3OH Studio" },
  { src: "/calendar/12.jpg", alt: "December Wall Calendar", accentColor: "#8B9A6E", photographer: "CH3OH Studio" },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];
