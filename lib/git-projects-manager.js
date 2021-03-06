'use babel';

import { CompositeDisposable } from 'atom';

import * as file_utils from './file-utils';

export default {

    subscriptions: null,

    config: {
        "basePath": {
            "description": "The base directory where to try to find projects",
            "type": "string",
            "default": "~"
        }
    },

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'git-projects-manager:Refresh projects': () => this.refresh_projects(),
        }));

        this.refresh_projects(silent=true);
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    open_project(project) {
        console.debug("Opening", project);
        atom.open({'pathsToOpen': [project], '.newWindow': true})
    },

    serialize() {
        return {
        };
    },

    refresh_projects_list(silent=false) {
        const basePath = atom.config.get('git-projects-manager.basePath').replace("~", process.env.HOME);
        console.debug('Refreshing Projects from', basePath);

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

            for (const a_project in our_projects) {
                const a_project_path = our_projects[a_project];

                //Create openProject commands dinamically
                const command_to_append = 'git-projects-manager:Open project ' + a_project;
                this.subscriptions.add(atom.commands.add('atom-workspace', {
                    [command_to_append]: () => this.open_project(a_project_path)
                }));

                //Create project submenus dinamically
                our_submenus.submenu[0].submenu.push(
                    {
                        label: a_project,
                        command: 'git-projects-manager:Open project ' + a_project,
                    }
                )
            }
            atom.menu.add([our_submenus]);
        } else {
            atom.notifications.addError("Base Path '" + basePath + "' does not exist. Review entered settings!")
            return false;
        }

        (!silent) && atom.notifications.addSuccess("Git projects list refreshed!");
        return true;
    },

    refresh_projects(silent=false) {
        this.refresh_projects_list(silent);
    },

};
