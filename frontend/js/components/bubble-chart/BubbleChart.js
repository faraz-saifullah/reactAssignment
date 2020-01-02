import React, { PureComponent } from 'react';
import {
  Legend,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { connect } from 'react-redux';
import { numberWithCommas } from '../../utils';
import { I18n, setLocale } from 'react-redux-i18n';

const colors = [
  '#2d8dfc',
  '#6185ae',
  '#11355f',
  '#f7f7f8',
  '#1C589E',
  '#E0E1E3',
  '#96C6FE',
  '#75818F',
  '#E5F1FF',
  '#495159',
];

class BubbleChart extends PureComponent {
  state = {
    tempData: [],
  };

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  // static jsfiddleUrl = 'https://jsfiddle.net/alidingling/uLysj0u2/';

  renderToolTip = ({ active, payload, label }) => {
    if (payload.length > 0) payload = payload[0].payload;
    if (active) {
      return (
        <div className="graph-tooltip">
          <h4>{payload.title}</h4>
          <div className="tooltip-tags">
            <div className="tooltip-category">
              {I18n.t('ideas.tagName')}: {payload.category}
            </div>
            <div className="tooltip-like">
              {payload.votes} {I18n.t('ideas.filter.xxlike')}
            </div>
          </div>
          <div className="tooltip-expect">
            <div className="tooltip-time">
              <div className="tooltip-time-label">
                {I18n.t('ideas.modal.timeMarket')}
              </div>
              <div className="tooltip-time-value">
                {payload.expectedTtm} {I18n.t('ideas.filter.xMonths')}
              </div>
            </div>
            <div className="tooltip-time float-right">
              <div className="tooltip-time-label">
                {I18n.t('ideas.modal.estProfit')}
              </div>
              <div className="tooltip-time-value">
                {this.props.dollar}
                {numberWithCommas(payload.expectedProfitInCents)}/
                {I18n.t('ideas.filter.year')}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    var xMax = 0,
      yMax = 0;
    this.props.metaData.map(item => {
      if (item.expectedTtm > xMax) {
        xMax = item.expectedTtm;
      }
      if (item.expectedProfitInCents > yMax) {
        yMax = item.expectedProfitInCents;
      }
    });
    return (
      <ResponsiveContainer width="100%" minHeight="500px">
        <ScatterChart
          margin={{
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            type="number"
            domain={[0, xMax]}
            dataKey="expectedTtm"
            name="Months"
            unit=""
            padding={{ top: 20 }}
            axisLine={false}
            label={{
              value: I18n.t('ideas.modal.timeToMarket'),
              offset: 20,
              position: 'bottom',
            }}
          />
          <YAxis
            type="number"
            domain={[0, yMax]}
            dataKey="expectedProfitInCents"
            name="Profit per Year"
            unit="k"
            orientation="left"
            tickFormatter={tick => numberWithCommas(tick / 1000)}
            padding={{ left: 50 }}
            axisLine={false}
          >
            <Label
              value={
                I18n.t('ideas.filter.new.annualProfitBefore') +
                this.props.dollar +
                I18n.t('ideas.filter.new.annualProfitAfter')
              }
              position="insideLeft"
              angle={-90}
              offset={-40}
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <ZAxis
            type="number"
            dataKey="votes"
            range={[1000, 4000]}
            name=""
            unit="   "
          />
          <Tooltip
            cursor={false}
            content={this.renderToolTip}
            coordinate={{ x: 0, y: -130 }}
            viewBox={{ x: 0, y: 0, width: 400, height: 400 }}
          />
          <Scatter name="" data={this.props.metaData} shape="circle">
            {this.props.metaData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#2d8dfc"
                stroke="rgba(51,51,51,0.2)"
                strokeWidth={2}
                onClick={() => this.props.showIdea(entry)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    dollar: state.users.setting.currency == 'USD' ? '$' : '¥',
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(BubbleChart);
