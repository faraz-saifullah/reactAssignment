import React from 'react';
import { connect } from 'react-redux';
import { toggleVote, editIdeaFor } from '../../actions/ideas';
import thumbsImage from '../../../assets/images/resting.svg';
import thumbsDownImage from '../../../assets/images/pressed.svg';
import { I18n, setLocale } from 'react-redux-i18n';
import { numberWithCommas } from '../../utils';
import './IdeaCards.scss';

class CardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTags: false,
    };

    this.handleLike = this.handleLike.bind(this);
    this.editIdea = this.editIdea.bind(this);
    this.showTags = this.showTags.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    if (window.innerWidth > 1400) {
      const categories = document.getElementsByClassName('ideacategory');
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].innerHTML.length > 11) {
          categories[i].style.maxWidth = '150px';
        }
      }
    } else {
      const categories = document.getElementsByClassName('ideacategory');
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].innerHTML.length > 11) {
          categories[i].style.maxWidth = '90px';
        }
      }
    }
  }

  handleLike(ideaId) {
    const { dispatch, myIdea, filter, number } = this.props;
    dispatch(toggleVote(ideaId, true, myIdea, filter, number));
  }

  editIdea() {
    const { dispatch, idea } = this.props;
    dispatch(editIdeaFor(idea));
    this.props.showEdit();
  }

  showTags() {
    this.setState({ isTags: !this.state.isTags });
  }

  render() {
    const { idea, myIdea, hideProfit, authority } = this.props;
    let admin_flag = false;
    if (authority.authorities && authority.authorities[0] == 'ROLE_ADMIN') {
      admin_flag = true;
    }

    return (
      <div className="card-wrapper">
        <div className="col-md-12 customcard">
          <div className="bigrow row pt-2">
            <div className="col-md-12 internal">
              <button className="btn btn-md ideacategory">
                {idea ? idea.category : 0}
              </button>
              {idea.tags.length > 1 && myIdea == false ? (
                <div
                  className="btn btn-md extracategories"
                  onMouseOver={this.showTags}
                  onMouseOut={this.showTags}
                >
                  {idea ? idea.tags.length - 1 : ''}+ {I18n.t('ideas.tags')}
                  {this.state.isTags ? (
                    <div className="more-tags">
                      {idea.tags.map((tag, key) => {
                        if (key === 0) {
                          return;
                        }
                        return <div className="temp" key={key}>{tag}</div>;
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {idea.liked && !myIdea ? (
                <div
                  className="like-button"
                  onClick={() => this.handleLike(idea ? idea.id : '')}
                >
                  <img src={thumbsDownImage} alt="Already voted" />
                </div>
              ) : !myIdea ? (
                <div
                  className="like-button"
                  onClick={() => this.handleLike(idea ? idea.id : '')}
                >
                  <img src={thumbsImage} alt="Thumbs Up" />
                </div>
              ) : (
                    <a
                      href="#"
                      className="edit-card-button"
                      onClick={() => this.editIdea()}
                    >
                      {I18n.t('ideas.my.edit')}
                    </a>
                  )}
            </div>
            <h1 onClick={() => this.props.showIdea(this.props.key)}>
              <a href="#">{idea ? idea.title : ''}</a>
            </h1>
            <div
              className="col-md-6 timecost time"
              onClick={() => this.props.showIdea(this.props.key)}
            >
              <p className="low">{I18n.t('ideas.modal.timeMarket')}</p>
              <p className="high">
                {idea ? numberWithCommas(idea.expectedTtm) : 0}{' '}
                {I18n.t('ideas.filter.xMonths')}
              </p>
            </div>
            {hideProfit ? (
              <div
                className="col-md-6 timecost cost"
                onClick={() => this.props.showIdea(this.props.key)}
              >
                <div className="low">
                  {admin_flag
                    ? I18n.t('ideas.modal.estProfit')
                    : I18n.t('ideas.modal.estCost')}
                </div>
                <div className="high">
                  {this.props.dollar}{' '}
                  {idea
                    ? numberWithCommas(
                      admin_flag
                        ? idea.expectedProfitInCents +
                        ' / ' +
                        I18n.t('ideas.filter.year')
                        : idea.expectedCostInCents
                    )
                    : 0}
                </div>
              </div>
            ) : (
                <div
                  className="col-md-6 timecost cost"
                  onClick={() => this.props.showIdea(this.props.key)}
                >
                  <div className="low">{I18n.t('ideas.modal.estProfit')}</div>
                  <div className="high">
                    {this.props.dollar}{' '}
                    {idea
                      ? numberWithCommas(idea.expectedProfitInCents) +
                      ' / ' +
                      I18n.t('ideas.filter.year')
                      : 0}
                  </div>
                </div>
              )}
            <hr />
            <div
              className="col-md-12 social"
              onClick={() => this.props.showIdea(this.props.key)}
            >
              <p className="comment">
                <i className="far fa-thumbs-up mr-1" />{' '}
                {idea ? numberWithCommas(idea.votes) : 0}{' '}
                {I18n.t('ideas.filter.xxlike')}
              </p>
              <p className="comment comment-amount">
                {idea ? numberWithCommas(idea.comments.length) : 0}{' '}
                {I18n.t('ideas.filter.xxcomments')}
              </p>
              <p className="moreoptions">
                <span>...</span>
                {I18n.t('ideas.filter.more')}
              </p>
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
    hideProfit: state.users.setting.features.hideProfitsForUsers,
    dollar: state.users.setting.currency == 'USD' ? '$' : '¥',
    authority: state.profile.userAccountInfo,
    number: state.ideas.number,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardView);
