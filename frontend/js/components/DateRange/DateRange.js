import React, { Component } from 'react';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n, setLocale } from 'react-redux-i18n';
import Scroll from 'react-scroll';

import 'react-datetime/css/react-datetime.css';
import './DateRange.scss';

class DateRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: props.min,
      endDate: props.max,
      used: false,
    };

    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  componentWillReceiveProps(props) {
    this.setState({
      startDate: props.min,
      endDate: props.max,
    });
  }

  handleStartChange(date) {
    this.setState({ startDate: date });
    const { endDate } = this.state;
    if (
      moment(date).valueOf() > moment('2019-01-01').valueOf() ||
      moment(endDate).valueOf() < moment('2020-01-01').valueOf()
    ) {
      this.setState({ used: true });
    } else {
      this.setState({ used: false });
    }
    this.props.handleChange([
      moment(date).valueOf(),
      moment(endDate).valueOf(),
    ]);
  }

  handleEndChange(date) {
    this.setState({ endDate: date });
    const { startDate } = this.state;
    if (
      moment(startDate).valueOf() > moment('2019-01-01').valueOf() ||
      moment(date).valueOf() < moment('2020-01-01').valueOf()
    ) {
      this.setState({ used: true });
    } else {
      this.setState({ used: false });
    }
    this.props.handleChange([
      moment(startDate).valueOf(),
      moment(date).valueOf(),
    ]);
  }

  handleCollapse(e) {
    const upSel = e.currentTarget.querySelector('.fa-angle-up');
    const downSel = e.currentTarget.querySelector('.fa-angle-down');
    const rangeSelector = e.currentTarget.nextSibling;

    if (upSel.classList.contains('hidden')) {
      upSel.classList.remove('hidden');
      downSel.classList.add('hidden');
      rangeSelector.classList.remove('hidden');
    } else {
      upSel.classList.add('hidden');
      downSel.classList.remove('hidden');
      rangeSelector.classList.add('hidden');
    }
  }

  onFocus(index) {
    if (this.props.type == 'filter') {
      if (index == 1) {
        var y =
          document
            .getElementsByClassName('rdtPicker')[0]
            .getBoundingClientRect().top + window.pageYOffset;
        var height = document
          .getElementsByClassName('rdtPicker')[0]
          .getBoundingClientRect().height;
        var totalHeight = y + height + 20;
        console.log(totalHeight);
        if (
          document.querySelector('.sidebar-column').getBoundingClientRect()
            .height < totalHeight
        ) {
          let scroll = Scroll.animateScroll;
          scroll.scrollToBottom({ smooth: false, duration: 0, delay: 0 });
          document.querySelector('.sidebar-column').style.height =
            totalHeight + 'px';
        }
      } else {
        var length = document.getElementsByClassName('rdtPicker').length;
        var y =
          document
            .getElementsByClassName('rdtPicker')
          [length - 1].getBoundingClientRect().top + window.pageYOffset;
        var height = document
          .getElementsByClassName('rdtPicker')
        [length - 1].getBoundingClientRect().height;
        var totalHeight = y + height + 20;
        if (
          document.querySelector('.sidebar-column').getBoundingClientRect()
            .height < totalHeight
        ) {
          let scroll = Scroll.animateScroll;
          scroll.scrollToBottom({ smooth: false, duration: 0, delay: 0 });
          document.querySelector('.sidebar-column').style.height =
            totalHeight + 'px';
        }
      }
    }
  }

  onBlur() {
    if (this.props.type == 'filter') {
      document.querySelector('.sidebar-column').style.height = 'auto';
    }
  }

  render() {
    const { startDate, endDate, used } = this.state;
    return (
      <div className="filters-range">
        <h6
          className={used ? 'range-title selected' : 'range-title'}
          onClick={e => this.handleCollapse(e)}
        >
          {I18n.t('ideas.filter.new.dateSub')}
          <i className="fas fa-angle-down float-right hidden" />
          <i className="fas fa-angle-up float-right" />
        </h6>
        <div className="range-data">
          <div className="range-holder row">
            <div className="col-md-6 date-picker">
              <label>{I18n.t('ideas.filter.from')}</label>
              <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                onBlur={this.onBlur}
                onChange={this.handleStartChange}
                value={new Date(startDate)}
                closeOnSelect={true}
                onFocus={() => this.onFocus(1)}
              />
            </div>
            <div className="col-md-6 date-picker">
              <label>{I18n.t('ideas.filter.to')} </label>
              <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                onBlur={this.onBlur}
                onChange={this.handleEndChange}
                value={new Date(endDate)}
                closeOnSelect={true}
                onFocus={() => this.onFocus(2)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(DateRange);
