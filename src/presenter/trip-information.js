import {remove, render, AddedComponentPosition} from "../utils/render.js";
import TripInformationContainer from "../view/trip-information.js";
import TripPriceView from "../view/trip-price.js";

export default class TripInformation {
  constructor(tripMainElement, filterModel, pointsModel, getDatePointsPlan) {
    this._tripMainElement = tripMainElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._getDatePointsPlan = getDatePointsPlan;

    this._tripInformationContainer = null;

    this.initialize = this.initialize.bind(this);

    this._pointsModel.addObserver(this.initialize);
    this._filterModel.addObserver(this.initialize);
  }

  initialize() {
    if (this._tripInformationContainer !== null) {
      remove(this._tripInformationContainer);
    }

    const datePointsPlan = this._getDatePointsPlan();

    this._tripInformationContainer = new TripInformationContainer(datePointsPlan);
    render(
        this._tripInformationContainer,
        new TripPriceView(datePointsPlan),
        AddedComponentPosition.BEFORE_END
    );

    render(
        this._tripMainElement,
        this._tripInformationContainer,
        AddedComponentPosition.AFTER_BEGIN
    );
  }
}
