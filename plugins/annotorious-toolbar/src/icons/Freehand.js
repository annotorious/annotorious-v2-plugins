export default () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('viewBox', '0 0 70 50');

  svg.innerHTML = `
    <g>
      <path d="m 34.427966,2.7542372 c 0,0 -22.245763,20.7627118 -16.737288,27.7542378 5.508475,6.991525 27.648305,-15.36017 34.639831,-9.11017 6.991525,6.25 -11.440678,13.665255 -13.983051,25.423729" />
      <g class="handles">
        <circle cx="34.427966" cy="2.7542372"  r="5" />
        <circle cx="38.347458" cy="46.822033" r="5" />
      </g>
    </g>
  `;
  
  return svg;
}