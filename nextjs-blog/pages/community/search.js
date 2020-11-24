import Head from "next/head";
import Header from '../../components/HeaderFooter/Header'
import Footer from '../../components/HeaderFooter/Footer'
import { useEffect, useState } from 'react'
import SearchBar from "../../components/SearchBar";
import { connectToDatabase } from '../../helper_scripts/mongodb'
import toggleAutoSuggestion from "../../helper_scripts/toggleAutoSuggestion.js";
import ItemsGrid from "../../components/GridSystem/ItemsGrid";
import Title from "../../components/Community/Title.js";
import Main from "../../components/Community/Main";
import checkCookie from "../../helper_scripts/checkcookie";


export default function Search({ fonts, query }) {
    const [style, setStyle] = useState({})
    const [uid, setUID] = useState(-1)

    useEffect(() => {
        setUID(checkCookie())
        toggleAutoSuggestion()
    }, [])

    return (
        <>
            <Head>
                <title>Search Results - Calligraphy2Digital</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='min-vh-100 relative'>
                <Header key={uid} uid={uid} />
                <SearchBar />
                <Main>
                    <Title title={`Search results for "${query.length > 15 ? query.slice(0, 16) + '...' : query}"`} />
                    <div className='mt4'>
                        {fonts.length == 0
                            ? <div className='f2 gray'>Sorry, no matched font found in our community.</div>
                            : <ItemsGrid col={1} row={8} type='font_in_community' infoList={fonts} />}
                    </div>
                </Main>
                <div className='absolute bottom-0 w-100'>
                    <Footer />
                </div>

            </div>

        </>
    )
}


export async function getServerSideProps(context) {

    const query = context.query.query

    const { db } = await connectToDatabase();

    const fonts = await await db
        .collection("projects")
        .find({
            "publish.published": true,
            projectName: new RegExp(query, 'i'),
        })
        .sort({ last_modified: -1 })
        .toArray()

    return {
        props: {
            fonts: JSON.parse(JSON.stringify(fonts)),
            query: query
        },
    };

}