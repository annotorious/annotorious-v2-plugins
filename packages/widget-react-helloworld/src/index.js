import React from 'preact/compat';

import './index.css';

const HelloWorldWidget = props => {
  // We'll be using 'highlighting' as body purpose for 
  // this type of widget
  const currentHighlight = props.annotation ? 
    props.annotation.bodies.find(b => b.purpose === 'highlighting') : null;

  // This function handles body updates as the user presses buttons
  const setHighlightBody = value => () => {
    props.onUpsertBody(currentHighlight, { value, purpose: 'highlighting' });
  }

  return (
    <div className="helloworld-widget">
      { [ 'red', 'green', 'blue' ].map(color => 
        <button 
          key={color}    
          className={currentHighlight?.value === color ? 'selected' : null}
          style={{ backgroundColor: color }}
          onClick={setHighlightBody(color)} />
      )}
    </div>
  )

}

export default HelloWorldWidget;