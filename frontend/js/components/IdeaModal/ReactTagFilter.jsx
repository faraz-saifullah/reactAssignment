import { WithContext as ReactTags } from 'react-tag-input';
import React from 'react';
import PropTypes from 'prop-types';

export class ReactTagFilter extends React.Component {
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
    const KeyCodes = {
      comma: 188,
      enter: 13,
    };
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    return (
      <div>
        <ReactTags
          tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          // placeholder={tags.length > 0 ? '' : I18n.t('ideas.modal.addTopic')}
          required
        />
      </div>
    );
  }
}

ReactTagFilter.propTypes = {
  setTags: PropTypes.func,
  tags: PropTypes.array,
};
