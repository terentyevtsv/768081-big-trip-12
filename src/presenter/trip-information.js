import {remove, render, AddedComponentPosition} from "../utils/render.js";
import TripInformationContainer from "../view/trip-information.js";
import TripPriceView from "../view/trip-price.js";

export default class TripInformation {
  constructor(tripMainElement, filterModel, pointsModel, getPlanDateEventMap) {
    this._tripMainElement = tripMainElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._getPlanDateEventMap = getPlanDateEventMap;

    this._tripInformationContainer = null;

    this.init = this.init.bind(this);

    this._pointsModel.addObserver(this.init);
    this._filterModel.addObserver(this.init);
  }

  init() {
    if (this._tripInformationContainer !== null) {
      remove(this._tripInformationContainer);
    }

    const planDateEventsMap = this._getPlanDateEventMap();

    this._tripInformationContainer = new TripInformationContainer(planDateEventsMap);
    render(
        this._tripInformationContainer,
        new TripPriceView(planDateEventsMap),
        AddedComponentPosition.BEFORE_END
    );

    render(
        this._tripMainElement,
        this._tripInformationContainer,
        AddedComponentPosition.AFTER_BEGIN
    );
  }
}
