export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <path d="M 45.14,2.37 60.67,20.76 25.33,50.32 9.9,31.94 Z"/>
      <g class="handles">
        <circle cx="45.14" cy="2.37"  r="5" />
        <circle cx="60.67" cy="20.76"  r="5" />
        <circle cx="25.33" cy="50.32" r="5" />
        <circle cx="9.9"   cy="31.94" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}

