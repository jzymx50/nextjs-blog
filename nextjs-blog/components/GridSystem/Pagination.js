import PageLink from './PageLink'

function Pagination(props) {
    const { num, label, onPageChange } = props
    const pageList = Array.from({ length: num }, (v, i) => i + 1)
    return (
        <div className='pagination tc pa2'>
            {pageList.map((val, idx) =>
                <PageLink
                    num={val}
                    isCurrent={idx + 1 === label ? true : false}
                    key={'page' + val}
                    onPageChange={onPageChange}
                />)}
        </div>
    )
}

export default Pagination