import {render, AddedComponentPosition} from "../utils/render.js";
import FilterHeaderView from "../view/filter-header.js";
import FilterView from "../view/filter.js";
import { UpdateType } from "../const.js";

export default class Filter {
  constructor(tripMainTripControlElement, filterModel) {
    this._tripMainTripControlElement = tripMainTripControlElement;
    this._filterModel = filterModel;

    this._filterHeaderView = new FilterHeaderView();
    this._filterView = new FilterView();

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    this._filterView.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    render(
        this._tripMainTripControlElement,
        this._filterHeaderView,
        AddedComponentPosition.BEFORE_END
    );

    render(
        this._tripMainTripControlElement,
        this._filterView,
        AddedComponentPosition.BEFORE_END
    );
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UpdateType.MINOR, filterType);
  }
}
