const StoreSubStructure = {
  EVENT_TYPES: `eventTypes`,
  CITIES: `cities`,
  POINTS: `points`
};

export default class Store {
  constructor(key, storage) {
    this._storageKey = key;
    this._storage = storage;
  }

  _getCachedStructure() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  _getStructure(key) {
    const cachedStructure = this._getCachedStructure();
    if (cachedStructure.hasOwnProperty(key)) {
      return cachedStructure[key];
    }

    return [];
  }

  getEventTypesOffers() {
    return this._getStructure(StoreSubStructure.EVENT_TYPES);
  }

  getCities() {
    return this._getStructure(StoreSubStructure.CITIES);
  }

  getPointsStructure() {
    const cachedStructure = this._getCachedStructure();
    if (cachedStructure.hasOwnProperty(StoreSubStructure.POINTS)) {
      return cachedStructure[StoreSubStructure.POINTS];
    }

    return {};
  }

  setEventTypes(eventTypes) {
    const cachedStructure = this._getCachedStructure();
    cachedStructure[StoreSubStructure.EVENT_TYPES] = eventTypes;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedStructure)
    );
  }

  setCities(cities) {
    const cachedStructure = this._getCachedStructure();
    cachedStructure[StoreSubStructure.CITIES] = cities;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedStructure)
    );
  }

  setPoints(points) {
    const cachedStructure = this._getCachedStructure();
    cachedStructure[StoreSubStructure.POINTS] = points;

    this._storage.setItem(
        this._storageKey,
        JSON.stringify(cachedStructure)
    );
  }

  setPoint(key, value) {
    const points = this.getPointsStructure();
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
    const pointsStructure = this.getPointsStructure();

    // Раскидал созданные точки по временным id
    points.forEach((point) => {
      pointsStructure[point.tempId] = point;
    });

    let tempPointsStructure = null;
    const resultedPointsStructure = Object.values(pointsStructure)
      .reduce((accumulator, currentPoint) => {
        if (tempPointsStructure === null) {
          tempPointsStructure = Object.assign(
              {},
              {
                [accumulator.id]: accumulator
              },
              {
                [currentPoint.id]: currentPoint
              }
          );

          return tempPointsStructure;
        }

        return Object.assign(
            {},
            accumulator,
            {
              [currentPoint.id]: currentPoint
            }
        );
      });

    this.setPoints(resultedPointsStructure);
  }

  removePoint(key) {
    const points = this.getPointsStructure();

    delete points[key];
    this.setPoints(points);
  }
}
