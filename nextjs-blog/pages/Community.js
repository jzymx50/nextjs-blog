import Head from "next/head";
import Header from "../components/HeaderFooter/Header.js";
import Footer from "../components/HeaderFooter/Footer.js";
import SearchBar from '../components/SearchBar'
import toggleAutoSuggestion from "../helper_scripts/toggleAutoSuggestion.js";
import Filter from "../components/Filter.js";
import Main from "../components/Community/Main.js";
import Title from "../components/Community/Title.js";
import { useEffect, useState } from "react";
import checkCookie from "../helper_scripts/checkcookie.js";
import ItemsGrid from "../components/GridSystem/ItemsGrid.js";
import { connectToDatabase } from '../helper_scripts/mongodb.js'

export default function Community({ fonts }) {
    const [infoList, setInfoList] = useState(fonts)
    const [uid, setUID] = useState(-1)
    useEffect(() => {
        setUID(checkCookie())
        toggleAutoSuggestion()
    }, [])

    const filterFeed = function (category, sortBy, direction) {
        let output = []
        switch (category) {
            case 'all':
                output = fonts
                break
            case 'free':
                output = fonts.filter(font => font.publish.license === 'Downloadable')
                break
            case 'notFree':
                output = fonts.filter(font => font.publish.license === 'Copyrighted')
                break
        }
        if (direction == 'up') {
            switch (sortBy) {
                case 'popularity':
                    output = output.sort((a, b) => a.publish.downloads - b.publish.downloads).slice()
                    break
                case 'date':
                    output = output.sort((a, b) => new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime()).slice()
                    break
            }
        } else if (direction == 'down') {
            switch (sortBy) {
                case 'popularity':
                    output = output.sort((b, a) => a.publish.downloads - b.publish.downloads).slice()
                    break
                case 'date':
                    output = output.sort((b, a) => new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime()).slice()
                    break
            }
        }
        setInfoList(output)

    }

    return (
        <>
            <Head>
                <title>Community - Calligraphy2Digital</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="google-signin-client_id" content="2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com" />
                <script src="https://apis.google.com/js/platform.js" async defer></script>
            </Head>
            <div className='min-vh-100 relative'>
                <Header key={uid} uid={uid} />
                <SearchBar />
                <Main>
                    <Title title='Explore and find your favorites' />
                    <div className='mt4'>
                        <Filter filterFeed={filterFeed} />
                        <ItemsGrid row={8} col={1} type='font_in_community' infoList={infoList} />
                    </div>
                </Main>
                <div className='absolute bottom-0 w-100'>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export async function getStaticProps() {

    const { db } = await connectToDatabase();

    const fonts = await await db
        .collection("projects")
        .find({
            "publish.published": true,
        })
        .sort({ last_modified: -1 })
        .toArray()

    return {
        props: {
            fonts: JSON.parse(JSON.stringify(fonts)),
        },
    };

}
