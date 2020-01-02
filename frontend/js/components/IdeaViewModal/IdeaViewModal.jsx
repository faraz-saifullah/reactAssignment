import React from 'react';
import moment from 'moment';
import { Modal, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import FileViewer from 'react-file-viewer-extended';
import Collapse from '@kunukn/react-collapse';
import Files from 'react-files';
import {
  toggleVote,
  selectIdeaForView,
  editIdeaFor,
} from '../../actions/ideas';
import { addComment, replyComment } from '../../actions/comments';
import { numberWithCommas } from '../../utils';
import { I18n, setLocale } from 'react-redux-i18n';
import {
  areAllAttachmentsUploaded,
  changeFilesOnNewComment,
  removeFilesOnNewComment,
} from '../../actions/files';
import './IdeaViewModal.scss';
import 'font-awesome/css/font-awesome.min.css';
import '../../../assets/bootstrap/css/bootstrap.min.css';
import { getApiBaseUrl, ID_TOKEN_KEY } from '../../const';

const API_BASE_URI = getApiBaseUrl();

class IdeaViewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idea: props.idea,
      myIdea: props.myIdea,
      commentContent: '',
      blankCommentError: false,
      bufComment: [],
      isPreviewFile: false,
      selectedFile: null,
      replyContent: '',
      isReply: -1,
      anonyComment: false,
      anonyReply: false,
      openDescription: false,
    };
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  componentWillReceiveProps(props) {
    this.setState({ idea: props.idea });
  }

  previewFile = file => {
    this.setState({
      isPreviewFile: true,
      selectedFile: file,
    });
  };

  hidePreviewFile = () => {
    this.setState({
      isPreviewFile: false,
    });
  };

  validateComment = () => {
    const { commentContent } = this.state;
    if (commentContent.trim().length === 0) {
      this.setState({ blankCommentError: true });
      return false;
    }
    return true;
  };

  showReply = comment_id => {
    this.setState({
      isReply: comment_id,
    });
  };

  handleReplyContent = e => {
    let replyBtnActivate = false;
    if (e.target.value.trim().length > 0) {
      replyBtnActivate = true;
    }
    this.setState({
      replyContent: e.target.value,
      replyBtnActivate,
    });
  };

  handleAddComment = () => {
    const { dispatch, idea, commentsToAdd, profile } = this.props;
    const { commentContent, anonyComment } = this.state;
    let files = [];
    let comment = {
      ideaId: idea.id,
      text: commentContent,
      authorComment: !idea.anonymous,
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
    const index = commentsToAdd.findIndex(x => x.ideaId === idea.id);
    if (index !== -1) {
      files = commentsToAdd[index].files;
    }
    comment.files = files;
    if (!areAllAttachmentsUploaded(comment)) {
      alert('wait until all attachments are uploaded');
    } else {
      if (this.validateComment()) {
        dispatch(addComment(comment));

        let { bufComment } = this.state;
        bufComment.push(comment);
        this.setState({
          commentContent: '',
          bufComment,
          blankCommentError: false,
          anonyComment: false,
        });
      }
    }
  };

  handleLike(ideaId) {
    const { dispatch } = this.props;

    dispatch(toggleVote(ideaId));
    var { idea } = this.state;
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
    const { replyContent, anonyReply } = this.state;
    if (replyContent.trim().length == 0) {
      this.setState({ blankReplyError: true });
      return;
    }
    var { idea, bufComment } = this.state;

    let reply = {
      anonymous: anonyReply,
      commentId: comment.id,
      authorReply: !idea.anonymous,
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

    for (var i = 0; i < idea.comments.length; i++) {
      if (idea.comments[i].id == comment.id) {
        idea.comments[i].replies.push(reply);
        break;
      }
    }
    for (let i = 0; i < bufComment.length; i++) {
      if (bufComment[i].id === comment.id) {
        bufComment[i].replies.push(reply);
        break;
      }
    }

    this.setState({
      idea,
      bufComment,
      isReply: -1,
      replyContent: '',
      anonyReply: false,
      replyBtnActivate: false,
    });
  };

  handleCommentContent = e => {
    this.setState({ commentContent: e.target.value });
  };

  onFilesChange = files => {
    const { dispatch, idea, type } = this.props;
    const { remoteFiles, localFiles } = this.props;

    let newFiles = [];
    Array.prototype.push.apply(newFiles, localFiles);
    Array.prototype.push.apply(newFiles, remoteFiles);
    changeFilesOnNewComment(dispatch, idea.id, localFiles, files);
  };

  onFilesError = (error, file) => {
    console.log(`error code ${error.code}: ${error.message}`);
  };

  downloadFile = (url, filename) => {
    fetch(url)
      .then(resp => resp.blob())
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
  };

  removeFile = file => {
    const { dispatch, idea } = this.props;
    const { remoteFiles, localFiles } = this.props;

    const updatedFiles = [];
    for (let i = 0; i < localFiles.length; i++) {
      if (localFiles[i].id === file.id) {
        // delete localFiles[i];
      } else {
        updatedFiles.push(localFiles[i]);
      }
    }
    for (let i = 0; i < remoteFiles.length; i++) {
      if (remoteFiles[i].id != file.id) {
        updatedFiles.push(remoteFiles[i]);
      }
    }

    let newFiles = [];
    Array.prototype.push.apply(newFiles, localFiles);
    Array.prototype.push.apply(newFiles, remoteFiles);
    changeFilesOnNewComment(dispatch, idea.id, newFiles, updatedFiles);
  };

  handleIcon = e => {
    this.setState({ openDescription: !this.state.openDescription });
  };

  showEdit = idea => {
    const { dispatch } = this.props;
    dispatch(editIdeaFor(idea));
    this.props.showEdit();
  };

  setAnonyComment = () => {
    const { anonyComment } = this.state;
    this.setState({
      anonyComment: !anonyComment,
    });
  };

  setAnonyReply = () => {
    const { anonyReply } = this.state;
    this.setState({
      anonyReply: !anonyReply,
    });
  };

  render() {
    const {
      remoteFiles,
      localFiles,
      user,
      commentsToAdd,
      profile,
      selIdea,
      hideProfit,
    } = this.props;
    const {
      idea,
      bufComment,
      myIdea,
      isPreviewFile,
      selectedFile,
    } = this.state;
    let admin_flag = false;

    if (profile.authorities && profile.authorities[0] === 'ROLE_ADMIN') {
      admin_flag = true;
    }
    const token = localStorage.getItem(ID_TOKEN_KEY) || null;
    if (idea.title !== undefined) {
      return (
        <div className="idea-details-container">
          <div className="idea-back">
            <Button variant="link" onClick={() => this.props.onHideIdea()}>
              <i className="fas fa-chevron-left" /> &nbsp;
              {I18n.t('ideas.modal.back')}
            </Button>
          </div>
          <div className="idea-details">
            <Row>
              <Col md={1}>
                {idea.anonymous ? null : (
                  <div className="dp-placeholder">
                    <img
                      alt="profile"
                      src={idea.submittedBy.profilePictureURL}
                      style={{ width: '100%', borderRadius: '50px' }}
                    />
                  </div>
                )}
              </Col>
              <Col md={8}>
                <div className="mb-1">
                  <small>
                    <span className="author mr-2">
                      {idea.anonymous
                        ? I18n.t('ideas.modal.anonymous')
                        : idea.submittedBy.fullName}
                    </span>{' '}
                    |{' '}
                    <span className="date ml-2">
                      {moment(idea.submittedAt).format('YYYY-MM-DD')}
                    </span>
                  </small>
                  {idea.editable ? (
                    <Button
                      variant="link"
                      className="edit-btn pull-right"
                      onClick={() => this.showEdit(idea)}
                    >
                      <i className="fas fa-pencil-alt mr-1" />
                      {I18n.t('ideas.my.edit')}
                    </Button>
                  ) : null}
                </div>
                <h4>{idea.title}</h4>
                <div className="idea-features mt-4 mb-4">
                  <ul>
                    <li className="mr-4 mb-1">
                      <span className="float-left mr-2">
                        <div className="icon-holder">
                          <i className="far fa-clock" />
                        </div>
                      </span>
                      <span className="float-right">
                        {' '}
                        {I18n.t('ideas.modal.timeMarket')}
                        <br />
                        {idea.expectedTtm} {I18n.t('ideas.filter.xMonths')}
                      </span>
                      <span className="clearfix" />
                    </li>
                    <li className="mb-1">
                      <span className="float-left mr-2">
                        <div className="icon-holder">
                          <i className="far fa-money-bill-alt" />
                        </div>
                      </span>
                      <span className="float-right">
                        {I18n.t('ideas.modal.estCost')}: {this.props.dollar}
                        {numberWithCommas(idea.expectedCostInCents)}
                        <br />
                        {hideProfit === false ||
                        admin_flag === true ||
                        idea.editable === true
                          ? I18n.t('ideas.modal.estProfit') +
                            ':' +
                            this.props.dollar +
                            numberWithCommas(idea.expectedProfitInCents) +
                            '/' +
                            I18n.t('ideas.filter.year')
                          : null}
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
                      this.state.openDescription ? 'app__collapse--active' : ''
                    }
                    onChange={state => this.setState({ spy3: state })}
                    render={collapseState => <p>{idea.description}</p>}
                  />
                  {idea.description.length > 300 ||
                  (idea.description.match(/[^\n]*\n[^\n]*/gi) &&
                    idea.description.match(/[^\n]*\n[^\n]*/gi).length > 3) ? (
                    <center>
                      <Button
                        variant="link"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="true"
                        onClick={this.handleIcon}
                        aria-controls="collapseOne"
                      >
                        {I18n.t('ideas.view.description')}{' '}
                        <i
                          className={
                            this.state.openDescription
                              ? 'fas fa-chevron-up ml-1'
                              : 'fas fa-chevron-down ml-1'
                          }
                          id="collapseIcon"
                        />
                      </Button>
                    </center>
                  ) : null}
                </div>
                <div className="mb-2">
                  <b>{I18n.t('ideas.view.comments')}</b>
                </div>
                {selIdea.comments.map((comment, key) => (
                  <div key={key} className="comment-container mt-2">
                    <Row>
                      <Col md={8} xs={8}>
                        <span className="comment-author mr-2">
                          {comment.anonymous
                            ? I18n.t('ideas.modal.anonymous')
                            : comment.submittedBy.fullName}
                        </span>
                        {comment.submittedBy.authorities ? (
                          comment.submittedBy.authorities[0] != 'ROLE_USER' ? (
                            <span className="btn btn-md label-bordered role-tag">
                              {I18n.t('ideas.view.admin')}
                            </span>
                          ) : comment.anonymous === false ? (
                            comment.authorComment ? (
                              <span className="btn btn-md label-bordered role-tag">
                                {I18n.t('ideas.view.author')}
                              </span>
                            ) : null
                          ) : null
                        ) : null}
                      </Col>
                      <Col md={4} xs={4} className="pull-right">
                        <span className="comment-date pull-right">
                          {moment(comment.submittedAt).format('YYYY-MM-DD')}
                        </span>
                      </Col>
                    </Row>
                    <span className="clearfix" />
                    <div className="comment-body mr-3 mt-3">{comment.text}</div>

                    <div className="comment-files">
                      {comment.files.length > 0
                        ? comment.files.map((attach, key) => (
                            <span
                              key={key}
                              className="file-name comment-file-item"
                              onClick={() => this.previewFile(attach)}
                            >
                              {attach.name} ({attach.sizeReadable})
                            </span>
                          ))
                        : null}
                    </div>

                    <div className="comment-reply mt-3">
                      <Button
                        size="lg"
                        variant="link"
                        onClick={() => this.showReply(comment.id)}
                      >
                        <i className="fa fa-reply" /> &nbsp;
                        {I18n.t('ideas.view.reply')}
                      </Button>
                    </div>
                    <div style={{ margin: '20px' }}>
                      {comment.replies.map((reply, key) => (
                        <div key={key} className="comment-reply-container mt-2">
                          <span className="float-left">
                            <span className="comment-author mr-2">
                              {reply.anonymous
                                ? I18n.t('ideas.modal.anonymous')
                                : reply.submittedBy.fullName}
                            </span>
                            {reply.submittedBy.authorities ? (
                              reply.submittedBy.authorities[0] !=
                              'ROLE_USER' ? (
                                <span className="btn btn-md label-bordered role-tag">
                                  {I18n.t('ideas.view.admin')}
                                </span>
                              ) : reply.anonymous == false ? (
                                reply.authorReply ? (
                                  <span className="btn btn-md label-bordered role-tag">
                                    {I18n.t('ideas.view.author')}
                                  </span>
                                ) : null
                              ) : null
                            ) : null}
                          </span>
                          <span className="comment-date pull-right">
                            {moment(reply.submittedAt).format('YYYY-MM-DD')}
                          </span>
                          <span className="clearfix" />
                          <div className="comment-body mr-3 mt-3">
                            {reply.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    {this.state.isReply === comment.id ? (
                      <form
                        action=""
                        style={{
                          margin: '10px',
                          marginRight: '0',
                          textAlign: 'right',
                        }}
                      >
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder={I18n.t('ideas.view.inputReply')}
                          onChange={this.handleReplyContent}
                          value={this.state.replyContent}
                        />
                        <div className="add-reply-footer">
                          <div
                            className={
                              this.state.replyBtnActivate
                                ? 'btn bordered-btn mt-3 add-reply-btn active-next-btn'
                                : 'btn bordered-btn mt-3 add-reply-btn'
                            }
                            onClick={() => this.handleAddReply(comment)}
                          >
                            {I18n.t('ideas.modal.addReply')}
                          </div>

                          <div className="custom-control custom-checkbox anony-checkbox reply-anony">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="defaultUnchecked"
                              checked={this.state.anonyReply ? 'checked' : ''}
                            />
                            <label
                              className="custom-control-label anony-label"
                              htmlFor="defaultUnchecked"
                              onClick={this.setAnonyReply}
                            >
                              {I18n.t('ideas.modal.submitAnony')}
                            </label>
                          </div>
                        </div>
                      </form>
                    ) : null}
                  </div>
                ))}
                <Form action="">
                  <Form.Group>
                    <Form.Control
                      type="textarea"
                      rows="2"
                      placeholder={
                        idea.comments.length > 0 || bufComment.length > 0
                          ? ''
                          : I18n.t('ideas.my.firstComment')
                      }
                      onChange={this.handleCommentContent}
                      value={this.state.commentContent}
                    />{' '}
                    {this.state.blankCommentError ? (
                      <small className="form-text text-danger">
                        {I18n.t('ideas.modal.blankCommentError')}
                      </small>
                    ) : null}
                  </Form.Group>
                  <div className="comment-files">
                    {remoteFiles.length > 0
                      ? remoteFiles.map((attach, key) => (
                          <span
                            key={key}
                            className="file-name comment-file-item"
                          >
                            {attach.name} ({attach.sizeReadable})
                            <a
                              href="#"
                              className="d-inline-block ml-2"
                              onClick={() => this.removeFile(attach)}
                            >
                              &times;
                            </a>
                          </span>
                        ))
                      : null}
                    {localFiles.length > 0
                      ? localFiles.map((attach, key) => (
                          <span
                            key={key}
                            className="file-name comment-file-item"
                          >
                            {attach.name} ({attach.sizeReadable})
                            <a
                              href="#"
                              className="d-inline-block ml-2"
                              onClick={() => this.removeFile(attach)}
                            >
                              &times;
                            </a>
                          </span>
                        ))
                      : null}
                  </div>
                  <small className="d-block mb-5 comment-file-input">
                    <Files
                      ref="localFiles"
                      className="files-dropzone-list"
                      onChange={files => this.onFilesChange(files)}
                      onError={(error, files) =>
                        this.onFilesError(error, files)
                      }
                      style={{ height: '100px', width: '100%' }}
                      accepts={[
                        'image/*',
                        '.pdf',
                        'audio/*',
                        '.txt',
                        '.json',
                        '.xml',
                        '.docx',
                        '.xml',
                      ]}
                      multiple
                      maxFiles={10}
                      maxFileSize={3145728}
                      minFileSize={0}
                      clickable
                    >
                      <a
                        href="#"
                        className="btn upload-btn mb-3 attachment-padding"
                      >
                        <i className="fas fa-paperclip mr-1" />
                      </a>
                    </Files>
                    <div> {I18n.t('ideas.modal.uploadFiles')} </div>
                  </small>
                  <div className="add-comment-footer">
                    <div
                      href="#"
                      className={
                        this.state.commentContent.trim().length > 0
                          ? 'btn bordered-btn float-right active-next-btn'
                          : 'btn bordered-btn float-right'
                      }
                      onClick={this.handleAddComment}
                    >
                      {I18n.t('ideas.view.addComment')}
                    </div>
                    <div className="custom-control custom-checkbox anony-checkbox comment-anony">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="defaultUnchecked"
                        checked={this.state.anonyComment ? 'checked' : ''}
                      />
                      <label
                        className="custom-control-label anony-label"
                        htmlFor="defaultUnchecked"
                        onClick={this.setAnonyComment}
                      >
                        {I18n.t('ideas.modal.submitAnony')}
                      </label>
                    </div>
                  </div>
                </Form>
                <span className="clearfix" />
              </Col>
              <Col md={3}>
                <div className="like-container d-flex justify-content-center align-items-center pt-4 pb-4">
                  {idea.liked && !myIdea ? (
                    <a
                      href="#"
                      className="btn btn-lg like-btn"
                      onClick={() => this.handleLike(idea ? idea.id : '')}
                    >
                      <i className="far fa-thumbs-up mr-1" />{' '}
                      {I18n.t('ideas.view.liked')}
                    </a>
                  ) : !myIdea ? (
                    <a
                      href="#"
                      className="btn btn-lg like-btn"
                      onClick={() => this.handleLike(idea ? idea.id : '')}
                    >
                      <i className="far fa-thumbs-up mr-1"></i>{' '}
                      {I18n.t('ideas.view.like')}
                    </a>
                  ) : null}
                  <br />
                  <div className="likes-number mt-3">
                    {idea.votes} {I18n.t('ideas.filter.xxlike')}
                  </div>
                </div>

                <div className="idea-tags mt-5">
                  <b>{I18n.t('ideas.modal.tags')}: </b>
                  <br />
                  {idea.tags.map((tag, key) => {
                    if (key === 0) {
                      return (
                        <a key={key} className="btn label-filled">
                          {tag}
                        </a>
                      );
                    }
                    return (
                      <a key={key} className="btn label-bordered">
                        {tag}
                      </a>
                    );
                  })}
                </div>

                <div className="idea-attachments mt-5">
                  <center>
                    {idea.files.map((file, key) => {
                      if (file.preview.type !== 'image') {
                        return (
                          <div
                            key={key}
                            className="attachment-container"
                            key={file.id}
                          >
                            <div
                              className="attachment d-flex"
                              onClick={() => this.previewFile(file)}
                            >
                              <i className="far fa-file-pdf"></i>
                            </div>
                            <div className="attachment-title mt-1">
                              <div>{file.name}</div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={key}
                          className="attachment-container mt-5"
                          key={file.id}
                        >
                          <div
                            className="attachment d-flex"
                            onClick={() => this.previewFile(file)}
                          >
                            <img
                              alt="preview"
                              src={
                                file.remote
                                  ? API_BASE_URI +
                                    file.preview.url +
                                    '&token=' +
                                    token
                                  : file.preview.url
                              }
                              className="rounded-circle attachment-img"
                            />
                          </div>
                          <div className="attachment-title mt-1">
                            <div>{file.name}</div>
                          </div>
                        </div>
                      );
                    })}
                    {idea.files.length === 0 ? (
                      <div className="attachment-container">
                        <div className="attachment-title">
                          {I18n.t('ideas.my.noFile')}
                        </div>
                        <div className="attachment d-flex mt-2">
                          <i className="fas fa-file" />
                        </div>
                      </div>
                    ) : null}
                  </center>
                </div>
              </Col>
            </Row>
          </div>
          {isPreviewFile ? (
            <Modal
              show={isPreviewFile}
              onHide={this.hidePreviewFile}
              id="previewFileModal"
            >
              <Modal.Header>
                <Modal.Title>{selectedFile.name}</Modal.Title>
                <button
                  type="button"
                  className="download-attachment close pt-4"
                  onClick={() =>
                    this.downloadFile(
                      (selectedFile.remote ? API_BASE_URI : '') +
                        selectedFile.preview.url +
                        '&token=' +
                        token,
                      selectedFile.name
                    )
                  }
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
                    filePath={
                      (selectedFile.remote ? API_BASE_URI : '') +
                      selectedFile.preview.url +
                      '&token=' +
                      token
                    }
                  />
                </div>
              </Modal.Body>
            </Modal>
          ) : null}
        </div>
      );
    }
    return '';
  }
}

function mapStateToProps(state, ownProps) {
  const { comment, idea } = ownProps;

  let localFiles = [];
  let remoteFiles = [];
  if (comment != null) {
    if (comment.files != null) {
      remoteFiles = comment.files;
    }
  } else {
    // mode : adding an idea - ownProps.idea == null
    const index = state.ideas.commentsToAdd.findIndex(
      x => x.ideaId === idea.id
    );
    if (index !== -1) {
      localFiles = state.ideas.commentsToAdd[index].files;
    }
  }

  return {
    localFiles,
    remoteFiles,
    popularTags: state.ideas.popularTags,
    selIdea: state.ideas.selectedIdea,
    user: state.users.usersArr,
    profile: state.profile.userAccountInfo,
    commentsErrorMessage: state.ideas.commentsErrorMessage,
    commentsToAdd: state.ideas.commentsToAdd,
    hideProfit: state.users.setting.features.hideProfitsForUsers,
    lang: state.i18n.locale,
    dollar: state.users.setting.currency === 'USD' ? '$' : '¥',
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeaViewModal);
