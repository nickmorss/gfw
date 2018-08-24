import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Legend, {
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  LegendItemTypes,
  LegendListItem
} from 'wri-api-components/dist/legend';

import Icons from 'wri-api-components/dist/icons';

import Loader from 'components/ui/loader';

import Timeline from './components/timeline';
import LayerListMenu from './components/layer-list-menu';
import LayerSelectorMenu from './components/layer-selector-menu';
import LayerSelector from './components/layer-selector';
import LayerStatement from './components/layer-statement';
import LayerMoreInfo from './components/layer-more-info';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const {
      layerGroups,
      onChangeOrder,
      onChangeTimeline,
      onChangeThreshold,
      onToggleLayer,
      onChangeLayer,
      onChangeParam,
      onChangeInfo,
      loading,
      ...rest
    } = this.props;

    return (
      <div className="c-legend">
        <Icons />
        {loading && <Loader className="datasets-loader" />}
        {!loading &&
          layerGroups &&
          !!layerGroups.length && (
            <Legend
              layerGroups={layerGroups}
              collapsable={false}
              onChangeOrder={onChangeOrder}
            >
              {layerGroups.map((lg, i) => {
                const {
                  isSelectorLayer,
                  isMultiLayer,
                  isMultiSelectorLayer,
                  selectorLayerConfig,
                  color,
                  metadata,
                  id,
                  layers,
                  statementConfig
                } =
                  lg || {};

                const activeLayer =
                  (layers && layers.find(l => l.active)) || [];
                const {
                  legendConfig,
                  params,
                  timelineConfig,
                  moreInfo,
                  paramsSelectorConfig
                } =
                  activeLayer || {};

                return (
                  <LegendListItem
                    index={i}
                    key={id}
                    layerGroup={lg}
                    toolbar={
                      <LegendItemToolbar
                        {...rest}
                        enabledStyle={{
                          fill: color || '#97be32'
                        }}
                        defaultStyle={{
                          fill: '#999'
                        }}
                        disabledStyle={{
                          fill: '#d6d6d9'
                        }}
                        focusStyle={{
                          fill: '#676867'
                        }}
                        onChangeInfo={() => onChangeInfo(metadata)}
                      >
                        <LegendItemButtonOpacity
                          className="-plain"
                          handleStyle={[
                            {
                              backgroundColor: '#fff',
                              borderRadius: '4px',
                              border: 0,
                              boxShadow: 'rgba(0, 0, 0, 0.29) 0px 1px 2px 0px'
                            }
                          ]}
                          trackStyle={[
                            { backgroundColor: color || '#97be32' },
                            { backgroundColor: '#d6d6d9' }
                          ]}
                        />
                        <LegendItemButtonVisibility />
                        {metadata && <LegendItemButtonInfo />}
                        <LegendItemButtonRemove />
                      </LegendItemToolbar>
                    }
                  >
                    <LegendItemTypes />
                    {activeLayer &&
                      paramsSelectorConfig &&
                      params &&
                      paramsSelectorConfig.map(
                        paramConfig =>
                          (paramConfig.options ? (
                            <LayerSelector
                              key={`${activeLayer.name}-${paramConfig.key}`}
                              className="param-selector"
                              {...paramConfig}
                              value={
                                params[paramConfig.key] || paramConfig.default
                              }
                              onChange={e =>
                                onChangeParam(activeLayer, {
                                  [paramConfig.key]: e
                                })
                              }
                            />
                          ) : null)
                      )}
                    {(isSelectorLayer || isMultiSelectorLayer) &&
                      selectorLayerConfig && (
                        <LayerSelectorMenu
                          className="layer-selector"
                          layerGroup={lg}
                          multi={isMultiSelectorLayer}
                          onChange={onChangeLayer}
                          {...selectorLayerConfig}
                        />
                      )}
                    {statementConfig && (
                      <LayerStatement
                        className="layer-statement"
                        {...statementConfig}
                      />
                    )}
                    {timelineConfig && (
                      <Timeline
                        className="timeline"
                        handleChange={range =>
                          onChangeTimeline(activeLayer, range)
                        }
                        {...timelineConfig}
                        customColor={
                          legendConfig &&
                          legendConfig.items &&
                          legendConfig.items[0].color
                        }
                      />
                    )}
                    {isMultiLayer && (
                      <LayerListMenu
                        className="sub-layer-menu"
                        layers={lg.layers}
                        onToggle={onToggleLayer}
                        onInfoClick={onChangeInfo}
                      />
                    )}
                    {moreInfo && (
                      <LayerMoreInfo className="more-info" {...moreInfo} />
                    )}
                  </LegendListItem>
                );
              })}
            </Legend>
          )}
      </div>
    );
  }
}

MapLegend.defaultProps = {
  maxHeight: 300,
  LegendItemToolbar: <LegendItemToolbar />,
  LegendItemTypes: <LegendItemTypes />
};

MapLegend.propTypes = {
  layerGroups: PropTypes.array,
  loading: PropTypes.bool,
  onChangeOrder: PropTypes.func,
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func,
  onChangeParam: PropTypes.func,
  onChangeLayer: PropTypes.func,
  onChangeInfo: PropTypes.func,
  layers: PropTypes.array
};

export default MapLegend;
