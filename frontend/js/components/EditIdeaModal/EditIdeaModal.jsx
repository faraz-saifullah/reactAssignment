/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import Files from 'react-files';
import PropTypes from 'prop-types';
import { I18n, setLocale } from 'react-redux-i18n';
import { areAllAttachmentsUploaded, changeFiles } from '../../actions/files';
import { updateIdea } from '../../actions/ideas';
import { numberWithCommas } from '../../utils';
import { ReactTagFilter } from '../IdeaModal/ReactTagFilter';
import './EditIdeaModal.scss';

class EditIdeaModal extends React.Component {
  constructor(props) {
    super(props);

    console.log(props.idea);
    const {
      expectedTtm,
      expectedProfitInCents,
      expectedCostInCents,
      title,
      description,
      tags,
      files,
      anonymous,
      stage,
      category,
      id,
      submittedAt,
      submittedBy,
      votes,
      editable,
      liked,
    } = props.idea;
    this.state = {
      expectedTtm,
      expectedProfitInCents,
      expectedCostInCents,
      title,
      description,
      tags,
      files,
      anonymous,
      stage,
      category,
      id,
      submittedAt,
      submittedBy,
      votes,
      editable,
      liked,
      show: props.show,
      errorMessage: '',
      hasFieldErrors: false,
    };
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { files } = props.idea;
    this.setState({ files });
  }

  removeFile = file => {
    const { dispatch } = this.props;
    const { localFiles, remoteFiles } = this.props;
    const { id, files } = this.state;

    console.log(file);
    const newFileArray = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].id !== file.id) {
        newFileArray.push(files[i]);
      }
    }

    for (let i = 0; i < remoteFiles.length; i++) {
      if (remoteFiles[i].id !== file.id) {
        newFileArray.push(remoteFiles[i]);
      }
    }

    console.log(newFileArray);

    this.refs.localFiles.removeFile(file);

    changeFiles(dispatch, id, files, newFileArray);
  };

  handleUpdate = () => {
    const { dispatch } = this.props;
    const {
      title,
      description,
      tags,
      files,
      expectedCostInCents,
      expectedProfitInCents,
      expectedTtm,
      id,
      stage,
      anonymous,
      submittedAt,
      submittedBy,
      votes,
      editable,
      liked,
      hasFieldErrors,
    } = this.state;
    console.log('update idea', idea);
    const idea = {
      id,
      title,
      description,
      stage,
      expectedCostInCents,
      expectedProfitInCents,
      expectedTtm,
      anonymous,
      files,
      tags,
      category: tags[0],
      submittedAt,
      submittedBy,
      votes,
      editable,
      liked,
    };
    const errorMessage = this.validateIdea(idea);
    if (errorMessage.length > 0 || hasFieldErrors) {
      this.setState({ errorMessage });
      return;
    }
    dispatch(updateIdea(idea));
    this.props.handleClose();
  };

  validateIdea = idea => {
    let errorMessage = '';

    this.validateFields(idea);

    if (idea.tags.length === 0) {
      errorMessage = I18n.t('ideas.modal.specifyTag');
    } else if (!areAllAttachmentsUploaded(idea)) {
      // TODO: make a retry behavior when finishing editing or adding ideas
      errorMessage = I18n.t('ideas.modal.uploadWait');
    }

    return errorMessage;
  };

  validateInput = idea => {
    let errorMessage = '';

    this.validateFields(idea);

    return errorMessage;
  };

  validateFields = idea => {
    const titleFieldError = document.getElementById('idea-title-field-error');
    const descriptionFieldError = document.getElementById(
      'idea-description-field-error'
    );
    const durationFieldError = document.getElementById(
      'idea-duration-field-error'
    );
    const costFieldError = document.getElementById('idea-cost-field-error');
    const profitFieldError = document.getElementById('idea-profit-field-error');

    if (idea.title.trim().length === 0) {
      titleFieldError.innerHTML = I18n.t('ideas.modal.emptyTitle');
      titleFieldError.classList.remove('hidden');
    } else {
      titleFieldError.classList.add('hidden');
    }

    if (idea.description.trim().length === 0) {
      descriptionFieldError.innerHTML = I18n.t('ideas.modal.emptyDescription');
      descriptionFieldError.classList.remove('hidden');
    } else {
      descriptionFieldError.classList.add('hidden');
    }

    if (parseInt(idea.expectedTtm) > 300) {
      durationFieldError.innerHTML = I18n.t('ideas.modal.largeTtm');
      durationFieldError.classList.remove('hidden');
    } else if (parseInt(idea.expectedTtm) <= 0) {
      durationFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      durationFieldError.classList.remove('hidden');
    } else {
      durationFieldError.classList.add('hidden');
    }

    if (parseInt(idea.expectedCostInCents) > 10000000) {
      costFieldError.innerHTML = I18n.t('ideas.modal.errorCost');
      costFieldError.classList.remove('hidden');
    } else if (parseInt(idea.expectedCostInCents) <= 0) {
      costFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      costFieldError.classList.remove('hidden');
    } else {
      costFieldError.classList.add('hidden');
    }

    if (parseInt(idea.expectedProfitInCents) > 100000000) {
      profitFieldError.innerHTML = I18n.t('ideas.modal.errorProfit');
      profitFieldError.classList.remove('hidden');
    } else if (parseInt(idea.expectedProfitInCents) <= 0) {
      profitFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      profitFieldError.classList.remove('hidden');
    } else {
      profitFieldError.classList.add('hidden');
    }

    if (
      idea.title !== '' &&
      idea.description !== '' &&
      idea.expectedTtm !== '' &&
      idea.expectedCostInCents !== '' &&
      idea.expectedProfitInCents !== '' &&
      titleFieldError.classList.contains('hidden') &&
      descriptionFieldError.classList.contains('hidden') &&
      durationFieldError.classList.contains('hidden') &&
      costFieldError.classList.contains('hidden') &&
      profitFieldError.classList.contains('hidden')
    ) {
      this.setState({ hasFieldErrors: false });
      return;
    }

    this.setState({ hasFieldErrors: true });
  };

  setTags = tags => {
    let tagsArray = [];
    tags.map(tag => {
      tagsArray.push(tag.text);
    });
    if (tags.length === 0) {
      let errorMessage = I18n.t('ideas.modal.specifyTag');
      this.setState({ tags: tagsArray, errorMessage });
    } else {
      this.setState({ tags: tagsArray, errorMessage: '' });
    }
  };

  onFilesChange = file => {
    const { dispatch, remoteFiles } = this.props;
    const { id, files } = this.state;
    const newFiles = [];
    Array.prototype.push.apply(newFiles, files);
    Array.prototype.push.apply(newFiles, file);
    Array.prototype.push.apply(newFiles, remoteFiles);
    changeFiles(dispatch, id, files, newFiles);
  };

  onFilesError(error, file) {
    console.log(`error code ${error.code}: ${error.message}`);
  }

  updateInput = field => {
    return e => {
      const {
        title,
        description,
        expectedCostInCents,
        expectedProfitInCents,
        expectedTtm,
      } = this.state;
      const idea = {
        title,
        description,
        expectedCostInCents,
        expectedProfitInCents,
        expectedTtm,
      };
      if (
        field === 'expectedCostInCents' ||
        field === 'expectedProfitInCents' ||
        field === 'expectedTtm'
      ) {
        if (/^\d+$/.test(e.currentTarget.value.replace(/\,/g, ''))) {
          idea[field] = 1 * e.currentTarget.value.replace(/\,/g, '');
        } else if (e.currentTarget.value === '') {
          idea[field] = 0;
        } else {
          return;
        }
      } else {
        idea[field] = e.currentTarget.value;
      }
      const errorMessage = this.validateInput(idea);
      this.setState({ [field]: idea[field], errorMessage });
    };
  };

  render() {
    const {
      title,
      description,
      tags,
      files,
      expectedCostInCents,
      expectedProfitInCents,
      expectedTtm,
      id,
      stage,
      anonymous,
      submittedAt,
      submittedBy,
      votes,
      editable,
      liked,
    } = this.state;
    const tagsArray = [];
    tags.map(tag => {
      tagsArray.push({ id: tag, text: tag });
    });
    const { errorMessage, hasFieldErrors } = this.state;
    return (
      <Modal show={true} onHide={this.props.handleClose} id="editIdeaModal">
        <Modal.Header>
          <Modal.Title>{I18n.t('ideas.my.editIdea')}</Modal.Title>
          <Button
            variant="link"
            className="close pt-4"
            onClick={this.props.handleClose}
          >
            {I18n.t('ideas.modal.close')} &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Form.Group>
              <Form.Label>{I18n.t('ideas.modal.title1')}</Form.Label>
              <Form.Control
                type="text"
                ref={e => (this.title = e)}
                value={title}
                onChange={this.updateInput('title')}
                required
              />
              <div
                className="field-error text-danger hidden"
                id="idea-title-field-error"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="">
                {I18n.t('ideas.modal.description')}
              </Form.Label>
              <Form.Control
                type="textarea"
                ref={e => (this.description = e)}
                rows="2"
                value={description}
                onChange={this.updateInput('description')}
                required
              />
              <div
                className="field-error text-danger hidden"
                id="idea-description-field-error"
              />
            </Form.Group>

            <Row>
              <Col md={7}>
                <Form.Group>
                  <Form.Label htmlFor="">
                    {I18n.t('ideas.modal.timeToMarket')}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    ref={e => (this.timeMarket = e)}
                    value={expectedTtm}
                    onChange={this.updateInput('expectedTtm')}
                    required
                  />
                  <div
                    className="field-error text-danger hidden"
                    id="idea-duration-field-error"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="">
                    {I18n.t('ideas.modal.estimateCost')}
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <span className="input-group-text">
                        {this.props.dollar}
                      </span>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      ref={e => (this.costMarket = e)}
                      aria-label="Amount (to the nearest dollar)"
                      value={numberWithCommas(expectedCostInCents)}
                      onChange={this.updateInput('expectedCostInCents')}
                    />
                  </InputGroup>
                  <div
                    className="field-error text-danger hidden"
                    id="idea-cost-field-error"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="">
                    {I18n.t('ideas.modal.estimateProfit')}
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <span className="input-group-text">
                        {this.props.dollar}
                      </span>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      ref={e => (this.profitMarket = e)}
                      aria-label="Amount (to the nearest dollar)"
                      value={numberWithCommas(expectedProfitInCents)}
                      onChange={this.updateInput('expectedProfitInCents')}
                    />
                  </InputGroup>
                  <div
                    className="field-error text-danger hidden"
                    id="idea-profit-field-error"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="">
                    {I18n.t('ideas.modal.tags')}
                  </Form.Label>
                  <ReactTagFilter
                    tags={tagsArray}
                    setTags={tags => this.setTags(tags)}
                  />
                  <br />
                  <small>{I18n.t('ideas.modal.tagAdd')}</small>
                </Form.Group>

                {errorMessage.length > 0 ? (
                  <div className="alert alert-danger" id="validation-error-2">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  variant="primary"
                  className={
                    errorMessage.length > 0 || hasFieldErrors
                      ? 'pull-right mb-5 mt-4 text-uppercase'
                      : 'pull-right mb-5 mt-4 active-next-btn text-uppercase'
                  }
                  onClick={this.handleUpdate}
                >
                  {I18n.t('ideas.my.saveChange')}
                </Button>
                <span className="clearfix" />
              </Col>

              <Col md={5} className="mt-1">
                <div className="file-details">
                  {I18n.t('ideas.modal.file')}:
                  {files.map((file, key) => (
                    <span key={key} className="file-name d-block">
                      {file.name} ({file.sizeReadable})
                      <a
                        href="#"
                        className="d-inline-block ml-2"
                        onClick={() => this.removeFile(file)}
                      >
                        &times;
                      </a>
                    </span>
                  ))}
                  <div className="upload-container mt-5">
                    <center>
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
                        <Button
                          href="#"
                          variant="outline-primary"
                          className="text-uppercase mb-3 upload-btn"
                        >
                          <i className="fas fa-paperclip mr-1" />
                          &nbsp;{I18n.t('ideas.modal.attach')}
                        </Button>
                      </Files>
                      <small>{I18n.t('ideas.modal.uploadFiles')}</small>
                    </center>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

EditIdeaModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dollar: PropTypes.string,
  handleClose: PropTypes.func,
  idea: PropTypes.object,
  lang: PropTypes.string.isRequired,
  localFiles: PropTypes.array,
  number: PropTypes.number,
  remoteFiles: PropTypes.array,
  setting: PropTypes.object,
  type: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  console.log('EditIdeaModal.mapStateToProps...');

  let localFiles = [];
  let remoteFiles = [];
  if (ownProps.idea != null) {
    const index = state.ideas.ideasArr.findIndex(
      x => x.id === ownProps.idea.id
    );
    if (index !== -1) {
      const ideaFiles = state.ideas.ideasArr[index].files;
      if (ideaFiles !== null) {
        for (let fileIndex in ideaFiles) {
          if (ideaFiles[fileIndex].remote) {
            remoteFiles.push(ideaFiles[fileIndex]);
          } else {
            localFiles.push(ideaFiles[fileIndex]);
          }
        }
      }
    }
  } else {
    // mode : adding an idea - ownProps.idea == null
    localFiles = state.ideas.ideaToAdd.files;
    remoteFiles = [];
  }

  return {
    localFiles,
    remoteFiles,
    idea: state.ideas.editableIdea,
    lang: state.i18n.locale,
    dollar: state.users.setting.currency === 'USD' ? '$' : '¥',
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditIdeaModal);
