export const createTripPriceTemplate = (planDateEventsMap) => {
  let account = 0;
  for (const eventsDate of planDateEventsMap.keys()) {
    for (const evt of planDateEventsMap.get(eventsDate)) {
      evt.offers
        .filter((offer) => offer.isAccepted)
        .forEach((offer) => {
          account += offer.price;
        });
      account += evt.price;
    }
  }

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${account}</span>
    </p>`
  );
};
