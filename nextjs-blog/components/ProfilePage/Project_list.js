import React from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { PlusCircleFill } from "react-bootstrap-icons";
import SingleProjectProfile from "./SingleProjectProfile.js";

export default class Project_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProjectList: [],
            new_pid: -1,
        };
        this.getUserProjects();
        this.startNewProject = this.startNewProject.bind(this);
    }

    getUserProjects() {
        fetch("/api/getUserInfo", {
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
                if (!data.fail) {
                    this.setState({ userProjectList: data.related.projects });
                }
            });
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

    render() {
        return (
            <div>
                {this.state.userProjectList.map((data, key) => {
                    return <SingleProjectProfile key={key} pid={data} />;
                })}
                <div
                    onClick={this.startNewProject}
                    className="w-100 ba b--dotted mv4 tc pointer"
                >
                    <p className="di f2 avenir mb2">
                        <PlusCircleFill className="mt2 mh2" size={36} />
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
            </div>
        );
    }
}
