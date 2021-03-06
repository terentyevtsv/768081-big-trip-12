import Abstract from "./abstract.js";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let previousElement = this.getElement();
    const parent = previousElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, previousElement);
    previousElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw Error(`Abstract method not implemented: resetHandlers`);
  }
}
