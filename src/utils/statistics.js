import {PointGroup} from "../const.js";

export const getEventTypeMoneyMap = (points) => {
  const resultMap = new Map();

  for (const point of points) {
    if (!resultMap.has(point.eventType.name)) {
      resultMap.set(point.eventType.name, 0);
    }

    const price = resultMap.get(point.eventType.name) + point.price;
    resultMap.set(point.eventType.name, price);
  }

  return resultMap;
};

export const getTransportUsageMap = (points) => {
  const resultMap = new Map();

  for (const point of points) {
    if (point.eventType.pointGroup !== PointGroup.MOVEMENT) {
      continue;
    }

    if (!resultMap.has(point.eventType.name)) {
      resultMap.set(point.eventType.name, 0);
    }

    const count = resultMap.get(point.eventType.name) + 1;
    resultMap.set(point.eventType.name, count);
  }

  return resultMap;
};

export const getTimeSpentMap = (points) => {
  const tempTimeSpentMap = new Map();

  // Подсчет количества времени для каждого типа точки маршрута
  for (const point of points) {
    if (!tempTimeSpentMap.has(point.eventType.name)) {
      tempTimeSpentMap.set(point.eventType.name, 0);
    }

    const value = tempTimeSpentMap.get(point.eventType.name);
    const differenceValue = point.timeInterval.rightLimitDate - point.timeInterval.leftLimitDate;
    tempTimeSpentMap.set(point.eventType.name, value + differenceValue);
  }

  return tempTimeSpentMap;
};
