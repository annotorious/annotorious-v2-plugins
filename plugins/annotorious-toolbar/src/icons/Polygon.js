export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <path d='M 5,14 60,5 55,45 18,38 Z' />
      <g class="handles">
        <circle cx="5"  cy="14"  r="5" />
        <circle cx="60" cy="5"  r="5" />
        <circle cx="55"  cy="45" r="5" />
        <circle cx="18" cy="38" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}