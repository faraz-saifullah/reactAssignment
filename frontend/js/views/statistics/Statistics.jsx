import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import { fetchTags } from '../../actions/ideas';
import Statistics from '../../components/statistics/Statistics';
import EditIdeaModal from '../../components/EditIdeaModal/EditIdeaModal';

class StatisticView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTags());
  }

  toggleEdit = isEdit => {
    this.setState({ isEdit });
  };

  render() {
    return (
      <Row className="mb-4">
        <Col md={12} className="page-header pl-5 mb-2">
          <h3>{I18n.t('admin.title')}</h3>
        </Col>
        <Col md={12} className="swap inner-main-component">
          <Statistics showEdit={() => this.toggleEdit(true)} />
          {this.state.isEdit && (
            <EditIdeaModal
              show={true}
              handleClose={() => this.toggleEdit(false)}
            />
          )}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    ideasArr: state.ideas.ideasArr,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticView);
