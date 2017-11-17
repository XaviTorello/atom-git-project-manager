'use babel';

import GitProjectsListView from './git-projects-list-view';
import { CompositeDisposable } from 'atom';

export default {

  gitProjectsListView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.gitProjectsListView = new GitProjectsListView(state.gitProjectsListViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gitProjectsListView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-projects-list:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gitProjectsListView.destroy();
  },

  serialize() {
    return {
      gitProjectsListViewState: this.gitProjectsListView.serialize()
    };
  },

  toggle() {
    console.log('GitProjectsList was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
