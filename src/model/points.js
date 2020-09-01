import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
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
}
