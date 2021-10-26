import React from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ValidatableTag from './ValidatableTag';
import TagInput from './TagInput';

import './TagValidatorWidget.scss';

/**
 * Get existing draft tag or create a new, empty one
 */
const getDraftTag = existing => {
  return existing ? existing : {
    type: 'TextualBody', value: '', purpose: 'tagging', confirmed: true, draft: true
  };
};

const TagValidatorWidget = props => {

  // All tags (draft and non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

  // Non-draft tags
  const tags = all.filter(b => !b.draft);

  // Draft tag (if any)
  const draftTag = getDraftTag(all.find(b => b.draft)); 

  const [ showTagInput, setShowTagInput ] = useState(false);

  // Open the tag input field in case there are 0 tags
  useEffect(() => {
    setShowTagInput(tags.length == 0);
  }, [ tags.length ]);

  useEffect(() => {
    // 'Enter' on the popup is handled as OK
    const listener = evt => {
      if (evt.which === 13)
        onCtrlEnter();
    }

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  });

  const onAddTag = () => {
    if (draftTag.value) {
      setShowTagInput(false);

      const { draft, ...tag } = draftTag; 

      props.onUpdateBody(draftTag, tag);
    }
  }

  const onEditDraft = value => {
    const prev = draftTag.value.trim();
    const updated = value.trim();

    if (prev.length === 0 && updated.length > 0) {
      props.onAppendBody({ ...draftTag, value: updated });
    } else if (prev.length > 0 && updated.length === 0) {
      props.onRemoveBody(draftTag);
    } else {
      props.onUpdateBody(draftTag, { ...draftTag, value: updated });
    }
  }

  const onCtrlEnter = tag => {
    setShowTagInput(false);
    props.onSaveAndClose();
  }

  const onSelectSuggestion = value => {
    const { draft, ...tag } = draftTag;
    const updated = { ...tag, value };

    if (draftTag.value) {
      props.onUpdateBody(draftTag, updated);
    } else {
      props.onAppendBody(updated);
    }

    setShowTagInput(false);
  }

  return (
    <div className="r6o-widget r6o-tag-validator">
      <TransitionGroup className="tag-list">
        { tags.map(tag =>
          <CSSTransition key={tag.value} timeout={200}>
            <ValidatableTag 
              body={tag} 
              onUpdateConfirmation={props.onUpdateBody} 
              onReject={props.onRemoveBody} /> 
          </CSSTransition>
        )}
        
        <TagInput 
          vocabulary={props.vocabulary}
          visible={showTagInput}
          value={draftTag.value}
          onChange={onEditDraft}
          onSelectSuggestion={onSelectSuggestion}
          onEnter={onAddTag}
          onCtrlEnter={onCtrlEnter} /> 
      </TransitionGroup>

      <button className="add-tag" onClick={() => setShowTagInput(!showTagInput)}>
        <span>Add Tag</span>
      </button>
    </div>
  )

}

export default TagValidatorWidget;