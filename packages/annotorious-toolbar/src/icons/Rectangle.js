export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <rect x="12" y="10" width="46" height="30" />
      <g class="handles">
        <circle cx="12"  cy="10"  r="5" />
        <circle cx="58" cy="10"  r="5" />
        <circle cx="12"  cy="40" r="5" />
        <circle cx="58" cy="40" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}