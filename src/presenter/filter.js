import {render, AddedComponentPosition, remove} from "../utils/render.js";
import FilterHeaderView from "../view/filter-header.js";
import FilterView from "../view/filter.js";

export default class Filter {
  constructor(tripMainTripControlElement, filterModel) {
    this._tripMainTripControlElement = tripMainTripControlElement;
    this._filterModel = filterModel;

    this._filterHeaderView = new FilterHeaderView();

    const {isEverythingDisabled, isFutureDisabled, isPastDisabled} =
      this._filterModel.getFilterDisabledFlags();
    this._filterView = new FilterView(
        isEverythingDisabled,
        isFutureDisabled,
        isPastDisabled,
        this._filterModel.getFilter()
    );

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._updateFiltersAccessibilityStatus = this.updateFiltersAccessibilityStatus.bind(this);
  }

  init() {
    render(
        this._tripMainTripControlElement,
        this._filterHeaderView,
        AddedComponentPosition.BEFORE_END
    );

    this.updateFiltersAccessibilityStatus();
  }

  updateFiltersAccessibilityStatus() {
    if (this._filterView !== null) {
      remove(this._filterView);
      this._filterView = null;
    }

    const {isEverythingDisabled, isFutureDisabled, isPastDisabled} =
      this._filterModel.getFilterDisabledFlags();
    this._filterView = new FilterView(
        isEverythingDisabled,
        isFutureDisabled,
        isPastDisabled,
        this._filterModel.getFilter()
    );

    this._filterView.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    render(
        this._tripMainTripControlElement,
        this._filterView,
        AddedComponentPosition.BEFORE_END
    );
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(filterType);
  }
}
