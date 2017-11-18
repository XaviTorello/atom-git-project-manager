'use babel';

import gitProjectsManagerView from './git-projects-manager-view';
import { CompositeDisposable } from 'atom';

import * as file_utils from './file-utils';

export default {

  gitProjectsManagerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.gitProjectsManagerView = new gitProjectsManagerView(state.gitProjectsManagerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gitProjectsManagerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-projects-manager:refreshProjects': () => this.refresh_projects(),
      'git-projects-manager:openProject': (project) => this.open_project(project)
    }));

    this.refresh_projects();
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gitProjectsManagerView.destroy();
  },

  open_project(project="Empty") {
    console.log("Opening", project);
    atom.open({'pathsToOpen': [project], '.newWindow': true})
  },

  serialize() {
    return {
      gitProjectsManagerViewState: this.gitProjectsManagerView.serialize()
    };
  },

  refresh_projects_list() {
    console.log('Refreshing Projects');

    const basePath = "/home/gisce/projects/";

    if (file_utils.exists(basePath)) {
      const our_projects = file_utils.get_projects(basePath);

      let our_submenus = {
        "label": "Packages",
        "submenu": [
          {
            "label": "Git Projects Manager",
            "submenu": [{type: 'separator'}],
          }
        ]
      };

      for (const a_project in our_projects){
        const a_project_path = our_projects[a_project];

        //Creating openProject commands dinamically
        const command_to_append = 'git-projects-manager:openProject_' + a_project;
        this.subscriptions.add(atom.commands.add('atom-workspace', {
          [command_to_append]: () => this.open_project(a_project_path)
        }));

        //Creating projects submenus dinamically
        our_submenus.submenu[0].submenu.push(
          {
            label: a_project,
            command: 'git-projects-manager:openProject_' + a_project,
          }
        )
        atom.menu.add(our_submenus);
      }

      //see atom.project.rootDirectories[0]

      atom.menu.add([our_submenus]);
    }

    //handle basePath error -> integrate it with promises

    return true;
  },

  refresh_projects() {
    this.refresh_projects_list();
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
