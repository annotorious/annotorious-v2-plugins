import React from 'preact/compat';
import TagAutocomplete from './TagAutocomplete';

// We can later extend this for URI-based tags
const renderSuggestion = suggestion => 
  <div>{ suggestion }</div>

const TagInput = props => {

  const onKeyDown = evt => {
    if (evt.which === 13) { // Enter
      if (evt.ctrlKey)
        props.onCtrlEnter();
      else
        props.onEnter();
    }
  }

  return (
    <div className="tag-input">
      { props.visible && 
        <TagAutocomplete 
          content={props.value}
          placeholder="Add tag..."
          onChange={props.onChange}
          onKeyDown={onKeyDown} 
          onSelectSuggestion={props.onSelectSuggestion}
          vocabulary={props.vocabulary || []} />
      }
    </div>
  )

}

export default TagInput;