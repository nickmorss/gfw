import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MenuFlap from 'pages/map/menu/components/menu-flap';

import Icon from 'components/ui/icon';
import gfwLogo from 'assets/logos/gfw.png';

import './menu-styles.scss';

class Menu extends PureComponent {
  render() {
    const {
      sections,
      activeSection,
      selectedSection,
      setSelectedSection,
      onToggleLayer,
      setModalMeta,
      loading
    } = this.props;

    return (
      <div>
        <div className="c-map-menu">
          <img
            className="c-map-menu__logo"
            src={gfwLogo}
            alt="Global Forest Watch"
          />
          {sections && (
            <ul
              className={`c-map-menu__buttons-group ${
                selectedSection ? '--has-selection' : ''
              }`}
            >
              {sections.map(section => {
                const { slug, name, icon, layerCount } = section;
                return (
                  <li
                    key={`menu_${slug}`}
                    className={`c-map-menu__item ${
                      selectedSection === slug ? '--selected' : ''
                    }`}
                  >
                    <button
                      className="c-map-menu__item-button"
                      onClick={() => {
                        setSelectedSection(slug);
                      }}
                      disabled={loading}
                    >
                      <Icon icon={icon} className="icon" />
                      {name}
                      {!!layerCount && (
                        <div className="c-map-menu__item-badge">
                          {layerCount}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <MenuFlap
          section={selectedSection}
          isBig={activeSection && activeSection.large}
          onClickClose={() => setSelectedSection(null)}
        >
          {activeSection &&
            activeSection.Component && (
              <activeSection.Component
                {...activeSection}
                onToggleLayer={onToggleLayer}
                onInfoClick={setModalMeta}
              />
            )}
        </MenuFlap>
      </div>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.array,
  selectedSection: PropTypes.string,
  activeSection: PropTypes.object,
  setSelectedSection: PropTypes.func.isRequired,
  layers: PropTypes.array,
  onToggleLayer: PropTypes.func,
  setModalMeta: PropTypes.func,
  loading: PropTypes.bool
};

export default Menu;