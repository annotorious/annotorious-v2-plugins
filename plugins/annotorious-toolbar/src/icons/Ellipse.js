export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <ellipse cx="35" cy="25" rx="30" ry="19" />
      <g class="handles">
        <circle cx="35" cy="6"  r="5" />
        <circle cx="5" cy="25" r="5" />
        <circle cx="65" cy="25" r="5" />
        <circle cx="35" cy="44" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}