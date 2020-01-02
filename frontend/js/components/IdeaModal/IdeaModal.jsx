/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-return-assign */
import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Col, Row, Form, InputGroup } from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';
import Files from 'react-files';
import FileViewer from 'react-file-viewer';
import Stepper from 'react-stepper-horizontal';
import PropTypes from 'prop-types';
import { ReactTagFilter } from './ReactTagFilter';
import { FiltersTag } from '../FiltersTag';
import { addIdea, removeTemp, handleAddIdeaError } from '../../actions/ideas';
import { areAllAttachmentsUploaded, changeFiles } from '../../actions/files';
import { numberWithCommas } from '../../utils';
import './IdeaModal.scss';
import { getApiBaseUrl, ID_TOKEN_KEY } from '../../const';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const API_BASE_URI = getApiBaseUrl();

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class IdeaModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      tags: [],
      title: '',
      description: '',
      expectedCostInCents: 0,
      expectedProfitInCents: 0,
      expectedTtm: 0,
      anony: false,
      idea: props.idea,
      remoteFiles: [],
      localFiles: [],
      stage: 'Launched',
      id: props.id ? props.id : -1,
      firstValidated: false,
      secondValidated: false,
      isPreviewFile: false,
      selectedFile: null,
      isPreview: false,
      step: 1,
    };
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  removeFile = file => {
    const { dispatch, idea, type } = this.props;
    const { localFiles } = this.props;

    const newFiles = [];
    for (let i = 0; i < localFiles.length; i++) {
      if (localFiles[i].id === file.id) {
        // delete localFiles[i];
      } else {
        newFiles.push(localFiles[i]);
      }
    }

    this.refs.localFiles.removeFile(file);

    changeFiles(dispatch, -1, localFiles, newFiles);
  };

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

  setInput = field => {
    return value => {
      if (
        field === 'expectedCostInCents' ||
        field === 'expectedProfitInCents' ||
        field === 'expectedTtm'
      ) {
        if (/^\d+$/.test(value.currentTarget.value.replace(/\,/g, ''))) {
          this.setState({
            [field]: value.currentTarget.value.replace(/\,/g, ''),
          });
        } else if (value.currentTarget.value === '') {
          this.setState({
            [field]: 0,
          });
        }
      } else {
        this.setState({
          [field]: value.currentTarget.value,
        });
      }

      if (
        field === 'expectedCostInCents' ||
        field === 'expectedProfitInCents' ||
        field === 'expectedTtm'
      ) {
        if (this.validateSecondScreen()) {
          this.setState({ secondValidated: true });
        } else {
          this.setState({ secondValidated: false });
        }
      }

      if (field === 'title' || field === 'description') {
        if (this.validateFirstScreen()) {
          this.setState({ firstValidated: true });
        } else {
          this.setState({ firstValidated: false });
        }
      }
    };
  };

  setTags = tags => {
    this.setState({
      tags,
    });

    if (this.validateFirstScreen(tags)) {
      this.setState({ firstValidated: true });
    } else {
      this.setState({ firstValidated: false });
    }
  };

  setAnony = () => {
    this.setState({ anony: !this.state.anony });
  };

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch(removeTemp());
    this.setState({
      show: false,
      tags: [],
      title: '',
      description: '',
      expectedCostInCents: 0,
      expectedProfitInCents: 0,
      expectedTtm: 0,
      anony: false,
      remoteFiles: [],
      localFiles: [],
      stage: 'Launched',
      firstValidated: false,
      secondValidated: false,
      isPreviewFile: false,
      selectedFile: null,
    });
  };
  handleShow = () => {
    this.setState({
      show: true,
      step: 1,
      isPreview: false,
      tags: [],
      title: '',
      description: '',
      expectedCostInCents: 0,
      expectedProfitInCents: 0,
      expectedTtm: 0,
      anony: false,
      remoteFiles: [],
      localFiles: [],
      stage: 'Launched',
      firstValidated: false,
      secondValidated: false,
      isPreviewFile: false,
      selectedFile: null,
    });
  };
  handleBackEdit = () => {
    this.setState({ isPreview: false });
  };

  handleShowPreview = () => {
    this.setState({ isPreview: true, step: 3 });
  };

  handleSubmit() {
    const {
      id,
      tags,
      stage,
      title,
      description,
      expectedCostInCents,
      expectedProfitInCents,
      expectedTtm,
      anony,
    } = this.state;
    const {
      type,
      localFiles,
      remoteFiles,
      dispatch,
      number,
      myIdea,
      filter,
    } = this.props;
    const category = tags[0].text;
    const newTags = [];
    tags.map(tag => {
      newTags.push(tag.text);
    });
    const newFiles = [];
    Array.prototype.push.apply(newFiles, this.props.localFiles);
    Array.prototype.push.apply(newFiles, this.props.remoteFiles);
    const idea = {
      title,
      description,
      stage,
      expectedCostInCents,
      expectedTtm,
      expectedProfitInCents,
      tags: newTags,
      category,
      anonymous: anony,
      files: newFiles,
    };

    const errorMessage = this.validateIdea(idea);
    if (type === 'edit') {
    } else {
      if (errorMessage.length > 0) {
        dispatch(handleAddIdeaError(errorMessage));
        alert(errorMessage);
        return;
      }
      dispatch(addIdea(idea, number, myIdea, filter));
      this.props.clearFilter();
      this.handleClose();
    }
  }

  validateIdea(idea) {
    let errorMessage = '';
    if (idea.title.length === 0) {
      errorMessage += 'Title must be required.\n';
    }

    if (idea.description.length === 0) {
      errorMessage += 'Description must be required.\n';
    }

    if (idea.stage.length === 0) {
      errorMessage += 'Stage must be required.\n';
    }

    if (idea.expectedCostInCents.length === 0) {
      errorMessage += 'ExpectedCostInCents must be required.\n';
    }

    if (idea.expectedTtm.length === 0) {
      errorMessage += 'ExpectedTtm must be required.\n';
    }

    if (idea.expectedProfitInCents.length === 0) {
      errorMessage += 'ExpectedProfitInCents must be required.\n';
    }

    if (idea.tags.length === 0) {
      errorMessage += 'Tags must be required.\n';
    }

    // TODO: make a retry behavior when finishing editing or adding ideas
    if (!areAllAttachmentsUploaded(idea)) {
      errorMessage += I18n.t('ideas.modal.uploadWait');
    }
    if (errorMessage.endsWith('\n')) {
      errorMessage = errorMessage.substr(0, errorMessage.length - 1);
    }

    return errorMessage;
  }

  handleNextScreen(e) {
    e.preventDefault();
    const screenNum = parseInt(e.target.getAttribute('data-screen'));
    if (screenNum === 1) {
      this.setState({ step: 1 });
    } else if (screenNum === 2 && this.validateFirstScreen()) {
      const errorLabel = document.getElementById('validation-error-1');
      const tagsInput = document.getElementsByClassName(
        'ReactTags__tagInputField'
      )[0];
      if (tagsInput.value !== '') {
        errorLabel.innerHTML = I18n.t('ideas.modal.withoutEnter');
        errorLabel.classList.remove('hidden');
      } else {
        this.setState({ step: 2 });
      }
    } else if (screenNum === 3 && this.validateSecondScreen()) {
      this.setState({ step: 3 });
    }
  }

  validateFirstScreen(tags) {
    const titleField = document.getElementById('idea-title-field');
    const titleFieldError = document.getElementById('idea-title-field-error');
    const descriptionField = document.getElementById('idea-description-field');
    const descriptionFieldError = document.getElementById(
      'idea-description-field-error'
    );
    const tagFieldError = document.getElementById('idea-tag-field-error');
    const errorLabel = document.getElementById('validation-error-1');
    const tagsInput = document.getElementsByClassName(
      'ReactTags__tagInputField'
    )[0];
    if (!tags) {
      tags = this.state.tags;
    }

    errorLabel.classList.add('hidden');
    if (titleField.value.trim().length === 0) {
      titleFieldError.innerHTML = I18n.t('ideas.modal.emptyTitle');
      titleFieldError.classList.remove('hidden');
    } else {
      titleFieldError.classList.add('hidden');
    }
    if (descriptionField.value.trim().length === 0) {
      descriptionFieldError.innerHTML = I18n.t('ideas.modal.emptyDescription');
      descriptionFieldError.classList.remove('hidden');
    } else {
      descriptionFieldError.classList.add('hidden');
    }
    if (tags.length === 0 && tagsInput.value === '') {
      tagFieldError.innerHTML = I18n.t('ideas.modal.specifyTag');
      tagFieldError.classList.remove('hidden');
    } else if (tagsInput.value !== '') {
      errorLabel.innerHTML = I18n.t('ideas.modal.withoutEnter');
      errorLabel.classList.remove('hidden');
      tagFieldError.classList.add('hidden');
    } else {
      tagFieldError.classList.add('hidden');
    }

    if (
      titleField.value.trim() !== '' &&
      descriptionField.value.trim() !== '' &&
      tags.length > 0 &&
      titleFieldError.classList.contains('hidden') &&
      descriptionFieldError.classList.contains('hidden')
    ) {
      return true;
    }

    return false;
  }

  validateSecondScreen() {
    const durationField = document.getElementById('idea-duration-field');
    const durationFieldError = document.getElementById(
      'idea-duration-field-error'
    );

    const costField = document.getElementById('idea-cost-field');
    const costFieldError = document.getElementById('idea-cost-field-error');

    const profitField = document.getElementById('idea-profit-field');
    const profitFieldError = document.getElementById('idea-profit-field-error');

    if (parseInt(durationField.value.replace(/,/g, '')) > 300) {
      durationFieldError.innerHTML = I18n.t('ideas.modal.largeTtm');
      durationFieldError.classList.remove('hidden');
    } else if (parseInt(durationField.value.replace(/,/g, '')) <= 0) {
      durationFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      durationFieldError.classList.remove('hidden');
    } else if (durationField.value.trim().length === 0) {
      durationFieldError.innerHTML = I18n.t('ideas.modal.specifyTime');
      durationFieldError.classList.remove('hidden');
    } else {
      durationFieldError.classList.add('hidden');
    }

    if (parseInt(costField.value.replace(/,/g, '')) > 10000000) {
      costFieldError.innerHTML = I18n.t('ideas.modal.errorCost');
      costFieldError.classList.remove('hidden');
    } else if (parseInt(costField.value.replace(/,/g, '')) <= 0) {
      costFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      costFieldError.classList.remove('hidden');
    } else if (costField.value.trim().length === 0) {
      costFieldError.innerHTML = I18n.t('ideas.modal.addTime');
      costFieldError.classList.remove('hidden');
    } else {
      costFieldError.classList.add('hidden');
    }

    if (parseInt(profitField.value.replace(/,/g, '')) > 100000000) {
      profitFieldError.innerHTML = I18n.t('ideas.modal.errorProfit');
      profitFieldError.classList.remove('hidden');
    } else if (parseInt(profitField.value.replace(/,/g, '')) <= 0) {
      profitFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
      profitFieldError.classList.remove('hidden');
    } else if (!profitField.value) {
      profitFieldError.innerHTML = I18n.t('ideas.modal.specifyProfit');
      profitFieldError.classList.remove('hidden');
    } else {
      profitFieldError.classList.add('hidden');
    }

    if (
      durationField.value !== '' &&
      costField.value !== '' &&
      profitField.value !== '' &&
      durationFieldError.classList.contains('hidden') &&
      costFieldError.classList.contains('hidden') &&
      profitFieldError.classList.contains('hidden')
    ) {
      return true;
    }

    return false;
  }

  onFilesChange(files) {
    const { dispatch, idea, type } = this.props;
    const { remoteFiles, localFiles } = this.props;

    const newFiles = [];
    Array.prototype.push.apply(newFiles, files);
    Array.prototype.push.apply(newFiles, remoteFiles);
    if (type === 'edit') {
      changeFiles(dispatch, idea.id, idea.files, newFiles);
    } else {
      changeFiles(dispatch, -1, localFiles, files);
    }
  }

  onFilesError(error, file) {
    console.log(`error code ${error.code}: ${error.message}`);
  }

  existInArray = item => {
    const { tags } = this.state;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].text === item) {
        return true;
      }
    }
    return false;
  };

  addTag = item => {
    if (this.existInArray(item)) {
      return;
    }
    const { tags } = this.state;
    tags.push({ id: item, text: item });
    this.setState({ tags });
    if (this.validateFirstScreen(tags)) {
      this.setState({ firstValidated: true });
    } else {
      this.setState({ firstValidated: false });
    }
  };

  previewAttachment = files => {
    const token = localStorage.getItem(ID_TOKEN_KEY) || null;
    return files.map((attach, key) => {
      if (attach.preview.type === 'image') {
        return (
          <Col
            className="mr-2 mb-3 ml-2"
            md={5}
            xs={12}
            key={attach.id}
            onClick={() => this.previewFile(attach)}
          >
            <div className="attachment-container">
              <div className="attachment d-flex">
                <img
                  src={
                    attach.remote
                      ? attach.preview.url + '&token=' + token
                      : attach.preview.url
                  }
                  alt="Profile"
                  className="rounded-circle attachment-img"
                />
              </div>
              <div className="attachment-title mt-1">{attach.name}</div>
            </div>
          </Col>
        );
      }
      return (
        <Col
          className="mr-2 mb-2 ml-2"
          md={5}
          xs={12}
          key={attach.id}
          onClick={() => this.previewFile(attach)}
        >
          <div className="attachment-container">
            <div className="attachment d-flex">
              <i className="far fa-file-pdf" />
            </div>
            <div className="attachment-title mt-1">{attach.name}</div>
          </div>
        </Col>
      );
    });
  };

  render() {
    let { remoteFiles, localFiles, popularTags } = this.props;
    const tagBuf = [];
    popularTags.map(tag => {
      tagBuf.push(tag.name);
    });

    const {
      show,
      step,
      tags,
      firstValidated,
      secondValidated,
      attaches,
      title,
      description,
      expectedCostInCents,
      expectedProfitInCents,
      expectedTtm,
      isPreviewFile,
      selectedFile,
      isPreview,
    } = this.state;
    const token = localStorage.getItem(ID_TOKEN_KEY) || null;
    const tagsBuf = [];
    tags.map(tag => {
      tagsBuf.push(tag.text);
    });
    if (!remoteFiles) remoteFiles = [];
    if (!localFiles) localFiles = [];
    return (
      <div className="idea-block">
        <React.Fragment>
          <Button
            variant="primary"
            className="modal-toggler btn-lg float-right"
            onClick={this.handleShow}
          >
            {I18n.t('ideas.addNew')}
          </Button>

          <Modal
            show={show}
            onHide={this.handleClose}
            id="ideaModal"
            backdrop="static"
          >
            <Modal.Header>
              <Modal.Title>
                {isPreview === false
                  ? I18n.t('ideas.modal.addIdea')
                  : I18n.t('ideas.modal.preview')}
              </Modal.Title>
              <Button
                variant="link"
                className="close pt-4"
                onClick={this.handleClose}
              >
                {I18n.t('ideas.modal.close')} &times;
              </Button>
            </Modal.Header>
            <Modal.Body className="row">
              {!isPreview ? (
                <Col md={{ span: 8, offset: 2 }}>
                  <div className="pr-5 pl-5 pb-4 mb-4 stepper">
                    <Stepper
                      steps={[
                        { title: I18n.t('ideas.modal.basic') },
                        { title: I18n.t('ideas.modal.timeCost') },
                        { title: I18n.t('ideas.modal.file') },
                      ]}
                      circleTop={6}
                      titleTop={12}
                      size={25}
                      circleFontSize={14}
                      titleFontSize={13}
                      defaultTitleColor="#c2d1d9"
                      activeTitleColor="#424b5a"
                      completeTitleColor="#424b5a"
                      defaultColor="#c2d1d9"
                      activeColor="#424b5a"
                      completeColor="#424b5a"
                      defaultBorderColor="#c2d1d9"
                      completeBorderColor="#c2d1d9"
                      activeBorderColor="#c2d1d9"
                      activeStep={step - 1}
                    />
                  </div>

                  <div
                    id="first-screen"
                    className={step === 1 ? 'active' : 'hidden'}
                  >
                    <Form noValidate>
                      <Form.Group>
                        <Form.Label>{I18n.t('ideas.modal.title1')}</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.setInput('title')}
                          ref={e => (this.title = e)}
                          id="idea-title-field"
                          value={this.state.title}
                          placeholder={I18n.t('ideas.modal.ideaName')}
                          required
                        />
                        <div
                          className="field-error text-danger hidden"
                          id="idea-title-field-error"
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>
                          {I18n.t('ideas.modal.description')}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          ref={e => (this.description = e)}
                          onChange={this.setInput('description')}
                          rows="2"
                          id="idea-description-field"
                          value={this.state.description}
                          placeholder={I18n.t('ideas.modal.tellMore')}
                          required
                        />
                        <div
                          className="field-error text-danger hidden"
                          id="idea-description-field-error"
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>{I18n.t('ideas.modal.tags')}</Form.Label>
                        <ReactTagFilter
                          tags={tags}
                          setTags={tags => this.setTags(tags)}
                        />
                        <small className="tags-info">
                          {I18n.t('ideas.modal.tagAdd')}
                        </small>
                        <div
                          className="field-error text-danger hidden"
                          id="idea-tag-field-error"
                        />
                      </Form.Group>
                      <b className="d-inline-block mt-2">
                        {I18n.t('ideas.modal.popularTag')}
                      </b>
                      <FiltersTag
                        buttons={tagBuf}
                        addTag={this.addTag}
                        type="popular"
                        tags={tagsBuf}
                      />
                      <br />
                      <div
                        className="alert alert-danger hidden"
                        id="validation-error-1"
                      />
                      <Col md={4} xs="auto" className="pull-right">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className={
                            firstValidated
                              ? 'text-uppercase next-btn mb-5 mt-4 modal-next active-next-btn'
                              : 'text-uppercase next-btn mb-5 mt-4 modal-next'
                          }
                          data-screen={2}
                          onClick={e => this.handleNextScreen(e)}
                        >
                          {I18n.t('ideas.modal.specificTime')}
                        </Button>
                      </Col>
                      <span className="clearfix" />
                    </Form>
                  </div>

                  <div
                    id="second-screen"
                    className={step === 2 ? 'active' : 'hidden'}
                  >
                    <Form.Group>
                      <Form.Label>
                        {I18n.t('ideas.modal.timeToMarket')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        onChange={this.setInput('expectedTtm')}
                        ref={e => (this.timeMarket = e)}
                        id="idea-duration-field"
                        placeholder={I18n.t('ideas.modal.estimateDuration')}
                        value={
                          expectedTtm !== 0 ? numberWithCommas(expectedTtm) : ''
                        }
                        required
                      />
                      <div
                        className="field-error text-danger hidden"
                        id="idea-duration-field-error"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>
                        {I18n.t('ideas.modal.estimateCost')}
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <span className="input-group-text">
                            <b>{this.props.dollar}</b>
                          </span>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          ref={e => (this.costMarket = e)}
                          placeholder="0"
                          aria-label="Amount (to the nearest dollar)"
                          id="idea-cost-field"
                          value={
                            expectedCostInCents !== 0
                              ? numberWithCommas(expectedCostInCents)
                              : ''
                          }
                          onChange={this.setInput('expectedCostInCents')}
                        />
                      </InputGroup>
                      <div
                        className="field-error text-danger hidden"
                        id="idea-cost-field-error"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>
                        {I18n.t('ideas.modal.estimateProfit')}
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <span className="input-group-text">
                            <b>{this.props.dollar}</b>
                          </span>
                        </InputGroup.Prepend>
                        <Form.Control
                          type="text"
                          ref={e => (this.profitMarket = e)}
                          placeholder="0"
                          aria-label="Amount (to the nearest dollar)"
                          id="idea-profit-field"
                          value={
                            expectedProfitInCents !== 0
                              ? numberWithCommas(expectedProfitInCents)
                              : ''
                          }
                          onChange={this.setInput('expectedProfitInCents')}
                        />
                      </InputGroup>
                      <div
                        className="field-error text-danger hidden"
                        id="idea-profit-field-error"
                      />
                    </Form.Group>

                    <div
                      className="alert alert-danger hidden"
                      id="validation-error-5"
                    />
                    <Row className="bottom-controls">
                      <Col md={4} xs={3}>
                        <a
                          href="#"
                          className="modal-next"
                          data-screen={1}
                          onClick={e => this.handleNextScreen(e)}
                        >
                          <i className="fas fa-chevron-left mt-3" />
                          &nbsp;
                          {I18n.t('ideas.modal.backtoBasic')}
                        </a>
                      </Col>
                      <Col md={{ span: 4, offset: 4 }} xs={3}>
                        <Button
                          type="submit"
                          variant="primary"
                          className={
                            secondValidated
                              ? 'next-btn mb-5 modal-next active-next-btn text-uppercase'
                              : 'next-btn mb-5 modal-next text-uppercase'
                          }
                          data-screen={3}
                          onClick={e => this.handleNextScreen(e)}
                        >
                          {I18n.t('ideas.modal.addFile')}
                        </Button>
                      </Col>
                    </Row>
                    <span className="clearfix" />
                  </div>

                  <div
                    id="third-screen"
                    className={step === 3 ? 'active' : 'hidden'}
                  >
                    <center>
                      <span className="skip-file-text">
                        {I18n.t('ideas.modal.skipFile')}
                      </span>
                      <div className="upload-container mt-2 mb-5">
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
                            '.xlsx',
                          ]}
                          multiple
                          maxFiles={10}
                          maxFileSize={3145728}
                          minFileSize={0}
                          clickable
                        >
                          <Button
                            variant="outline-primary"
                            className="text-uppercase mb-3 upload-btn"
                          >
                            <i className="fas fa-paperclip mr-1" />
                            &nbsp;{I18n.t('ideas.modal.attach')}
                          </Button>
                        </Files>
                        <small
                          className="font-10 d-block mb-4"
                          style={{ color: '#8a8a8a' }}
                        >
                          {I18n.t('ideas.modal.uploadFiles')}
                        </small>
                        {remoteFiles.length + localFiles.length > 0 ? (
                          <div className="mb-2">
                            {I18n.t('ideas.modal.attached')}:
                          </div>
                        ) : (
                          <div />
                        )}
                        {remoteFiles.length > 0
                          ? remoteFiles.map((attach, key) => (
                              <span key={key} className="file-name d-block">
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
                              <span key={key} className="file-name d-block">
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
                    </center>
                    <Row className="bottom-controls font-weight-bold">
                      <Col md={4} xs={6}>
                        <a
                          href="#"
                          className="modal-next"
                          data-screen={2}
                          onClick={e => this.handleNextScreen(e)}
                        >
                          <i className="fas fa-chevron-left mt-3" />{' '}
                          {I18n.t('ideas.modal.backToTime')}
                        </a>
                      </Col>
                      <Col md={{ span: 4, offset: 4 }} xs={6}>
                        <Button
                          variant="primary"
                          size="lg"
                          className="text-uppercase next-btn mb-5 pt-2 active-next-btn"
                          onClick={() => {
                            this.handleShowPreview();
                          }}
                        >
                          {I18n.t('ideas.modal.previewBtn')}
                        </Button>
                      </Col>
                    </Row>
                    <span className="clearfix" />
                  </div>
                </Col>
              ) : (
                <Col className="pr-4 pl-4">
                  <center className="mb-2">
                    <h4>
                      <i className="fas fa-check-circle" />
                    </h4>
                    <b>{I18n.t('ideas.modal.great')}</b>
                    <div className="check-submission-text">
                      {I18n.t('ideas.modal.checkSubmission')}
                    </div>
                  </center>
                  <div>
                    <p className="mb-1"> {I18n.t('ideas.modal.title1')} </p>
                    <Col
                      sm={12}
                      md={12}
                      xs="auto"
                      className="idea-title m-0 p-0"
                    >
                      {title}
                    </Col>
                    <p className="mb-1 mt-3">
                      {I18n.t('ideas.modal.description')}{' '}
                    </p>
                    <Col
                      sm={12}
                      md={12}
                      xs="auto"
                      className="idea-desc m-0 p-0"
                    >
                      {description}
                    </Col>
                  </div>
                  <Row className="mt-4">
                    <Col md={6}>
                      <Row>
                        <div className="idea-features mb-4 ml-2">
                          <ul>
                            <li className="mr-4">
                              <span className="float-left mr-2">
                                <div className="icon-holder">
                                  <i className="far fa-clock" />
                                </div>
                              </span>
                              <span className="float-right">
                                {' '}
                                {I18n.t('ideas.modal.timeToMarket')}
                                <br />
                                {expectedTtm} {I18n.t('ideas.filter.months')}
                              </span>
                              <span className="clearfix" />
                            </li>
                            <li>
                              <span className="float-left mr-2">
                                <div className="icon-holder mt-3">
                                  <i className="far fa-money-bill-alt" />
                                </div>
                              </span>
                              <span className="float-right">
                                <p />
                                {I18n.t('ideas.modal.estimateCost')}:{' '}
                                {this.props.dollar}
                                {expectedCostInCents}
                                <br /> {I18n.t(
                                  'ideas.modal.estimateProfit'
                                )}: {this.props.dollar}
                                {expectedProfitInCents} /{' '}
                                {I18n.t('ideas.filter.year')}
                              </span>
                              <span className="clearfix" />
                            </li>
                          </ul>
                        </div>
                      </Row>
                    </Col>
                    <Col md={6} className="mt-3 mb-2">
                      <Row className="ml-0">
                        <div className="mb-2 mr-2">
                          {' '}
                          <b>{I18n.t('ideas.modal.tags')}</b>{' '}
                        </div>
                        <div className="m-0">
                          {tags.map((tag, key) => {
                            if (key === 0) {
                              return (
                                <span
                                  key={key}
                                  className="btn label-filled ml-2 mb-1"
                                >
                                  {tag.text}
                                </span>
                              );
                            }
                            return (
                              <span
                                key={key}
                                className="btn label-bordered ml-1 mb-1"
                              >
                                {tag.text}
                              </span>
                            );
                          })}
                        </div>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    {remoteFiles.length + localFiles.length > 0 ? (
                      <Col md={1} className="mr-0 mb-2">
                        <b>{I18n.t('ideas.modal.file')}</b>
                      </Col>
                    ) : (
                      <Col md={2} className="mr-0 mb-2">
                        <b>{I18n.t('ideas.modal.noFile')}</b>
                      </Col>
                    )}
                    <Row>
                      {this.previewAttachment(remoteFiles)}
                      {this.previewAttachment(localFiles)}
                    </Row>
                  </Row>

                  <Row>
                    <Col
                      md={{ span: 6, offset: 6 }}
                      xs={{ span: 12, offset: 0 }}
                    >
                      <Form>
                        <Form.Group>
                          <InputGroup>
                            <InputGroup.Prepend>
                              <Form.Check
                                custom
                                label=""
                                id="custom-checkbox"
                                onClick={() => this.setAnony()}
                              />
                              <Form.Label className="ml-4 p-1">
                                {I18n.t('ideas.modal.submitAnony')}{' '}
                              </Form.Label>
                            </InputGroup.Prepend>
                          </InputGroup>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>

                  <Row className="bottom-controls mt-2 font-weight-bold">
                    <Col md={{ span: 3, offset: 3 }} xs={6}>
                      <a
                        href="#"
                        onClick={() => {
                          this.handleBackEdit();
                        }}
                      >
                        <i className="fas fa-chevron-left mt-3 mb-3" />{' '}
                        {I18n.t('ideas.modal.backEdit')}
                      </a>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="text-uppercase next-btn mb-5 pt-2 active-next-btn"
                        onClick={() => {
                          this.handleSubmit();
                        }}
                      >
                        {I18n.t('ideas.modal.submitIdea')}
                      </Button>
                    </Col>
                  </Row>
                  <span className="clearfix" />
                </Col>
              )}
            </Modal.Body>
          </Modal>

          {isPreviewFile ? (
            <Modal
              show={isPreviewFile}
              onHide={this.hidePreviewFile}
              id="previewFileModal"
            >
              <Modal.Header>
                <Modal.Title>{selectedFile.name}</Modal.Title>
                <Button
                  variant="link"
                  className="close pt-4"
                  onClick={this.hidePreviewFile}
                >
                  {I18n.t('ideas.modal.close')} &times;
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div className="preview-file">
                  <FileViewer
                    fileType={selectedFile.extension}
                    filePath={
                      (selectedFile.remote ? API_BASE_URI : '') +
                      selectedFile.preview.url
                    }
                  />
                </div>
              </Modal.Body>
            </Modal>
          ) : null}
        </React.Fragment>
      </div>
    );
  }
}

IdeaModal.propTypes = {
  clearFilter: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  dollar: PropTypes.string,
  filter: PropTypes.string,
  idea: PropTypes.object,
  lang: PropTypes.string.isRequired,
  localFiles: PropTypes.array,
  myIdea: PropTypes.any,
  number: PropTypes.number,
  popularTags: PropTypes.array,
  remoteFiles: PropTypes.array,
  setting: PropTypes.object,
  type: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  let localFiles = [];
  let remoteFiles = [];
  if (ownProps.idea != null) {
    const index = state.ideas.ideasArr.findIndex(
      x => x.id === ownProps.idea.id
    );
    if (index !== -1) {
      const ideaFiles = state.ideas.ideasArr[index].files;
      if (ideaFiles !== null) {
        for (const fileIndex in ideaFiles) {
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
    popularTags: state.ideas.popularTags,
    lang: state.i18n.locale,
    number: state.ideas.number,
    dollar: state.users.setting.currency === 'USD' ? '$' : '¥',
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeaModal);
