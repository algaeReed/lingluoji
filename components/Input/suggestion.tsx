const sampleSuggestions = [
  {
    id: "1",
    name: "iPhone",
  },
  {
    id: "2",
    name: "iPhone 3G",
  },
  {
    id: "3",
    name: "iPhone 3GS",
  },
  {
    id: "4",
    name: "iPhone 4",
  },
  {
    id: "5",
    name: "iPhone 4s",
  },
  {
    id: "6",
    name: "iPhone 5",
  },
  {
    id: "7",
    name: "iPhone 5c",
  },
  {
    id: "8",
    name: "iPhone 5s",
  },
  {
    id: "9",
    name: "iPhone 6",
  },
  {
    id: "10",
    name: "iPhone 6 Plus",
  },
  {
    id: "11",
    name: "iPhone 6s",
  },
  {
    id: "12",
    name: "iPhone 6s Plus",
  },
  {
    id: "13",
    name: "iPhone SE (第一代)",
  },
  {
    id: "14",
    name: "iPhone 7",
  },
  {
    id: "15",
    name: "iPhone 7 Plus",
  },
  {
    id: "16",
    name: "iPhone 8",
  },
  {
    id: "17",
    name: "iPhone 8 Plus",
  },
  {
    id: "18",
    name: "iPhone X",
  },
  {
    id: "19",
    name: "iPhone XR",
  },
  {
    id: "20",
    name: "iPhone XS",
  },
  {
    id: "21",
    name: "iPhone XS Max",
  },
  {
    id: "22",
    name: "iPhone 11",
  },
  {
    id: "23",
    name: "iPhone 11 Pro",
  },
  {
    id: "24",
    name: "iPhone 11 Pro Max",
  },
  {
    id: "25",
    name: "iPhone SE (第二代)",
  },
  {
    id: "26",
    name: "iPhone 12 mini",
  },
  {
    id: "27",
    name: "iPhone 12",
  },
  {
    id: "28",
    name: "iPhone 12 Pro",
  },
  {
    id: "29",
    name: "iPhone 12 Pro Max",
  },
  {
    id: "30",
    name: "iPhone 13 mini",
  },
  {
    id: "31",
    name: "iPhone 13",
  },
  {
    id: "32",
    name: "iPhone 13 Pro",
  },
  {
    id: "33",
    name: "iPhone 13 Pro Max",
  },
  {
    id: "34",
    name: "iPhone SE (第三代)",
  },
  {
    id: "35",
    name: "iPhone 14",
  },
  {
    id: "36",
    name: "iPhone 14 Plus",
  },
  {
    id: "37",
    name: "iPhone 14 Pro",
  },
  {
    id: "38",
    name: "iPhone 14 Pro Max",
  },
  {
    id: "39",
    name: "iPhone 15",
  },
  {
    id: "40",
    name: "iPhone 15 Plus",
  },
  {
    id: "41",
    name: "iPhone 15 Pro",
  },
  {
    id: "42",
    name: "iPhone 15 Pro Max",
  },
  {
    id: "43",
    name: "EarPods (3.5mm)",
  },
  {
    id: "44",
    name: "EarPods (Lightning)",
  },
  {
    id: "45",
    name: "AirPods (1st generation)",
  },
  {
    id: "46",
    name: "AirPods (2nd generation)",
  },
  {
    id: "47",
    name: "AirPods (3rd generation)",
  },
  {
    id: "48",
    name: "AirPods Pro (1st generation)",
  },
  {
    id: "49",
    name: "AirPods Pro (2nd generation)",
  },
  {
    id: "50",
    name: "AirPods Pro (2nd generation with USB-C)",
  },
  {
    id: "51",
    name: "AirPods Max",
  },
  {
    id: "52",
    name: "Beats Fit Pro",
  },
  {
    id: "53",
    name: "Beats Studio Buds",
  },
  {
    id: "54",
    name: "Beats Studio Buds+",
  },
  {
    id: "55",
    name: "Beats Studio Pro",
  },
  {
    id: "56",
    name: "iMac (24-inch, M1)",
  },
  {
    id: "57",
    name: "iMac (24-inch, M3)",
  },
  {
    id: "58",
    name: "Mac mini (Intel)",
  },
  {
    id: "59",
    name: "Mac mini (M1)",
  },
  {
    id: "60",
    name: "Mac mini (M2 / M2 Pro)",
  },
  {
    id: "61",
    name: "Mac Studio (M1 Max / M1 Ultra)",
  },
  {
    id: "62",
    name: "Mac Studio (M2 Max / M2 Ultra)",
  },
  {
    id: "63",
    name: "Mac Pro (Intel, Tower)",
  },
  {
    id: "64",
    name: "Mac Pro (M2 Ultra, 2023)",
  },
  {
    id: "65",
    name: "MacBook (12-inch, 2015–2019)",
  },
  {
    id: "66",
    name: "MacBook Air (Intel, 多代)",
  },
  {
    id: "67",
    name: "MacBook Air (M1, 2020)",
  },
  {
    id: "68",
    name: "MacBook Air (M2, 2022)",
  },
  {
    id: "69",
    name: "MacBook Air (M3, 2024)",
  },
  {
    id: "70",
    name: "MacBook Pro (13-inch, Intel)",
  },
  {
    id: "71",
    name: "MacBook Pro (13-inch, M1)",
  },
  {
    id: "72",
    name: "MacBook Pro (14-inch, M1 Pro / M1 Max)",
  },
  {
    id: "73",
    name: "MacBook Pro (16-inch, M1 Pro / M1 Max)",
  },
  {
    id: "74",
    name: "MacBook Pro (14/16-inch, M2 Pro / M2 Max)",
  },
  {
    id: "75",
    name: "MacBook Pro (14/16-inch, M3 Pro / M3 Max)",
  },
  {
    id: "76",
    name: "Galaxy S24 Ultra",
  },
  {
    id: "77",
    name: "Galaxy S24+",
  },
  {
    id: "78",
    name: "Galaxy S24",
  },
  {
    id: "79",
    name: "Galaxy S23 Ultra",
  },
  {
    id: "80",
    name: "Galaxy S23+",
  },
  {
    id: "81",
    name: "Galaxy S23",
  },
  {
    id: "82",
    name: "Galaxy Z Fold5",
  },
  {
    id: "83",
    name: "Galaxy Z Flip5",
  },
  {
    id: "84",
    name: "Galaxy Z Fold4",
  },
  {
    id: "85",
    name: "Galaxy Z Flip4",
  },
  {
    id: "86",
    name: "Galaxy Buds Pro",
  },
  {
    id: "87",
    name: "Galaxy Buds2 Pro",
  },
  {
    id: "88",
    name: "Galaxy Buds Live",
  },
  {
    id: "89",
    name: "Galaxy Buds2",
  },
  {
    id: "90",
    name: "Galaxy Buds+",
  },
  {
    id: "91",
    name: "Galaxy Book4 Ultra",
  },
  {
    id: "92",
    name: "Galaxy Book4 Pro 360",
  },
  {
    id: "93",
    name: "Galaxy Book4 Pro",
  },
  {
    id: "94",
    name: "Galaxy Book3 Ultra",
  },
  {
    id: "95",
    name: "Galaxy Book3 Pro 360",
  },
  {
    id: "96",
    name: "Galaxy Tab S9 Ultra",
  },
  {
    id: "97",
    name: "Galaxy Tab S9+",
  },
  {
    id: "98",
    name: "Galaxy Tab S9",
  },
  {
    id: "99",
    name: "Galaxy Tab S8 Ultra",
  },
  {
    id: "100",
    name: "Galaxy Tab S8+",
  },
  {
    id: "101",
    name: "Galaxy Tab S8",
  },
  {
    id: "102",
    name: "华为 Pura 70 Ultra",
  },
  {
    id: "103",
    name: "华为 Pura 70 Pro+",
  },
  {
    id: "104",
    name: "华为 Pura 70 Pro",
  },
  {
    id: "105",
    name: "华为 Mate 60 Pro+",
  },
  {
    id: "106",
    name: "华为 Mate 60 Pro",
  },
  {
    id: "107",
    name: "华为 Mate 60",
  },
  {
    id: "108",
    name: "华为 Mate X5",
  },
  {
    id: "109",
    name: "华为 nova 12 Ultra",
  },
  {
    id: "110",
    name: "华为 nova 12 Pro",
  },
  {
    id: "111",
    name: "华为 nova 12",
  },
  {
    id: "112",
    name: "HUAWEI FreeBuds Pro 3",
  },
  {
    id: "113",
    name: "HUAWEI FreeBuds 5",
  },
  {
    id: "114",
    name: "HUAWEI FreeBuds SE 2",
  },
  {
    id: "115",
    name: "HUAWEI FreeBuds 4i",
  },
  {
    id: "116",
    name: "HUAWEI FreeClip（非入耳耳夹式）",
  },
  {
    id: "117",
    name: "HUAWEI MateBook X Pro 2024",
  },
  {
    id: "118",
    name: "HUAWEI MateBook 14s 2023",
  },
  {
    id: "119",
    name: "HUAWEI MateBook 16s 2023",
  },
  {
    id: "120",
    name: "HUAWEI MateBook D 14 2024",
  },
  {
    id: "121",
    name: "HUAWEI MateBook E 2-in-1",
  },
  {
    id: "122",
    name: "HUAWEI MatePad Pro 13.2 英寸",
  },
  {
    id: "123",
    name: "HUAWEI MatePad Pro 11 (2024)",
  },
  {
    id: "124",
    name: "HUAWEI MatePad 11.5S",
  },
  {
    id: "125",
    name: "HUAWEI MatePad Air",
  },
  {
    id: "126",
    name: "HUAWEI MatePad SE 10.4",
  },
  {
    id: "127",
    name: "HUAWEI WATCH Ultimate",
  },
  {
    id: "128",
    name: "HUAWEI WATCH GT 4",
  },
  {
    id: "129",
    name: "HUAWEI WATCH 4 Pro",
  },
  {
    id: "130",
    name: "HUAWEI WATCH FIT 3",
  },
  {
    id: "131",
    name: "HUAWEI WATCH Kids 5 Pro",
  },
];

export default sampleSuggestions;
