export default class Cities {
  constructor() {
    this._citiesMap = null;
  }

  get cities() {
    return Array.from(this._citiesMap.keys());
  }

  setCities(cities) {
    this._citiesMap = cities;
  }

  getDestination(city) {
    return this._citiesMap.has(city)
      ? this._citiesMap.get(city)
      : null;
  }

  static adaptDestinationToClient(destination) {
    const photos = [];
    destination.pictures.forEach((picture) => {
      photos.push({
        source: picture.src,
        description: picture.description
      });
    });
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          photos
        }
    );

    delete adaptedDestination.name;
    delete adaptedDestination.pictures;

    return adaptedDestination;
  }
}
