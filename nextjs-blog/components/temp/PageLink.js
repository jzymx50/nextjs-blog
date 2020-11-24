
export default function PageLink(props) {

    const { num, isCurrent, onPageChange } = props

    let classes = 'h2 w2 br-pill mh1 inline-flex items-center justify-center pointer '

    classes += isCurrent ?
        'bg-dark-gray light-gray' :
        'dark-gray bg-animate hover-bg-near-white dim'

    const handleClick = function (e) {
        onPageChange(parseInt(e.target.textContent))
    }
    return (
        <div
            className={classes}
            onClick={handleClick}
        >
            {num}
        </div>
    )
}