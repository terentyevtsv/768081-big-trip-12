import SmartView from "./smart.js";

const createNewEventButtonTemplate = (isEnabled) =>
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    ${!isEnabled ? `disabled` : ``}
  >
    New event
  </button>`;

export default class NewEventButton extends SmartView {
  constructor(isEnabled) {
    super();

    this._data.isEnabled = isEnabled;
    this._clickNewEventButtonHandler = this._clickNewEventButtonHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButtonTemplate(this._data.isEnabled);
  }

  _clickNewEventButtonHandler(evt) {
    this._callback.newEventClick(evt);
    this.updateData({isEnabled: !this._data.isEnabled}, false);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`click`, this._clickNewEventButtonHandler);
  }

  setButtonClickHandler(callback) {
    this._callback.newEventClick = callback;
    this.getElement().addEventListener(`click`, this._clickNewEventButtonHandler);
  }

  inverseEnabled() {
    this.updateData({
      isEnabled: !this._data.isEnabled
    }, false);
  }
}
