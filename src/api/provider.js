import {nanoid} from "nanoid";

const createPointsStructure = (points) => {
  return points.reduce((accumulator, currentPoint) => {
    delete currentPoint.isDeleting;
    delete currentPoint.isSaving;
    delete currentPoint.isDisabled;
    return Object.assign({}, accumulator, {
      [currentPoint.id]: currentPoint,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._shouldSynchronize = false;
  }

  get shouldSynchronize() {
    return this._shouldSynchronize;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api
        .getPoints()
        .then((points) => {
          const pointsObject = createPointsStructure(points);
          this._store.setPoints(pointsObject);
          return points;
        });
    }

    const pointsObject = this._store.getPointsObject();
    const tempPoints = Object.values(pointsObject);
    return Promise.resolve(tempPoints);
  }

  getEventTypesOffers() {
    if (this._isOnLine()) {
      return this._api
        .getEventTypesOffers()
        .then((serverEventTypes) => {
          this._store.setEventTypes(serverEventTypes);
          return serverEventTypes;
        });
    }

    const eventTypesOffers = this._store.getEventTypesOffers();
    return Promise.resolve(eventTypesOffers);
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api
        .getDestinations()
        .then((serverDestinations) => {
          this._store.setCities(serverDestinations);
          return serverDestinations;
        });
    }

    const destinations = this._store.getCities();
    return Promise.resolve(destinations);
  }

  updatePoint(point) {
    if (this._isOnLine()) {
      return this._api
        .updatePoint(point)
        .then((updatedPoint) => {
          this._store.setPoint(updatedPoint.id, updatedPoint);
          return updatedPoint;
        });
    }

    this._shouldSynchronize = true;
    this._store.setPoint(point.id, point);
    return Promise.resolve(point);
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api
        .createPoint(point)
        .then((responsePoint) => {
          this._store.setPoint(responsePoint.id, responsePoint);
          return responsePoint;
        });
    }

    this._shouldSynchronize = true;

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewPointId = nanoid();
    const localNewPoint = Object.assign(
        {},
        point,
        {
          id: localNewPointId,
          tempId: localNewPointId
        }
    );

    this._store.setPoint(localNewPoint.id, localNewPoint);

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (this._isOnLine()) {
      return this._api
        .deletePoint(point)
        .then(() => {
          this._store.removePoint(point.id);
        });
    }

    this._shouldSynchronize = true;

    this._store.removePoint(point.id);

    return Promise.resolve();
  }

  synchronize() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._store.getPointsObject());

      return this._api.synchronize(storePoints)
        .then((response) => {
          if (response.created.length > 0) {
            this._store.updateCreatedPoints(response.created);
          }

          this._shouldSynchronize = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
