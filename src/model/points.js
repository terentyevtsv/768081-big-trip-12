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
}
