import axios from 'axios';

import { getGainRanked, getExtent } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  axios
    .all([getGainRanked(params), getExtent(params)])
    .then(
      axios.spread((gainResponse, extentResponse) => {
        const gainData = gainResponse.data.data;
        const extentData = extentResponse.data.data;
        let mappedData = [];
        if (gainData && gainData.length && extentData && extentData.length) {
          mappedData = gainData.map(item => {
            const gain = item.gain ? item.gain : 0;
            return {
              id: item.region,
              gain,
              percentage: 100 * gain / extentData[0].value
            };
          });
        }
        dispatch(setWidgetData({ data: mappedData, widget }));
      })
    )
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
