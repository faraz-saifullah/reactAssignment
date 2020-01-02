import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Button, Row, Col, Modal, Card } from 'react-bootstrap';

class Color extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  showModal = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  render() {
    const { color_object, colorPalette } = this.props;
    return (
      <div className="mb-3">
        <Row>
          <Col md={12}>
            <Card.Title className="corporate-setting-sub-title">
              {color_object.title}
            </Card.Title>
          </Col>
          <Col md={12}>
            <Card.Text className="corporate-setting-description">
              {color_object.description}
            </Card.Text>
          </Col>
        </Row>
        <Row className="mt-4 align-items-center">
          <Col md={2} xs={3}>
            <div
              className="color-picker"
              style={{
                backgroundColor: `#${color_object.code}`,
              }}
            >
              &nbsp;
            </div>
          </Col>
          <Col md={4} xs={4} className="p-2">
            <b className="color-settings-title"># {color_object.code}</b>
          </Col>
          <Col md={6} xs={5}>
            <Button
              variant="outline-primary"
              className="text-uppercase font-12 action-btn"
              onClick={() => {
                this.showModal();
              }}
            >
              <i className="fas fa-pencil-alt" /> &nbsp;
              <span>{I18n.t('console.corporate_settings.change_color')}</span>
            </Button>
          </Col>
        </Row>
        <Modal
          size="lg"
          centered
          show={this.state.show}
          onHide={this.showModal}
        >
          <Modal.Header closeButton>
            <h4>{color_object.title}</h4>
          </Modal.Header>
          <Modal.Body>
            <color_object.widget
              colorPalette={colorPalette}
              code={this.props.color_object.code}
              onHide={this.showModal}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Color.propTypes = {
  color_object: PropTypes.object,
  colorPalette: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    colorPalette: state.users.setting.colorPalette,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Color);
