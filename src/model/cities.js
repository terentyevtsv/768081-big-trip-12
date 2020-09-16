export default class Cities {
  constructor() {
    this._citiesStructure = null;
  }

  get cities() {
    return Array.from(this._citiesStructure.keys());
  }

  setCities(cities) {
    this._citiesStructure = cities;
  }

  getDestination(city) {
    return this._citiesStructure.has(city)
      ? this._citiesStructure.get(city)
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
