import React, { PureComponent } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import CountryDataProvider from 'providers/country-data-provider';
import Map from 'components/map';
import MapMenu from 'pages/map/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import MapControls from 'components/map/components/map-controls';
import RecentImagery from 'pages/map/recent-imagery';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    return (
      <div className="l-map">
        <Map />
        <MapMenu />
        <div className="map-actions">
          <MapControls className="map-controls" share />
          <DragDropContextProvider backend={HTML5Backend}>
            <RecentImagery />
          </DragDropContextProvider>
        </div>
        <Share />
        <ModalMeta />
        <CountryDataProvider />
      </div>
    );
  }
}

export default Page;
