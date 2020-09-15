import AbstractView from "./abstract.js";

const createTripPriceTemplate = (planDatePointsMap) => {
  let account = 0;
  for (const pointsDate of planDatePointsMap.keys()) {
    for (const point of planDatePointsMap.get(pointsDate)) {
      point.offers
        .filter((offer) => offer.isAccepted)
        .forEach((offer) => {
          account += offer.price;
        });
      account += point.price;
    }
  }

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${account}</span>
    </p>`
  );
};

export default class TripPrice extends AbstractView {
  constructor(planDatePointsMap) {
    super();
    this._planDatePointsMap = planDatePointsMap;
  }

  getTemplate() {
    return createTripPriceTemplate(this._planDatePointsMap);
  }
}
