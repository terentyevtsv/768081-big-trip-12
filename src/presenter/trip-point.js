import ReadingPointContentView from "../view/reading-point-content.js";
import BasePointView from "../view/base-point.js";
import {renderPointsOptions, renderFormState} from "../utils/editable-point.js";
import {render, replace, remove, AddedComponentPosition} from "../utils/render.js";
import SelectedOffersContainerView from "../view/selected-offers-container.js";
import OfferItemView from "../view/offer-item.js";
import OpenPointButtonView from "../view/open-point-button.js";
import {Key, UserAction} from "../const.js";
import PointsModel from "../model/points.js";
import PointDetailsView from "../view/point-details.js";
import PointsFiltration from "../utils/filter.js";

const MAXIMUM_OFFERS_COUNT = 3;

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TripPoint {
  constructor(
      point,
      filterPresenter,
      pointListContainer,
      pointsModel,
      offersModel,
      citiesModel,
      filterModel,
      changePoint,
      changeMode,
      api
  ) {
    this._point = point;
    this._filterPresenter = filterPresenter;
    this._pointListContainer = pointListContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._citiesModel = citiesModel;
    this._filterModel = filterModel;
    this._api = api;

    this._changePoint = changePoint;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escapeKeyDownHandler = this._escapeKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleOffersListChange = this._handleOffersListChange.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  initialize(point) {
    // Предыдущие редактируемый и компонент для чтения у точки маршрута
    const previousPointComponent = this._pointComponent;
    const previousPointEditComponent = this._pointEditComponent;

    // Собранные (не подключенные к DOM) пара текущих компонентов с новой моделью
    this._renderReadOnlyPoint(point);
    this._renderEditablePoint(point);

    // Подписка к событиям компонентов
    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (previousPointComponent === null ||
        previousPointEditComponent === null) {
      // Изначально отрисовка компонента для чтения
      render(
          this._pointListContainer,
          this._pointComponent,
          AddedComponentPosition.BEFORE_END
      );
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      // Обновление компонента для чтения
      replace(this._pointComponent, previousPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      // Обновление компонента для записи
      replace(this._pointEditComponent, previousPointEditComponent);
    }

    // Отчистка памяти от старых компонентов
    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this.initialize(this._point);
      this._replaceFormToPoint();
    }
  }

  _renderOffers(point) {
    // Контейнер предложений для текущего события
    const selectedOffersContainer = new SelectedOffersContainerView();
    render(
        this._pointComponent,
        selectedOffersContainer,
        AddedComponentPosition.BEFORE_END
    );

    // Заполнение контейнера предложений текущего события
    let count = 0; // счетчик предложений для короткой записи события
    for (const offer of point.offers) {
      if (offer.isAccepted) {
        ++count;
        if (count > MAXIMUM_OFFERS_COUNT) {
          break;
        }

        render(
            selectedOffersContainer,
            new OfferItemView(offer),
            AddedComponentPosition.BEFORE_END
        );
      }
    }
  }

  _renderReadOnlyPoint(point) {
    this._pointComponent = new ReadingPointContentView(point);

    // Отрисовка краткого списка предложений
    this._renderOffers(point);

    // В конце элемента для чтения кнопка открытия события
    render(
        this._pointComponent,
        new OpenPointButtonView(),
        AddedComponentPosition.BEFORE_END
    );
  }

  _renderEditablePoint(point) {
    this._pointEditComponent = new BasePointView(
        point,
        false,
        this._offersModel,
        this._citiesModel,
        this.initialize,
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
      this._offersContainerView.setOffersCheckHandler(this._handleOffersListChange);
    }
  }

  // Подмена точки маршрута на форму редактирования
  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escapeKeyDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  // Подмена формы редактирования на точку маршрута
  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escapeKeyDownHandler);

    this._mode = Mode.DEFAULT;
  }

  _handleOffersListChange() {
    const offerElements = this._pointEditComponent.getElement()
      .querySelectorAll(`.event__offer-checkbox`);
    const offers = [];
    for (let i = 0; i < offerElements.length; ++i) {
      offers[i] = offerElements[i].checked;
    }

    this._pointEditComponent.updateOffers(offers);
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(point) {
    renderFormState(
        this._pointEditComponent,
        this._offersContainerView,
        this._pointDetailsView, {
          isDisabled: true,
          isSaving: true
        });
    const destinationsInformation = this._pointsModel.getDestinationsInformation(point.city);
    const tempPoint = PointsModel.adaptToServer(point, destinationsInformation);
    this._api.updatePoint(tempPoint)
      .then(() => {
        renderFormState(
            this._pointEditComponent,
            this._offersContainerView,
            this._pointDetailsView, {
              isDisabled: false,
              isSaving: false
            }
        );

        this._point = point;

        this.initialize(this._point);
        this._replaceFormToPoint();

        this._pointsModel.update(this._point);

        const pointsFiltration = new PointsFiltration(this._pointsModel.get());
        pointsFiltration.setFilterDisabledFlags(this._filterModel);
        this._filterPresenter.updateAccessibilityStatus();
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

  _handleDeleteClick(point) {
    renderFormState(
        this._pointEditComponent,
        this._offersContainerView,
        this._pointDetailsView, {
          isDisabled: true,
          isDeleting: true
        }
    );
    this._api.deletePoint(point)
      .then(() => {
        renderFormState(
            this._pointEditComponent,
            this._offersContainerView,
            this._pointDetailsView, {
              isDisabled: false,
              isDeleting: false
            }
        );
        this._changePoint(UserAction.POINT_REMOVAL, point);

        const pointsFiltration = new PointsFiltration(this._pointsModel.get());
        pointsFiltration.setFilterDisabledFlags(this._filterModel);
        this._filterPresenter.updateAccessibilityStatus();
      })
      .catch(() => {
        this._pointEditComponent.shake(() => {
          renderFormState(
              this._pointEditComponent,
              this._offersContainerView,
              this._pointDetailsView, {
                isDisabled: false,
                isDeleting: false
              }
          );
        });
      });
  }

  _handleFavoriteClick() {
    this._point.isFavorite = !this._point.isFavorite;
  }

  _handleCloseClick() {
    this.initialize(this._point);
    this._replaceFormToPoint();
  }

  _escapeKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this._handleCloseClick();
    }
  }
}
