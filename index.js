const MAX_SESSION_TIME = 300000; // 5min
const LIMIT = 10; // max length for time array
let enterTime = [];

let dateInMs = new Date().getTime().toString();

// variant 1
const setLocalStorage = storageFactory.bind(null, localStorage);
// const setSessionStorage = storageFactory.bind(null, sessionStorage);

function storageFactory(storage, key, value) {
  return storage.setItem(key, value.toString());
}

// variant 2
// const setLocalStorage = storageFactory.bind(localStorage);
// const setSessionStorage = storageFactory.bind(sessionStorage);

// function storageFactory(key, value) {
//   return this.setItem(key, value);
// }

// variant 3
// const setLocalStorage = storageFactory(localStorage);
// const setSessionStorage = storageFactory(sessionStorage);

// function storageFactory(storage) {
//   return function (key, value) {
//     return storage.setItem(key, value);
//   }
// }
// or (storageFactory as arrow func)
// const storageFactory = (storage) => (key, value) => storage.setItem(key, value);


const setNotification = (data) => {
  document.dispatchEvent(new CustomEvent('notification', { detail: { data } }));
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    const oldEnterTime = localStorage.getItem('enterTime');
    let sessionNum = localStorage.getItem('sessionNum');
   
    if (oldEnterTime !== null) {
      const oldEnterTimeArray = oldEnterTime.split(",");
      const arrayLength = oldEnterTimeArray.length;
      
      if (dateInMs - oldEnterTimeArray[arrayLength - 1] >= MAX_SESSION_TIME) {
        setNotification('Приветствуем снова у нас на странице!)');
        sessionNum = +sessionNum + 1;
  
        localStorage.setItem('sessionNum', sessionNum);
      }

      if (oldEnterTimeArray.length === LIMIT) {
        oldEnterTimeArray.splice(0, 1 );
      }
      
      enterTime = [...oldEnterTimeArray, dateInMs];
  
    } else {
      localStorage.setItem('sessionNum', '1');
      enterTime = [dateInMs];
    }
  
    console.log('Number of enter:', sessionNum);
    console.log(enterTime);
  
    // if we call storageFactory with three params without bind
    // storageFactory(localStorage, 'date', dateInMs);
    // storageFactory(sessionStorage, 'date', dateInMs);
  
    // call all variants
    setLocalStorage('enterTime', enterTime);
    setLocalStorage('sessionNum', sessionNum);
  }
  
  catch (domException) {
    if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(domException.name)) {
      localStorage.clear();
    }
  }
});
