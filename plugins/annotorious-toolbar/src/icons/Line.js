export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <line x1="10" y1="50" x2="60" y2="10"></line>
      <g class="handles">
        <circle cx="55" cy="14" r="5"></circle>
        <circle cx="12" cy="47" r="5"></circle>
      </g>
    </g>
  `;

  return svg;
}