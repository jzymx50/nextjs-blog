import Head from "next/head";
import FontProjectInterface from "../components/FontProjectInterface.js";
import fetch from "isomorphic-unfetch";
import { parseCookies } from "nookies";
import Header from '../components/HeaderFooter/Header'
import Footer from '../components/HeaderFooter/Footer'


export default class FontProject extends React.Component {

    static getInitialProps({ query }) {
        return { query }
    }

    constructor(props) {
        super(props);
        this.state = { pid: parseInt(this.props.query.pid, 10), uid: -1 };
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
                    <title>Font Project</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className='min-vh-100 relative bg-moon-gray w-100'>
                    <Header key={this.state.uid} uid={this.state.uid} />

                    {this.state.uid >= 0 ? (<FontProjectInterface key={this.state.uid} uid={this.state.uid} pid={this.state.pid} />) : null}

                </div>
                <div className='absolute bottom-0 w-100'>
                    <Footer />
                </div>
            </>
        );
    }
}
