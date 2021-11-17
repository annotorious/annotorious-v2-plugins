import React, { useRef, useState } from 'react';

const Autocomplete = props => {

  const element = useRef();

  const [ value, setValue ] = useState('');

  const suggestions = [];

  const onKeyPress = evt => {
    if (evt.which === 13) {
      setValue('');
      props.onSubmit(value);
    }
  }

  const onChange = evt => {
    setValue(evt.target.value);
  }

  return (
    <div className="r6o-autocomplete" ref={element}>
      <div>
        <input 
          onKeyPress={onKeyPress}
          onChange={onChange}
          value={value}
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