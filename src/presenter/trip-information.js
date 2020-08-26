import {remove, render, AddedComponentPosition} from "../utils/render.js";
import TripInformationContainer from "../view/trip-information.js";
import TripPriceView from "../view/trip-price.js";

export default class TripInformation {
  constructor(tripMainElement, filterModel, getPlanDateEventMap) {
    this._tripMainElement = tripMainElement;
    this._filterModel = filterModel;
    this._getPlanDateEventMap = getPlanDateEventMap;

    this._tripInformationContainer = null;
    this._handleFilterChanged = this._handleFilterChanged.bind(this);
    this._filterModel.addObserver(this._handleFilterChanged);
  }

  _handleFilterChanged() {
    this.init();
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
