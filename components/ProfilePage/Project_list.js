import React from "react";

import fetch from "isomorphic-unfetch";

import SingleProjectProfile from "./SingleProjectProfile.js";

export default class Project_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProjectList: [],
            new_pid: -1,
        };
        this.getUserProjects();

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



    render() {
        return (
            <div>

                {this.state.userProjectList.map((data, key) => {
                    return <SingleProjectProfile key={key} pid={data} />;
                })}
            </div>
        );
    }
}
