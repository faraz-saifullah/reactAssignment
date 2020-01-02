/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import CardView from './CardView';
import { fetchIdeas } from '../../actions/ideas';
import './IdeaCards.scss';

class IdeaCards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCards: [],
      myIdea: props.myIdea,
      pageNum: 1,
      number: 0,
    };

    this.prevPage = this.prevPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.number !== this.state.number) {
      this.setState({ number: props.number });
      const scroll = Scroll.animateScroll;
      scroll.scrollTo(0, { smooth: false, duration: 0, delay: 0 });
    }
  }

  isRecentIdea(sumbitDate) {
    const today = new Date();
    const submittedDate = new Date(sumbitDate);

    return (
      submittedDate.getDate() === today.getDate() &&
      submittedDate.getMonth() === today.getMonth() &&
      submittedDate.getFullYear() === today.getFullYear()
    );
  }

  prevPage() {
    const { number, dispatch, filter } = this.props;
    const { myIdea } = this.state;
    if (number > -1 && number !== 0) {
      dispatch(fetchIdeas(number - 1, myIdea, filter));
    }
  }

  firstPage() {
    const { dispatch, filter } = this.props;
    const { myIdea } = this.state;
    dispatch(fetchIdeas(0, myIdea, filter));
  }

  nextPage() {
    const { number, totalPages, filter, dispatch } = this.props;
    const { myIdea } = this.state;
    if (number < totalPages - 1) {
      dispatch(fetchIdeas(number + 1, myIdea, filter));
    }
  }

  lastPage() {
    const { myIdea } = this.state;
    const { dispatch, number, totalPages, filter } = this.props;
    if (number < totalPages - 1) {
      dispatch(fetchIdeas(totalPages - 1, myIdea, filter));
    }
  }

  render() {
    const {
      ideasArr,
      totalPages,
      number,
      filter,
      showEdit,
      showIdea,
      isFetchingIdeas,
    } = this.props;

    const { myIdea } = this.state;
    return (
      <div className="cards-wrapper">
        <div className="cards-navigation">
          <Row className="section-ideacards">
            {ideasArr.map((idea, i) => (
              <Col sm={12} md={4} key={i} className="mt-4 idea-card-wrapper">
                <CardView
                  idea={idea}
                  id={i}
                  showEdit={showEdit}
                  myIdea={myIdea}
                  index={i}
                  key={i}
                  filter={filter}
                  showIdea={() => showIdea(i)}
                />
              </Col>
            ))}
          </Row>
          {isFetchingIdeas || ideasArr.length === 0 ? null : (
            <Row className="page-column-section">
              <div className="page-column">
                <span
                  role="button"
                  tabIndex="0"
                  className={number === 0 ? 'deactive' : 'active'}
                  onClick={this.firstPage}
                >
                  &lt;&lt;
                </span>
                <span
                  role="button"
                  tabIndex="0"
                  className={number === 0 ? 'deactive' : 'active'}
                  onClick={this.prevPage}
                >
                  &lt;
                </span>
                <span className="page-numbers">
                  {number + 1} of {totalPages}
                </span>
                <span
                  role="button"
                  tabIndex="0"
                  className={number === totalPages - 1 ? 'deactive' : 'active'}
                  onClick={this.nextPage}
                >
                  >
                </span>
                <span
                  role="button"
                  tabIndex="0"
                  className={number === totalPages - 1 ? 'deactive' : 'active'}
                  onClick={this.lastPage}
                >
                  >>
                </span>
              </div>
            </Row>
          )}
        </div>
      </div>
    );
  }
}

IdeaCards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filter: PropTypes.string,
  ideasArr: PropTypes.array.isRequired,
  isFetchingIdeas: PropTypes.any,
  lang: PropTypes.string.isRequired,
  myIdea: PropTypes.bool,
  number: PropTypes.number,
  showEdit: PropTypes.bool,
  showIdea: PropTypes.bool,
  totalPages: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    isFetchingIdeas: state.ideas.isFetchingIdeas,
    number: state.ideas.number,
    totalPages: state.ideas.totalPages,
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeaCards);
