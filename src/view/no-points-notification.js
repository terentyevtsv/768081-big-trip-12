import AbstractView from "./abstract.js";

const createNoPointsNotificationTemplate = () =>
  `<p class="trip-events__msg">
    Click New Event to create your first point
  </p>`;

export default class NoPointsNotification extends AbstractView {
  getTemplate() {
    return createNoPointsNotificationTemplate();
  }
}
