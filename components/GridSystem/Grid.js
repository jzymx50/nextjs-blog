import charIdx from '../ShowCaseSVG/charIdx'
import CharSVG from '../ShowCaseSVG/CharSVG'
export default function Grid(props) {
    const { updated, pid, uid, col, row, count, curPage, type } = props
    const start = (curPage - 1) * col * row
    const end = Math.min(count, curPage * col * row)
    const items = []
    for (let i = start; i < end; i++) {
        items.push(charIdx[i])
    }
    if (type === "char") {
        return (
            <div className='flex flex-wrap w-100 pa2'>
                {items.map((char, i) =>
                    <CharSVG
                        updated={updated}
                        pid={pid}
                        uid={uid}
                        index={start + i}
                        char={char}
                        width={1 / col}
                        key={char}
                    />)}
            </div>
        )
    }else{return (<div></div>)}
}