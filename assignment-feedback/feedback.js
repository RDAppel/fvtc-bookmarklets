javascript: (() => {

	const id = 'feedback-panel'
    const existing = document.querySelector(`#${id}`)
    if (existing) {
        const { display } = window.getComputedStyle(existing, null)
        existing.style.display = (display === 'none') ? 'block' : 'none'
        return
    }

    const courseId = document.querySelector('#crumb_1')?.innerText.trim().split(' ').slice(0, -1).join(' ')
    const assignId = document.querySelector('#pageTitleText')?.innerText
    if (!courseId || !assignId) return

	//console.log({ courseId, assignId })

	// apply styles
	const css = `
		#feedback-panel{display:flex;flex-direction:row;justify-content:space-between;align-content:stretch;gap:4px;background-color:white;position:fixed;left:0;right:412px;bottom:0;height:30%;border:1px solid darkgray;padding:12px 48px;z-index:1000;}
		#feedback-panel a{underline;cursor:pointer;}
		#feedback-panel a:hover{text-decoration:underline;}
		.feedback-panel-inner {background-color:#eee;padding:12px;margin-bottom:12px;flex-grow:1;}
		.feedback-panel-inner .items {height:75%;overflow-y:scroll;}
		.feedback-panel-inner p {margin:2px;}
		.feedback-panel-inner .title {font-weight:bold;border-bottom:1px solid black;padding-bottom:2px;margin-bottom:4;text-align:center;}
		.feedback-panel-inner button {margin-top:12px;}
	`
	
	const style = document.createElement('style')
	if (style.styleSheet) style.styleSheet.cssText = css
	else style.appendChild(document.createTextNode(css))
	document.querySelector('head').appendChild(style)


	// load feedback from local storage
	const feedbackKeys = {
		"General": "generalFeedback",
		"Course": `courseFeedback-${courseId}`,
		"Assignment": `assignmentFeedback-${assignId}-${courseId}`
	}

	const getFeedback = type => {
		return JSON.parse(localStorage.getItem(feedbackKeys[type])) || []
	}

	const updateFeedback = (type, feedback) => {
		localStorage.setItem(feedbackKeys[type], JSON.stringify(feedback))
	}
		
    //const feedbackId = `feedback-${assignId}-${courseId}`
    const feedbackIframe = document.querySelector('#feedbacktext_ifr')
    const feedbackPanel = feedbackIframe.contentWindow.document.querySelector('#tinymce')

    const expandButton = document.querySelector('#currentAttempt_gradeDataPanelLink')
    if (expandButton.getAttribute('aria-expanded') !== "true") expandButton.click()

    const studentName = document.querySelector('#panelbutton2 > div > div.user-navigator > div.students-pager > h3 > span:nth-child(3)')?.innerText.split(' (Attempt')[0]

    const firstName = studentName.split(' ')[0]

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
	panel.classList.add('feedback-panel')
    c.append(panel)

    const displayOption = (text, parent) => {
		text = text.trim().replace("{{firstName}}", firstName)

        const p = document.createElement('p')
        parent.append(p);

		const a = document.createElement('a')
		p.append(a)

		a.innerText = text
		a.addEventListener('click', () => {
			setEndOfContenteditable(feedbackPanel)
			feedbackPanel.focus()
			const p = document.createElement('p')
			p.innerText = text
			feedbackPanel.append(p)

			const firstP = feedbackPanel.querySelector('p')
			const innerText = firstP.innerText
			if (innerText.trim() === '') firstP.remove()
		})
    }

	
	Object.keys(feedbackKeys).forEach(title => {
		const div = document.createElement('div')
		div.classList.add('feedback-panel-inner')
		panel.append(div)

		const titleDiv = document.createElement('div')
		titleDiv.innerText = `${title} Feedback`
		div.append(titleDiv)
		titleDiv.classList.add('title')

		const itemsDiv = document.createElement('div')
		div.append(itemsDiv)
		itemsDiv.classList.add('items')

		// display existing feedback
		getFeedback(title).forEach(text => displayOption(text, itemsDiv))

		const button = document.createElement('button')
		button.innerText = `New ${title} Feedback`
		button.addEventListener('click', () => {
			const text = window.prompt(`Enter feedback text (use {{firstName}} to insert student's first name)`)
			if (!text) return
			displayOption(text, itemsDiv)
			updateFeedback(title, [...getFeedback(title), text])
		})
		div.append(button)
	})
})()