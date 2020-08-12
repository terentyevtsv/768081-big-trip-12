import OffersContainerView from "./offers.js";
import DestinationView from "./destination.js";
import {AddedComponentPosition, render} from "../common.js";
import {eventTypes, getOffers, cities} from "../mock/event.js";
import EmptyEventView from "./empty-event.js";

const EMPTY_EVENT_INDEX = 0;

const getDefaultEvent = () => {
  const tmpCities = Array.from(cities.keys());
  const evt = {
    eventType: eventTypes[EMPTY_EVENT_INDEX],
    city: tmpCities[EMPTY_EVENT_INDEX],
    offers: [],
    destination: cities.get(tmpCities[EMPTY_EVENT_INDEX]),
    isFavorite: false,
    price: 0
  };

  const date = new Date();
  date.setHours(0, 0, 0);

  evt.timeInterval = {
    leftLimitDate: date,
    rightLimitDate: date
  };

  const offers = getOffers(evt.eventType);
  for (let i = 0; i < offers.length; i++) {
    evt.offers[i] = {
      name: offers[i].name,
      price: offers[i].price,
      isAccepted: false
    };
  }

  return evt;
};

export const createEventTemplate = (evt = null, placeContainer) => {
  const isNewEvent = evt === null;
  evt = evt || getDefaultEvent();

  // Форма добавление/редактирования
  const emptyEventElement = new EmptyEventView(evt, isNewEvent)
    .getElement();
  render(
      placeContainer,
      emptyEventElement,
      AddedComponentPosition.BEFORE_END
  );

  // Оферы и места
  const eventDetailsElement = placeContainer.querySelector(`.event__details`);
  if (evt.offers.length > 0 || evt.destination !== null) {
    if (evt.offers.length > 0) {
      render(
          eventDetailsElement,
          new OffersContainerView(evt.offers).getElement(),
          AddedComponentPosition.BEFORE_END
      );
    }

    const destination = cities.get(evt.city);
    if (destination !== null) {
      render(
          eventDetailsElement,
          new DestinationView(destination).getElement(),
          AddedComponentPosition.BEFORE_END
      );
    }
  } else {
    eventDetailsElement.remove();
  }
};
