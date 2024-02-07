javascript: (() => {
        
    const div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.top = 0
    div.style.right = 0
    div.style.zIndex = 9999
    div.style.backgroundColor = 'white'
    div.style.padding = '1em'
    div.style.border = '1px solid black'

    div.textContent = 'Drop the feedback.json file here...'
    document.body.appendChild(div)

    div.addEventListener('dragover', e => e.preventDefault())
    div.addEventListener('drop', e => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        const reader = new FileReader()
        reader.onload = e => {
            const data = JSON.parse(e.target.result)
            data.forEach(([key, value]) => localStorage.setItem(key, value))

            div.textContent = 'Feedback imported!'
            setTimeout(() => div.remove(), 2000)
        }
        reader.readAsText(file)
    })

})()