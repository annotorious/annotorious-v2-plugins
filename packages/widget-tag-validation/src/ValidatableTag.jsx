import React from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';
import { Checkmark, Cross } from './Icons';

const ValidatableTag = props => {

  const [ isConfirmed, setIsConfirmed ] = useState(props.body.confirmed);

  const [ buttonsVisible, setButtonsVisible ] = useState(false);

  useEffect(_ => {
    const updatedBody = { ...props.body };
    
    if (isConfirmed)
      updatedBody.confirmed = true;
    else
      delete updatedBody.confirmed;

    props.onUpdateConfirmation(props.body, updatedBody);
  }, [ isConfirmed ]);

  const toggleConfirmed = () => {
    setIsConfirmed(!isConfirmed);
    setButtonsVisible(false);
  } 

  const reject = () => 
    props.onReject(props.body);

  return (
    <div 
      className={isConfirmed ? 'validatable-tag confirmed' : 'validatable-tag'}
      onMouseMove={() => setButtonsVisible(true)}
      onMouseLeave={() => setButtonsVisible(false)}>

      <span className="label">{ props.body.value }</span>

      <div className="validation-buttons" style={buttonsVisible ? {opacity: 1} : {}}>
        <div 
          className="validation-button confirm" 
          onClick={toggleConfirmed}>
          <Checkmark width={24} height={24} />
        </div>
        
        <div 
          className="validation-button reject"
          onClick={reject}>
          <Cross width={22} height={22} />
        </div>
      </div>
    </div>
  )

}

export default ValidatableTag;