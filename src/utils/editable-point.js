import OffersContainerView from "../view/offers.js";
import DestinationView from "../view/destination.js";
import {AddedComponentPosition, render, remove} from "./render.js";

export const renderPointsOptions = (pointDetailsView, pointEditComponent, point, citiesModel) => {
  render(
      pointEditComponent,
      pointDetailsView,
      AddedComponentPosition.BEFORE_END
  );

  let offersContainerView = null;

  // Оферы и места
  if (point.offers.length > 0 || point.destination !== null) {
    if (point.offers.length > 0) {
      offersContainerView = new OffersContainerView(point.offers);
      render(
          pointDetailsView,
          offersContainerView,
          AddedComponentPosition.BEFORE_END
      );
    }

    const destination = citiesModel.getDestination(point.city);
    if (destination !== null) {
      render(
          pointDetailsView,
          new DestinationView(destination),
          AddedComponentPosition.BEFORE_END
      );
    }
  } else {
    remove(pointDetailsView);
  }

  return offersContainerView;
};

export const renderFormState = (pointEditComponent, offersContainerView, pointDetailsView, state) => {
  if (offersContainerView !== null) {
    offersContainerView.updateData({isDisabled: state.isDisabled});
  }
  pointEditComponent.updateData(state, false);
  render(
      pointEditComponent,
      pointDetailsView,
      AddedComponentPosition.BEFORE_END
  );
};
