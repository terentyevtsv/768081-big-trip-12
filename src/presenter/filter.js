import {render, AddedComponentPosition, remove} from "../utils/render.js";
import FilterHeaderView from "../view/filter-header.js";
import FilterView from "../view/filter.js";

export default class Filter {
  constructor(tripMainTripControlElement, filterModel) {
    this._tripMainTripControlElement = tripMainTripControlElement;
    this._filterModel = filterModel;

    this._filterHeaderView = new FilterHeaderView();
    this._filterView = new FilterView();

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    render(
        this._tripMainTripControlElement,
        this._filterHeaderView,
        AddedComponentPosition.BEFORE_END
    );

    if (this._filterView !== null) {
      remove(this._filterView);
      this._filterView = null;
    }

    this._filterView = new FilterView();
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
