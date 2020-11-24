import { useEffect, useState } from 'react'
import UserFont from '../UserFont'
import Pagination from './Pagination'

const itemType = {
    font_in_community: UserFont,
}

export default function ItemsGrid(props) {
    const { col, row, type, infoList } = props

    const count = infoList.length
    const pageNum = Math.ceil(count / (col * row))
    const SpecificItem = itemType[type]

    const [currentPage, setCurrenPage] = useState(0)
    const [items, setItems] = useState([])




    const handlePageChange = function (pageIdx) {
        setCurrenPage(pageIdx)
    }

    useEffect(() => { setCurrenPage(1) }, [])
    // Setup the items array for rendering the children of <Grid>
    useEffect(() => {
        const start = (currentPage - 1) * col * row
        const end = Math.min(count, currentPage * col * row)
        setItems(infoList.slice(start, end))
    }, [currentPage, infoList])



    return (
        <div className='mv2'>
            <div className='flex flex-wrap w-100 mb5'>
                {items.map(info =>
                    <SpecificItem
                        info={info}
                        width={1 / col}
                        key={info.pid}
                    />)}
            </div>
            <Pagination num={pageNum} label={currentPage} onPageChange={handlePageChange} />
        </div>
    )


} 