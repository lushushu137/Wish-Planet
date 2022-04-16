import myPlanet from "./asset/pic/myPlanet.jpg";
import myPlanet_1 from "./asset/pic/myPlanet (1).jpg";
import myPlanet_2 from "./asset/pic/myPlanet (2).jpg";
import myPlanet_3 from "./asset/pic/myPlanet (3).jpg";

export const starName = [
  "No Where Land",
  "Akira Land",
  "Wonderland",
  "Itinerant Poet Planet",
];
export const starPos = [
  {
    x: 0.3,
    y: 0.1,
    radius1: 4,
    radius2: 20,
  },
  {
    x: 0.3,
    y: 0.2,
    radius1: 3,
    radius2: 15,
  },
  {
    x: 0.3,
    y: 0.3,
    radius1: 2,
    radius2: 10,
  },
  {
    x: 0.8,
    y: 0.2,
    radius1: 2,
    radius2: 10,
  },
];

export const starData = [
  {
    x: 0.2,
    y: 0.1,
    radius1: 4,
    radius2: 20,
    url: myPlanet,
    name: "Lu Shu",
    from: "No Where Land",
    time: "2022-1-1",
  },
  {
    x: 0.1,
    y: 0.2,
    radius1: 3,
    radius2: 15,
    url: myPlanet_1,
    name: "ToTo",
    from: "Itinerant Poet Planet",
    time: "2022-2-21",
  },
  {
    x: 0.2,
    y: 0.3,
    radius1: 2,
    radius2: 10,
    url: myPlanet_2,
    name: "Christy",
    from: "Wonderland",
    time: "2022-3-14",
  },
  {
    x: 0.7,
    y: 0.2,
    radius1: 2,
    radius2: 10,
    url: myPlanet_3,
    name: "Gio",
    from: "Akira Land",
    time: "2022-4-1",
  },
];

export const newStar = (time, name, from, url) => {
  let newStarData = {
    ...starPos[Math.floor(Math.random() * (starPos.length - 1))],
    from,
    time,
    name,
    url,
  };
  starData.push(newStarData);
  return newStarData;
};
