'use babel';

import GitProjectsListView from './git-projects-list-view';
import { CompositeDisposable } from 'atom';

import * as file_utils from './file-utils';

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

  refreshProjects() {
    console.log('Testing if main folder exists');

    const basePath = "/home/gisce/projects";
    const result = file_utils.exists(basePath);
    console.log("  the result>>",result);
  },

  toggle() {
    this.refreshProjects();

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
