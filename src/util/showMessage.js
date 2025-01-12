const showMessage = ({
    message,
    duration = 5000,
    style = {},
    onClear = null
  }, setMessage) => {
    if(!message || typeof setMessage !== 'function'){
        console.error('setMessage must be a fuction and cannot be null');
        return;
    } ;
    

    setMessage({text: message, style});

    if (duration > 0) {
      setTimeout(() => {
        setMessage(null);
        if(onClear) onClear();
      }, duration);
    }
  } 

export default showMessage;