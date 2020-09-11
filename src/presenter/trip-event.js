import ReadingEventContentView from "../view/reading-event-content.js";
import BaseEventView from "../view/base-event.js";
import {renderEventsOptions, renderFormState} from "../utils/editable-event.js";
import {render, replace, remove, AddedComponentPosition} from "../utils/render.js";
import SelectedOffersContainerView from "../view/selected-offers-container.js";
import OfferItemView from "../view/offer-item.js";
import OpenEventButtonView from "../view/open-event-button.js";
import {UserAction} from "../const.js";
import PointsModel from "../model/points.js";
import EventDetailsView from "../view/event-details.js";
import EventsFiltration from "../utils/filter.js";

const MAX_OFFERS_COUNT = 3;

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TripEvent {
  constructor(
      evt,
      filterPresenter,
      eventListContainer,
      pointsModel,
      offersModel,
      citiesModel,
      filterModel,
      changeData,
      changeMode,
      api
  ) {
    this._event = evt;
    this._filterPresenter = filterPresenter;
    this._eventListContainer = eventListContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._citiesModel = citiesModel;
    this._filterModel = filterModel;
    this._api = api;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._changeOffersListHandler = this._changeOffersListHandler.bind(this);
    this.init = this.init.bind(this);
  }

  init(evt) {
    // Предыдущие редактируемый и компонент для чтения у точки маршрута
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    // Собранные (не подключенные к DOM) пара текущих компонентов с новой моделью
    this._renderReadOnlyEvent(evt);
    this._renderEditableEvent(evt);

    // Подписка к событиям компонентов
    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventComponent === null ||
        prevEventEditComponent === null) {
      // Изначально отрисовка компонента для чтения
      render(
          this._eventListContainer,
          this._eventComponent,
          AddedComponentPosition.BEFORE_END
      );
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      // Обновление компонента для чтения
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      // Обновление компонента для записи
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    // Отчистка памяти от старых компонентов
    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this.init(this._event);
      this._replaceFormToEvent();
    }
  }

  _renderOffers(evt) {
    // Контейнер предложений для текущего события
    const selectedOffersContainer = new SelectedOffersContainerView();
    render(
        this._eventComponent,
        selectedOffersContainer,
        AddedComponentPosition.BEFORE_END
    );

    // Заполнение контейнера предложений текущего события
    let cnt = 0; // счетчик предложений для короткой записи события
    for (let k = 0; k < evt.offers.length; ++k) {
      if (evt.offers[k].isAccepted) {
        ++cnt;
        if (cnt > MAX_OFFERS_COUNT) {
          break;
        }

        render(
            selectedOffersContainer,
            new OfferItemView(evt.offers[k]),
            AddedComponentPosition.BEFORE_END
        );
      }
    }
  }

  _renderReadOnlyEvent(evt) {
    this._eventComponent = new ReadingEventContentView(evt);

    // Отрисовка краткого списка предложений
    this._renderOffers(evt);

    // В конце элемента для чтения кнопка открытия события
    render(
        this._eventComponent,
        new OpenEventButtonView(),
        AddedComponentPosition.BEFORE_END
    );
  }

  _changeOffersListHandler() {
    const offerElements = this._eventEditComponent.getElement()
      .querySelectorAll(`.event__offer-checkbox`);
    const offers = [];
    for (let i = 0; i < offerElements.length; ++i) {
      offers[i] = offerElements[i].checked;
    }

    this._eventEditComponent.updateOffers(offers);
  }

  _renderEditableEvent(evt) {
    this._eventEditComponent = new BaseEventView(
        evt,
        false,
        this._offersModel,
        this._citiesModel,
        this.init,
        () => render(
            this._eventEditComponent,
            this._eventDetailsView,
            AddedComponentPosition.BEFORE_END
        )
    );

    this._eventDetailsView = new EventDetailsView();
    this._offersContainerView = renderEventsOptions(
        this._eventDetailsView,
        this._eventEditComponent,
        evt,
        this._citiesModel
    );
    if (this._offersContainerView !== null) {
      this._offersContainerView.setCheckOffersHandler(this._changeOffersListHandler);
    }
  }

  // Подмена события на форму редактирования
  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  // Подмена формы редактирования на событие
  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(evt) {
    renderFormState(
        this._eventEditComponent,
        this._offersContainerView,
        this._eventDetailsView, {
          isDisabled: true,
          isSaving: true
        });
    const destinationInfo = this._pointsModel.getDestinationInfo(evt.city);
    const point = PointsModel.adaptToServer(evt, destinationInfo);
    this._api.updatePoint(point)
      .then(() => {
        renderFormState(
            this._eventEditComponent,
            this._offersContainerView,
            this._eventDetailsView, {
              isDisabled: false,
              isSaving: false
            }
        );

        this._event = evt;

        this.init(this._event);
        this._replaceFormToEvent();

        this._pointsModel.updatePoint(this._event);

        const eventsFiltration = new EventsFiltration(this._pointsModel.getPoints());
        eventsFiltration.setFilterDisabledFlags(this._filterModel);
        this._filterPresenter.updateFiltersAccessibilityStatus();
      })
      .catch(() => {
        this._eventEditComponent.shake(() => {
          renderFormState(
              this._eventEditComponent,
              this._offersContainerView,
              this._eventDetailsView, {
                isDisabled: false,
                isSaving: false
              }
          );
        });
      });
  }

  _handleDeleteClick(evt) {
    renderFormState(
        this._eventEditComponent,
        this._offersContainerView,
        this._eventDetailsView, {
          isDisabled: true,
          isDeleting: true
        }
    );
    this._api.deletePoint(evt)
      .then(() => {
        renderFormState(
            this._eventEditComponent,
            this._offersContainerView,
            this._eventDetailsView, {
              isDisabled: false,
              isDeleting: false
            }
        );
        this._changeData(UserAction.DELETE_EVENT, evt);

        const eventsFiltration = new EventsFiltration(this._pointsModel.getPoints());
        eventsFiltration.setFilterDisabledFlags(this._filterModel);
        this._filterPresenter.updateFiltersAccessibilityStatus();
      })
      .catch(() => {
        this._eventEditComponent.shake(() => {
          renderFormState(
              this._eventEditComponent,
              this._offersContainerView,
              this._eventDetailsView, {
                isDisabled: false,
                isDeleting: false
              }
          );
        });
      });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.init(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleFavoriteClick() {
    this._event.isFavorite = !this._event.isFavorite;
  }
}
