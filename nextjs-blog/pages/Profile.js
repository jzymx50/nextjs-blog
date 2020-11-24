import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { parseCookies } from "nookies";
import Project_list from "../components/ProfilePage/Project_list.js";
import UserProfile from "../components/ProfilePage/UserProfile.js";
import Header from "../components/HeaderFooter/Header.js";
import Footer from "../components/HeaderFooter/Footer.js";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uid: -1 };
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
            <div className="container ">
                <Head>
                    <title>Profile</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="google-signin-client_id" content="2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com" />
                    <script src="https://apis.google.com/js/platform.js" async defer></script>
                </Head>
                <Header key={this.state.uid} uid={this.state.uid} />
                <main id="root" className="pa0 mw8 center min-h-100">
                    <div className="flex items-start mb2">
                        <div className="w-25 pa3 mr4 h2">
                            <UserProfile key={this.state.uid} uid={this.state.uid} />
                        </div>
                        <div className="w-70 mr2 pt3 mt3">
                            <Project_list
                                key={this.state.uid}
                                uid={this.state.uid}
                            />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}
