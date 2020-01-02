import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { updatePageTitleSuccess } from '../../../../actions/admin';

class Title extends React.Component {
  constructor() {
    super();
    this.state = {
      titleInput: '',
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  changeTitle = (e) => {
    e.preventDefault();
    const { title } = e.target.elements;
    const { dispatch } = this.props;
    const titleInput = title.value.trim();
    this.setState({ titleInput });
    dispatch(updatePageTitleSuccess(titleInput));
  };

  render() {
    const { title } = this.props;
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="corporate-setting-title">
            <h5>{I18n.t('console.corporate_settings.title')}</h5>
          </Card.Title>
          <Card.Text className="corporate-setting-description">
            {I18n.t('console.corporate_settings.title_description')}
          </Card.Text>
          <Form
            noValidate
            validated={false}
            onSubmit={this.changeTitle}
          >
            <Row className="align-items-center">
              <Col md={12}>
                <Form.Label> {I18n.t('console.corporate_settings.title')}</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={this.state.titleInput}
                  placeholder={title}
                  name="title"
                />
              </Col>
              <Col md={12} className="mt-4 text-center">
                <Button
                  type="submit"
                  variant="primary"
                  className="text-uppercase font-12 action-btn text-center"
                >
                  {I18n.t('console.corporate_settings.change_title_button')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

Title.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  title: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    title: state.admin.title,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Title);
