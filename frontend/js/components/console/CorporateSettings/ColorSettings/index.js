import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Row, Col, ListGroup, Modal } from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import Color from './Color/index';
import { updateColor } from '../../../../actions/admin';
import Color1Widget from './Color/Color1Widget/index';
import Color2Widget from './Color/Color2Widget/index';
import Color3Widget from './Color/Color3Widget/index';

class ColorSettings extends React.Component {
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

  resetPalette = () => {
    const { dispatch } = this.props;
    const color_object = {
      color1: '2D8DFC',
      color2: '333333',
      color3: 'FAFAFA',
    };
    this.setState({
      show: !this.state.show,
    });
    dispatch(updateColor(color_object));
  };

  render() {
    const { setting } = this.props;
    const { color1, color2, color3 } = setting
      ? setting.colorPalette || {}
      : {};
    const color_object = [
      {
        name: 'color1',
        number: 1,
        title: I18n.t('console.corporate_settings.color1'),
        description: I18n.t('console.corporate_settings.color1_description'),
        code: color1,
        widget: Color1Widget,
      },
      {
        name: 'color2',
        number: 2,
        title: I18n.t('console.corporate_settings.color2'),
        description: I18n.t('console.corporate_settings.color2_description'),
        code: color2,
        widget: Color2Widget,
      },
      {
        name: 'color3',
        number: 3,
        title: I18n.t('console.corporate_settings.color3'),
        description: I18n.t('console.corporate_settings.color3_description'),
        code: color3,
        widget: Color3Widget,
      },
    ];

    return (
      <React.Fragment>
        <Row className="align-items-center">
          <Col md={6} xs={6}>
            <h6 className="color-settings-title">
              {I18n.t('console.corporate_settings.color_settings')}
            </h6>
          </Col>
          <Col md={6} xs={6} className="pull-right">
            <Button
              size="sm"
              variant="link"
              onClick={this.showModal}
              className="pull-right"
            >
              {I18n.t('console.corporate_settings.clear_palette')}
            </Button>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              {color_object.map(eachColor => (
                <ListGroup.Item key={eachColor.name} className="pl-0 pr-0">
                  <Color color_object={eachColor} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
        <div>
          <Modal
            size="lg"
            centered
            show={this.state.show}
            onHide={this.showModal}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <p>
                {I18n.t('console.corporate_settings.confirm_clear_palette')}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="link"
                className="text-uppercase"
                onClick={this.showModal}
              >
                {I18n.t('console.user_mngt.cancel')}
              </Button>
              <Button
                variant="primary"
                className="text-uppercase"
                onClick={this.resetPalette}
              >
                {I18n.t('console.user_mngt.confirm')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

ColorSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  setting: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    setting: state.users.setting,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorSettings);
