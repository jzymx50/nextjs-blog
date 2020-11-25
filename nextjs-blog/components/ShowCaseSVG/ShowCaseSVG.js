import { useState } from 'react'
import Grid from '../GridSystem/Grid'
import Pagination from '../GridSystem/Pagination'

export default function ShowCaseSVG(props) {
    const { col, row, count, type, bool_show } = props
    const [currentPage, setCurrentPage] = useState(1)
    const [rerender, setRerender] = useState(0)
    const pageNum = Math.ceil(count / (col * row))

    const handlePageChange = function (pageIdx) {
        setCurrentPage(pageIdx)
    }

    if (rerender !== bool_show) {
        setRerender(bool_show);
    }

    if (rerender !== 0) {
        return (
            <div className='prjDetail center'>
                <Grid updated={bool_show} pid={props.pid} uid={props.uid} col={col} row={row} curPage={currentPage} count={count} type={type} />
                <Pagination num={pageNum} label={currentPage} onPageChange={handlePageChange} />
            </div>
        )
    } else {
        return (
            <div className='prjDetail center'></div>
        )
    }


}