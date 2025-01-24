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

const ARE_WE_HOME = document.documentElement.classList.contains('home');
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/adrianapsay', title: 'GitHub', external: true },
  ];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    
    
    a.target = a.host !== location.host ? '_blank' : '_self';
    
    nav.append(a);
    
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
  


