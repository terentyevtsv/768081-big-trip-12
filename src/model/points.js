import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  getCitiesMap() {
    return this._citiesMap;
  }

  setСitiesMap(value) {
    this._citiesMap = value;
  }

  getDestinationInfo(city) {
    return this._citiesMap.has(city)
      ? this._citiesMap.get(city)
      : null;
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  updatePoint(point) {
    const index = this._points.findIndex((item) => item.id === point.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    const part1 = this._points.slice(0, index);
    const part2 = this._points.slice(index + 1);
    this._points = [
      ...part1,
      point,
      ...part2
    ];

    this._notify(point);
  }

  addPoint(update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(update);
  }

  deletePoint(update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(update);
  }

  static adaptToClient(point, eventType, maskOffers) {
    const offers = [];
    const checkedOffersSet = new Set(point.offers.map((offer) => offer.title));
    maskOffers.forEach((offer) => {
      offers.push({
        name: offer.name,
        price: offer.price,
        label: offer.label,
        isAccepted: checkedOffersSet.has(offer.name)
      });
    });

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          eventType,
          city: point.destination.name,
          offers,
          isFavorite: point.is_favorite,
          price: point.base_price,
          timeInterval: {
            leftLimitDate: new Date(point.date_from),
            rightLimitDate: new Date(point.date_to)
          }
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.destination;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.type;

    return adaptedPoint;
  }

  static adaptToServer(point, destinationInfo) {
    const tmpOffers = point.offers
      .filter((offer) => offer.isAccepted);
    const offers = [];
    tmpOffers.forEach((offer) => offers.push({
      price: offer.price,
      title: offer.name
    }));

    const destination = {
      description: destinationInfo.description,
      name: point.city,
      pictures: []
    };

    destinationInfo.photos.forEach((photo) => destination.pictures.push({
      src: photo.source,
      description: photo.description
    }));

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "date_from": point.timeInterval.leftLimitDate.toISOString(),
          "date_to": point.timeInterval.rightLimitDate.toISOString(),
          "is_favorite": point.isFavorite,
          offers,
          destination,
          "type": point.eventType.value
        }
    );

    delete adaptedPoint.city;
    delete adaptedPoint.eventType;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.timeInterval;

    delete adaptedPoint.isDeleting;
    delete adaptedPoint.isSaving;
    delete adaptedPoint.isDisabled;

    return adaptedPoint;
  }
}
