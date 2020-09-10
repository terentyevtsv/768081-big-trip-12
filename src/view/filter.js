import AbstractView from "./abstract.js";

const createSiteFilterTemplate = (isEverythingDisabled, isFutureDisabled, isPastDisabled) =>
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input
        id="filter-everything"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
        checked
        ${isEverythingDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-future"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="future"
        ${isFutureDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input
        id="filter-past"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="past"
        ${isPastDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class Filter extends AbstractView {
  constructor(isEverythingDisabled, isFutureDisabled, isPastDisabled) {
    super();

    this._isEverythingDisabled = isEverythingDisabled;
    this._isFutureDisabled = isFutureDisabled;
    this._isPastDisabled = isPastDisabled;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate(
        this._isEverythingDisabled,
        this._isFutureDisabled,
        this._isPastDisabled
    );
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
