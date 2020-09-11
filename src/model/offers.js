import {getSnakeCaseString, getCapitalizedWord} from "../utils/common.js";
import {EventGroup} from "../const.js";

const eventGroups = {
  [`taxi`]: EventGroup.MOVEMENT,
  [`bus`]: EventGroup.MOVEMENT,
  [`train`]: EventGroup.MOVEMENT,
  [`ship`]: EventGroup.MOVEMENT,
  [`transport`]: EventGroup.MOVEMENT,
  [`drive`]: EventGroup.MOVEMENT,
  [`flight`]: EventGroup.MOVEMENT,
  [`check-in`]: EventGroup.PLACE,
  [`sightseeing`]: EventGroup.PLACE,
  [`restaurant`]: EventGroup.PLACE,
};

export default class Offers {
  constructor() {
    this._typeOffers = null;
  }

  get eventTypes() {
    return Array.from(this._typeOffers.keys());
  }

  setOffers(typeOffers) {
    this._typeOffers = typeOffers;
  }

  getOffers(eventType) {
    return this._typeOffers.has(eventType)
      ? this._typeOffers.get(eventType)
      : null;
  }

  static adaptOfferToClient(offer) {
    const adaptedOffer = Object.assign(
        {},
        offer,
        {
          name: offer.title,
          label: getSnakeCaseString(offer.title)
        }
    );

    delete adaptedOffer.title;

    return adaptedOffer;
  }

  static adaptEventTypeToClient(serverEventType) {
    const adaptedEventType = Object.assign(
        {},
        serverEventType,
        {
          name: getCapitalizedWord(serverEventType.type),
          image: `img/icons/${serverEventType.type}.png`,
          eventGroup: eventGroups[serverEventType.type],
          value: serverEventType.type
        }
    );

    delete adaptedEventType.offers;
    delete adaptedEventType.type;

    return adaptedEventType;
  }
}
