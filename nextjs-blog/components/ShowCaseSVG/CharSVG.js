const path = require("path");

export default function CharSVG(props) {
    const { pid, uid, index, char, width, updated } = props
    const dir = "http://localhost:8080/" + path.join('Backend', 'Users', `${uid}`, 'Projects', `${pid}`, `Uploads`, `Images_From_PDF`, index + '_' + updated + `.svg`);
    return (
        <div
            className='char tc'
            style={{ width: width * 100 + '%' }}
        >
            <img key={Date.now()} src={dir} />
            <p> {char} </p>
        </div>
    )
}