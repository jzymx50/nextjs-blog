export default function toggleAutoSuggestion() {
    const form = document.querySelector('.search-bar form')
    const input = document.querySelector('.search-bar input')
    const suggestion = document.querySelector('.search-bar ul')
    const height = form.clientHeight
    const br = `${height / 2}px ${height / 2}px 0 0`

    document.body.addEventListener('click', e => {

        if (document.activeElement == input && suggestion.hasChildNodes()) {
            suggestion.style.display = null
            form.style['border-radius'] = br
        } else {
            suggestion.style.display = 'none'
            form.style['border-radius'] = null
        }
    })
}