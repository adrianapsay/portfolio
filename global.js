console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = Array.from($$("nav a"));
// console.log(navLinks);

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// if (currentLink) {
// currentLink.classList.add('current');
// }

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/adrianapsay', title: 'GitHub Profile' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    
    if (a.host != location.host) {
        a.target = "_blank"
    }
    
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select id="theme-switch">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
      </label>`
);

let select = document.querySelector('#theme-switch');

const savedScheme = localStorage.colorScheme || 'light dark';
document.documentElement.style.setProperty('color-scheme', savedScheme);
select.value = savedScheme;

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
  });


let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
    event.preventDefault();
  
    let data = new FormData(form);
    let url = form.action + '?';
    let params = [];
  
    for (let [name, value] of data) {
      params.push(`${name}=${encodeURIComponent(value)}`);
    }
  
    url += params.join('&');
  
    console.log('Generated URL:', url);
  
    location.href = url;
  });

export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      // console.log(url)
      // console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    // console.log(response)
    const data = await response.json();
    return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

// // Create an async function to load projects and call fetchJSON (works)
// (async function loadProjects() {
//     const data = await fetchJSON('../lib/projects.json');
//     console.log(data);
// })();



export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Your code will go here
  // Check if containerElement is valid DOM element
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    console.error('Invalid container element provided.');
    return;
  }

  // Validate the heading level to ensure it's a valid heading tag
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid heading level "${headingLevel}". Defaulting to 'h2'.`);
      headingLevel = 'h2';  // Fallback to a default heading level
  }

  containerElement.innerHTML = '';

  for (let project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
      <p class="project-year">Year: ${project.year}</p>
    `;
    containerElement.appendChild(article);
  }
}


// // testing different headingLevels (works)
// (async function loadProjects() {
//     // Fetch projects from the JSON file
//     const projects = await fetchJSON('../lib/projects.json');

//     // Select the container element (targeting the existing '.projects' div)
//     const container = document.querySelector('.projects');

//     // Render the projects
//     renderProjects(projects, container, 'h2');
// })();

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
