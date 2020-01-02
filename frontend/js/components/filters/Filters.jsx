import React from 'react';
import { connect } from 'react-redux';
import RangeBox from '../RangeBox/RangeBox';
import { FiltersTag } from '../FiltersTag';
import moment from 'moment';
import { I18n, setLocale } from 'react-redux-i18n';
import './Filters.scss';
import { fetchIdeas, clearAllFilters } from '../../actions/ideas';
import DateRange from '../DateRange/DateRange';
import { Form, InputGroup, Button, Col, Row, Modal } from 'react-bootstrap';

class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchType: true,
      myIdeasOnly: props.myIdeasOnly,
      votesMin: 0,
      votesMax: 1000,
      profitMin: 0,
      profitMax: 100000000,
      submittedAtMsMin: moment('2019-01-01').valueOf(),
      submittedAtMsMax: moment().valueOf(),
      implementationTimeMsMin: 0,
      implementationTimeMsMax: 300,
      costMin: 0,
      costMax: 10000000,
      tags: [],
      tagInput: '',
      filter: props.filter,
    };

    this.toggleSearchType = this.toggleSearchType.bind(this);
    this.openSearchTip = this.openSearchTip.bind(this);
    this.handleLikeChange = this.handleLikeChange.bind(this);
    this.handleProfitChange = this.handleProfitChange.bind(this);
    this.handleSubmittedChange = this.handleSubmittedChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleCostChange = this.handleCostChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);

    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.defaultFilter = this.defaultFilter.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(props) {
    if (props.filter != this.state.filter) {
      const { dispatch } = this.props;
      const { myIdeasOnly, filter } = this.props;
      const {
        submittedAtMsMax,
        submittedAtMsMin,
        votesMin,
        votesMax,
        profitMin,
        profitMax,
        implementationTimeMsMax,
        implementationTimeMsMin,
        tags,
        searchType,
        costMin,
        costMax,
      } = this.state;
      dispatch(
        fetchIdeas(
          0,
          myIdeasOnly,
          props.filter,
          submittedAtMsMin,
          submittedAtMsMax,
          votesMin,
          votesMax,
          profitMin,
          profitMax,
          implementationTimeMsMin,
          implementationTimeMsMax,
          tags,
          searchType,
          costMin,
          costMax
        )
      );
    }
    this.setState({ filter: props.filter, myIdeasOnly: props.myIdeasOnly });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeSearchTip();
    }
  }

  toggleSearchType(e) {
    const currentType = e.target.id === 'search-full' ? true : false;
    this.setState({ searchType: currentType });
    this.onChangeFilter({ searchType: currentType });
  }

  handleLikeChange(value) {
    this.setState({ votesMin: value[0], votesMax: value[1] });
    this.onChangeFilter({ votesMin: value[0], votesMax: value[1] });
  }

  handleProfitChange(value) {
    this.setState({ profitMin: value[0], profitMax: value[1] });
    this.onChangeFilter({ profitMin: value[0], profitMax: value[1] });
  }

  handleSubmittedChange(value) {
    this.setState({ submittedAtMsMin: value[0], submittedAtMsMax: value[1] });
    this.onChangeFilter({
      submittedAtMsMin: value[0],
      submittedAtMsMax: value[1],
    });
  }

  handleTimeChange(value) {
    this.setState({
      implementationTimeMsMin: value[0],
      implementationTimeMsMax: value[1],
    });
    this.onChangeFilter({
      implementationTimeMsMin: value[0],
      implementationTimeMsMax: value[1],
    });
  }

  handleCostChange(value) {
    this.setState({ costMin: value[0], costMax: value[1] });
    this.onChangeFilter({ costMin: value[0], costMax: value[1] });
  }

  handleTagsChange(value) {
    this.setState({ tags: value });
    this.onChangeFilter({ tags: value });
  }

  onChangeFilter(params) {
    const { dispatch } = this.props;
    const { myIdeasOnly, filter } = this.state;
    const votesMin =
      params.votesMin !== undefined ? params.votesMin : this.state.votesMin;
    const votesMax =
      params.votesMax !== undefined ? params.votesMax : this.state.votesMax;
    const profitMin =
      params.profitMin !== undefined ? params.profitMin : this.state.profitMin;
    const profitMax =
      params.profitMax !== undefined ? params.profitMax : this.state.profitMax;
    const submittedAtMsMin =
      params.submittedAtMsMin !== undefined
        ? params.submittedAtMsMin
        : this.state.submittedAtMsMin;
    const submittedAtMsMax =
      params.submittedAtMsMax != undefined
        ? params.submittedAtMsMax
        : this.state.submittedAtMsMax;
    const implementationTimeMsMin =
      params.implementationTimeMsMin !== undefined
        ? params.implementationTimeMsMin
        : this.state.implementationTimeMsMin;
    const implementationTimeMsMax =
      params.implementationTimeMsMax !== undefined
        ? params.implementationTimeMsMax
        : this.state.implementationTimeMsMax;
    const costMax =
      params.costMax !== undefined ? params.costMax : this.state.costMax;
    const costMin =
      params.costMin !== undefined ? params.costMin : this.state.costMin;
    const searchType =
      params.searchType !== undefined
        ? params.searchType
        : this.state.searchType;
    const tags = params.tags !== undefined ? params.tags : this.state.tags;
    dispatch(
      fetchIdeas(
        0,
        myIdeasOnly,
        filter,
        submittedAtMsMin,
        submittedAtMsMax,
        votesMin,
        votesMax,
        profitMin,
        profitMax,
        implementationTimeMsMin,
        implementationTimeMsMax,
        tags,
        searchType,
        costMin,
        costMax
      )
    );
  }

  openSearchTip() {
    const infoSelector = document.getElementsByClassName('searchtype-info');

    infoSelector[0].classList.add('active');
  }

  closeSearchTip() {
    const infoSelector = document.getElementsByClassName('searchtype-info');

    infoSelector[0].classList.remove('active');
  }

  existInArray = item => {
    const { tags } = this.state;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] === item) {
        return true;
      }
    }
    return false;
  };

  addTag(item) {
    if (this.existInArray(item)) {
      return;
    }
    const { tags } = this.state;
    tags.push(item);
    this.setState({ tags });
    this.onChangeFilter({ tags });
  }

  deleteTag(item) {
    if (this.existInArray(item)) {
      const { tags } = this.state;
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] === item) {
          delete tags[i];
          this.onChangeFilter(tags);
          this.setState({ tags });
        }
      }
    }
  }

  onChangeCustom = e => {
    if (e.target.value === '' || e.target.value.trim().length > 0) {
      this.setState({ tagInput: e.currentTarget.value });
    }
  };

  addCustomFilter = e => {
    e.preventDefault();
    let { tagInput, tags } = this.state;
    if (this.existInArray(tagInput)) {
      return;
    }
    tags.push(tagInput);

    this.setState({
      tagInput: '',
      tags,
    });
    this.onChangeFilter({ tags });
  };

  defaultFilter = () => {
    let defaultState = {
      searchType: true,
      myIdeasOnly: this.props.myIdeasOnly,
      votesMin: 0,
      votesMax: 1000,
      profitMin: 0,
      profitMax: 100000000,
      submittedAtMsMin: moment('2019-01-01').valueOf(),
      submittedAtMsMax: moment().valueOf(),
      implementationTimeMsMin: 0,
      implementationTimeMsMax: 300,
      costMin: 0,
      costMax: 10000000,
      tags: [],
      tagInput: '',
    };

    this.setState(defaultState);
    this.onChangeFilter(defaultState);
    const { dispatch } = this.props;
    dispatch(clearAllFilters(true));
  };

  render() {
    const {
      tags,
      tagInput,
      myIdeasOnly,
      searchType,
      votesMin,
      votesMax,
      profitMin,
      profitMax,
      submittedAtMsMax,
      submittedAtMsMin,
      implementationTimeMsMax,
      implementationTimeMsMin,
      costMin,
      costMax,
      filter,
    } = this.state;
    const { popularTags, hideProfitsForUsers, userAccountInfo } = this.props;
    const tagBuf = [];
    popularTags.map(tag => {
      tagBuf.push(tag.name);
    });
    return (
      <div className="filters-wrapper">
        <div className="filters-header">
          <div className="filters-title float-left">
            <i className="fas fa-sliders-h" /> {I18n.t('ideas.filter.title')}
          </div>
          <div className="filters-clear float-right">
            <a href="#" onClick={this.defaultFilter}>
              {I18n.t('ideas.filter.new.clear')}
            </a>
          </div>
          <div className="clearfix" />
        </div>
        <div className="filters-list">
          <form onSubmit={this.addCustomFilter}>
            <div className="search-wrapper d-flex align-items-center">
              <a href="#">
                <i className="fas fa-search" />
              </a>
              <input
                type="search"
                placeholder={I18n.t('ideas.filter.new.example')}
                value={tagInput}
                onChange={this.onChangeCustom}
              />
            </div>
          </form>
          <div className="searchtype-wrapper d-flex justify-content-center">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <button
                className={
                  searchType
                    ? 'btn btn-default btn-searchtype active'
                    : 'btn btn-default btn-searchtype'
                }
                id="search-full"
                onClick={e => this.toggleSearchType(e)}
              >
                {I18n.t('ideas.filter.new.full')}
              </button>
              <button
                className={
                  searchType
                    ? 'btn btn-default btn-searchtype'
                    : 'btn btn-default btn-searchtype active'
                }
                id="search-partial"
                onClick={e => this.toggleSearchType(e)}
              >
                {I18n.t('ideas.filter.new.partial')}
              </button>
            </div>
          </div>
          <div className="searchtype-tip">
            <h5>
              {I18n.t('ideas.filter.new.fullPartial')}{' '}
              <span onClick={this.openSearchTip}>?</span>
            </h5>
          </div>
          <div className="searchtype-info" ref={this.setWrapperRef}>
            <span onClick={this.closeSearchTip}>x</span>
            <h5>{I18n.t('ideas.filter.new.tagDescription')}</h5>
          </div>
          <FiltersTag
            buttons={tags}
            deleteTag={this.deleteTag}
            addTag={this.addTag}
            type="tag"
            page="filter"
          />
          <FiltersTag
            title={I18n.t('ideas.filter.new.mostTags')}
            buttons={tagBuf}
            tags={tags}
            addTag={this.addTag}
            deleteTag={this.deleteTag}
            type="popular"
            page="filter"
          />
          <hr className="divider" />
          {!myIdeasOnly ? (
            <div>
              <RangeBox
                title={I18n.t('ideas.filter.new.noLikes')}
                type="vote"
                from={0}
                to={1000}
                low={votesMin}
                high={votesMax}
                handleChange={this.handleLikeChange}
              />
              {hideProfitsForUsers &&
                userAccountInfo.authorities &&
                userAccountInfo.authorities[0] === 'ROLE_USER' ? null : (
                  <RangeBox
                    title={
                      I18n.t('ideas.filter.new.annualProfitBefore') +
                      this.props.dollar +
                      I18n.t('ideas.filter.new.annualProfitAfter')
                    }
                    type="profit"
                    from={0}
                    to={100000000}
                    low={profitMin}
                    high={profitMax}
                    handleChange={this.handleProfitChange}
                  />
                )}
              <RangeBox
                title={I18n.t('ideas.modal.timeToMarket')}
                type="time"
                from={0}
                to={300}
                low={implementationTimeMsMin}
                high={implementationTimeMsMax}
                handleChange={this.handleTimeChange}
              />
              <RangeBox
                title={
                  I18n.t('ideas.filter.new.costImpl') + this.props.dollar + ')'
                }
                type="cost"
                from={0}
                to={10000000}
                low={costMin}
                high={costMax}
                handleChange={this.handleCostChange}
              />
              {filter === 'recent' ? (
                <DateRange
                  min={submittedAtMsMin}
                  max={submittedAtMsMax}
                  type={'filter'}
                  handleChange={this.handleSubmittedChange}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAccountInfo: state.profile.userAccountInfo,
    popularTags: state.ideas.popularTags,
    dollar: state.users.setting.currency == 'USD' ? '$' : '¥',
    lang: state.i18n.locale,
    hideProfitsForUsers: state.users.setting.features.hideProfitsForUsers,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const connectedFilters = connect(mapStateToProps, mapDispatchToProps)(Filters);
export { connectedFilters as Filters };
