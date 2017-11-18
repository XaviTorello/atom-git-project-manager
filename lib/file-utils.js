'use babel';

const fs = require('fs');

//Check if File/Dir exists
export const exists = (filename) => {
  return fs.existsSync(filename);
};

//Return the content of a directory
export const dir_content = (path) => {
  return fs.readdirSync(path);
};

//Return the git projects inside a directory
export const get_projects = (path) => {
  let the_projects = {};

  const git_project_file = "/.git/index";
  const candidate_projects = dir_content(path);

  for (const i in candidate_projects) {
    const a_candidate = candidate_projects[i];
    const candidate_path = path + "/" + a_candidate;
    const candidate_git = candidate_path + git_project_file;

    // Test if candidate project is a git repo
    if (exists(candidate_git))
      the_projects[a_candidate] = candidate_path;
  }

  return the_projects;
};
