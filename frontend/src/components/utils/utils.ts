import { MetaData } from "../../types";

export const stopwords = [
  "blazer",
  "burkha",
  'halfshirt',
  "headwear",
  "longpants",
  "scarf",
  "sweater",
  "vest",
  "bags",
  "chudidar",
  "hoddie",
  "jeans",
  "jersey",
  "kurta",
  "saree",
  "shirt",
  "shoes",
  "skirt",
  "strip-dress",
  "sunglasses",
  "tops",
  "trousers",
  "tshirt",
];

export const newColor = {
  hex: "#000000",
  hsl: { h: 0, s: 0, l: 0, a: 1 },
  hsv: { h: 0, s: 0, v: 0, a: 1 },
  oldHue: 0,
  rgb: { r: 0, g: 0, b: 0, a: 1 },
  source: "rgb",
};

export function captureVideoFrame(vid, format, quality) {
  if (typeof vid === "string") {
    vid = document.getElementById(vid);
  }

  format = format || "jpeg";
  quality = quality || 0.92;

  if (!vid || (format !== "png" && format !== "jpeg")) {
    return false;
  }

  const canvas = document.createElement("canvas");

  canvas.width = vid.videoWidth;
  canvas.height = vid.videoHeight;

  canvas.getContext("2d").drawImage(vid, 0, 0);

  let dataUri = canvas.toDataURL("image/" + format, quality);
  let data = dataUri.split(",")[1];
  let mimeType = dataUri.split(";")[0].slice(5);

  let bytes = window.atob(data);
  let buf = new ArrayBuffer(bytes.length);
  let arr = new Uint8Array(buf);

  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  let blob = new Blob([arr], { type: mimeType });
  return { blob: blob, dataUri: dataUri, format: format };
}

export const md: MetaData[] = [
  {
    frame_sec: 0,
    persons:
      '[{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},]',
  },
  {
    frame_sec: 1,
    persons:
      '[{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},]',
  },
  {
    frame_sec: 2,
    persons:
      '[{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},{box: [0, 0, 0.3, 0.3],labels: ["shirt"],colors: ["#fff222", "#fff222"],},]',
  },
];

export const piedata: any[] = [
  {
    country: "Lithuania",
    litres: 500,
    subData: [
      { name: "A", value: 200 },
      { name: "B", value: 150 },
      { name: "C", value: 100 },
      { name: "D", value: 50 },
    ],
  },
  {
    country: "Czech Republic",
    litres: 300,
    subData: [
      { name: "A", value: 150 },
      { name: "B", value: 100 },
      { name: "C", value: 50 },
    ],
  },
  {
    country: "Ireland",
    litres: 200,
    subData: [
      { name: "A", value: 110 },
      { name: "B", value: 60 },
      { name: "C", value: 30 },
    ],
  },
  {
    country: "Germany",
    litres: 150,
    subData: [
      { name: "A", value: 80 },
      { name: "B", value: 40 },
      { name: "C", value: 30 },
    ],
  },
  {
    country: "Australia",
    litres: 140,
    subData: [
      { name: "A", value: 90 },
      { name: "B", value: 40 },
      { name: "C", value: 10 },
    ],
  },
  {
    country: "Austria",
    litres: 120,
    subData: [
      { name: "A", value: 60 },
      { name: "B", value: 30 },
      { name: "C", value: 30 },
    ],
  },
];

export const flowerdata: any[] = [
  {
    category: "One",
    value1: 8,
    value2: 2,
  },
  {
    category: "Two",
    value1: 11,
    value2: 4,
  },
  {
    category: "Three",
    value1: 7,
    value2: 6,
  },
  {
    category: "Four",
    value1: 13,
    value2: 8,
  },
  {
    category: "Five",
    value1: 12,
    value2: 10,
  },
  {
    category: "Six",
    value1: 15,
    value2: 12,
  },
  {
    category: "Seven",
    value1: 9,
    value2: 14,
  },
  {
    category: "Eight",
    value1: 6,
    value2: 16,
  },
];

export const linedata: any[] = [
  {
    date: 1.0,
    value: 13,
  },
  {
    date: 1.5,
    value: 13,
  },
  {
    date: 2.0,
    value: 13,
  },
  {
    date: 2.5,
    value: 13,
  },
  {
    date: 3.0,
    value: 13,
  },
  {
    date: 3.5,
    value: 13,
  },
  {
    date: 4.0,
    value: 13,
  },
  {
    date: 4.5,
    value: 13,
  },
  {
    date: 5.0,
    value: 13,
  },
  {
    date: 5.5,
    value: 13,
  },
];

export const toggledata: any[] = [
  { from: "jeans", to: "darkslategray", value: 4 },
  { from: "Scarf", to: "darkslategray", value: 5 },
  { from: "Sweater", to: "darkslategray", value: 13 },
  { from: "Blazer", to: "darkslategray", value: 2 },
  { from: "jeans", to: "dimgray", value: 5 },
  { from: "Sweater", to: "rosybrown", value: 1 },
  { from: "skirt", to: "darkslategray", value: 1 },
  { from: "skirt", to: "dimgray", value: 1 },
  { from: "Scarf", to: "darkslateblue", value: 1 },
  { from: "Scarf", to: "slategray", value: 1 },
  { from: "skirt", to: "darkslateblue", value: 1 },
  { from: "Long pants", to: "rosybrown", value: 1 },
  { from: "jeans", to: "darkgray", value: 1 },
  { from: "Scarf", to: "dimgray", value: 1 },
  { from: "Sweater", to: "silver", value: 2 },
  { from: "jersey", to: "dimgray", value: 1 },
  { from: "jeans", to: "gray", value: 2 },
  { from: "Scarf", to: "silver", value: 1 },
  { from: "Sweater", to: "lightgray", value: 1 },
  { from: "Scarf", to: "gray", value: 1 },
  { from: "Blazer", to: "silver", value: 1 },
  { from: "jersey", to: "silver", value: 1 },
  { from: "shirt", to: "darkgray", value: 1 },
  { from: "Blazer", to: "saddlebrown", value: 1 },
  { from: "Blazer", to: "sienna", value: 1 },
];

export const searchdata: any[] = [
  [
    {
      video_id: "5f05d0f814e6a15bdc797d12",
      date: "2020-07-11",
      frame_sec: 3,
      time: "00:51:29",
      labels: ["jeans", "Scarf"],
      colors: ["darkslategray", "darkslategray"],
      coord: { latitude: 12.9718871, longitude: 77.59367089999999 },
      location_type: "GEOMETRIC_CENTER",
      street: "Kasturba Road",
      city: "Bengaluru",
      county: "Bangalore Urban",
      country: "India",
      state: "Karnataka",
      sublocality: "Sampangi Rama Nagar",
    },
    {
      video_id: "5f05d0f814e6a15bdc797d12",
      date: "2020-07-11",
      time: "00:51:32",
      frame_sec: 3,
      labels: ["Sweater", "jeans"],
      colors: ["darkslategray", "dimgray"],
      coord: { latitude: 12.9718871, longitude: 77.59367089999999 },
      location_type: "GEOMETRIC_CENTER",
      street: "Kasturba Road",
      city: "Bengaluru",
      county: "Bangalore Urban",
      country: "India",
      state: "Karnataka",
      sublocality: "Sampangi Rama Nagar",
    },
  ],
  [
    {
      video_id: "5f05d0f814e6a15bdc797d12",
      date: "2020-07-11",
      frame_sec: 3,
      time: "00:51:29",
      labels: ["jeans", "Scarf"],
      colors: ["darkslategray", "darkslategray"],
      coord: { latitude: 12.9718871, longitude: 77.59367089999999 },
      location_type: "GEOMETRIC_CENTER",
      street: "Kasturba Road",
      city: "Bengaluru",
      county: "Bangalore Urban",
      country: "India",
      state: "Karnataka",
      sublocality: "Sampangi Rama Nagar",
    },
    {
      video_id: "5f05d0f814e6a15bdc797d12",
      date: "2020-07-11",
      time: "00:51:32",
      frame_sec: 3,
      labels: ["Sweater", "jeans"],
      colors: ["darkslategray", "dimgray"],
      coord: { latitude: 12.9718871, longitude: 77.59367089999999 },
      location_type: "GEOMETRIC_CENTER",
      street: "Kasturba Road",
      city: "Bengaluru",
      county: "Bangalore Urban",
      country: "India",
      state: "Karnataka",
      sublocality: "Sampangi Rama Nagar",
    },
  ],
  [],
];
