import React from 'preact/compat';

const HelloWorldWidget = props => {

  const { annotation } = props;

  // We'll be using 'highlighting' as body purpose for 
  // this type of widget
  const currentHighlight = annotation ? 
    annotation.bodies.find(b => b.purpose === 'highlighting') : null;

  // This function handles body updates as the user presses buttons
  const setHighlightBody = value => evt => {
    props.onUpsertBody(currentHighlight, { value, purpose: 'highlighting' });
  }

  // Just a helper to create the color buttons
  const createButton = value =>
    <button 
      // Set class to 'selected' if this button value equals current highlight
      className={currentHighlight?.value === value ? 'selected' : null}

      // Set color value as CSS background
      style={{ backgroundColor: value }}

      // On click add (or replace) the current highlight body
      onClick={setHighlightBody(value)}></button>

  return (
    <div className="helloworld-widget">
      { createButton('red') }
      { createButton('green') }
      { createButton('blue') }
    </div>
  )

}

export default HelloWorldWidget;