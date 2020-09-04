import OffersContainerView from "../view/offers.js";
import DestinationView from "../view/destination.js";
import {AddedComponentPosition, render, remove} from "./render.js";

export const renderEventsOptions = (eventDetailsView, eventEditComponent, evt, citiesModel) => {
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
    remove(eventDetailsView);
  }

  return offersContainerView;
};

export const renderFormState = (eventEditComponent, offersContainerView, eventDetailsView, state) => {
  if (offersContainerView !== null) {
    offersContainerView.updateData({isDisabled: state.isDisabled});
  }
  eventEditComponent.updateData(state, false);
  render(
      eventEditComponent,
      eventDetailsView,
      AddedComponentPosition.BEFORE_END
  );
};
