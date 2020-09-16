import BasePointView from "../view/base-point.js";
import {renderPointsOptions, renderFormState} from "../utils/editable-point.js";
import {render, AddedComponentPosition, replace, remove} from "../utils/render.js";
import {Key, UserAction} from "../const.js";
import PointsModel from "../model/points.js";
import PointDetailsView from "../view/point-details.js";
import PointsFiltration from "../utils/filter.js";

const EMPTY_POINT_INDEX = 0;

export default class NewPoint {
  constructor(
      filterPresenter,
      pointListContainer,
      offersModel,
      citiesModel,
      pointsModel,
      filterModel,
      newPointButtonView,
      changePoint,
      changePointsMode,
      api
  ) {
    this._filterPresenter = filterPresenter;
    this._pointListContainer = pointListContainer;
    this._changePoint = changePoint;
    this._changePointsMode = changePointsMode;
    this._offersModel = offersModel;
    this._citiesModel = citiesModel;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._newPointButtonView = newPointButtonView;
    this._api = api;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escapeKeyDownHandler = this._escapeKeyDownHandler.bind(this);
    this._initializeBasePoint = this._initializeBasePoint.bind(this);
    this._changeOffersListHandler = this._changeOffersListHandler.bind(this);
    this._point = this._getDefaultPoint();

    this._offers = [];

    for (const offer of this._point.offers) {
      this._offers.push(offer.isAccepted);
    }
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    this._newPointButtonView.inverseEnabled();
    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escapeKeyDownHandler);
  }

  _escapeKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(point) {
    renderFormState(
        this._pointEditComponent,
        this._offersContainerView,
        this._pointDetailsView, {
          isDisabled: true,
          isSaving: true
        });
    for (let i = 0; i < this._offers.length; ++i) {
      point.offers[i].isAccepted = this._offers[i];
    }

    const destinationsInformation = this._pointsModel.getDestinationsInformation(point.city);
    const tempPoint = PointsModel.adaptToServer(point, destinationsInformation);

    this._api.createPoint(tempPoint)
      .then((response) => {
        renderFormState(
            this._pointEditComponent,
            this._offersContainerView,
            this._pointDetailsView, {
              isDisabled: false,
              isSaving: false
            }
        );

        this._changePoint(
            UserAction.POINT_CREATION,
            Object.assign({id: response.id}, point)
        );
        this.destroy();

        const pointsFiltration = new PointsFiltration(this._pointsModel.getPoints());
        pointsFiltration.setFilterDisabledFlags(this._filterModel);
        this._filterPresenter.updateFiltersAccessibilityStatus();
      })
      .catch(() => {
        this._pointEditComponent.shake(() => {
          renderFormState(
              this._pointEditComponent,
              this._offersContainerView,
              this._pointDetailsView, {
                isDisabled: false,
                isSaving: false
              }
          );
        });
      });
  }

  _handleCancelClick() {
    this.destroy();
  }

  // Значения по умолчанию для точки маршрута при создании
  _getDefaultPoint() {
    const tempCities = this._citiesModel.cities;
    const point = {
      eventType: this._offersModel.eventTypes[EMPTY_POINT_INDEX],
      city: tempCities[EMPTY_POINT_INDEX],
      offers: [],
      destination: this._citiesModel.getDestination(tempCities[EMPTY_POINT_INDEX]),
      isFavorite: false,
      price: 0
    };

    const date = new Date();
    date.setHours(0, 0, 0);

    point.timeInterval = {
      leftLimitDate: date,
      rightLimitDate: date
    };

    const offers = this._offersModel.getOffers(point.eventType);
    for (let i = 0; i < offers.length; i++) {
      point.offers[i] = {
        name: offers[i].name,
        price: offers[i].price,
        label: offers[i].label,
        isAccepted: false
      };
    }

    return point;
  }

  _initializeBasePoint(point) {
    const previousPointEditComponent = this._pointEditComponent;

    this._offers = [];
    for (let i = 0; i < point.offers.length; i++) {
      this._offers[i] = false;
    }

    this._renderNewPoint(point);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleCancelClick);

    document.addEventListener(`keydown`, this._escapeKeyDownHandler);

    replace(this._pointEditComponent, previousPointEditComponent);
    remove(previousPointEditComponent);
  }

  _changeOffersListHandler() {
    const offerElements = this._pointEditComponent.getElement()
      .querySelectorAll(`.event__offer-checkbox`);
    for (let i = 0; i < offerElements.length; ++i) {
      this._offers[i] = offerElements[i].checked;
    }
    this._pointEditComponent.updateOffers(this._offers);
  }

  _renderNewPoint(point) {
    this._pointEditComponent = new BasePointView(
        point,
        true,
        this._offersModel,
        this._citiesModel,
        this._initializeBasePoint,
        () => render(
            this._pointEditComponent,
            this._pointDetailsView,
            AddedComponentPosition.BEFORE_END
        )
    );

    this._pointDetailsView = new PointDetailsView();
    this._offersContainerView = renderPointsOptions(
        this._pointDetailsView,
        this._pointEditComponent,
        point,
        this._citiesModel
    );
    if (this._offersContainerView !== null) {
      this._offersContainerView.setCheckOffersHandler(this._changeOffersListHandler);
    }

    render(
        this._pointListContainer,
        this._pointEditComponent,
        AddedComponentPosition.BEFORE_END
    );
  }

  initialize() {
    this._renderNewPoint(this._point);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleCancelClick);

    document.addEventListener(`keydown`, this._escapeKeyDownHandler);
  }
}
