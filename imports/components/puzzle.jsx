import React from 'react';
import classNames from 'classnames';

/* global Router */

/* eslint-disable import/prefer-default-export */

export class PuzzleGrid extends React.Component {
  cellProps(cell) {
    const cursor = this.props.cursor;
    const props = {
      key: cell._id,
      number: cell.number,
      black: cell.black,
      circled: cell.circled,
      fill: cell.fill,
      selected: (cursor.selected_row === cell.row &&
                 cursor.selected_column === cell.column),
      onClick: () => { this.props.onClickCell(cell); },
    };
    if (cursor.word_across === cell.word_across) {
      if (cursor.selected_direction === 'across') {
        props.inWord = true;
      } else {
        props.otherWord = true;
      }
    }
    if (cursor.word_down === cell.word_down) {
      if (cursor.selected_direction === 'down') {
        props.inWord = true;
      } else {
        props.otherWord = true;
      }
    }

    return props;
  }

  render() {
    /* eslint-disable react/no-array-index-key */
    /*
     * This is a grid indexed by (y,x), so the index here is actually
     * a fine key.
     */
    const rows = this.props.grid.map((row, i) => {
      const cells = row.map(cell => <PuzzleCell {...this.cellProps(cell)} />);
      return (
        <div className="row" key={i}>
          {cells}
        </div>
      );
    });
    /* eslint-enable react/no-array-index-key */
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class PuzzleCell extends React.Component {
  computeClasses() {
    if (this.props.black) {
      return 'filled';
    }
    const classes = {
      circled: this.props.circled,
      selected: this.props.selected,
      inword: this.props.inWord,
      otherword: this.props.otherWord,
      reveal: this.props.fill.reveal,
      wrong: (this.props.fill.checked === 'checking'),
      checked: (this.props.fill.checked === 'checked'),
      correct: (this.props.fill.correct && this.props.letter === this.props.fill.letter),
      pencil: this.props.fill.pencil,
    };

    return classes;
  }

  render() {
    const classes = this.computeClasses();

    return (
      <div role="button" className={classNames('cell', classes)} onClick={this.props.onClick} >
        <div className="circle">
          {this.props.number && (
            <div className="numberlabel">
              {this.props.number}
            </div>
          )}
          <div className="cellbody">
            <div className="fill">
              {this.props.fill.letter}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class Metadata extends React.Component {
  startGame() {
    const id = this.props.puzzle._id;
    Meteor.call('newGame', id, function (error, gotId) {
      if (!error) {
        Router.go('game', { id: gotId });
      }
    });
  }

  render() {
    return (
      <div id="details">
        <div className="title">
          <span className="label label-default">Title</span>
          <span className="value"> {this.props.puzzle.title}</span>
          {this.props.preview && (
            <span>
              <span className="preview label">Preview</span>
              <button className="btn" onClick={this.startGame.bind(this)}>Start Game</button>
            </span>
          )}
        </div>
        <div className="author">
          <span className="label label-default">By</span>
          <span className="value">{this.props.puzzle.author}</span>
        </div>
      </div>
    );
  }
}

export class CurrentClue extends React.Component {
  render() {
    const clue = this.props.clue;
    if (!clue) {
      return null;
    }
    return (
      <div id="theclue">
        <span className="label">
          <span className="number">{clue.number}</span>
          <span className="direction"> {clue.direction}</span>
        </span>
        <span className="text">{clue.text}</span>
        <div className="clear" />
      </div>
    );
  }
}
