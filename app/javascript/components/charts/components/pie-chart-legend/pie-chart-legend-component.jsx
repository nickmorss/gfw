import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';

import './pie-chart-legend-styles.scss';

class PieChartLegend extends PureComponent {
  render() {
    const { data, config, className } = this.props;
    let sizeClass = '';
    if (data.length > 5) {
      sizeClass = 'x-small';
    } else if (data.length > 3) {
      sizeClass = 'small';
    }

    return (
      <ul className={`c-pie-chart-legend ${className} ${sizeClass}`}>
        {data.map((item, index) => {
          const value = `${formatNumber({
            num: item[config.key],
            unit: config.unit
          })}`;
          return (
            <li className="legend-item" key={index.toString()}>
              <div className="legend-title">
                <span style={{ backgroundColor: item.color }}>{}</span>
                <p>
                  {item.label}
                  {data.length > 5 && ` - ${value}`}
                </p>
              </div>
              <div className="legend-value" style={{ color: item.color }}>
                {value}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}

PieChartLegend.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  className: PropTypes.string
};

PieChartLegend.defaultProps = {
  config: {
    unit: '',
    key: 'value',
    format: '.3s'
  }
};

export default PieChartLegend;
