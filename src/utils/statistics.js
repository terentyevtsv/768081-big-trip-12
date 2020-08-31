import {EventGroup} from "../const.js";

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
    if (point.eventType.eventGroup !== EventGroup.MOVEMENT) {
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
  const tmpTimeSpentMap = new Map();

  // Подсчет количества времени для каждого типа точки маршрута
  for (const point of points) {
    if (!tmpTimeSpentMap.has(point.eventType)) {
      tmpTimeSpentMap.set(point.eventType, 0);
    }

    const value = tmpTimeSpentMap.get(point.eventType);
    const difValue = point.timeInterval.rightLimitDate - point.timeInterval.leftLimitDate;
    tmpTimeSpentMap.set(point.eventType, value + difValue);
  }

  return tmpTimeSpentMap;
};
