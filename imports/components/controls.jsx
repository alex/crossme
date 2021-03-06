import React from 'react';
import classNames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import { DropdownButton, MenuItem, Modal, Button } from 'react-bootstrap';

import PlayerListContainer from './player_list.jsx';

class RevealControl extends React.Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(eventKey, event) {
    event.currentTarget.blur();
    this.props.doReveal(event.currentTarget.dataset.target);
  }

  render() {
    return (
      <DropdownButton title="Reveal" id="dReveal" onSelect={this.onSelect}>
        <MenuItem data-target="square">Square</MenuItem>
        <MenuItem data-target="word">Word</MenuItem>
        <MenuItem data-target="grid">Grid</MenuItem>
      </DropdownButton>
    );
  }
}

class CheckControl extends React.Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(eventKey, event) {
    event.currentTarget.blur();
    this.props.doCheck(event.currentTarget.dataset.target);
  }

  render() {
    return (
      <DropdownButton title="Check" id="dCheck" onSelect={this.onSelect}>
        <MenuItem data-target="square">Square</MenuItem>
        <MenuItem data-target="word">Word</MenuItem>
        <MenuItem data-target="grid">Grid</MenuItem>
      </DropdownButton>
    );
  }
}

class PencilControl extends React.Component {
  click(e) {
    this.props.onSetPencil(e.currentTarget.dataset.pencil === 'true');
  }

  render() {
    return (
      <div className="btn-group">
        <button
          data-pencil="false"
          className={classNames('btn', { active: !this.props.isPencil })}
          onClick={this.click.bind(this)}
        >
          Pen
        </button>
        <button
          data-pencil="true"
          className={classNames('btn', { active: this.props.isPencil })}
          onClick={this.click.bind(this)}
        >
          Pencil
        </button>
      </div>
    );
  }
}

const PencilControlContainer = withTracker(() => {
  return {
    isPencil: Session.get('pencil'),
    onSetPencil: p => (Session.set('pencil', p)),
  };
})(PencilControl);

class RebusControl extends React.Component {
  click() {
    Session.set('rebus', true);
  }

  render() {
    return (
      <div className="btn-group">
        <button
          className="btn"
          onClick={this.click.bind(this)}
        >
          Rebus
        </button>
      </div>
    );
  }
}

class KeyboardShortcuts extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <a role="button" className="sidebar-link" onClick={this.open.bind(this)}>Keyboard Shortcuts</a>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Body>
            <div className="contents">
              <table>
                <tbody>
                  <tr>
                    <th>&lt;Alt&gt;+p</th>
                    <td>Toggle pencil/pen</td>
                  </tr>
                  <tr>
                    <th>Arrows</th>
                    <td>Move+toggle direction</td>
                  </tr>
                  <tr>
                    <th>TAB</th>
                    <td>Next clue</td>
                  </tr>
                  <tr>
                    <th>Enter</th>
                    <td>Toggle direction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

class UserPreferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }


  isSettingChecked(setting, value, isDefault) {
    const curValue = this.props.currentUser.profile[setting];
    if (!setting) {
      return isDefault ? 'checked' : '';
    }
    return curValue === value ? 'checked' : '';
  }

  updateSetting(e) {
    const target = $(e.currentTarget);
    const inputName = target.attr('name');
    if (target.context.checked) {
      const inputValue = target.attr('value');
      Meteor.call('updateSetting', inputName, inputValue);
    } else {
      Meteor.call('updateSetting', inputName, false);
    }
  }

  render() {
    if (this.props.currentUser) {
      const onChange = this.updateSetting.bind(this);
      return (
        <div>
          <a role="button" className="sidebar-link" onClick={this.open.bind(this)}>Settings</a>
          <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
            <Modal.Header>
              <Modal.Title>Solving Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="form">
                <h5>After changing direction with the arrow keys:</h5>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="settingArrows"
                      id="inputSettingArrowsStay"
                      value="stay"
                      checked={this.isSettingChecked('settingArrows', 'stay', true)}
                      onChange={onChange}
                    />
                    Stay in the same square
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="settingArrows"
                      id="inputSettingArrowsMove"
                      value="move"
                      checked={this.isSettingChecked('settingArrows', 'move', false)}
                      onChange={onChange}
                    />
                    Move in the direction of the arrow
                  </label>
                </div>

                <h5>Within a word:</h5>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="settingWithinWord"
                      id="inputSettingWithinWordSkip"
                      value="skip"
                      checked={this.isSettingChecked('settingWithinWord', 'skip', true)}
                      onChange={onChange}
                    />
                    Skip over filled squares
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="settingWithinWord"
                      id="inputSettingWithinWordOverwrite"
                      value="overwrite"
                      checked={this.isSettingChecked('settingWithinWord', 'overwrite', false)}
                      onChange={onChange}
                    />
                    Overwrite filled in squares
                  </label>
                </div>

                <h5>At the end of a word:</h5>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="settingEndWordBack"
                      id="inputSettingEndWordBack"
                      value="back"
                      checked={this.isSettingChecked('settingEndWordBack', 'back', false)}
                      onChange={onChange}
                    />
                    Jump back to first blank in the word (if any)
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="settingEndWordNext"
                      id="inputSettingEndWordNext"
                      value="next"
                      checked={this.isSettingChecked('settingEndWordNext', 'next', false)}
                      onChange={onChange}
                    />
                    Jump to the next word (if no next blank)
                  </label>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
    return null;
  }
}

export default class Sidebar extends React.Component {
  render() {
    return (
      <div id="controls">
        <ul className="nav nav-pills nav-stacked">
          <li>
            <RevealControl doReveal={this.props.doReveal} />
          </li>
          <li>
            <CheckControl doCheck={this.props.doCheck} />
          </li>
          <li>
            <PencilControlContainer />
          </li>
          <li>
            <RebusControl />
          </li>
          <li className="player-label"> Now playing:</li>
          <li>
            <PlayerListContainer gameId={this.props.gameId} />
          </li>
        </ul>
        <KeyboardShortcuts />
        <UserPreferences currentUser={this.props.currentUser} />
      </div>
    );
  }
}
