/* eslint-disable react/no-multi-comp */
import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Modal, Button } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import FileViewer from 'react-file-viewer';
import Files from 'react-files';
import { FiltersTag } from '../FiltersTag';
import { addIdea, removeTemp } from '../../actions/ideas';
import {
  areAllAttachmentsUploaded,
  changeFiles,
  handleAddIdeaError,
} from '../../actions/files';
import { numberWithCommas } from '../../utils';
import '../IdeaModal/IdeaModal.scss';
import './AddNewIdeas.scss';
import { API_BASE_URI, ID_TOKEN_KEY } from '../../const';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class AddNewIdeas extends React.Component {
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
      titlePristine: true,
      descriptionPristine: true,
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
      if (localFiles[i].id == file.id) {
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

  setInput = field => value => {
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
      } else {
        return;
      }
    } else {
      this.setState({
        [field]: value.currentTarget.value,
      });
    }
    if (field === 'title' || field === 'description') {
      const { titlePristine, descriptionPristine } = this.state;
      if (field === 'title' && titlePristine) {
        this.setState({ titlePristine: false });
      } else if (field === 'description' && descriptionPristine) {
        this.setState({ descriptionPristine: false });
      }
      if (this.validateFirstScreen()) {
        this.setState({ firstValidated: true });
      } else {
        this.setState({ firstValidated: false });
      }
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
    const firstScreen = document.getElementById('first-screen');
    const secondScreen = document.getElementById('second-screen');
    const thirdScreen = document.getElementById('third-screen');

    if (screenNum === 1) {
      firstScreen.classList.remove('hidden');
      secondScreen.classList.add('hidden');
      thirdScreen.classList.add('hidden');

      document
        .querySelector('.steppers-list li:nth-child(1)')
        .classList.add('active');
      document
        .querySelector('.steppers-list li:nth-child(2)')
        .classList.remove('active');
      document
        .querySelector('.steppers-list li:nth-child(3)')
        .classList.remove('active');
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
        firstScreen.classList.add('hidden');
        secondScreen.classList.remove('hidden');
        thirdScreen.classList.add('hidden');

        document
          .querySelector('.steppers-list li:nth-child(2)')
          .classList.add('active');
        document
          .querySelector('.steppers-list li:nth-child(3)')
          .classList.remove('active');
        this.setState({ step: 2 });
      }
    } else if (screenNum === 3 && this.validateSecondScreen()) {
      firstScreen.classList.add('hidden');
      secondScreen.classList.add('hidden');
      thirdScreen.classList.remove('hidden');
      this.setState({ step: 3 });

      document
        .querySelector('.steppers-list li:nth-child(3)')
        .classList.add('active');
    }
  }

  validateFirstScreen(tags) {
    const titleField = document.getElementById('idea-title-field');
    const titleFieldError = document.getElementById('idea-title-field-error');

    const descriptionField = document.getElementById('idea-description-field');
    const descriptionFieldError = document.getElementById(
      'idea-description-field-error'
    );

    const errorLabel = document.getElementById('validation-error-1');

    const { titlePristine, descriptionPristine } = this.state;

    if (!tags) {
      tags = this.state.tags;
    }

    errorLabel.classList.add('hidden');

    if (!titlePristine) {
      if (titleField.value.trim().length === 0) {
        titleFieldError.innerHTML = I18n.t('ideas.modal.emptyTitle');
        titleFieldError.classList.remove('hidden');
      } else {
        titleFieldError.classList.add('hidden');
      }
    }

    if (!descriptionPristine) {
      if (descriptionField.value.trim().length === 0) {
        descriptionFieldError.innerHTML = I18n.t(
          'ideas.modal.emptyDescription'
        );
        descriptionFieldError.classList.remove('hidden');
      } else {
        descriptionFieldError.classList.add('hidden');
      }
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
    } else {
      durationFieldError.classList.add('hidden');
    }

    if (parseInt(costField.value.replace(/,/g, '')) > 10000000) {
      costFieldError.innerHTML = I18n.t('ideas.modal.errorCost');
      costFieldError.classList.remove('hidden');
    } else if (parseInt(costField.value.replace(/,/g, '')) <= 0) {
      costFieldError.innerHTML = I18n.t('ideas.modal.negativeValue');
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
      if (tags[i].text == item) {
        return true;
      }
    }
    return false;
  };

  addTag = item => {
    if (this.existInArray(item)) {
    } else {
      const { tags } = this.state;
      tags.push({ id: item, text: item });
      this.setState({ tags });
      if (this.validateFirstScreen(tags)) {
        this.setState({ firstValidated: true });
      } else {
        this.setState({ firstValidated: false });
      }
    }
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
          <button
            className="btn btn-lg custom-btn newidea"
            data-toggle="modal"
            data-target="#addIdeaModal"
            onClick={this.handleShow}
          >
            {I18n.t('ideas.addNew')}
          </button>

          <Modal
            show={show}
            onHide={this.handleClose}
            id="ideaModal"
            backdrop="static"
          >
            <Modal.Header>
              <Modal.Title>
                {isPreview == false
                  ? I18n.t('ideas.modal.addIdea')
                  : I18n.t('ideas.modal.preview')}
              </Modal.Title>
              <button
                type="button"
                className="close pt-4"
                // data-dismiss="modal"
                onClick={this.handleClose}
              >
                {I18n.t('ideas.modal.close')} &times;
              </button>
            </Modal.Header>
            <Modal.Body className="row">
              {!isPreview ? (
                <div className="col-md-8 offset-md-2">
                  <div className="stepper mb-5">
                    <ul className="steppers-list">
                      <li className="active">
                        <center>
                          <a href="#" data-step="1">
                            1
                          </a>
                          <p className="mt-2">{I18n.t('ideas.modal.basic')}</p>
                        </center>
                      </li>
                      <li className={step > 1 ? 'active' : ''}>
                        <center>
                          <a href="#" data-step="2">
                            2
                          </a>
                          <p className="mt-2">
                            {I18n.t('ideas.modal.timeCost')}
                          </p>
                        </center>
                      </li>
                      <li className={step > 2 ? 'active' : ''}>
                        <center>
                          <a href="#" data-step="3">
                            3
                          </a>
                          <p className="mt-2">{I18n.t('ideas.modal.file')}</p>
                        </center>
                      </li>
                    </ul>
                  </div>

                  <div
                    id="first-screen"
                    className={step == 1 ? 'active' : 'hidden'}
                  >
                    <form noValidate>
                      <div className="form-group">
                        <label>{I18n.t('ideas.modal.title1')}</label>
                        <input
                          type="text"
                          onChange={this.setInput('title')}
                          className="form-control"
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
                      </div>

                      <div className="form-group">
                        <label>{I18n.t('ideas.modal.description')}</label>
                        <textarea
                          className="form-control"
                          ref={e => (this.description = e)}
                          onChange={this.setInput('description')}
                          rows="3"
                          id="idea-description-field"
                          value={this.state.description}
                          placeholder={I18n.t('ideas.modal.tellMore')}
                          required
                        />
                        <div
                          className="field-error text-danger hidden"
                          id="idea-description-field-error"
                        />
                      </div>

                      <div className="form-group">
                        <label>{I18n.t('ideas.modal.tags')}</label>
                        <ReactTagFilter
                          tags={tags}
                          setTags={tag => this.setTags(tag)}
                        />
                        <small className="tags-info">
                          {I18n.t('ideas.modal.tagAdd')}
                        </small>
                      </div>
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

                      <button
                        type="submit"
                        className={
                          firstValidated
                            ? 'btn btn-lg specify-btn float-right mb-5 mt-4 modal-next active-next-btn'
                            : 'btn btn-lg specify-btn float-right mb-5 mt-4 modal-next'
                        }
                        data-screen={2}
                        onClick={e => this.handleNextScreen(e)}
                      >
                        {I18n.t('ideas.modal.specificTime')}
                      </button>
                      <span className="clearfix" />
                    </form>
                  </div>

                  <div
                    id="second-screen"
                    className={step == 2 ? 'active' : 'hidden'}
                  >
                    <div className="form-group">
                      <label>{I18n.t('ideas.modal.timeToMarket')}</label>
                      <input
                        type="text"
                        ref={e => (this.timeMarket = e)}
                        placeholder={I18n.t('ideas.modal.estimateDuration')}
                        className="form-control"
                        id="idea-duration-field"
                        value={
                          expectedTtm != 0 ? numberWithCommas(expectedTtm) : ''
                        }
                        onChange={this.setInput('expectedTtm')}
                      />
                      <div
                        className="field-error text-danger hidden"
                        id="idea-duration-field-error"
                      />
                    </div>

                    <div className="form-group">
                      <label>{I18n.t('ideas.modal.estimateCost')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <b>{this.props.dollar}</b>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          ref={e => (this.costMarket = e)}
                          placeholder="0"
                          aria-label="Amount (to the nearest dollar)"
                          id="idea-cost-field"
                          value={
                            expectedCostInCents != 0
                              ? numberWithCommas(expectedCostInCents)
                              : ''
                          }
                          onChange={this.setInput('expectedCostInCents')}
                        />
                      </div>
                      <div
                        className="field-error text-danger hidden"
                        id="idea-cost-field-error"
                      />
                    </div>

                    <div className="form-group">
                      <label>{I18n.t('ideas.modal.estimateProfit')}</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <b>{this.props.dollar}</b>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          ref={e => (this.profitMarket = e)}
                          placeholder="0"
                          aria-label="Amount (to the nearest dollar)"
                          id="idea-profit-field"
                          value={
                            expectedProfitInCents != 0
                              ? numberWithCommas(expectedProfitInCents)
                              : ''
                          }
                          onChange={this.setInput('expectedProfitInCents')}
                        />
                      </div>
                      <div
                        className="field-error text-danger hidden"
                        id="idea-profit-field-error"
                      />
                    </div>

                    <div
                      className="alert alert-danger hidden"
                      id="validation-error-5"
                    />

                    <span className="float-left" />
                    <div className="bottom-controls">
                      <a
                        href="#"
                        className="modal-next"
                        data-screen={1}
                        onClick={e => this.handleNextScreen(e)}
                      >
                        <i className="fas fa-chevron-left mt-3" />{' '}
                        {I18n.t('ideas.modal.backtoBasic')}
                      </a>

                      <span className="float-right">
                        <a
                          href="#"
                          className={
                            secondValidated
                              ? 'btn bordered-btn mb-5 modal-next active-next-btn'
                              : 'btn bordered-btn mb-5 modal-next'
                          }
                          data-screen={3}
                          onClick={e => this.handleNextScreen(e)}
                        >
                          {I18n.t('ideas.modal.addFile')}
                        </a>
                      </span>
                    </div>
                    <span className="clearfix" />
                  </div>

                  <div
                    id="third-screen"
                    className={step == 3 ? 'active' : 'hidden'}
                  >
                    <center>
                      <span>{I18n.t('ideas.modal.skipFile')}</span>
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
                          <a href="#" className="btn upload-btn mb-3">
                            <i className="fas fa-paperclip mr-1" />{' '}
                            {I18n.t('ideas.modal.attach')}
                          </a>
                        </Files>
                        <br />
                        <small className="d-block mb-5">
                          {' '}
                          {I18n.t('ideas.modal.uploadFiles')}{' '}
                        </small>
                        <div className="mb-2">
                          {I18n.t('ideas.modal.attached')}:
                        </div>
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

                    <span className="float-left" />
                    <a
                      href="#"
                      className="modal-next"
                      data-screen={2}
                      onClick={e => this.handleNextScreen(e)}
                    >
                      <i className="fas fa-chevron-left mt-3" />{' '}
                      {I18n.t('ideas.modal.backToTime')}
                    </a>

                    <span className="float-right">
                      <Button
                        variant="primary"
                        className="btn specify-btn mb-5 pt-2 active-next-btn"
                        onClick={() => {
                          this.handleShowPreview();
                        }}
                      >
                        {I18n.t('ideas.modal.previewBtn')}
                      </Button>
                    </span>

                    <span className="clearfix" />
                  </div>
                </div>
              ) : (
                  <div className="col-md-12 pr-4 pl-4">
                    <center>
                      <h4>
                        <i className="fas fa-check-circle" />
                      </h4>
                      <b>{I18n.t('ideas.modal.great')}</b>
                      <p>{I18n.t('ideas.modal.checkSubmission')}</p>
                    </center>
                    <h6 className="idea-title mt-5">{title}</h6>
                    {I18n.t('ideas.modal.description')}
                    <p className="idea-desc pr-3">{description}</p>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="idea-features mt-1 mb-4">
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
                        <br />
                        <div className="row  idea-attachments">
                          <div className="col-md-4">
                            <b>
                              {remoteFiles.length + localFiles.length > 0
                                ? `${I18n.t('ideas.modal.file')}: `
                                : I18n.t('ideas.modal.noFile')}
                            </b>
                          </div>
                        </div>
                        <div className="row idea-attachments">
                          {remoteFiles.map(attach => {
                            if (attach.preview.type == 'image') {
                              return (
                                <div
                                  key={key}
                                  className="col-md-5"
                                  key={attach.id}
                                  onClick={() => this.previewFile(attach)}
                                >
                                  <div className="attachment-container">
                                    <div className="attachment d-flex">
                                      <img
                                        src={
                                          attach.remote
                                            ? `${attach.preview.url}&token=${token}`
                                            : attach.preview.url
                                        }
                                        alt="Profile"
                                        className="rounded-circle attachment-img"
                                      />
                                    </div>
                                    <div className="attachment-title mt-1">
                                      {attach.name}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={key}
                                className="col-md-5"
                                key={attach.id}
                                onClick={() => this.previewFile(attach)}
                              >
                                <div className="attachment-container">
                                  <div className="attachment d-flex">
                                    <i className="far fa-file-pdf" />
                                  </div>
                                  <div className="attachment-title mt-1">
                                    {attach.name}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {localFiles.map((attach, key) => {
                            if (attach.preview.type === 'image') {
                              return (
                                <div
                                  key={key}
                                  className="col-md-5"
                                  key={attach.id}
                                  onClick={() => this.previewFile(attach)}
                                >
                                  <div className="attachment-container">
                                    <div className="attachment d-flex">
                                      <img
                                        src={
                                          attach.remote
                                            ? `${attach.preview.url}&token=${token}`
                                            : attach.preview.url
                                        }
                                        alt="Profile"
                                        className="rounded-circle attachment-img"
                                      />
                                    </div>
                                    <div className="attachment-title mt-1">
                                      {attach.name}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div
                                key={key}
                                className="col-md-5"
                                key={attach.id}
                                onClick={() => this.previewFile(attach)}
                              >
                                <div className="attachment-container">
                                  <div className="attachment d-flex">
                                    <i className="far fa-file-pdf" />
                                  </div>
                                  <div className="attachment-title mt-1">
                                    {attach.name}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <br /> <br />
                      </div>
                      <div className="col-md-6">
                        <b>{I18n.t('ideas.modal.tags')}</b>
                        {tags.map((tag, key) => {
                          if (key == 0) {
                            return (
                              <span key={key} className="btn label-filled ml-2">
                                {tag.text}
                              </span>
                            );
                          }
                          return (
                            <span key={key} className="btn label-bordered">
                              {tag.text}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span className="float-right mt-4 handle-back">
                          <a
                            href="#"
                            onClick={() => {
                              this.handleBackEdit();
                            }}
                          >
                            <i className="fas fa-chevron-left mt-3" />{' '}
                            {I18n.t('ideas.modal.backEdit')}
                          </a>
                        </span>
                        <span className="clearfix" />
                      </div>
                      <div className="col-md-6">
                        <span className="float-left">
                          <div className="custom-control custom-checkbox anony-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="defaultUnchecked"
                              checked={this.state.anony ? 'checked' : ''}
                            />
                            <label
                              className="custom-control-label anony-label"
                              htmlFor="defaultUnchecked"
                              onClick={() => this.setAnony()}
                            >
                              {I18n.t('ideas.modal.submitAnony')}
                            </label>
                          </div>
                          <br />
                          <button
                            className="btn specify-btn mt-1 mb-5 pt-2 active-next-btn"
                            onClick={() => {
                              this.handleSubmit();
                            }}
                          >
                            {I18n.t('ideas.modal.submitIdea')}
                          </button>
                        </span>
                        <span className="clearfix" />
                      </div>
                    </div>
                  </div>
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
                <button
                  type="button"
                  className="close pt-4"
                  // data-dismiss="modal"
                  onClick={this.hidePreviewFile}
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

class ReactTagFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ tags: props.tags });
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
    this.props.setTags(tags.filter((tag, index) => index !== i));
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
    this.props.setTags([...this.state.tags, tag]);
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
    this.props.setTags(newTags);
  }

  render() {
    const { tags } = this.state;

    return (
      <div>
        <ReactTags
          tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          placeholder={tags.length > 0 ? '' : I18n.t('ideas.modal.addTopic')}
        />
      </div>
    );
  }
}

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
    lang: state.i18n.locale,
    remoteFiles,
    popularTags: state.ideas.popularTags,
    number: state.ideas.number,
    lang: state.i18n.locale,
    dollar: state.users.setting.currency == 'USD' ? '$' : '¥',
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewIdeas);
