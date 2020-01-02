import React, { Component } from 'react';

export class Collapsable extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
    };
  }
  render() {
    let { collapsed } = this.state;
    return (
      <div className="collapsable-wrapper">
        <div
          onClick={() => this.setState({ collapsed: !collapsed })}
          className={`arrow-icon ${
            collapsed ? 'arrow-roatate-up' : 'arrow-roatate-down'
          }`}
        >
          <span>
            <img src={require('./../../../assets/images/arrow-angle.png')} />
          </span>
        </div>
        {!collapsed ? this.props.children : null}
      </div>
    );
  }
}
