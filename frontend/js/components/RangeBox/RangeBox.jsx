import React from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import { I18n, setLocale } from 'react-redux-i18n';
import 'rc-slider/assets/index.css';
import './RangeBox.scss';
import { clearAllFilters } from '../../actions/ideas';
import { numberWithCommas } from '../../utils';

const Range = Slider.Range;

class RangeBox extends React.Component {
  constructor(props) {
    super(props);

    const { from, to, type } = this.props;

    this.state = {
      lowerBound: from,
      upperBound: to,
      value: [from, to],
      used: false,
      type: type,
      collapse: false,
    };

    this.onLowerBoundChange = this.onLowerBoundChange.bind(this);
    this.onUpperBoundChange = this.onUpperBoundChange.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.changeValue = this.changeValue.bind(this);

    this.handleGradientValue = this.handleGradientValue.bind(this);
    this.inputToSliders = this.inputToSliders.bind(this);
    this.inputToSlider = this.inputToSlider.bind(this);
    this.sliderToInput = this.sliderToInput.bind(this);
    this.setDefault = this.setDefault.bind(this);
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  onLowerBoundChange(e) {
    if (
      !e.target.value.match(/^[0-9,]+$/) &&
      e.target.value.match(/^[0-9,\sa-zA-Z]+$/)
    ) {
      return false;
    }
    var temp = e.target.value.replace(/\,/g, '');
    this.setState({ lowerBound: 1 * temp });
    const { upperBound } = this.state;
    var value = [1 * temp, upperBound];
    this.setState({ value: this.sliderToInput([1 * temp, upperBound]) });
    if (1 * temp != 0 || upperBound < this.props.to) {
      this.setState({ used: true });
    } else {
      this.setState({ used: false });
    }
    this.props.handleChange(value);
  }

  onUpperBoundChange(e) {
    if (
      !e.target.value.match(/^[0-9,]+$/) &&
      e.target.value.match(/^[0-9,\sa-zA-Z]+$/)
    ) {
      return false;
    }
    var temp = e.target.value.replace(/\,/g, '');
    this.setState({ upperBound: 1 * temp });
    const { lowerBound } = this.state;
    var value = [lowerBound, 1 * temp];
    this.setState({ value: this.sliderToInput([lowerBound, 1 * temp]) });
    if (1 * temp < this.props.to || lowerBound != 0) {
      this.setState({ used: true });
    } else {
      this.setState({ used: false });
    }
    this.props.handleChange(value);
  }

  onSliderChange(value) {
    this.setState({ value });
    if (this.props.type == 'time') {
      this.setState({ lowerBound: value[0] });
      this.setState({ upperBound: value[1] });
    } else {
      this.setState({ lowerBound: this.inputToSlider(value[0]) });
      this.setState({ upperBound: this.inputToSlider(value[1]) });
    }
    if (value[0] != 0 || value[1] < this.props.to) {
      this.setState({ used: true });
    } else {
      this.setState({ used: false });
    }
  }

  sliderToInput(value) {
    value[0] = this.handleGradientValue(value[0]);
    value[1] = this.handleGradientValue(value[1]);
    return value;
  }

  handleGradientValue(value) {
    const { to } = this.props;
    if (value < to * 0.001) {
      value = value * 100;
    } else if (value < to * 0.2) {
      value = ((value + to * 0.066) / 19.9) * 30;
    } else if (value < to * 0.4) {
      value = value * 1.5 + to * 0.1;
    } else if (value < to * 0.6) {
      value = value * 0.75 + to * 0.4;
    } else if (value < to * 0.8) {
      value = value * 0.5 + to * 0.45;
    } else {
      value = value * 0.25 + to * 0.75;
    }
    return Math.floor(value);
  }

  inputToSliders(value) {
    value[0] = this.inputToSlider(value[0]);
    value[1] = this.inputToSlider(value[1]);
    return value;
  }

  inputToSlider(value) {
    const { to } = this.props;
    if (value < to * 0.1) {
      value = value / 100;
    } else if (value < to * 0.4) {
      value = (value * 19.9) / 30 - to * 0.066;
    } else if (value < to * 0.7) {
      value = (value - to * 0.1) / 1.5;
    } else if (value < to * 0.85) {
      value = (value - to * 0.4) / 0.75;
    } else if (value < to * 0.95) {
      value = (value - to * 0.55) * 2;
    } else {
      value = (value - to * 0.75) * 4;
    }
    return Math.floor(value);
  }

  handleCollapse(e) {
    const upSel = e.currentTarget.querySelector('.fa-angle-up')
      ? e.currentTarget.querySelector('.fa-angle-up')
      : e.currentTarget.parent.querySelector('.fa-angle-up');
    const downSel = e.currentTarget.querySelector('.fa-angle-down')
      ? e.currentTarget.querySelector('.fa-angle-down')
      : e.currentTarget.parent.querySelector('.fa-angle-down');
    const rangeSelector = e.currentTarget.querySelector('.fa-angle-up')
      ? e.currentTarget.nextSibling
      : e.currentTarget.parent.nextSibling;

    if (upSel.classList.contains('hidden')) {
      upSel.classList.remove('hidden');
      downSel.classList.add('hidden');
      rangeSelector.classList.remove('hidden');
      this.setState({ collapse: false });
    } else {
      upSel.classList.add('hidden');
      downSel.classList.remove('hidden');
      rangeSelector.classList.add('hidden');
      this.setState({ collapse: true });
    }
  }

  changeValue(e) {
    var value1 = e[0];
    var value2 = e[1];
    var result = [];
    if (this.props.type == 'time') {
      result = e;
    } else {
      result = this.inputToSliders([value1, value2]);
    }
    this.setState({
      lowerBound: result[0],
      upperBound: result[1],
      value: e,
    });
    this.props.handleChange(result);
  }

  setDefault() {
    this.setState({
      lowerBound: 0,
      upperBound: this.props.to,
      value: [0, this.props.to],
      used: false,
    });
    const { dispatch } = this.props;
    dispatch(clearAllFilters(false));
  }

  render() {
    const { title, from, to, clearFlag } = this.props;
    const { used, lowerBound, upperBound, collapse, value } = this.state;
    if (clearFlag) {
      this.setDefault();
    }
    return (
      <div className="filters-range">
        <h6
          className={
            used
              ? 'range-title selected' + (collapse ? ' collapsed' : '')
              : 'range-title' + (collapse ? ' collapsed' : '')
          }
          onClick={e => this.handleCollapse(e)}
        >
          {title}
          <i className="fas fa-angle-down float-right hidden" />
          <i className="fas fa-angle-up float-right" />
        </h6>
        <div className="range-data">
          <div className="range-holder">
            <label>{I18n.t('ideas.filter.from')} </label>
            <input
              type="text"
              max={to}
              min={from}
              value={numberWithCommas(lowerBound)}
              onChange={this.onLowerBoundChange}
            />
            <br />
            <label>{I18n.t('ideas.filter.to')} </label>
            <input
              type="text"
              max={to}
              min={from}
              value={numberWithCommas(upperBound)}
              onChange={this.onUpperBoundChange}
            />
          </div>
          <br />
          <Range
            allowCross={false}
            max={to}
            min={from}
            value={value}
            onChange={this.onSliderChange}
            onAfterChange={this.changeValue}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    clearFlag: state.ideas.clearFlag,
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeBox);
