import {AddedComponentPosition, render} from "../utils/render.js";
import TripPriceView from "./trip-price.js";
import {getDateForInterval} from "../utils/formats.js";
import AbstractView from "./abstract.js";

const MAX_CITIES_COUNT = 3;
const FIRST_CITY_INDEX = 0;
const SECOND_CITY_INDEX = 1;
const LAST_CITY_INDEX = 2;

const getRoute = (cities) => {
  let route = ``;
  for (let i = 0; i < MAX_CITIES_COUNT; ++i) {
    if (i >= cities.length) {
      break;
    }
    switch (i) {
      case FIRST_CITY_INDEX:
        route = `${cities[i]}`;
        break;

      case SECOND_CITY_INDEX:
        route = `${route} &mdash; ${cities.length > MAX_CITIES_COUNT ? `...` : cities[i]}`;
        break;

      case LAST_CITY_INDEX:
        route = `${route} &mdash; ${cities[cities.length - 1]}`;
        break;
    }
  }

  return route;
};

const createTripInformationContainerTemplate = (planDateEventsMap) => {
  const msDates = Array.from(planDateEventsMap.keys());
  if (msDates.length === 0) {
    return `<section class="trip-main__trip-info  trip-info"></section>`;
  }

  // Берем дату начала первого события в первой дате
  const leftLimitDate = planDateEventsMap.get(msDates[0])[0].timeInterval.leftLimitDate;

  const lastDateEvents = planDateEventsMap.get(msDates[msDates.length - 1]);
  const rightLimitDate = lastDateEvents[lastDateEvents.length - 1].timeInterval.rightLimitDate;

  const cities = [];
  let index = 0;
  let lastCity = ``;
  for (const msDate of msDates) {
    for (const evt of planDateEventsMap.get(msDate)) {
      if (cities.length === 0) {
        lastCity = evt.city;
        cities[index] = evt.city;
        continue;
      }
      if (lastCity !== evt.city) {
        cities[++index] = evt.city;
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
  constructor(planDateEventsMap) {
    super();
    this._planDateEventsMap = planDateEventsMap;
  }

  getTemplate() {
    return createTripInformationContainerTemplate(this._planDateEventsMap);
  }

  fillPrice() {
    render(
        this,
        new TripPriceView(this._planDateEventsMap),
        AddedComponentPosition.BEFORE_END
    );
  }
}
