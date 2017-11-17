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
      'git-projects-list:toggle': () => this.toggle(),
      'git-projects-list:open_project': (project) => this.open_project(project)
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

    const basePath = "/home/gisce/projects/";

    if (file_utils.exists(basePath)) {
      const our_projects = file_utils.get_projects(basePath);

      let our_submenus = {
        "label": "Packages",
        "submenu": [
          {
            "label": "Git Projects List",
            "submenu": [],
          }
        ]
      };

      for (const a_project in our_projects){
        const a_project_path = our_projects[a_project];

        our_submenus.submenu[0].submenu.push(
          {
            label: a_project,
            command: 'git-projects-list:open_project',
          }
        )
        atom.menu.add(our_submenus);
      }

      //see atom.project.rootDirectories[0]

      atom.menu.add([our_submenus]);
    }

    //handle basePath error -> integrate it with promises
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
