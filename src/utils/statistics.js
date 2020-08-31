import {EventGroup} from "../const.js";

export const getEventTypeMoneyMap = (eventTypes, points) => {
  const eventTypeMoneySpending = {};

  eventTypes.forEach((eventType) => {
    eventTypeMoneySpending[eventType.name] = 0;
    return;
  });

  points.forEach((point) => {
    eventTypeMoneySpending[point.eventType.name] += point.price;
    return;
  });

  const resultMap = new Map();
  eventTypes.forEach((eventType) => {
    if (eventTypeMoneySpending[eventType.name] !== 0) {
      resultMap.set(eventType.name, eventTypeMoneySpending[eventType.name]);
    }
  });

  return resultMap;
};

export const getTransportUsageMap = (eventTypes, points) => {
  const tmpEventTypes = new Map();

  const transportEventTypes = eventTypes
    .filter((eventType) => eventType.eventGroup === EventGroup.MOVEMENT);
  transportEventTypes.forEach((eventType) => tmpEventTypes.set(eventType.name, 0));

  points.forEach((point) => {
    if (tmpEventTypes.has(point.eventType.name)) {
      let currentValue = tmpEventTypes.get(point.eventType.name);
      tmpEventTypes.set(point.eventType.name, ++currentValue);
    }
  });

  const resultMap = new Map();
  for (const eventTypeName of tmpEventTypes.keys()) {
    const count = tmpEventTypes.get(eventTypeName);
    if (count > 0) {
      resultMap.set(eventTypeName, count);
    }
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
