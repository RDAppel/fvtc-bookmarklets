javascript: (() => {
	const rtl = localStorage.getItem('right-to-left') || 'false'
	localStorage.setItem('right-to-left', rtl)

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
		#feedback-panel{background-color:white;position:fixed;left:0;right:412px;bottom:0;min-height:30%;border:1px solid darkgray;padding:12px 48px;z-index:1000;}
		#feedback-panel a{underline;cursor:pointer;}
		#feedback-panel a:hover{text-decoration:underline;}
		#feedback-panel-container{display:flex;flex-direction:row;justify-content:space-between;align-content:stretch;gap:4px;width:100%;height:100%;border:0;}
		.feedback-panel-inner {background-color:#eee;padding:12px;margin-bottom:12px;flex-grow:1;min-width:25%;height:100%}
		.feedback-panel-inner .items {min-height:75%;overflow-y:scroll;}
		.feedback-panel-inner p {margin:2px;}
		.feedback-panel-inner p a {margin-right:1em;}
		.feedback-panel-inner .title {font-weight:bold;border-bottom:1px solid black;padding-bottom:2px;margin-bottom:4;text-align:center;}
		.feedback-panel-inner button {margin-top:2px;margin-right:2px;}
		.drop {min-height:20px;background-color:#fff;border:1px solid #777;padding:2px;}
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

	if (!feedbackIframe) return alert('no iframe found')
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

    const body = document.querySelector('body')
    const panel = document.createElement('div')
    panel.id = id
	panel.classList.add('feedback-panel')
    body.append(panel)

	const container = document.createElement('div')
	container.id = 'feedback-panel-container'
	panel.append(container)
	

    const displayOption = (text, parent) => {
		text = text.trim().replace('{{firstName}}', firstName)

		const checkTag = '{{check}}'
		const { length } = checkTag

        const p = document.createElement('p')
        parent.append(p);

		const a = document.createElement('a')
		p.append(a)
		a.innerText = text.replace(checkTag, '')

		const appendFeedback = (submit = false) => {
			setEndOfContenteditable(feedbackPanel)
			feedbackPanel.focus()
			const p = document.createElement('p')
			p.innerText = a.innerText
			feedbackPanel.append(p)

			const firstP = feedbackPanel.querySelector('p')
			const innerText = firstP.innerText
			if (innerText.trim() === '') firstP.remove()

			if (submit) {
				document.querySelector('#currentAttempt_grade').value = document.querySelector('#currentAttempt_pointsPossible').innerText.slice(1)
				document.querySelector('#currentAttempt_submitButton').dispatchEvent(new Event('click'))
			}
		}

		a.addEventListener('click', () => appendFeedback(false))

		if (text.substring(text.length - length) === checkTag) {
			const aCheck = document.createElement('a')
			aCheck.title = 'Add feedback and submit with full points.'
			p.append(aCheck)
			aCheck.innerText = '√'
			aCheck.addEventListener('click', () => appendFeedback(true))
		}

    }

	const download = (content, fileName, type = 'text/plain') => {
		const a = document.createElement('a')
		const file = new Blob([content], { type })
		a.href = URL.createObjectURL(file)
		a.download = fileName
		a.click()
	}

	const keys = Object.keys(feedbackKeys)
	;(rtl === 'true' ? keys.reverse() : keys).forEach(title => {
		const div = document.createElement('div')
		div.classList.add('feedback-panel-inner')
		container.append(div)

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
			const text = window.prompt(`Enter feedback text (use {{firstName}} to insert student's first name). Optionally you can add {{check}} to the end and this will add the ability to auto submit with full credit.`)
			if (!text) return
			displayOption(text, itemsDiv)
			updateFeedback(title, [...getFeedback(title), text])
		})
		div.append(button)
		
		const ieDiv = document.createElement('div')
		ieDiv.classList.add('feedback-import-export')
		div.append(ieDiv)

		const exportBtn = document.createElement('button')
		exportBtn.textContent = 'Export'
		ieDiv.append(exportBtn)
		exportBtn.addEventListener('click', () => {
			const items = JSON.stringify(getFeedback(title))
			download(items, `${title}.json`)
		})

		const deleteBtn = document.createElement('button')
		deleteBtn.textContent = 'Delete All'
		ieDiv.append(deleteBtn)
		deleteBtn.addEventListener('click', () => {
			if (confirm(`Are you sure you want to delete all ${title} Feedback items?`)) {
				updateFeedback(title, [ ])
				itemsDiv.innerHTML = ''
			}
		})

		const importPanel = document.createElement('div')
		const defaultText = 'Import - Drop file here.'
		importPanel.textContent = defaultText
		importPanel.classList.add('drop')
		ieDiv.append(importPanel)
		importPanel.addEventListener('dragover', e => e.preventDefault())
		importPanel.addEventListener('drop', e => {
			e.preventDefault()

			const { dataTransfer } = e
			if (!dataTransfer) return

			const { files } = dataTransfer
			if (!files) return

			[ ...files ].forEach(f => {
				const reader = new FileReader()
				reader.onload = e => {
					try {
						const items = JSON.parse(e.target.result)
						items.forEach(item => displayOption(item, itemsDiv))
						updateFeedback(title, [...getFeedback(title), ...items])
						importPanel.textContent = 'Imported!'
					}
					catch { importPanel.textContent = 'Error!' }
				}
				reader.onerror = () => importPanel.textContent = 'Error!'

				reader.readAsText(f, "UTF-8")
			})
			  
			setTimeout(() => importPanel.textContent = defaultText, 3000)
		})
	})
})()