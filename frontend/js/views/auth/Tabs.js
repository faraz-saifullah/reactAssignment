import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

function Tabs(props) {
  const { tabData, activeTab, changeTab } = props;
  return (
    <ul className="signup-nav">
      {tabData.map(tab => (
        <Tab
          key={tab.name}
          data={tab}
          isActive={activeTab === tab}
          handleClick={() => changeTab(tab)}
        />
      ))}
    </ul>
  );
}

Tabs.propTypes = {
  activeTab: PropTypes.object,
  changeTab: PropTypes.func.isRequired,
  tabData: PropTypes.array,
};


export default Tabs;
