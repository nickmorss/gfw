import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import Icon from 'components/ui/icon';
import Slider from 'components/ui/slider';

import PlayIcon from 'assets/icons/play.svg';
import PauseIcon from 'assets/icons/pause.svg';

import './styles.scss';

class Timeline extends Component {
  render() {
    const {
      className,
      isPlaying,
      handleTogglePlay,
      min,
      max,
      start,
      end,
      trim,
      handleOnChange,
      handleOnAfterChange,
      marks,
      customColor,
      formatDateString,
      intervalStep,
      canPlay
    } = this.props;

    return (
      <div className={`c-timeline ${className || ''}`}>
        {canPlay && (
          <button className="control-btn" onClick={handleTogglePlay}>
            <Icon
              className={isPlaying ? 'pause' : 'play'}
              icon={isPlaying ? PauseIcon : PlayIcon}
            />
          </button>
        )}
        <Slider
          className={`range ${canPlay ? 'can-play' : ''}`}
          marks={marks}
          disabled={isPlaying}
          min={min}
          max={max}
          value={canPlay ? [start, end, trim] : [start, end]}
          trackColors={[customColor, chroma(customColor).darken(1.3)]}
          step={intervalStep}
          onChange={handleOnChange}
          onAfterChange={handleOnAfterChange}
          formatValue={formatDateString}
          showTooltip={index => isPlaying && index === 1}
          range
        />
      </div>
    );
  }
}

Timeline.propTypes = {
  className: PropTypes.string,
  isPlaying: PropTypes.bool,
  handleTogglePlay: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  start: PropTypes.number,
  end: PropTypes.number,
  trim: PropTypes.number,
  handleOnChange: PropTypes.func,
  handleOnAfterChange: PropTypes.func,
  marks: PropTypes.object,
  formatDateString: PropTypes.func,
  customColor: PropTypes.string,
  intervalStep: PropTypes.number,
  canPlay: PropTypes.bool
};

export default Timeline;