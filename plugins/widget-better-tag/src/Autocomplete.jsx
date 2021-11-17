import React, { useRef } from 'react';

const Autocomplete = props => {

  const element = useRef();

  const suggestions = [];

  return (
    <div className="r6o-autocomplete" ref={element}>
      <div>
        <input 
          placeholder={props.placeholder} />
      </div>
      <ul>
        {suggestions.length > 0 && suggestions.map((item, index) => (
          <li style={
                highlightedIndex === index
                  ? { backgroundColor: '#bde4ff' }
                  : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}>
            {item.label ? item.label : item}
          </li>
        ))}
      </ul>
    </div>
  )
}


export default Autocomplete;