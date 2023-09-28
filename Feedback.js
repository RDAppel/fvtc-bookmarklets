javascript: (() => {

    const courseId = document.querySelector('#crumb_1')?.innerText.trim().split(' ').slice(0, -1).join('')
    const assignId = document.querySelector('#pageTitleText')?.innerText
    if (!courseId || !assignId) return

    const feedbackId = `feedback-${assignId}-${courseId}`
    const feedbackIframe = document.querySelector('#feedbacktext_ifr')
    const feedbackPanel = feedbackIframe.contentWindow.document.querySelector('#tinymce')

    const expandButton = document.querySelector('#currentAttempt_gradeDataPanelLink')
    if (expandButton.getAttribute('aria-expanded') !== "true") expandButton.click()

    const studentName = document.querySelector('#anonymous_element_19 > span:nth-child(3)')?.innerText.split(' (Attempt')[0]


    const firstName = studentName.split(' ')[1]
    // alert(firstName)
    // return

    const id = 'feedback-snippet'
    const existing = document.querySelector(`#${id}`)
    if (existing) {
        const { display } = window.getComputedStyle(existing, null)
        existing.style.display = (display === 'none') ? 'block' : 'none'
        return
    }

    const setEndOfContenteditable = contentEditableElement => {
        const range = document.createRange()
        range.selectNodeContents(contentEditableElement)
        range.collapse(false)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }

    const c = document.querySelector('body')
    const panel = document.createElement('div')
    panel.id = id
    panel.style.cssText = `display: block; background-color: white; position: fixed; left: 0; right: 0; bottom: 0; height: 30%; border-top: 1px solid black; padding: 3px; z-index: 1000; overflow-y: auto;`
    c.append(panel)

    const displayOption = text => {
        const p = document.createElement('p')
        panel.append(p);
        p.innerText = text;
        const button = document.createElement('button');
        button.innerText = "insert"
        p.append(button)
        button.addEventListener('click', () => {
            setEndOfContenteditable(feedbackPanel)
            feedbackPanel.focus()
            const p = document.createElement('p')
            p.innerText = text
            feedbackPanel.append(p)
        })
    }

    displayOption("test123")
    displayOption("test456")

    //feedbackPanel.innerHTML = ""



    // const textarea = document.createElement('textarea');
    // textarea.style.width = '100%';
    // textarea.style.height = '100%';
    // textarea.style.resize = 'none';
    // textarea.style.padding = '3px';
    // panel.append(textarea);

    // const value = localStorage.getItem(feedbackId);
    // if (value) textarea.value = value;

    // let timeout = null;

    // textarea.addEventListener('keyup', () => {
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => { window.localStorage.setItem(feedbackId, textarea.value); }, 800)
    // });
})();