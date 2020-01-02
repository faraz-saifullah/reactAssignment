import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import RangePicker from '../range-picker/RangePicker';
import { I18n, setLocale } from 'react-redux-i18n';
import { toggleVote, clearAllFilters, selectIdeaForView, editIdeaFor, fetchIdeas, fetchSummary } from '../../actions/ideas';
import { FiltersTag } from '../FiltersTag';
import Files from 'react-files';
import Collapse from "@kunukn/react-collapse";
import { numberWithCommas } from '../../utils';
import { addComment, replyComment } from '../../actions/comments';
import { areAllAttachmentsUploaded, changeFilesOnNewComment, removeFilesOnNewComment } from '../../actions/files';
import BubbleChart from '../bubble-chart/BubbleChart';
import DateRange from '../DateRange/DateRange';
import FileViewer from 'react-file-viewer-extended';
import { getApiBaseUrl, ID_TOKEN_KEY } from '../../const';
import Scroll from 'react-scroll';
import history from './../../history';
import './Statistics.scss';

const API_BASE_URI = getApiBaseUrl();

class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      searchType: true,
      votesMin: 0,
      votesMax: 1000,
      profitMin: 0,
      profitMax: 100000000,
      submittedAtMsMin: moment('2019-01-01').valueOf(),
      submittedAtMsMax: moment().add(1, 'day').valueOf(),
      implementationTimeMsMin: 0,
      implementationTimeMsMax: 300,
      costMin: 0,
      costMax: 10000000,
      tags: [],
      tagInput: '',
      isIdea: false,
      selectedIdea: null,
      commentContent: '',
      blankCommentError: false,
      bufComment: [],
      isPreviewFile: false,
      selectedFile: null,
      replyContent: '',
      isReply: -1,
      currentY: 0,
      anonyReply: false,
      anonyComment: false,
      openDescription: false,
    };

    this.toggleSearchType = this.toggleSearchType.bind(this);
    this.openSearchTip = this.openSearchTip.bind(this);
    this.handleLikeChange = this.handleLikeChange.bind(this);
    this.handleProfitChange = this.handleProfitChange.bind(this);
    this.handleSubmissionChange = this.handleSubmissionChange.bind(this);
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
    const { dispatch } = this.props;
    const { user } = this.props;
    document.addEventListener('mousedown', this.handleClickOutside);
    if (user && user.authorities && user.authorities[0] === 'ROLE_USER') {
      history.push('/all-ideas');
    } else {
      dispatch(fetchSummary());
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(props) {
    this.setState({ filter: props.filter, myIdeasOnly: props.myIdeasOnly });
  }

  toggleSearchType(e) {
    const currentType = e.target.id === 'search-full';
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

  handleSubmissionChange(value) {
    this.setState({ submittedAtMsMin: value[0], submittedAtMsMax: value[1] });
    this.onChangeFilter({ submittedAtMsMin: value[0], submittedAtMsMax: value[1] });
  }

  handleTimeChange(value) {
    this.setState({ implementationTimeMsMin: value[0], implementationTimeMsMax: value[1] });
    this.onChangeFilter({ implementationTimeMsMin: value[0], implementationTimeMsMax: value[1] });
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

    let votesMin = (params.votesMin != undefined) ? params.votesMin : this.state.votesMin;
    let votesMax = (params.votesMax != undefined) ? params.votesMax : this.state.votesMax;
    let profitMin = (params.profitMin != undefined) ? params.profitMin : this.state.profitMin;
    let profitMax = (params.profitMax != undefined) ? params.profitMax : this.state.profitMax;
    let submittedAtMsMin = (params.submittedAtMsMin != undefined) ? params.submittedAtMsMin : this.state.submittedAtMsMin;
    let submittedAtMsMax = (params.submittedAtMsMax != undefined) ? params.submittedAtMsMax : this.state.submittedAtMsMax;
    let implementationTimeMsMin = (params.implementationTimeMsMin != undefined) ? params.implementationTimeMsMin : this.state.implementationTimeMsMin;
    let implementationTimeMsMax = (params.implementationTimeMsMax != undefined) ? params.implementationTimeMsMax : this.state.implementationTimeMsMax;
    let costMax = (params.costMax != undefined) ? params.costMax : this.state.costMax;
    let costMin = (params.costMin != undefined) ? params.costMin : this.state.costMin;
    let searchType = (params.searchType != undefined) ? params.searchType : this.state.searchType;
    let tags = (params.tags != undefined) ? params.tags : this.state.tags;
    dispatch(fetchSummary(submittedAtMsMin, submittedAtMsMax, votesMin, votesMax, profitMin, profitMax, implementationTimeMsMin, implementationTimeMsMax, tags, searchType, costMin, costMax));
  }

  openSearchTip() {
    const infoSelector = document.getElementsByClassName('searchtype-info');

    infoSelector[0].classList.add('active');
  }

  closeSearchTip() {
    const infoSelector = document.getElementsByClassName('searchtype-info');

    infoSelector[0].classList.remove('active');
  }


  setWrapperRef(node) {
    this.wrapperRef = node;
  }


  validateComment = () => {
    const { commentContent } = this.state;
    if (commentContent.trim().length == 0) {
      this.setState({ blankCommentError: true });
      return false;
    }
    return true;
  }

  showReply = (comment_id) => {
    this.setState({
      isReply: comment_id,
    });
  }

  handleReplyContent = (e) => {
    let replyBtnActivate = false;
    if (e.target.value.trim().length > 0) {
      replyBtnActivate = true;
    }
    this.setState({
      replyContent: e.target.value,
      replyBtnActivate,
    });
  }

  handleAddComment = () => {
    const {
      dispatch, commentsToAdd, profile, summary
    } = this.props;
    const { commentContent, selectedIdea, anonyComment } = this.state;
    let files = [];
    const comment = {
      ideaId: selectedIdea.id,
      text: commentContent,
      authorComment: !selectedIdea.anonymous,
      submittedBy: {
        authorities: profile.authorities,
        email: profile.email,
        enabled: profile.enabled,
        fullName: profile.fullName,
        id: profile.id,
        profilePictureURL: profile.profilePictureURL,
      },
      submittedAt: new Date().getTime(),
      anonymous: anonyComment,
    };
    const index = commentsToAdd.findIndex(x => x.ideaId === selectedIdea.id);
    if (index != -1) {
      files = commentsToAdd[index].files;
    }
    comment.files = files;
    if (!areAllAttachmentsUploaded(comment)) {
      alert('wait until all attachments are uploaded');
    } else if (this.validateComment()) {
      dispatch(addComment(comment));

      var { bufComment } = this.state;
      bufComment.push(comment);
      this.setState({
        commentContent: '',
        bufComment,
        blankCommentError: false,
        anonyComment: false
      })
    }
  }

  handleLike(ideaId) {
    const { dispatch } = this.props;

    dispatch(toggleVote(ideaId));
    let { idea } = this.state;
    if (idea.liked) {
      idea.liked = false;
      idea.votes--;
    } else {
      idea.votes++;
      idea.liked = true;
    }
    this.setState({ idea });
  }

  handleAddReply = (comment, isBuf = false) => {
    const { dispatch, profile } = this.props;
    let { selectedIdea, bufComment, anonyReply } = this.state;
    const { replyContent } = this.state;
    if (replyContent.trim().length == 0) {
      this.setState({ blankReplyError: true });
      return;
    }

    let reply = {
      anonymous: anonyReply,
      commentId: comment.id,
      authorReply: !selectedIdea.anonymous,
      submittedBy: {
        authorities: profile.authorities,
        email: profile.email,
        enabled: profile.enabled,
        fullName: profile.fullName,
        id: profile.id,
        profilePictureURL: profile.profilePictureURL,
      },
      submittedAt: new Date().getTime(),
      text: replyContent,
    };

    dispatch(replyComment(reply));

    for (var i = 0; i < selectedIdea.comments.length; i++) {
      if (selectedIdea.comments[i].id == comment.id) {
        selectedIdea.comments[i].replies.push(reply);
        break;
      }
    }
    for (var i = 0; i < bufComment.length; i++) {
      if (bufComment[i].id === comment.id) {
        bufComment[i].replies.push(reply);
        break;
      }
    }

    this.setState({
      selectedIdea, bufComment, isReply: -1, replyContent: '', anonyReply: false, replyBtnActivate: false
    });
  }

  handleCommentContent = (e) => {
    this.setState({ commentContent: e.target.value });
  }

  onFilesChange = (files) => {
    const { dispatch } = this.props;
    const { remoteFiles, localFiles } = this.props;
    const { selectedIdea } = this.state;
    const newFiles = [];
    Array.prototype.push.apply(newFiles, localFiles);
    Array.prototype.push.apply(newFiles, remoteFiles);
    changeFilesOnNewComment(dispatch, selectedIdea.id, localFiles, files);
  }

  onFilesError = (error, file) => {
    console.log(`error code ${error.code}: ${error.message}`);
  }

  removeFile = (file) => {
    const { dispatch } = this.props;
    const { remoteFiles, localFiles } = this.props;
    const { selectedIdea } = this.state;

    const updatedFiles = [];
    for (var i = 0; i < localFiles.length; i++) {
      if (localFiles[i].id == file.id) {
        // delete localFiles[i];
      } else {
        updatedFiles.push(localFiles[i]);
      }
    }
    for (var i = 0; i < remoteFiles.length; i++) {
      if (remoteFiles[i].id != file.id) {
        updatedFiles.push(remoteFiles[i]);
      }
    }

    const newFiles = [];
    Array.prototype.push.apply(newFiles, localFiles);
    Array.prototype.push.apply(newFiles, remoteFiles);
    changeFilesOnNewComment(dispatch, selectedIdea.id, newFiles, updatedFiles);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeSearchTip();
    }
  }

  existInArray = (item) => {
    const { tags } = this.state;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] == item) {
        return true;
      }
    }
    return false;
  }

  addTag(item) {
    console.log(item);
    if (this.existInArray(item)) {

    } else {
      var { tags } = this.state;
      tags.push(item);
      this.setState({ tags });
      this.onChangeFilter({ tags });
    }
  }

  deleteTag(item) {
    if (this.existInArray(item)) {
      let { tags } = this.state;
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] == item) {
          delete tags[i];
          this.onChangeFilter(tags);
          this.setState({ tags });
        }
      }
    }
  }

  onChangeCustom = (e) => {
    if (e.target.value == '' || e.target.value.trim().length > 0) {
      this.setState({ tagInput: e.currentTarget.value });
    }
  }

  previewFile = (file) => {
    this.setState({
      isPreviewFile: true,
      selectedFile: file,
    });
  }

  hidePreviewFile = () => {
    this.setState({
      isPreviewFile: false,
    });
  }

  handleLike(ideaId) {
    const { dispatch } = this.props;

    dispatch(toggleVote(ideaId));
    let { selectedIdea } = this.state;
    if (selectedIdea.liked) {
      selectedIdea.liked = false;
      selectedIdea.votes--;
    } else {
      selectedIdea.votes++;
      selectedIdea.liked = true;
    }
    this.setState({ selectedIdea });
  }

  addCustomFilter = (e) => {
    e.preventDefault();
    var { tagInput, tags } = this.state;
    if (this.existInArray(tagInput)) {
      return;
    }
    tags.push(tagInput);

    this.setState({
      tagInput: '',
      tags
    })
    this.onChangeFilter({ tags: tags });
  }

  defaultFilter = () => {
    let defaultState = {
      searchType: true,
      votesMin: 0,
      votesMax: 1000,
      profitMin: 0,
      profitMax: 100000000,
      submittedAtMsMin: moment('2019-01-01').valueOf(),
      submittedAtMsMax: moment().add(1, 'day').valueOf(),
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
  }

  showEdit = (idea) => {
    const { dispatch } = this.props;
    dispatch(editIdeaFor(idea));
    this.props.showEdit();
  }

  handleIcon = (e) => {
    this.setState({ openDescription: !this.state.openDescription });
  }

  showIdea = (idea) => {
    localStorage.setItem('idex_scroll_y', window.scrollY);
    const { dispatch } = this.props;
    dispatch(selectIdeaForView(idea));
    this.setState({
      isIdea: true,
      selectedIdea: idea,
    });
  }

  hideIdea = () => {
    const scroll_y = localStorage.getItem('idex_scroll_y');
    this.setState({
      bufComment: [],
      isIdea: false,
      selectedIdea: false,
    });
    this.onChangeFilter({});
    const scroll = Scroll.animateScroll;
    scroll.scrollTo(1 * scroll_y, { smooth: false, duration: 0, delay: 0 });
  }

  checkFilter = (idea) => {
    const { votesMin, votesMax, profitMin, profitMax, submittedAtMsMin, submittedAtMsMax, implementationTimeMsMax, implementationTimeMsMin, costMin, costMax, tags, searchType } = this.state;
    if (idea.votes < votesMin || idea.votes > votesMax) { return false; }
    if (idea.expectedCostInCents < costMin || idea.expectedCostInCents > costMax) { return false; }
    if (idea.expectedProfitInCents < profitMin || idea.expectedProfitInCents > profitMax) { return false; }
    if (idea.expectedTtm < implementationTimeMsMin || idea.expectedTtm > implementationTimeMsMax) { return false; }
    if (idea.submittedAt < submittedAtMsMin || idea.submittedAt > submittedAtMsMax) { return false; }
    if (tags.length == 0) { return true; }
    if (searchType == true) {
      for (var i = 0; i < tags.length; i++) {
        if (tags[i] == idea.category) {
          return true;
        }
      }
      return false;
    }
    for (var i = 0; i < tags.length; i++) {
      for (var j = 0; j < idea.tags.length; j++) {
        if (tags[i] == idea.tags[j]) {
          return true;
        }
      }
    }
    return false;

  }

  setAnonyComment = () => {
    const { anonyComment } = this.state;
    this.setState({
      anonyComment: !anonyComment,
    });
  }

  setAnonyReply = () => {
    const { anonyReply } = this.state;
    this.setState({
      anonyReply: !anonyReply,
    });
  }

  downloadFile = (url, filename) => {
    fetch(url).then(resp => resp.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename || 'download';

        const clickHandler = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            this.removeEventListener('click', clickHandler);
          }, 150);
        };
        a.addEventListener('click', clickHandler, false);

        a.click();
      });
  }

  render() {
    const {
      popularTags, summary, remoteFiles, localFiles, selIdea
    } = this.props;

    const {
      votesMax, votesMin, profitMin, profitMax, submittedAtMsMax, submittedAtMsMin, implementationTimeMsMax, implementationTimeMsMin, costMin, costMax, tags, tagInput, isIdea, selectedIdea, isPreviewFile, selectedFile, bufComment
    } = this.state;
    let tagBuf = [];
    popularTags.map(tag => {
      tagBuf.push(tag.name);
    });

    let tagsBuf = [];
    tags.map(tag => {
      tagsBuf.push(tag);
    });
    const token = localStorage.getItem(ID_TOKEN_KEY) || null;
    return (
      <div className="row mb-4">
        {/* <div className="col-md-12 headingbox">
          <h1>{I18n.t('admin.title')}</h1>
        </div> */}
        {(isIdea) ? (
          <div className="idea-details-container">
            <div className="idea-back">
              <div onClick={() => this.hideIdea()}><i className="fas fa-chevron-left" /> &nbsp;{I18n.t('ideas.modal.back')}</div>
            </div>
            <div className="idea-details">
              <div className="row">
                <div className="col-md-1 pr-0">
                  {(selIdea.anonymous) ? (null) : (
                    <div className="dp-placeholder"><img src={selIdea.submittedBy.profilePictureURL} style={{ width: '100%', borderRadius: '50px' }} /></div>
                  )}
                </div>
                <div className="col-md-8">
                  <small><span className="author mr-2">{selIdea.anonymousMode ? I18n.t('ideas.modal.anonymous') : (selIdea.submittedBy.fullName)}</span> | <span className="date ml-2">{moment(selIdea.submittedAt).format('YYYY-MM-DD')}</span></small>
                  {
                    (selIdea.editable) ? (
                      <a href="#" className="btn edit-btn float-right" onClick={() => this.showEdit(selIdea)}><i className="fas fa-pencil-alt mr-1" /> {I18n.t('ideas.my.edit')}</a>
                    ) : (null)
                  }
                  <h4>{selIdea.title}</h4>
                  <div className="idea-features mt-4 mb-4">
                    <ul>
                      <li className="mr-4">
                        <span className="float-left mr-2">
                          <div className="icon-holder">
                            <i className="far fa-clock" />
                          </div>
                        </span>
                        <span className="float-right"> {I18n.t('ideas.modal.timeMarket')}
                          <br />
                          {selIdea.expectedTtm} {I18n.t('ideas.filter.xMonths')}
                        </span>
                        <span className="clearfix" />
                      </li>
                      <li>
                        <span className="float-left mr-2">
                          <div className="icon-holder">
                            <i className="far fa-money-bill-alt" />
                          </div>
                        </span>
                        <span className="float-right">{I18n.t('ideas.modal.estCost')}: {this.props.dollar}{numberWithCommas(selIdea.expectedCostInCents)}
                          <br />
                          {I18n.t('ideas.modal.estProfit')}: {this.props.dollar}{numberWithCommas(selIdea.expectedProfitInCents)} / {I18n.t('ideas.filter.year')}
                        </span>
                        <span className="clearfix" />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Collapse
                      isOpen={this.state.openDescription}
                      collapseHeight="58px"
                      className={
                        (this.state.openDescription ? 'app__collapse--active' : '')
                      }
                      onChange={state => this.setState({ spy3: state })}
                      render={collapseState => (
                        <p>
                          {selIdea.description}
                        </p>
                      )}
                    />
                    {(selIdea.description.length > 300 || (selIdea.description.match(/[^\n]*\n[^\n]*/gi) && selIdea.description.match(/[^\n]*\n[^\n]*/gi).length > 3)) ? (
                      <center>
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"
                          onClick={this.handleIcon} aria-controls="collapseOne">
                          {I18n.t('ideas.view.description')} <i className={this.state.openDescription ? 'fas fa-chevron-up ml-1' : 'fas fa-chevron-down ml-1'} id="collapseIcon" />
                        </button>
                      </center>
                    ) : (null)}
                  </div>
                  <br />
                  <b>{I18n.t('ideas.filter.comments')}:</b>
                  {selIdea.comments.map((comment, key) => (
                    <div className="comment-container mt-2">
                      <span className="float-left">
                        {comment.submittedBy.profilePictureURL != null &&
                          <img src={comment.submittedBy.profilePictureURL} className="comment-author-avatar" />
                        }
                        <span className="comment-author mr-2">{(comment.anonymous) ? I18n.t('ideas.modal.anonymous') : comment.submittedBy.fullName}</span>
                        {(comment.submittedBy.authorities) ? (
                          (comment.submittedBy.authorities[0] != 'ROLE_USER') ? (
                            <span className="btn btn-md label-bordered role-tag">{I18n.t('ideas.view.admin')}</span>
                          ) : (
                              (comment.anonymous == false) ? (
                                (comment.authorComment) ? (
                                  <span className="btn btn-md label-bordered role-tag">{I18n.t('ideas.view.author')}</span>
                                ) : (null)
                              ) : (null)
                            )
                        ) : (null)}
                      </span>
                      <span className="comment-date float-right">{moment(comment.submittedAt).format('YYYY-MM-DD kk:mm')}</span>
                      <span className="clearfix" />
                      <div className="comment-body mr-3 mt-3">
                        {comment.text}
                      </div>

                      <div className="comment-files">
                        {
                          (comment.files.length > 0) ? (
                            comment.files.map(attach => (
                              <span className="file-name comment-file-item" onClick={() => this.previewFile(attach)}>
                                {attach.name} ({attach.sizeReadable})
                              </span>
                            ))
                          ) : (null)
                        }
                      </div>

                      <div className="comment-reply mt-3"><div href="#" onClick={() => this.showReply(comment.id)}><i className="fa fa-reply" /> {I18n.t('ideas.view.reply')}</div></div>
                      <div style={{ margin: '20px' }}>
                        {comment.replies.map(reply => (
                          <div className="comment-reply-container mt-2">
                            <span className="float-left">
                              {reply.submittedBy.profilePictureURL != null &&
                                <img src={reply.submittedBy.profilePictureURL} className="comment-author-avatar" />
                              }
                              <span className="comment-author mr-2">{reply.anonymous ? I18n.t('ideas.modal.anonymous') : (reply.submittedBy.fullName)}</span>
                              {(reply.submittedBy.authorities) ? (
                                (reply.submittedBy.authorities[0] != 'ROLE_USER') ? (
                                  <span className="btn btn-md label-bordered role-tag">{I18n.t('ideas.view.admin')}</span>
                                ) : (
                                    (reply.anonymous == false) ? (
                                      (reply.authorReply) ? (
                                        <span className="btn btn-md label-bordered role-tag">{I18n.t('ideas.view.author')}</span>
                                      ) : (null)
                                    ) : (null)
                                  )
                              ) : (null)}
                            </span>
                            <span className="comment-date float-right">{moment(reply.submittedAt).format('YYYY-MM-DD kk:mm')}</span>
                            <span className="clearfix" />
                            <div className="comment-body mr-3 mt-3">
                              {reply.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      {(this.state.isReply == comment.id) ? (
                        <form action="" style={{ margin: '10px', marginRight: '0', textAlign: 'right' }}>
                          <textarea className="form-control" rows="2" placeholder={I18n.t('ideas.view.inputReply')} onChange={this.handleReplyContent}
                            value={this.state.replyContent} />
                          <div className="add-reply-footer">
                            <div className={this.state.replyBtnActivate ? 'btn bordered-btn mt-3 add-reply-btn active-next-btn' : 'btn bordered-btn mt-3 add-reply-btn'} onClick={() => this.handleAddReply(comment)}>{I18n.t('ideas.modal.addReply')}</div>

                            <div className="custom-control custom-checkbox anony-checkbox reply-anony">
                              <input type="checkbox" className="custom-control-input" id="defaultUnchecked" checked={(this.state.anonyReply) ? 'checked' : ''} />
                              <label className="custom-control-label anony-label" htmlFor="defaultUnchecked" onClick={this.setAnonyReply}>{I18n.t('ideas.modal.submitAnony')}</label>
                            </div>
                          </div>
                        </form>
                      ) : (null)}
                    </div>
                  ))}
                  <form action="">
                    <textarea className="form-control" rows="2" placeholder={(selIdea.comments.length > 0 || bufComment.length > 0) ? ('') : I18n.t('ideas.my.firstComment')} onChange={this.handleCommentContent}
                      value={this.state.commentContent} />
                    {
                      (this.state.blankCommentError) ?
                        <small className="form-text text-danger">{I18n.t('ideas.modal.blankCommentError')}</small> : (null)
                    }

                    <div className="comment-files">
                      {
                        (remoteFiles.length > 0) ? (
                          remoteFiles.map(attach => (
                            <span className="file-name comment-file-item">
                              {attach.name} ({attach.sizeReadable})
                              <a href="#" className="d-inline-block ml-2" onClick={() => this.removeFile(attach)}>
                                &times;
                              </a>
                            </span>
                          ))
                        ) : (null)
                      }
                      {
                        (localFiles.length > 0) ? (
                          localFiles.map(attach => (
                            <span className="file-name comment-file-item">
                              {attach.name} ({attach.sizeReadable})
                              <a href="#" className="d-inline-block ml-2" onClick={() => this.removeFile(attach)}>
                                &times;
                              </a>
                            </span>
                          ))
                        ) : (null)
                      }
                    </div>
                    <small className="d-block mb-5 comment-file-input">
                      <Files
                        ref="localFiles"
                        className="files-dropzone-list"
                        onChange={(files) => this.onFilesChange(files)}
                        onError={(error, files) => this.onFilesError(error, files)}
                        style={{ height: '100px', width: '100%' }}
                        accepts={['image/*', '.pdf', 'audio/*', '.txt', '.json', '.xml', '.docx', '.xml']}
                        multiple
                        maxFiles={10}
                        maxFileSize={3145728}
                        minFileSize={0}
                        clickable
                      >
                        <a href="#" className="btn upload-btn mb-3 attachment-paddig">
                          <i className="fas fa-paperclip mr-1" />
                        </a>
                      </Files>
                      <div>
                        {' '}
                        {I18n.t('ideas.modal.uploadFiles')}{' '}
                      </div>
                    </small>

                    <div className="add-comment-footer">
                      <div href="#" className={this.state.commentContent.trim().length > 0 ? 'btn bordered-btn float-right active-next-btn' : 'btn bordered-btn float-right'} onClick={this.handleAddComment}>{I18n.t('ideas.view.addComment')}</div>
                      <div className="custom-control custom-checkbox anony-checkbox comment-anony">
                        <input type="checkbox" className="custom-control-input" id="defaultUnchecked" checked={(this.state.anonyComment) ? 'checked' : ''} />
                        <label className="custom-control-label anony-label" htmlFor="defaultUnchecked" onClick={this.setAnonyComment}>{I18n.t('ideas.modal.submitAnony')}</label>
                      </div>
                    </div>
                  </form>
                  <span className="clearfix" />
                </div>
                <div className="col-md-3">
                  <div className="like-container d-flex justify-content-center align-items-center pt-4 pb-4">
                    {(selIdea.liked) ? (
                      <a href="#" className="btn btn-lg like-btn" onClick={() => this.handleLike(selIdea ? selIdea.id : '')}><i className="far fa-thumbs-up mr-1" /> {I18n.t('ideas.view.liked')}</a>
                    ) : (
                        <a href="#" className="btn btn-lg like-btn" onClick={() => this.handleLike(selIdea ? selIdea.id : '')}><i className="far fa-thumbs-up mr-1" /> {I18n.t('ideas.view.like')}</a>
                      )}
                    <br />
                    <div className="likes-number mt-3">{selIdea.votes} {I18n.t('ideas.filter.xxlike')}</div>
                  </div>

                  <div className="idea-tags mt-5">
                    <b>{I18n.t('ideas.modal.tags')}: </b>
                    <br />
                    {selIdea.tags.map((tag, key) => {
                      if (key === 0) {
                        return (
                          <a className="btn label-filled" key={key}>{tag}</a>
                        )
                      }
                      return (
                        <a className="btn label-bordered" key={key}>{tag}</a>
                      )

                    })}
                  </div>

                  <div className="idea-attachments mt-5">
                    <center>
                      {selIdea.files.map(file => {
                        if (file.preview.type != "image") {
                          return (
                            <div className="attachment-container" key={file.id}>
                              <div className="attachment d-flex" onClick={() => this.previewFile(file)}>
                                <i className="far fa-file-pdf"></i>
                              </div>
                              <div className="attachment-title mt-1">
                                <div>{file.name}</div>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div className="attachment-container mt-5" key={file.id}>
                            <div className="attachment d-flex" onClick={() => this.previewFile(file)}>
                              <img src={(file.remote) ? (API_BASE_URI + file.preview.url + '&token=' + token) : (file.preview.url)} className="rounded-circle attachment-img" />
                            </div>
                            <div className="attachment-title mt-1">
                              <div>{file.name}</div>
                            </div>
                          </div>
                        )

                      })}
                      {(selIdea.files.length == 0) ? (
                        <div className="attachment-container">
                          <div className="attachment-title">
                            {I18n.t('ideas.my.noFile')}
                          </div>
                          <div className="attachment d-flex mt-2">
                            <i className="fas fa-file" />
                          </div>
                        </div>
                      ) : (null)}
                    </center>
                  </div>
                </div>
              </div>
            </div>
            {(isPreviewFile) ? (
              <Modal show={isPreviewFile} onHide={this.hidePreviewFile} id="previewFileModal">
                <Modal.Header>
                  <Modal.Title>{selectedFile.name}</Modal.Title>
                  <button
                    type="button"
                    className="download-attachment close pt-4"
                    onClick={() => this.downloadFile((`${(selectedFile.remote ? API_BASE_URI : "") + selectedFile.preview.url}&token=${token}`), selectedFile.name)}
                  >
                    {I18n.t('ideas.download')}
                  </button>
                  <button
                    type="button"
                    className="close"
                    onClick={this.hidePreviewFile}
                    style={{
                      margin: 'inherit',
                      paddingTop: '8px',
                    }}
                  >
                    {I18n.t('ideas.modal.close')} &times;
                  </button>
                </Modal.Header>
                <Modal.Body>
                  <div className="preview-file">
                    <FileViewer
                      fileType={selectedFile.extension}
                      filePath={`${(selectedFile.remote ? API_BASE_URI : "") + selectedFile.preview.url}&token=${token}`}
                    />
                  </div>
                </Modal.Body>
              </Modal>
            ) : (null)}
          </div>
        ) : (
            <div className="swap col-md-12">
              <div className="row">
                <div className="col-md-6 controlsbox searchstat">
                  <div className="col-md-12 ctrlhead">
                    <form onSubmit={this.addCustomFilter}>
                      <div className="search d-flex align-items-center">
                        <i className="fas fa-search" />
                        <input type="text" placeholder={I18n.t('stat.filterTag')} value={tagInput} onChange={this.onChangeCustom} />
                      </div>
                    </form>
                  </div>
                  <div className="col-md-12 ctrlhead mostpopular">
                    <div className="tags d-flex">
                      <FiltersTag
                        buttons={tagsBuf}
                        deleteTag={this.deleteTag} addTag={this.addTag}
                        type="tag" page="statistics"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-2 pt-3">
                  <div className="col-md-12 ctrlhead d-flex justify-content-center flex-column">
                    <div className="btn-group btn-group-toggle d-flex flex-column searchbtnstat" data-toggle="buttons">
                      <label className={this.state.searchType ? 'btn btn-default btn-searchtype active' : 'btn btn-default btn-searchtype'} id="search-full" onClick={e => this.toggleSearchType(e)}>
                        <input type="radio" name="options" id="option1" autoComplete="off"
                          checked /> {I18n.t('ideas.filter.new.full')}
                      </label>
                      <label className={this.state.searchType ? 'btn btn-default btn-searchtype' : 'btn btn-default btn-searchtype active'} id="search-partial" onClick={e => this.toggleSearchType(e)}>
                        <input type="radio" name="options" id="option2" autoComplete="off" /> {I18n.t('ideas.filter.new.partial')}
                      </label>
                    </div>
                    <div className="col-md-12 ctrlhead p-0 text-left">
                      <h5 className="text-left">{I18n.t('ideas.filter.new.fullPartial')} <span className="showinfo" onClick={this.openSearchTip}>?</span></h5>
                    </div>
                    <div className="searchtype-info" ref={this.setWrapperRef}>
                      <span onClick={this.closeSearchTip}>x</span>
                      <h5>
                        {I18n.t('ideas.filter.new.tagDescription')}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 ctrlhead mostpopular">
                  <div className="tags">
                    <p>{I18n.t('ideas.filter.new.mostTags')}</p>
                    <FiltersTag buttons={tagBuf} deleteTag={this.deleteTag} addTag={this.addTag} type="popular"
                      tags={tagsBuf} page="statistics" />
                  </div>
                </div>
              </div>
              <div className="row filters-group">
                <div className="col-md-4 buttonslider stat-filter">
                  <RangePicker title={I18n.t('ideas.filter.new.noLikes')} min={votesMin} max={votesMax} type="vote"
                    from={0} to={1000} handleChange={this.handleLikeChange} />
                </div>
                <div className="col-md-4 buttonslider stat-filter">
                  <RangePicker title={I18n.t('ideas.filter.new.annualProfitBefore') + this.props.dollar + I18n.t('ideas.filter.new.annualProfitAfter')} from={0} to={100000000} min={profitMin}
                    max={profitMax} type="profit" handleChange={this.handleProfitChange} />
                </div>
                <div className="col-md-4 buttonslider stat-filter">
                  <RangePicker title={I18n.t('ideas.modal.timeToMarket')} min={implementationTimeMsMin} max={implementationTimeMsMax} from={0}
                    to={300} type="time" handleChange={this.handleTimeChange} />
                </div>
                <div className="col-md-4 buttonslider stat-filter">
                  <RangePicker title={I18n.t('ideas.filter.new.costImpl') + this.props.dollar + ')'} min={costMin} max={costMax} type="cost"
                    from={0} to={10000000} handleChange={this.handleCostChange} />
                </div>
                <div className="col-md-4 buttonslider stat-filter">
                  <DateRange min={submittedAtMsMin} max={submittedAtMsMax} startDate={"2019.01.01"} endDate={"2020.01.01"}
                    type={"stat"} handleChange={this.handleSubmissionChange} />
                </div>
                <div className="col-md-4 buttonslider mt-4 clear-all-btn">
                  <button className="btn form-control bordered-btn" onClick={this.defaultFilter}>
                    {I18n.t('stat.clear')}
                  </button>
                </div>
              </div>
              <div className="row stat-graph">
                <BubbleChart metaData={summary} showIdea={this.showIdea} />
              </div>
            </div>
          )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { comment, selectedIdea } = ownProps;

  let localFiles = [];
  let remoteFiles = [];
  if (comment != null) {
    if (comment.files != null) {
      remoteFiles = comment.files;
    }
  } else {
    // mode : adding an idea - ownProps.idea == null
    if (state.ideas.commentsToAdd.length > 0) {
      localFiles = state.ideas.commentsToAdd[0].files;
    }
  }
  return {
    summary: state.ideas.summary,
    user: state.profile.userAccountInfo,
    selIdea: state.ideas.selectedIdea,
    localFiles,
    remoteFiles,
    popularTags: state.ideas.popularTags,
    profile: state.profile.userAccountInfo,
    commentsErrorMessage: state.ideas.commentsErrorMessage,
    commentsToAdd: state.ideas.commentsToAdd,
    dollar: (state.users.setting.currency == 'USD') ? '$' : '¥',
    lang: state.i18n.locale,
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statistics);
