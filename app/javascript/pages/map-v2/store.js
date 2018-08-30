/* eslint-disable import/first */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Components
import * as recentImageryComponent from 'components/map-v2/components/recent-imagery';
import * as DataAnalysisMenuComponent from 'pages/map-v2/data-analysis-menu';
import * as ShareComponent from 'components/modals/share';
import * as ModalMetaComponent from 'components/modals/meta';
import * as WidgetsComponent from 'components/widgets';
import * as PopupComponent from 'components/map-v2/components/popup';

// Providers
import * as countryDataProviderComponent from 'providers/country-data-provider';
import * as geostoreProviderComponent from 'providers/geostore-provider';
import * as whitelistsProviderComponent from 'providers/whitelists-provider';
import * as datasetsProviderComponent from 'providers/datasets-provider';
import * as layerSpecProviderComponent from 'providers/layerspec-provider';
import * as latestProviderComponent from 'providers/latest-provider';

// Component Reducers
const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  dataAnalysis: handleActions(DataAnalysisMenuComponent),
  recentImagery: handleActions(recentImageryComponent),
  widgets: handleActions(WidgetsComponent),
  popup: handleActions(PopupComponent)
};

// Provider Reducers
const providersReducers = {
  countryData: handleActions(countryDataProviderComponent),
  geostore: handleActions(geostoreProviderComponent),
  whitelists: handleActions(whitelistsProviderComponent),
  datasets: handleActions(datasetsProviderComponent),
  layerSpec: handleActions(layerSpecProviderComponent),
  latest: handleActions(latestProviderComponent)
};

export const reducers = combineReducers({
  ...providersReducers,
  ...componentsReducers,
  location: router.reducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(thunk, router.middleware);
const store = createStore(
  reducers,
  composeEnhancers(router.enhancer, middlewares)
);

export default store;