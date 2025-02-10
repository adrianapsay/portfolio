import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';
const list_projects = await fetchJSON('/lib/projects.json');
const isProjectsPage = window.location.pathname.includes('/projects/');
const projectsContainer = document.querySelector('.projects');

if (projectsContainer) {
    if (isProjectsPage) {
        renderProjects(list_projects, projectsContainer, 'h2');
    } else {
        const latestProjects = list_projects.slice(0, 3);
        renderProjects(latestProjects, projectsContainer, 'h2');
    }
}
const githubData = await fetchGitHubData('adrianapsay');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
      `;
  }