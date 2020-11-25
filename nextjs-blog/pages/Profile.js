import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { parseCookies } from "nookies";
import Project_list from "../components/ProfilePage/Project_list.js";
import UserProfile from "../components/ProfilePage/UserProfile.js";
import Header from "../components/HeaderFooter/Header.js";
import Footer from "../components/HeaderFooter/Footer.js";
import { PlusCircleFill } from "react-bootstrap-icons";
import Link from "next/link";
import ItemsGrid from "../components/GridSystem/ItemsGrid.js";
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uid: -1, userProjectList: [], new_pid: -1 };
        this.checkCookie = this.checkCookie.bind(this);
        this.startNewProject = this.startNewProject.bind(this);
        this.getUserProjects = this.getUserProjects.bind(this);
    }

    async checkCookie() {
        const cookies = parseCookies();
        if (cookies) {
            const res = await fetch("/api/cookiesRelated", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    cookie: cookies.Calli2Digital_thisSessionCookie,
                    timeStamp: new Date(),
                }),
            })
            const data = await res.json()

            if (data.uid !== -1) {
                this.setState({ uid: data.uid });
            }
        }

    }

    startNewProject() {
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                uid: this.props.uid,
                timeStamp: new Date(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ new_pid: data.pid });
                if (process.browser) {
                    document.getElementById("jumplink_new").click();
                }
            });
    }

    async componentDidMount() {
        await this.checkCookie();
        await this.getUserProjects();
    }

    async getUserProjects() {
        fetch("/api/getUserInfo", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                uid: this.state.uid,
                timeStamp: new Date(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.fail) {
                    this.setState({ userProjectList: data.related.projects });
                }
            });
    }



    render() {
        return (
            <>
                <Head>
                    <title>Profile</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="google-signin-client_id" content="2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com" />
                    <script src="https://apis.google.com/js/platform.js" async defer></script>
                </Head>
                <div className='min-vh-100 relative flex flex-column'>
                    <Header key={this.state.uid} uid={this.state.uid} />
                    <main id="root" className="pa0 mw8 center mb5">
                        <div className="flex mb2">
                            <div className="w-25 pa3 mr4 h2">
                                <UserProfile key={this.state.uid} uid={this.state.uid} />
                            </div>
                            <div className="w-70 mr2 pt3 mt3">
                                <div
                                    onClick={this.startNewProject}
                                    className="w-100 ba b--dotted mv4 tc pointer"
                                >
                                    <PlusCircleFill className="mt2 mh2" size={36} />
                                    <p className="di f2 avenir mb2">
                                        Create a new project
                                    </p>
                                </div>
                                <Link
                                    href={{
                                        pathname: "/FontProject",
                                        query: { pid: this.state.new_pid },
                                    }}
                                >
                                    <a id="jumplink_new"></a>
                                </Link>
                                <ItemsGrid row={5} col={1} type='font_project' infoList={this.state.userProjectList} />
                            </div>
                        </div>
                    </main>
                    <div className='absolute bottom-0 w-100'>
                        <Footer />
                    </div>
                </div>
            </>
        );
    }
}
