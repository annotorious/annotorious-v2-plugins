import React from 'react';

import Autocomplete from './Autocomplete';

const getDraftTag = existingDraft =>
  existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: 'tagging', draft: true
  };

const BetterTagPlugin = config => props => {

  // All tags (draft + non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(b => b.type === 'TextualBody' && b.purpose === 'tagging') : [];

  // Last draft tag goes into the input field
  const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft)); 

  // All except draft tag
  const tags = all.filter(b => b != draftTag);

  return (
    <div className="r6o-widget r6o-tag">
      { tags.length > 0 &&
        <ul className="r6o-taglist">
          { tags.map(tag =>
            <li key={tag.value} onClick={toggle(tag.value)}>
              <span className="r6o-label">{tag.value}</span>

              {!props.readOnly &&
                <CSSTransition in={showDelete === tag.value} timeout={200} classNames="r6o-delete">
                  <span className="r6o-delete-wrapper" onClick={onDelete(tag)}>
                    <span className="r6o-delete">
                      <CloseIcon width={12} />
                    </span>
                  </span>
                </CSSTransition>
              }
            </li>
          )}
        </ul>
      }

      {!props.readOnly &&
        <Autocomplete />
      }
    </div>
  )

}

export default BetterTagPlugin;