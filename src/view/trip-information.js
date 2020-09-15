import {AddedComponentPosition, render} from "../utils/render.js";
import TripPriceView from "./trip-price.js";
import {getDateForInterval} from "../utils/formats.js";
import AbstractView from "./abstract.js";

const MAXIMUM_CITIES_COUNT = 3;
const FIRST_CITY_INDEX = 0;
const SECOND_CITY_INDEX = 1;
const LAST_CITY_INDEX = 2;

const getRoute = (cities) => {
  let route = ``;
  for (let i = 0; i < MAXIMUM_CITIES_COUNT; ++i) {
    if (i >= cities.length) {
      break;
    }
    switch (i) {
      case FIRST_CITY_INDEX:
        route = `${cities[i]}`;
        break;

      case SECOND_CITY_INDEX:
        route = `${route} &mdash; ${cities.length > MAXIMUM_CITIES_COUNT ? `...` : cities[i]}`;
        break;

      case LAST_CITY_INDEX:
        route = `${route} &mdash; ${cities[cities.length - 1]}`;
        break;
    }
  }

  return route;
};

const createTripInformationContainerTemplate = (planDatePointsMap) => {
  const dates = Array.from(planDatePointsMap.keys());
  if (dates.length === 0) {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }

  // Берем дату начала первого события в первой дате
  const leftLimitDate = planDatePointsMap.get(dates[0])[0].timeInterval.leftLimitDate;

  const lastDatePoints = planDatePointsMap.get(dates[dates.length - 1]);
  const rightLimitDate = lastDatePoints[lastDatePoints.length - 1].timeInterval.rightLimitDate;

  const cities = [];
  let index = 0;
  let lastCity = ``;
  for (const date of dates) {
    for (const point of planDatePointsMap.get(date)) {
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
  constructor(planDatePointsMap) {
    super();
    this._planDatePointsMap = planDatePointsMap;
  }

  getTemplate() {
    return createTripInformationContainerTemplate(this._planDatePointsMap);
  }

  fillPrice() {
    render(
        this,
        new TripPriceView(this._planDatePointsMap),
        AddedComponentPosition.BEFORE_END
    );
  }
}
