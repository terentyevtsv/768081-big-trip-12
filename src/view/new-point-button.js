import SmartView from "./smart.js";

const createNewPointButtonTemplate = (isEnabled) =>
  `<button
    class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
    type="button"
    ${!isEnabled ? `disabled` : ``}
  >
    New event
  </button>`;

export default class NewPointButton extends SmartView {
  constructor(isEnabled) {
    super();

    this._data.isEnabled = isEnabled;
    this._clickNewPointButtonHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewPointButtonTemplate(this._data.isEnabled);
  }

  _clickHandler(evt) {
    this._callback.newPointClick(evt);
    this.updateData({isEnabled: !this._data.isEnabled}, false);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  setButtonClickHandler(callback) {
    this._callback.newPointClick = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  inverseEnabled() {
    this.updateData({
      isEnabled: !this._data.isEnabled
    }, false);
  }
}
