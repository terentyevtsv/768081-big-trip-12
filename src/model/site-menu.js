import Observer from "../utils/observer.js";
import {MenuItem} from "../const.js";

export default class SiteMenu extends Observer {
  constructor() {
    super();
    this._activeMenuItem = MenuItem.TABLE;
  }

  setMenuItem(menuItem) {
    this._activeMenuItem = menuItem;
    this._notify(menuItem);
  }

  getMenuItem() {
    return this._activeMenuItem;
  }
}
