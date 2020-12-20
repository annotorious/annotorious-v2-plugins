import React from 'preact/compat';

export const Checkmark = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={props.width} height={props.height}>
      <path fill="currentColor" d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z" />
    </svg>
  )
}

export const Cross = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 386.667 386.667" width={props.width} height={props.height}>
      <path fill="currentColor" d="m386.667 45.564-45.564-45.564-147.77 147.769-147.769-147.769-45.564 45.564 147.769 147.769-147.769 147.77 45.564 45.564 147.769-147.769 147.769 147.769 45.564-45.564-147.768-147.77z"/>
    </svg>
  )
}