import {getRandomInteger, getRandomDate} from "../utils/common.js";
import {EventGroup} from "../const.js";

const MAX_SENTENCE_COUNT = 5;
const destinationDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const MIN_PRICE = 20;
const MAX_PRICE = 200;
const DAYS_BEFORE_AFTER = 5;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getRandomTimeInterval = () => {
  const nowDate = new Date();

  const firstDate = new Date();
  const lastDate = new Date();

  // Определили диапазон дат
  firstDate.setDate(nowDate.getDate() - DAYS_BEFORE_AFTER);
  firstDate.setHours(0, 0, 0);

  lastDate.setDate(nowDate.getDate() + DAYS_BEFORE_AFTER);
  lastDate.setHours(23, 59, 59);

  const date1 = getRandomDate(firstDate, lastDate);
  const date2 = getRandomDate(firstDate, lastDate);

  if (date1 === date2) {
    return {
      leftLimitDate: date1,
      rightLimitDate: date2
    };
  }

  const leftLimitDate = date1 < date2 ? date1 : date2;
  const rightLimitDate = date1 < date2 ? date2 : date1;

  return {
    leftLimitDate,
    rightLimitDate
  };
};

const getRandomDestinationsDescription = () => {
  // Случайное количество предложений
  const sentenceCount = getRandomInteger(0, MAX_SENTENCE_COUNT);

  // Считаем, что если количество предложений 0, то описание отсутствует
  if (sentenceCount === 0) {
    return null;
  }

  // Формируем описание из заданного количества предложений и фотографий
  let fullDescription = ``;
  const photos = [];
  for (let i = 0; i < sentenceCount; i++) {
    fullDescription +=
      ` ${destinationDescriptions[getRandomInteger(0, destinationDescriptions.length - 1)]}`;
    photos[i] = `http://picsum.photos/248/152?r=${Math.random()}`;
  }

  return {
    description: fullDescription,
    photos
  };
};

export const cities = new Map([
  [`Amsterdam`, getRandomDestinationsDescription()],
  [`Geneva`, getRandomDestinationsDescription()],
  [`Chamonix`, getRandomDestinationsDescription()],
  [`Saint Petersburg`, getRandomDestinationsDescription()]
]);

export const typeOffers = new Map([
  [
    {
      name: `Taxi`,
      image: `img/icons/taxi.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `taxi`
    }, [
      {name: `Order Uber`, price: 30, label: `uber`},
      {name: `Order Yandex`, price: 25, label: `yandex`},
      {name: `Order Leader`, price: 27, label: `leader`}
    ]
  ],
  [
    {
      name: `Bus`,
      image: `img/icons/bus.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `bus`
    }, []
  ],
  [
    {
      name: `Train`,
      image: `img/icons/train.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `train`
    }, [
      {name: `Econom`, price: 60, label: `econom`},
      {name: `Stateroom`, price: 80, label: `stateroom`},
      {name: `SV`, price: 130, label: `sv`},
    ]
  ],
  [
    {
      name: `Ship`,
      image: `img/icons/ship.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `ship`
    }, [
      {name: `Entertainments on board`, price: 20, label: `entertainments`},
      {name: `Alcohol`, price: 80, label: `alcohol`},
    ]
  ],
  [
    {
      name: `Transport`,
      image: `img/icons/transport.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `transport`
    }, []
  ],
  [
    {
      name: `Drive`,
      image: `img/icons/drive.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `drive`
    }, [
      {name: `Navigation`, price: 5, label: `navigation`},
      {name: `Full tank of fuel`, price: 40, label: `full`},
      {name: `Video recorder`, price: 8, label: `recorder`},
    ]
  ],
  [
    {
      name: `Flight`,
      image: `img/icons/flight.png`,
      eventGroup: EventGroup.MOVEMENT,
      value: `flight`
    }, [
      {name: `Add luggage`, price: 30, label: `luggage`},
      {name: `Switch to comfort class`, price: 100, label: `comfort`},
      {name: `Add meal`, price: 15, label: `meal`},
      {name: `Choose seats`, price: 5, label: `seats`},
      {name: `Travel by train`, price: 40, label: `train`}
    ]
  ],
  [
    {
      name: `Check`,
      image: `img/icons/check-in.png`,
      eventGroup: EventGroup.PLACE,
      value: `check-in`
    }, [
      {name: `Sea view`, price: 100, label: `sea`},
      {name: `All inclusive`, price: 100, label: `all`},
      {name: `Meeting in arrival zone`, price: 15, label: `meeting`},
      {name: `Lux`, price: 50, label: `lux`},
      {name: `Mini bar`, price: 20, label: `bar`}
    ]
  ],
  [
    {
      name: `Sightseeing`,
      image: `img/icons/sightseeing.png`,
      eventGroup: EventGroup.PLACE,
      value: `sightseeing`
    }, [
      {name: `Book tickets`, price: 40, label: `tickets`},
      {name: `Lunch in city`, price: 30, label: `lunch`},
      {name: `Souvenirs`, price: 25, label: `souvenirs`}
    ]
  ],
  [
    {
      name: `Restaurant`,
      image: `img/icons/restaurant.png`,
      eventGroup: EventGroup.PLACE,
      value: `restaurant`
    }, [
      {name: `Desert`, price: 3, label: `desert`},
      {name: `Beverage`, price: 2, label: `beverage`},
      {name: `Snack`, price: 1, label: `snack`},
    ]
  ]
]);

const getRandomEventType = (eventTypes) => {
  return eventTypes[getRandomInteger(0, eventTypes.length - 1)];
};

export const generateEvent = (offersModel) => {
  const tmpCities = Array.from(cities.keys());
  const evt = {
    id: generateId(),
    eventType: getRandomEventType(offersModel.eventTypes),
    city: tmpCities[getRandomInteger(0, tmpCities.length - 1)],
    offers: [],
    isFavorite: Boolean(getRandomInteger()),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    timeInterval: getRandomTimeInterval()
  };

  const offers = offersModel.getOffers(evt.eventType);

  for (let i = 0; i < offers.length; i++) {
    evt.offers[i] = {
      name: offers[i].name,
      price: offers[i].price,
      label: offers[i].label,
      isAccepted: Boolean(getRandomInteger())
    };
  }

  return evt;
};
