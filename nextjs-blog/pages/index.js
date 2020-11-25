import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { parseCookies } from "nookies";
import Header from "../components/HeaderFooter/Header.js";
import Footer from "../components/HeaderFooter/Footer.js";
import Banner from "../components/HomepageBanner/Banner.js";
import ItemsGrid from "../components/GridSystem/ItemsGrid.js";
import { connectToDatabase } from '../helper_scripts/mongodb'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uid: -1, profilePicPath: "", fonts: props.fonts };
        this.checkCookie();
    }

    checkCookie() {
        const cookies = parseCookies();
        if (cookies) {
            fetch("/api/cookiesRelated", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    cookie: cookies.Calli2Digital_thisSessionCookie,
                    timeStamp: new Date(),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.uid !== -1) {
                        this.setState({ uid: data.uid });
                    }
                });
        }
    }

    render() {
        return (
            <>
                <Head>
                    <title>Login</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="google-signin-client_id" content="2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com" />
                    <script src="https://apis.google.com/js/platform.js" async defer></script>
                </Head>
                <div className='min-vh-100 relative'>
                    <Header key={this.state.uid} uid={this.state.uid} />
                    <Banner />
                    <div className='mw8 center mt5 pb6'>
                        <div className='f2 mb4 tc'>Featured Fonts In Our Community</div>
                        <ItemsGrid row={5} col={1} type='font_in_community' infoList={this.state.fonts} hidePage={true} />
                        <div className='tc'>
                            <div
                                className='grow dib f3-ns no-underline bg-gray near-white pa3 br4 pointer'
                                onClick={() => { window.open('http://calligraphy2digital.com/Community', '_self') }}
                            >
                                Explore more
                            </div>
                        </div>
                    </div>
                    <div className='absolute bottom-0 w-100'>
                        <Footer />
                    </div>
                </div>
            </>
        );
    }
}

export async function getStaticProps() {

    const { db } = await connectToDatabase();

    const fonts = await await db
        .collection("projects")
        .find({
            "publish.published": true,
            pid: { $lt: 5 }
        })
        .sort({ last_modified: -1 })
        .toArray()

    return {
        props: {
            fonts: JSON.parse(JSON.stringify(fonts)),
        },
    };

}