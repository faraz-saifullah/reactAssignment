import React from 'react';
import { Badge } from 'react-bootstrap';
import './FiltersTag.scss';

const colors = [
  '#2d8dfc',
  '#6185ae',
  '#11355f',
  '#f7f7f8',
  '#1C589E',
  '#E0E1E3',
  '#96C6FE',
  '#75818F',
  '#E5F1FF',
  '#495159',
];

export class FiltersTag extends React.Component {
  loadButtons = () => {
    const { buttons, type, page } = this.props;
    if (type === 'tag') {
      return buttons.map((item, key) => (
        <Badge
          key={`${item}`}
          variant="light"
          className="btn-tag"
          style={{ background: colors[0], color: 'white' }}
        >
          {item}
          <span onClick={() => this.props.deleteTag(item)}> x</span>
        </Badge>
      ));
    }
    return buttons.map(item => (
      <Badge
        key={`${item}`}
        onClick={() => this.props.addTag(item)}
        variant="light"
        className="btn-tag"
      >
        {item}
        <span> {this.existInArray(item) ? '✓' : '+'}</span>
      </Badge>
    ));
  };

  existInArray = item => {
    const { tags } = this.props;
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] === item) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { title, page } = this.props;

    return (
      <div className={`filters-tag ${page}`}>
        {title ? <h2>{title}</h2> : ''}
        {this.loadButtons()}
      </div>
    );
  }
}
