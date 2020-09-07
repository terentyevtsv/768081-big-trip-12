const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
  }

  getPoints() {
    return this._api.getPoints();
  }

  getEventTypesOffers() {
    return this._api.getEventTypesOffers();
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  updatePoint(point) {
    return this._api.updatePoint(point);
  }

  createPoint(point) {
    return this._api.createPoint(point);
  }

  deletePoint(point) {
    return this._api.deletePoint(point);
  }

  sync(data) {
    return this._api.sync(data);
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
