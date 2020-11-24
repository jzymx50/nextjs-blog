import Head from "next/head";
import { parseCookies } from "nookies";
import { connectToDatabase } from '../../helper_scripts/mongodb'
import Header from '../../components/HeaderFooter/Header'
import Footer from '../../components/HeaderFooter/Footer'
import { BookmarkHeart, BookmarkHeartFill, CloudArrowDown } from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import checkCookie from "../../helper_scripts/checkcookie.js";
import toggleAutoSuggestion from "../../helper_scripts/toggleAutoSuggestion.js";
import SearchBar from "../../components/SearchBar";

export default function ProjectDetail({ project }) {
    const font = project[0]
    const { pid, projectName, userName, userOwn, last_modified: pdate, publish } = font
    const { Sample_pics: urls, info, tags, license, likes, downloads, TTFname } = publish

    const [uid, setUID] = useState(-1)
    const [isLiked, setIsLiked] = useState(false)
    const fontURL = `http://3.139.230.100:8080/Backend/Users/${userOwn}/Projects/${pid}/Output/${TTFname}`
    useEffect(() => {

        // need font file here
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(`@font-face{font-family:"${projectName}";src:url("${fontURL}");}textarea{font-family:"${projectName}"}`));
        document.head.appendChild(style);
        setUID(checkCookie())
        toggleAutoSuggestion()

    }, [])

    useEffect(() => {
        if (uid >= 0) {
            if (likes.includes(uid)) {
                setIsLiked(true)
            }
        }
    }, [uid])

    const buttonStyle = 'f4 link dim br3 ba bw1 ph3 pv2 mb2 dib near-black di mh3 pointer'
    const tagStyle = 'f4 br3 ba bw1 ph3 pv2 mb3 mr3 dib near-black fl di ttc'

    const handleLikeButton = function () {
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: pid,
                "publish.likes": likes.push(uid),
                timeStamp: new Date(),
            }),
        })
    }

    const handleDownloadButton = function () {
        window.open(fontURL)
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: pid,
                "publish.downloads": downloads + 1,
                timeStamp: new Date(),
            }),
        })
    }

    return (
        <>
            <Head>
                <title>{projectName} - Calligraphy2Digital</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-signin-client_id" content="2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com" />
                <script src="https://apis.google.com/js/platform.js" async defer></script>
            </Head>
            <Header key={uid} uid={uid} />
            <SearchBar />
            <div className='mw8 center mt4 mb5'>

                <div className='db pv4'>
                    <img src={"http://3.139.230.100:8080" + urls[1]} className='w-100' />
                </div>

                <div className='flex mt4'>
                    <div className='w-two-thirds left-column pr5'>
                        <div className='flex relative items-end'>
                            <div className='f1 fl di mr3 b'>{projectName}</div>
                            <div className='f3 fl di ml4'>by<strong>{' ' + userName}</strong></div>
                        </div>

                        <div className='f3 mt4'>{info}</div>
                        <textarea
                            placeholder='Type something to try this font...'
                            rows='6'
                            className='br4 f2 mt4 w-100 pa3 outline-0'
                        ></textarea>
                    </div>
                    <div className='w-third right-column pl2'>
                        {/** buttons div */}
                        <div className='w-100 tr'>
                            {uid >= 0 ? (<div className={buttonStyle} id='like' onClick={handleLikeButton}>
                                {isLiked ? <BookmarkHeartFill className='v-mid' /> : <BookmarkHeart className='v-mid' />}
                                <a>{isLiked ? ' Unlike' : ' Like'}</a>
                            </div>) : <div className={buttonStyle} >Sign in to like this font</div>}
                            {license === 'Downloadable' ? (<div className={buttonStyle} onClick={handleDownloadButton}>
                                <CloudArrowDown className='v-mid' />
                                <a> Download</a>
                            </div>) : <div className={buttonStyle}>This font is copyrighted</div>}
                        </div>
                        {/** font stats */}
                        <div className='flex flex-wrap f3 w-100 mt4'>
                            <div className='w-50'>Likes:{' ' + likes.length}</div>
                            <div className='w-50'>Downloads:{' ' + downloads}</div>
                            <div className='w-100 mt1'>Last updated: {' ' + new Date(pdate).toLocaleString().split(',')[0]}</div>
                            <div className='w-100 mt1'>License: {' ' + license}</div>
                        </div>
                        {/** tags */}
                        <div className='mt5'>
                            <div className='f3 b'>Tags</div>
                            <div className='flex flex-wrap mt3'>
                                {tags.map(tag =>
                                    <div className={tagStyle} key={tag}>{tag}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='absolute bottom-0 w-100'>

            </div>
        </>
    )
}

export async function getStaticPaths() {
    // Get the ID array of all projects.
    const { db } = await connectToDatabase();

    const fonts = await db
        .collection("projects")
        .find()
        .toArray();



    // Get the paths we want to pre-render based on pids
    const paths = fonts.map((font) => ({
        params: { pid: font.pid.toString() },
    }))


    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths: paths, fallback: false }
}


export async function getStaticProps({ params }) {
    // get the project json by pid
    const { db } = await connectToDatabase();

    const project = await db
        .collection("projects")
        .find({ pid: parseInt(params.pid) })
        .toArray()


    return {
        props: {
            project: JSON.parse(JSON.stringify(project)),
        },
    };

}

