import {remove, render, AddedComponentPosition} from "../utils/render.js";
import TripInformationContainer from "../view/trip-information.js";
import TripPriceView from "../view/trip-price.js";

export default class TripInformation {
  constructor(tripMainElement, filterModel, pointsModel, getPlanDatePointMap) {
    this._tripMainElement = tripMainElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._getPlanDatePointMap = getPlanDatePointMap;

    this._tripInformationContainer = null;

    this.initialize = this.initialize.bind(this);

    this._pointsModel.addObserver(this.initialize);
    this._filterModel.addObserver(this.initialize);
  }

  initialize() {
    if (this._tripInformationContainer !== null) {
      remove(this._tripInformationContainer);
    }

    const planDatePointsMap = this._getPlanDatePointMap();

    this._tripInformationContainer = new TripInformationContainer(planDatePointsMap);
    render(
        this._tripInformationContainer,
        new TripPriceView(planDatePointsMap),
        AddedComponentPosition.BEFORE_END
    );

    render(
        this._tripMainElement,
        this._tripInformationContainer,
        AddedComponentPosition.AFTER_BEGIN
    );
  }
}
