import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// global vars
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
console.log(projectsContainer)
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');

function renderPieChart(projectsGiven) {
    d3.select('svg').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let selectedIndex = -1;
    let svg = d3.select('svg');
    newArcs.forEach((arc, idx) => {
          svg
          .append('path')
          .attr('d', arc)
          .attr('fill', colors(idx))
          .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
      
            svg
              .selectAll('path')
              .attr('class', (_, idx) => (
                (idx === selectedIndex ? 'selected' : '')
              ));
            
            d3.select('.legend')
              .selectAll('li')
              .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
            
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                let selectedYear = newData[selectedIndex].label;
                let filteredProjects = projects.filter((project) => project.year === selectedYear);
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }
          });
    })
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    
    legend
        .selectAll('li')
        .attr('class', (_, idx) => (
            (idx === selectedIndex ? 'selected' : '')
        ));
    });
  }

renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

// let selectedIndex = -1;
// let svg = d3.select('svg');
//   svg.selectAll('path').remove();
//   newArcs.forEach((arc, i) => {
//     svg
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(i))
//       .on('click', () => {
//         selectedIndex = selectedIndex === i ? -1 : i;
  
//         svg
//           .selectAll('path')
//           .attr('class', (_, idx) => (
//             (idx === selectedIndex ? 'selected' : '')
//           ));
        
//         d3.select('.legend')
//           .selectAll('li')
//           .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        
//         if (selectedIndex === -1) {
//             renderProjects(projects, projectsContainer, 'h2');
//         } else {
//             let selectedYear = newData[selectedIndex].label;
//             let filteredProjects = projects.filter((project) => project.year === selectedYear);
//             renderProjects(filteredProjects, projectsContainer, 'h2');
//         }
//       });
//   });

// legend
// .selectAll('li')
// .attr('class', (_, idx) => (
// // TODO: filter idx to find correct legend and apply CSS from above
// ));