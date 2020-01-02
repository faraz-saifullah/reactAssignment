import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Tab, Tabs, Row, Col } from 'react-bootstrap';
import { Filters } from '../../components/filters';
import IdeaModal from '../../components/IdeaModal/IdeaModal';
import IdeaCards from '../../components/IdeaCards/IdeaCards';
import IdeaViewModal from '../../components/IdeaViewModal/IdeaViewModal';
import { fetchIdeas, fetchTags, selectIdeaForView } from '../../actions/ideas';
import EditIdeaModal from '../../components/EditIdeaModal/EditIdeaModal';
import '../../components/IdeaCards/IdeaCards.scss';

class MyIdeasScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIdea: {},
      isSelected: -1,
      isEdit: false,
      filter: 'recent',
      cleanFilterFlag: false,
      myIdea: true,
    };

    this.showIdea = this.showIdea.bind(this);
    this.hideIdeaView = this.hideIdeaView.bind(this);
    this.showEdit = this.showEdit.bind(this);
    this.hideEdit = this.hideEdit.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.changeFilterParam = this.changeFilterParam.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchIdeas(0, true));
    dispatch(fetchTags());
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.ideasArr !== this.props.ideasArr) {
      this.clearFilters();
    }
  }

  changeFilter(filter) {
    this.setState({ filter });
    this.clearFilters();
  }

  showIdea(index) {
    localStorage.setItem('idex_scroll_y', window.scrollY);
    const idea = this.props.ideasArr[index];
    const { dispatch } = this.props;
    dispatch(selectIdeaForView(idea));
    this.setState({
      selectedIdea: idea,
      isSelected: index,
    });
  }

  hideIdeaView() {
    const scroll_y = localStorage.getItem('idex_scroll_y');
    this.setState({
      selectedIdea: {},
      isSelected: -1,
    });
    const scroll = Scroll.animateScroll;
    scroll.scrollTo(1 * scroll_y, { smooth: false, duration: 0, delay: 0 });
  }

  showEdit() {
    const scroll_y = localStorage.getItem('idex_scroll_y');
    this.setState({
      isEdit: true,
      isSelected: -1,
    });
    const scroll = Scroll.animateScroll;
    scroll.scrollTo(1 * scroll_y, { smooth: false, duration: 0, delay: 0 });
  }

  hideEdit() {
    const scroll_y = localStorage.getItem('idex_scroll_y');
    this.setState({
      isEdit: false,
    });
    const scroll = Scroll.animateScroll;
    scroll.scrollTo(1 * scroll_y, { smooth: false, duration: 0, delay: 0 });
  }

  clearFilters() {
    this.setState({ cleanFilterFlag: true });
    this.setState({ cleanFilterFlag: false });
  }

  changeFilterParam(e) {
    this.setState({ filter: e.target.value });
    this.changeFilter(e.target.value);
  }

  render() {
    const { ideasArr } = this.props;
    const { isSelected, filter, myIdea } = this.state;
    return (
      <Row className="mb-4">
        {isSelected > -1 ? (
          <Col md={12} className="swap inner-main-component">
            <IdeaViewModal
              idea={this.state.selectedIdea}
              onHideIdea={this.hideIdeaView}
              showEdit={this.showEdit}
              myIdea={true}
            />
          </Col>
        ) : (
          <div>
            <Row className="page-header pl-1 ">
              <Col md={7} sm={12} className="ml-5 mb-2">
                <div className="cards-wrapper">
                  <h1 className="title">
                    {myIdea
                      ? I18n.t('ideas.myIdeas')
                      : I18n.t('ideas.allIdeas')}
                  </h1>
                  <div className="cards-navigation">
                    <Tabs
                      defaultActiveKey="recent"
                      activeKey={filter === 'recent' ? 'recent' : 'liked'}
                      id="uncontrolled-tab-example"
                      onSelect={key =>
                        this.changeFilter(
                          key === 'liked' ? 'VotesAllTime' : 'recent'
                        )
                      }
                    >
                      <Tab
                        eventKey="recent"
                        title={I18n.t('ideas.filter.recent')}
                      />
                      <Tab
                        eventKey="liked"
                        title={I18n.t('ideas.filter.liked')}
                      >
                        <select
                          className="custom-select"
                          id="inputGroupSelect03"
                          value={filter}
                          onChange={this.changeFilterParam}
                        >
                          <option value="VotesPastHour">
                            {I18n.t('ideas.filter.type.pastHour')}
                          </option>
                          <option value="VotesPastDay">
                            {I18n.t('ideas.filter.type.pastDay')}
                          </option>
                          <option value="VotesPastWeek">
                            {I18n.t('ideas.filter.type.pastWeek')}
                          </option>
                          <option value="VotesPastMonth">
                            {I18n.t('ideas.filter.type.pastMonth')}
                          </option>
                          <option value="VotesPastYear">
                            {I18n.t('ideas.filter.type.pastYear')}
                          </option>
                          <option value="VotesAllTime">
                            {I18n.t('ideas.filter.type.allTime')}
                          </option>
                        </select>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </Col>
              <Col md={{ span: 3, offset: 1 }} className="mt-1">
                <IdeaModal
                  clearFilter={this.clearFilters}
                  myIdea={false}
                  filter={filter}
                />
              </Col>
            </Row>
            <Col md={12} className="swap inner-main-component">
              <Row>
                <Col md={9}>
                  <IdeaCards
                    showEdit={this.showEdit}
                    myIdea={true}
                    ideasArr={ideasArr}
                    showIdea={this.showIdea}
                    filter={filter}
                  />
                </Col>
                <Col md={3}>
                  <Row>
                    <Col md={12}>
                      <Filters
                        cleanFilterFlag={this.state.cleanFilterFlag}
                        myIdeasOnly={true}
                        filter={filter}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </div>
        )}
        {this.state.isEdit ? (
          <EditIdeaModal show={true} handleClose={this.hideEdit} />
        ) : null}
      </Row>
    );
  }
}

MyIdeasScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ideasArr: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    ideasArr: state.ideas.ideasArr,
    sizeOfPage: state.ideas.sizeOfPage,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyIdeasScreen);
