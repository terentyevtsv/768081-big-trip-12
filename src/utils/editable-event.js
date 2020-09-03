import EventDetailsView from "../view/event-details.js";
import OffersContainerView from "../view/offers.js";
import DestinationView from "../view/destination.js";
import {AddedComponentPosition, render} from "./render.js";

export const renderEventsOptions = (eventEditComponent, evt, citiesModel) => {
  const eventDetailsView = new EventDetailsView();

  render(
      eventEditComponent,
      eventDetailsView,
      AddedComponentPosition.BEFORE_END
  );

  let offersContainerView = null;

  // Оферы и места
  if (evt.offers.length > 0 || evt.destination !== null) {
    if (evt.offers.length > 0) {
      offersContainerView = new OffersContainerView(evt.offers);
      render(
          eventDetailsView,
          offersContainerView,
          AddedComponentPosition.BEFORE_END
      );
    }

    const destination = citiesModel.getDestination(evt.city);
    if (destination !== null) {
      render(
          eventDetailsView,
          new DestinationView(destination),
          AddedComponentPosition.BEFORE_END
      );
    }
  } else {
    eventDetailsView.remove();
  }

  return offersContainerView;
};
