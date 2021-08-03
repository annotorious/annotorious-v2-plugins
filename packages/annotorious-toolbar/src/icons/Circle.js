export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <circle cx="35" cy="25" r="23" />
      <g class="handles">
        <circle cx="35" cy="2"  r="5" />
        <circle cx="12" cy="25" r="5" />
        <circle cx="58" cy="25" r="5" />
        <circle cx="35" cy="48" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}