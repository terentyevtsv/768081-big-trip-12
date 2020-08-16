import AbstractView from "./abstract.js";

const createSiteFilterHeaderTemplate = () =>
  `<h2 class="visually-hidden">Filter events</h2>`;

export default class FilterHeader extends AbstractView {
  getTemplate() {
    return createSiteFilterHeaderTemplate();
  }
}
