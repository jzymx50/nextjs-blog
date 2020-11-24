import fetch from "isomorphic-unfetch";
import Messages from "../Snippets/Messages";
import Popup from "reactjs-popup";
import EnterCode from "../Snippets/EnterCode";
import Link from "next/link";
import { setCookie } from "nookies";
import cryptoRandomString from "crypto-random-string";
const path = require("path");
const crypto = require("crypto");

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            msgInfo: {
                type: "",
                message: "",
            },
            uid: -1,
            openPopup: "",
            code: "",
        };
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.forgetPW = this.forgetPW.bind(this);
    }

    forgetPW() {
        if (this.state.email === "") {
            this.setState({
                msgInfo: {
                    type: "Warning",
                    message:
                        "Please first enter your email address in the corresponding blank above before pressing the link.",
                },
            });
        } else {
            fetch("/api/forgetPassword", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    timeStamp: new Date(),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === "") {
                        this.setState({ openPopup: "password" });
                        this.setState({ code: data.code });
                        this.setState({ uid: data.uid });
                    } else {
                        this.setState({
                            msgInfo: {
                                type: "Alert",
                                message: data.message,
                            },
                        });
                    }
                });
        }
    }

    closeModal() {
        this.setState({ openPopup: "" });
    }

    handleEnter(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        fetch("/api/userLogin", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                email: this.state.email,
                timeStamp: new Date(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.salt) {
                    fetch("/api/userLogin", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                        },
                        body: JSON.stringify({
                            email: this.state.email,
                            password: crypto
                                .pbkdf2Sync(
                                    this.state.password,
                                    data.salt,
                                    100000,
                                    512,
                                    "sha512"
                                )
                                .toString("hex"),
                            timeStamp: new Date(),
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.verified === false) {
                                this.setState({ uid: data.uid });
                                this.setState({ openPopup: "account" });
                            } else if (data.verified) {
                                const cookie_value = cryptoRandomString({
                                    length: 20,
                                });
                                setCookie(
                                    null,
                                    "Calli2Digital_thisSessionCookie",
                                    cookie_value,
                                    {
                                        maxAge: 12 * 60 * 60,
                                        path: "/",
                                    }
                                );
                                fetch("/api/cookiesRelated", {
                                    method: "POST",
                                    headers: {
                                        "Content-type":
                                            "application/json; charset=UTF-8",
                                    },
                                    body: JSON.stringify({
                                        uid: data.uid,
                                        cookie: cookie_value,
                                        timeStamp: new Date(),
                                    }),
                                }).then(() => {
                                    let jumplink = document.getElementById(
                                        "jumplink"
                                    );
                                    jumplink.click();
                                });
                            } else {
                                this.setState({
                                    msgInfo: {
                                        type: "Alert",
                                        message: data.message,
                                    },
                                });
                            }
                        });
                } else {
                    this.setState({
                        msgInfo: {
                            type: "Alert",
                            message: data.message,
                        },
                    });
                }
            });
        event.preventDefault();
    }

    render() {
        return (
            <main className="pa4 black-80">
                <form className="measure center" onSubmit={this.handleSubmit}>
                    <fieldset id="log_in" className="ba b--transparent ph0 mh0">
                        <legend className="f4 fw6 ph0 mh0"> Log In </legend>
                        <div className="mt3">
                            <label
                                className="db fw6 lh-copy f6"
                                htmlFor="email-address"
                            >
                                {" "}
                                Email{" "}
                            </label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-white w-100"
                                type="email"
                                name="email"
                                id="email-address_1"
                                onBlur={this.handleEnter}
                            />
                        </div>
                        <div className="mv3">
                            <label
                                className="db fw6 lh-copy f6"
                                htmlFor="password"
                            >
                                {" "}
                                Password{" "}
                            </label>
                            <input
                                className="tooltip b pa2 input-reset ba bg-transparent hover-bg-white w-100"
                                type="password"
                                name="password"
                                id="password_1"
                                onBlur={this.handleEnter}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib bg-animate"
                            type="submit"
                            value="Log in"
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <a
                            href="#0"
                            onClick={this.forgetPW}
                            className="f6 link dim black db"
                        >
                            {" "}
                            Forgot your password ?{" "}
                        </a>
                    </div>
                </form>
                <Messages
                    type={this.state.msgInfo.type}
                    message={this.state.msgInfo.message}
                />
                <Popup
                    open={this.state.openPopup !== ""}
                    closeOnDocumentClick={false}
                >
                    <div className="modal">
                        <a className="close" onClick={this.closeModal}>
                            &times;
                        </a>
                        <EnterCode
                            uid={this.state.uid}
                            type={this.state.openPopup}
                            code={this.state.code}
                        />
                    </div>
                </Popup>
                <Link href="/Profile">
                    <a id="jumplink"></a>
                </Link>
            </main>
        );
    }
}
