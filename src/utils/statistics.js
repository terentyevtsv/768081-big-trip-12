import {PointGroup} from "../const.js";

export const getEventTypeMoneyStructure = (points) => {
  const resultStructure = new Map();

  for (const point of points) {
    if (!resultStructure.has(point.eventType.name)) {
      resultStructure.set(point.eventType.name, 0);
    }

    const price = resultStructure.get(point.eventType.name) + point.price;
    resultStructure.set(point.eventType.name, price);
  }

  return resultStructure;
};

export const getTransportUsageStructure = (points) => {
  const resultStructure = new Map();

  for (const point of points) {
    if (point.eventType.pointGroup !== PointGroup.MOVEMENT) {
      continue;
    }

    if (!resultStructure.has(point.eventType.name)) {
      resultStructure.set(point.eventType.name, 0);
    }

    const count = resultStructure.get(point.eventType.name) + 1;
    resultStructure.set(point.eventType.name, count);
  }

  return resultStructure;
};

export const getTimeSpentStructure = (points) => {
  const tempTimeSpentStructure = new Map();

  // Подсчет количества времени для каждого типа точки маршрута
  for (const point of points) {
    if (!tempTimeSpentStructure.has(point.eventType.name)) {
      tempTimeSpentStructure.set(point.eventType.name, 0);
    }

    const value = tempTimeSpentStructure.get(point.eventType.name);
    const differenceValue = point.timeInterval.rightLimitDate - point.timeInterval.leftLimitDate;
    tempTimeSpentStructure.set(point.eventType.name, value + differenceValue);
  }

  return tempTimeSpentStructure;
};
