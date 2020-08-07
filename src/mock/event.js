import {getRandomInteger, getRandomDate} from "../common.js";

const MAX_SENTENCE_COUNT = 5;
const CITIES = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
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

const EventGroup = {
  MOVEMENT: `to`,
  PLACE: `in`
};

const typeOffers = new Map([
  [
    {
      name: `Taxi`,
      image: `img/icons/taxi.png`,
      eventGroup: EventGroup.MOVEMENT
    }, [
      {name: `Order Uber`, price: 30},
      {name: `Order Yandex`, price: 25},
      {name: `Order Leader`, price: 27}
    ]
  ],
  [
    {
      name: `Bus`,
      image: `img/icons/bus.png`,
      eventGroup: EventGroup.MOVEMENT
    }, []
  ],
  [
    {
      name: `Train`,
      image: `img/icons/train.png`,
      eventGroup: EventGroup.MOVEMENT
    }, [
      {name: `Econom`, price: 60},
      {name: `Stateroom`, price: 80},
      {name: `SV`, price: 130},
    ]
  ],
  [
    {
      name: `Ship`,
      image: `img/icons/ship.png`,
      eventGroup: EventGroup.MOVEMENT
    }, [
      {name: `Entertainments on board`, price: 20},
      {name: `Alcohol`, price: 80},
    ]
  ],
  [
    {
      name: `Transport`,
      image: `img/icons/transport.png`,
      eventGroup: EventGroup.MOVEMENT
    }, []
  ],
  [
    {
      name: `Drive`,
      image: `img/icons/drive.png`,
      eventGroup: EventGroup.MOVEMENT
    }, [
      {name: `Navigation`, price: 5},
      {name: `Full tank of fuel`, price: 40},
      {name: `Video recorder`, price: 8},
    ]
  ],
  [
    {
      name: `Flight`,
      image: `img/icons/flight.png`,
      eventGroup: EventGroup.MOVEMENT
    }, [
      {name: `Add luggage`, price: 30},
      {name: `Switch to comfort class`, price: 100},
      {name: `Add meal`, price: 15},
      {name: `Choose seats`, price: 5},
      {name: `Travel by train`, price: 40}
    ]
  ],
  [
    {
      name: `Check`,
      image: `img/icons/check-in.png`,
      eventGroup: EventGroup.PLACE
    }, [
      {name: `Sea view`, price: 100},
      {name: `All inclusive`, price: 100},
      {name: `Meeting in arrival zone`, price: 15},
      {name: `Lux`, price: 50},
      {name: `Mini bar`, price: 20}
    ]
  ],
  [
    {
      name: `Sightseeing`,
      image: `img/icons/check-in.png`,
      eventGroup: EventGroup.PLACE
    }, [
      {name: `Book tickets`, price: 40},
      {name: `Lunch in city`, price: 30},
      {name: `Souvenirs`, price: 25}
    ]
  ],
  [
    {
      name: `Restaurant`,
      image: `img/icons/restaurant.png`,
      eventGroup: EventGroup.PLACE
    }, [
      {name: `Desert`, price: 3},
      {name: `Beverage`, price: 2},
      {name: `Snack`, price: 1},
    ]
  ]
]);

const eventTypes = Array.from(typeOffers.keys());

const getOffers = (eventType) => {
  return typeOffers.has(eventType)
    ? typeOffers.get(eventType)
    : null;
};

const getRandomEventType = () => {
  return eventTypes[getRandomInteger(0, eventTypes.length - 1)];
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

export const generateEvent = () => {
  const evt = {
    eventType: getRandomEventType(),
    city: CITIES[getRandomInteger(0, CITIES.length - 1)],
    offers: [],
    destination: getRandomDestinationsDescription(),
    isFavorite: Boolean(getRandomInteger()),
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    timeInterval: getRandomTimeInterval()
  };

  const offers = getOffers(evt.eventType);
  const offersCount = getRandomInteger(0, offers.length - 1);
  for (let i = 0; i < offersCount; i++) {
    evt.offers[i] = offers[i];
  }

  return evt;
};