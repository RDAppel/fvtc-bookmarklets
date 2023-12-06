javascript: (() => { 
    const autosubmit = true; /* change to 'false' if you don't want to auto-submit */
    document.querySelector('#currentAttempt_grade').value = document.querySelector('#currentAttempt_pointsPossible').innerText.slice(1);
    if (autosubmit) document.querySelector('#currentAttempt_submitButton').dispatchEvent(new Event('click'));
})();