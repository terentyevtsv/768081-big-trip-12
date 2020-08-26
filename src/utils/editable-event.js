import EventDetailsView from "../view/event-details.js";
import {cities} from "../mock/event.js";
import OffersContainerView from "../view/offers.js";
import DestinationView from "../view/destination.js";
import {AddedComponentPosition, render} from "./render.js";

export const renderEventsOptions = (eventEditComponent, evt) => {
  const eventDetailsView = new EventDetailsView();

  render(
      eventEditComponent,
      eventDetailsView,
      AddedComponentPosition.BEFORE_END
  );

  // Оферы и места
  if (evt.offers.length > 0 || evt.destination !== null) {
    if (evt.offers.length > 0) {
      render(
          eventDetailsView,
          new OffersContainerView(evt.offers),
          AddedComponentPosition.BEFORE_END
      );
    }

    const destination = cities.get(evt.city);
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
};
