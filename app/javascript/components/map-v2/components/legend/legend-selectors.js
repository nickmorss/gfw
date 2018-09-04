import { createStructuredSelector } from 'reselect';

import { getActiveDatasetsState, getLegendLayerGroups } from '../../selectors';

const getLoading = state => state.datasets.loading || state.countryData.loading;

export const getLegendProps = createStructuredSelector({
  loading: getLoading,
  layerGroups: getLegendLayerGroups,
  activeDatasets: getActiveDatasetsState
});
