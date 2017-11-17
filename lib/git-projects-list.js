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
    console.log('Refreshing Projects');

    const basePath = "/home/k/projects/";
    const basePath_exists = file_utils.exists(basePath);


    const git_project_file = "/.git/index"
    if (basePath_exists) {
      const candidate_projects = file_utils.dir_content(basePath);
      for (const i in candidate_projects) {
        const a_candidate = candidate_projects[i];
        const candidate_path = basePath + a_candidate + git_project_file;

        const result = file_utils.exists(candidate_path);
        console.log(a_candidate + " is " + result);
      }

    }
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
