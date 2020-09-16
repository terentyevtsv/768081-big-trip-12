import {getSnakeCaseText, getCapitalizedWord} from "../utils/common.js";
import {PointGroup} from "../const.js";

const pointGroupsDictionary = {
  [`taxi`]: PointGroup.MOVEMENT,
  [`bus`]: PointGroup.MOVEMENT,
  [`train`]: PointGroup.MOVEMENT,
  [`ship`]: PointGroup.MOVEMENT,
  [`transport`]: PointGroup.MOVEMENT,
  [`drive`]: PointGroup.MOVEMENT,
  [`flight`]: PointGroup.MOVEMENT,
  [`check-in`]: PointGroup.PLACE,
  [`sightseeing`]: PointGroup.PLACE,
  [`restaurant`]: PointGroup.PLACE,
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
          label: getSnakeCaseText(offer.title)
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
          pointGroup: pointGroupsDictionary[serverEventType.type],
          value: serverEventType.type
        }
    );

    delete adaptedEventType.offers;
    delete adaptedEventType.type;

    return adaptedEventType;
  }
}
