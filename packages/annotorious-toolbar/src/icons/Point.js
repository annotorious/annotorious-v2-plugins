export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <circle cx="36" cy="24" r="11" />
      <g class="handles"><circle cx="36" cy="24" r="4" /></g>
      <line x1="36" y1="3" x2="36" y2="13" />
      <line x1="36" y1="35" x2="36" y2="45" />
      <line x1="15" y1="24" x2="25" y2="24" />
      <line x1="47" y1="24" x2="57" y2="24" />
    </g>
  `;
  
  return svg;
}