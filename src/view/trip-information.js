import {AddedComponentPosition, render} from "../utils/render.js";
import TripPriceView from "./trip-price.js";
import {getDateForInterval} from "../utils/formats.js";
import AbstractView from "./abstract.js";

const MAXIMUM_CITIES_COUNT = 3;

const RouteIndex = {
  FIRST_CITY_INDEX: 0,
  SECOND_CITY_INDEX: 1,
  LAST_CITY_INDEX: 2,
};

const getRoute = (cities) => {
  let route = ``;
  for (let i = 0; i < MAXIMUM_CITIES_COUNT; ++i) {
    if (i >= cities.length) {
      break;
    }
    switch (i) {
      case RouteIndex.FIRST_CITY_INDEX:
        route = `${cities[i]}`;
        break;

      case RouteIndex.SECOND_CITY_INDEX:
        route = `${route} &mdash; ${cities.length > MAXIMUM_CITIES_COUNT ? `...` : cities[i]}`;
        break;

      case RouteIndex.LAST_CITY_INDEX:
        route = `${route} &mdash; ${cities[cities.length - 1]}`;
        break;
    }
  }

  return route;
};

const createTripInformationContainerTemplate = (datePointsPlan) => {
  const dates = Array.from(datePointsPlan.keys());
  if (dates.length === 0) {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }

  // Берем дату начала первого события в первой дате
  const leftLimitDate = datePointsPlan.get(dates[0])[0].timeInterval.leftLimitDate;

  const lastDatePoints = datePointsPlan.get(dates[dates.length - 1]);
  const rightLimitDate = lastDatePoints[lastDatePoints.length - 1].timeInterval.rightLimitDate;

  const cities = [];
  let index = 0;
  let lastCity = ``;
  for (const date of dates) {
    for (const point of datePointsPlan.get(date)) {
      if (cities.length === 0) {
        lastCity = point.city;
        cities[index] = point.city;
        continue;
      }
      if (lastCity !== point.city) {
        cities[++index] = point.city;
        lastCity = cities[index];
      }
    }
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRoute(cities)}</h1>

        <p class="trip-info__dates">${getDateForInterval(leftLimitDate)}&nbsp;&mdash;&nbsp;${getDateForInterval(rightLimitDate)}</p>
      </div>
    </section>`
  );
};

export default class TripInformationContainer extends AbstractView {
  constructor(datePointsPlan) {
    super();
    this._datePointsPlan = datePointsPlan;
  }

  getTemplate() {
    return createTripInformationContainerTemplate(this._datePointsPlan);
  }

  fillPrice() {
    render(
        this,
        new TripPriceView(this._datePointsPlan),
        AddedComponentPosition.BEFORE_END
    );
  }
}
