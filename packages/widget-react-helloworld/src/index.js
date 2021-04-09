import React from 'preact/compat';

import './index.css';

const HelloWorldWidget = props => {

  const { annotation } = props;

  // We'll be using 'highlighting' as body purpose for 
  // this type of widget
  const currentHighlight = annotation ? 
    annotation.bodies.find(b => b.purpose === 'highlighting') : null;

  // This function handles body updates as the user presses buttons
  const setHighlightBody = value => () => {
    props.onUpsertBody(currentHighlight, { value, purpose: 'highlighting' });
  }

  return (
    <div className="helloworld-widget">
      { [ 'red', 'green', 'blue' ].map(color => 

        <button 
          key={color}
    
          // Set class to 'selected' if this button value equals current highlight
          className={currentHighlight?.value === color ? 'selected' : null}

          // Set color value as CSS background
          style={{ backgroundColor: color }}

          // On click add (or replace) the current highlight body
          onClick={setHighlightBody(color)} />

    )}
    </div>
  )

}

export default HelloWorldWidget;