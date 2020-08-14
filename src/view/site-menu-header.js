import AbstractView from "./abstract.js";

const createSiteMenuHeaderTemplate = () =>
  `<h2 class="visually-hidden">Switch trip view</h2>`;

export default class SiteMenuHeader extends AbstractView {
  getTemplate() {
    return createSiteMenuHeaderTemplate();
  }
}
