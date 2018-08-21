import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import MapComponent from './map-component';
import { getMapProps } from './map-selectors';

import { setInteraction } from './components/popup/actions';
import ownActions from './map-actions';

const actions = {
  setInteraction,
  ...ownActions
};

const mapStateToProps = ({ location, datasets, geostore, latest }) => ({
  ...getMapProps({
    ...location,
    ...datasets,
    ...geostore,
    latest: latest.data
  })
});

class MapContainer extends PureComponent {
  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
