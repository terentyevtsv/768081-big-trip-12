const EVENT_TYPES_NAME = `eventTypes`;
const CITIES_NAME = `cities`;
const POINTS_NAME = `points`;

export default class Store {
  constructor(key, storage) {
    this._storageKey = key;
    this._storage = storage;
  }

  _getCachedObject() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  _getStructure(key) {
    const cachedObject = this._getCachedObject();
    if (cachedObject.hasOwnProperty(key)) {
      return cachedObject[key];
    }

    return [];
  }

  getEventTypesOffers() {
    return this._getStructure(EVENT_TYPES_NAME);
  }

  getCities() {
    return this._getStructure(CITIES_NAME);
  }

  getPointsObject() {
    const cachedObject = this._getCachedObject();
    if (cachedObject.hasOwnProperty(POINTS_NAME)) {
      return cachedObject[POINTS_NAME];
    }

    return {};
  }

  setEventTypes(eventTypes) {
    const cachedObject = this._getCachedObject();
    cachedObject[EVENT_TYPES_NAME] = eventTypes;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedObject)
    );
  }

  setCities(cities) {
    const cachedObject = this._getCachedObject();
    cachedObject[CITIES_NAME] = cities;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedObject)
    );
  }

  setPoints(points) {
    const cachedObject = this._getCachedObject();
    cachedObject[POINTS_NAME] = points;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedObject)
    );
  }

  setPoint(key, value) {
    const points = this.getPointsObject();
    const tempPoints = Object.assign(
        {},
        points,
        {
          [key]: value
        }
    );

    this.setPoints(tempPoints);
  }

  updateCreatedPoints(points) {
    // Точки в локальном хранилище
    const pointsObject = this.getPointsObject();

    // Раскидал созданные точки по временным id
    points.forEach((point) => {
      pointsObject[point.tempId] = point;
    });

    let tempPointsObject = null;
    const resultedPointsObject = Object.values(pointsObject)
      .reduce((accumulator, currentPoint) => {
        if (tempPointsObject === null) {
          tempPointsObject = Object.assign(
              {},
              {
                [accumulator.id]: accumulator
              },
              {
                [currentPoint.id]: currentPoint
              }
          );

          return tempPointsObject;
        }

        return Object.assign(
            {},
            accumulator,
            {
              [currentPoint.id]: currentPoint
            }
        );
      });

    this.setPoints(resultedPointsObject);
  }

  removePoint(key) {
    const points = this.getPointsObject();

    delete points[key];
    this.setPoints(points);
  }
}
