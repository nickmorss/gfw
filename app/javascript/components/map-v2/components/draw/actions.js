import { createAction, createThunkAction } from 'redux-tools';

import { getGeostoreKey } from 'services/geostore';

export const setGeostoreId = createAction('setGeostoreId');
export const setDrawLoading = createAction('setDrawLoading');

export const getGeostoreId = createThunkAction(
  'getGeostoreId',
  geojson => (dispatch, getState) => {
    if (!getState().analysis.loading) {
      dispatch(setDrawLoading({ loading: true, error: false, geostoreId: '' }));
      getGeostoreKey(geojson)
        .then(geostore => {
          if (geostore && geostore.data && geostore.data.data) {
            const { id } = geostore.data.data;
            dispatch(setGeostoreId(id));
          }
        })
        .catch(error => {
          setDrawLoading({
            loading: false,
            error: true
          });
          console.info(error);
        });
    }
  }
);