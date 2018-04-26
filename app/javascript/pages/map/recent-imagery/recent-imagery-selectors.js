import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import moment from 'moment';
import { format } from 'd3-format';
import { sortByKey } from 'utils/data';

const getData = state => state.data || null;
const getBbox = state => state.bbox || null;
const getDataStatus = state => state.dataStatus || null;
const getSettings = state => state.settings || null;

const getFilteredData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { clouds } = settings;
    const dataFiltered = data.filter(
      item => Math.round(item.attributes.cloud_score) <= clouds
    );
    return sortByKey(
      dataFiltered.map(item => item.attributes),
      'date_time',
      true
    );
  }
);

export const getAllTiles = createSelector([getFilteredData], data => {
  if (!data || isEmpty(data)) return [];

  return data.map(item => ({
    id: item.source,
    url: item.tile_url,
    thumbnail: item.thumbnail_url,
    cloudScore: item.cloud_score,
    dateTime: item.date_time,
    instrument: item.instrument,
    description: `${moment(item.date_time)
      .format('DD MMM YYYY')
      .toUpperCase()} - ${format('.0f')(item.cloud_score)}% cloud coverage - ${
      item.instrument
    }`
  }));
});

export const getTile = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { selectedTileSource } = settings;
    const index = findIndex(
      data,
      d => d.attributes.source === selectedTileSource
    );
    if (index === -1) {
      return null;
    }

    const selectedTile = data[index].attributes;
    return {
      url: selectedTile.tile_url,
      cloudScore: selectedTile.cloud_score,
      dateTime: selectedTile.date_time,
      instrument: selectedTile.instrument,
      description: `${moment(selectedTile.date_time)
        .format('DD MMM YYYY')
        .toUpperCase()} - ${format('.0f')(
        selectedTile.cloud_score
      )}% cloud coverage - ${selectedTile.instrument}`
    };
  }
);

export const getBounds = createSelector([getBbox], bbox => {
  if (!bbox || isEmpty(bbox)) return null;

  return bbox.geometry.coordinates;
});

export const getSources = createSelector(
  [getData, getDataStatus],
  (data, dataStatus) => {
    if (!data || isEmpty(data)) return null;

    const { tilesPerRequest, requestedTiles } = dataStatus;
    return data
      .slice(requestedTiles, requestedTiles + tilesPerRequest)
      .map(item => ({ source: item.attributes.source }));
  }
);

export const getDates = createSelector([getSettings], settings => {
  const { date, weeks } = settings;
  const currentDate = date ? moment(date) : moment();

  return {
    end: currentDate.format('YYYY-MM-DD'),
    start: currentDate.subtract(weeks, 'weeks').format('YYYY-MM-DD')
  };
});
