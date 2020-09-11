import {nanoid} from "nanoid";

const createPointsStructure = (points) => {
  return points.reduce((acc, current) => {
    delete current.isDeleting;
    delete current.isSaving;
    delete current.isDisabled;
    return Object.assign({}, acc, {
      [current.id]: current,
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
    const tmpPoints = Object.values(pointsObject);
    return Promise.resolve(tmpPoints);
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
        .then((response) => {
          this._store.setPoint(response.id, response);
          return response;
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

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._store.getPointsObject());

      return this._api.sync(storePoints)
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
