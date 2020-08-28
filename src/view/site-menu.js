import SmartView from "./smart.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = (activeMenuItem) =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a
      class="trip-tabs__btn ${activeMenuItem === MenuItem.TABLE ? `trip-tabs__btn--active` : ``}"
      data-menu="Table"
      href="#"
    >Table</a>
    <a
      class="trip-tabs__btn ${activeMenuItem === MenuItem.STATS ? `trip-tabs__btn--active` : ``}"
      data-menu="Stats"
      href="#"
    >Stats</a>
  </nav>`;

export default class SiteMenu extends SmartView {
  constructor(siteMenuModel) {
    super();

    this._siteMenuModel = siteMenuModel;
    this._data = siteMenuModel.getMenuItem();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._siteMenuModel.getMenuItem());
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {
      this._siteMenuModel.setMenuItem(evt.target.dataset.menu);
      this._data = this._siteMenuModel.getMenuItem();
      this.updateData(this._data);
      this._callback.menuClick(evt.target.dataset.menu);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
