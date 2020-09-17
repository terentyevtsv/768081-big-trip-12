import AbstractView from "./abstract.js";

const createTripPriceTemplate = (datePointsPlan) => {
  let account = 0;
  for (const pointsDate of datePointsPlan.keys()) {
    for (const point of datePointsPlan.get(pointsDate)) {
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
  constructor(datePointsPlan) {
    super();
    this._datePointsPlan = datePointsPlan;
  }

  getTemplate() {
    return createTripPriceTemplate(this._datePointsPlan);
  }
}
