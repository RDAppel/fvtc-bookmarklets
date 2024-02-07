javascript: (() => {
    ((content, fileName, type = 'text/plain') => {
        const a = document.createElement('a')
        const file = new Blob([content], { type })
        a.href = URL.createObjectURL(file)
        a.download = fileName
        a.click()
    })(JSON.stringify(Object.entries({...localStorage}).filter(([k]) => k.includes('Feedback'))), 'feedback.json')
})()