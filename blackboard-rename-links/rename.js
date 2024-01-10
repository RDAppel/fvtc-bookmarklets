
javascript: (() => {

    const id = 'input-panel'
    const existing = document.querySelector(`#${id}`)
    if (existing) {
        const { display } = window.getComputedStyle(existing, null)
        existing.style.display = (display === 'none') ? 'block' : 'none'
        return
    }

    // apply styles
    const css = `
		#input-panel{background-color:white;position:fixed;top:0;left:210px;bottom:0;width:30%;border:1px solid darkgray;padding:12px;z-index:1000;}
		#input-panel button {margin-top:12px;}
        #input-panel textarea {width:100%;height:90%;}
	`

    const style = document.createElement('style')
    if (style.styleSheet) style.styleSheet.cssText = css
    else style.appendChild(document.createTextNode(css))
    document.querySelector('head').appendChild(style)

    const c = document.querySelector('body')
    const panel = document.createElement('div')
    panel.id = id
    panel.classList.add('input-panel')
    c.append(panel)

    const textarea = document.createElement('textarea')
    textarea.id = 'rename-textarea'
    panel.append(textarea)

    const button = document.createElement('button')
    button.textContent = "Run"
    panel.append(button)

    button.addEventListener('click', async () => {
        const newTextItems = textarea.value.split('\n').filter(line => line.trim() !== '')

        if (!newTextItems) return alert('Error: No items entered!')

        const palette = document.querySelector('#courseMenuPalette_contents')
        const { items } = [...palette.querySelectorAll('li')].reduce((acc, cur) => {

            if (cur.classList.contains('divider')) return acc

            if (!acc.started) {
                const started = !!cur.querySelector('span[title="START"]')
                return started ? { started: true, ended: false, items: [cur] } : acc
            }

            if (acc.started && !acc.ended) {
                const ended = !!cur.querySelector('span[title="END"]')
                return { started: true, ended, items: [...acc.items, cur] }
            }

            return { started: true, ended: true, items: acc.items }

        }, { started: false, ended: false, items: [] })

        const message = `Error: The length of the list doesn't match the number of buttons!`
        if (items.length !== newTextItems.length) return alert(message)

        //console.log(items)

        const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))

        for (let i = 0; i < items.length; i++) {
            const link = items[i].querySelector('span a')
            if (i === 2) {
                var evt = new Event("click", {"bubbles":true, "cancelable":false})
                link.dispatchEvent(evt)
                

                // await delay(1000)
                // console.log('focus')
                // await delay(1000)
                // link.focus()
                // await delay(1000)
                // console.log('click')
                // await delay(1000)
                // link.click()
                // await delay(1000)
                // console.log('done')
            }
        }
    })


})();

/*

Week 1 (1/14 - 1/20)
Week 2 (1/21 - 1/27)
Week 3 (1/28 - 2/3)
Week 4 (2/4 - 2/10)
Week 5 (2/11 - 2/17)
Week 6 (2/18 - 2/24)
Week 7 (2/25 - 3/2)
Week 8 (3/3 - 3/9)
Week 9 (3/17 - 3/23)
Week 10 (3/24 - 3/30)
Week 11 (3/31 - 4/6)
Week 12 (4/7 - 4/13)
Week 13 (4/14 - 4/20)
Week 14 (4/21 - 4/27)
Week 15 (4/28 - 5/4)
Week 16 (5/5 - 5/11)
*/