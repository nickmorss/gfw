import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import {
  Line,
  Bar,
  Cell,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';

import ChartToolTip from '../components/chart-tooltip';
import CustomTick from './custom-tick-component';
import './composed-chart-styles.scss';

class CustomComposedChart extends PureComponent {
  findMaxValue = (data, config) => {
    const { yKeys } = config;
    const maxValues = [];
    Object.keys(yKeys).forEach(key => {
      Object.keys(yKeys[key]).forEach(subKey => {
        maxValues.push(maxBy(data, subKey)[subKey]);
      });
    });
    return max(maxValues);
  };

  render() {
    const {
      xKey,
      yKeys,
      xAxis,
      yAxis,
      gradients,
      tooltip,
      unit,
      unitFormat,
      height
    } = this.props.config;
    const {
      className,
      data,
      config,
      handleMouseMove,
      handleMouseLeave
    } = this.props;

    const { lines, bars, areas } = yKeys;
    const maxYValue = this.findMaxValue(data, config);

    return (
      <div className={`c-composed-chart ${className}`} style={{ height }}>
        <ResponsiveContainer width="99%">
          <ComposedChart
            data={data}
            margin={{ top: 15, right: 0, left: 42, bottom: 0 }}
            padding={{ left: 50 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {gradients &&
                Object.keys(gradients).map(key => (
                  <linearGradient
                    key={`lg_${key}`}
                    {...gradients[key].attributes}
                  >
                    {gradients[key].stops &&
                      Object.keys(gradients[key].stops).map(sKey => (
                        <stop
                          key={`st_${sKey}`}
                          {...gradients[key].stops[sKey]}
                        />
                      ))}
                  </linearGradient>
                ))}
            </defs>
            <XAxis
              dataKey={xKey || ''}
              axisLine={false}
              tickLine={false}
              tick={{ dy: 8, fontSize: '12px', fill: '#555555' }}
              {...xAxis}
            />
            <YAxis
              axisLine={false}
              strokeDasharray="3 4"
              tickSize={-42}
              mirror
              tickMargin={0}
              tick={
                <CustomTick
                  dataMax={maxYValue}
                  unit={unit || ''}
                  unitFormat={
                    unitFormat ||
                    (value =>
                      (value < 1 ? format('.2r')(value) : format('.2s')(value)))
                  }
                  fill="#555555"
                />
              }
              {...yAxis}
            />
            <CartesianGrid vertical={false} strokeDasharray="3 4" />
            <Tooltip
              cursor={{
                opacity: 0.5,
                stroke: '#d6d6d9',
                ...(!!bars && { strokeWidth: `${1.2 * (100 / data.length)}%` })
              }}
              content={<ChartToolTip settings={tooltip} />}
            />
            {areas &&
              Object.keys(areas).map(key => (
                <Area key={key} dataKey={key} dot={false} {...areas[key]} />
              ))}
            {lines &&
              Object.keys(lines).map(key => (
                <Line
                  key={key}
                  dataKey={key}
                  dot={false}
                  strokeWidth={2}
                  {...lines[key]}
                />
              ))}
            {bars &&
              Object.keys(bars).map(key => (
                <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                  {bars[key].itemColor &&
                    data.map(item => (
                      <Cell key={`c_${item.color}`} fill={item.color} />
                    ))}
                </Bar>
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CustomComposedChart.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  className: PropTypes.string,
  handleMouseMove: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  backgroundColor: PropTypes.string
};

export default CustomComposedChart;
