import fetch from "isomorphic-unfetch";
import cryptoRandomString from "crypto-random-string";
import Messages from "../Snippets/Messages";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import EnterCode from "../Snippets/EnterCode";
const crypto = require("crypto");

export default class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirm_password: "",
            msgInfo: { type: "", message: "" },
            openPopup: false,
            uid: -1,
        };
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleEnter(event) {
        let name = event.target.name;
        let value = event.target.value;
        if (
            name === "email" &&
            value !== "" &&
            (!value.includes("@") || value.indexOf("@") === value.length - 1)
        ) {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message: "Your email address is not in a valid format.",
                },
            });
        } else if (
            name === "password" &&
            value !== "" &&
            (value.length < 8 ||
                value.toUpperCase() === value ||
                value.toLowerCase() === value ||
                !/\d/.test(value) ||
                !/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(value))
        ) {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message:
                        "Your password must be at least 8 characters long, with at least one uppercase letter, one lowercase, one number digit and one special symbol each.",
                },
            });
        } else if (
            name === "confirm_password" &&
            value !== "" &&
            value !== this.state.password
        ) {
            this.setState({
                msgInfo: {
                    type: "Warning",
                    message: "Password confirmation doesn't match Password.",
                },
            });
        } else {
            this.setState({ [event.target.name]: event.target.value });
            this.setState({ msgInfo: { type: "", message: "" } });
        }
    }

    handleSubmit(event) {
        if (
            this.state.msgInfo.type === "" &&
            this.state.email !== "" &&
            this.state.password !== "" &&
            this.state.confirm_password !== ""
        ) {
            let salt = cryptoRandomString({ length: 20 });
            fetch("/api/userSignup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: crypto
                        .pbkdf2Sync(
                            this.state.password,
                            salt,
                            100000,
                            512,
                            "sha512"
                        )
                        .toString("hex"),
                    salt: salt,
                    timeStamp: new Date(),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (typeof (data.uid) === "number") {
                        this.setState({ uid: data.uid });
                        this.setState({ openPopup: true });
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
                    message:
                        "Please solve the existing alert or warning first. Remember not to leave any value blank.",
                },
            });
        }
        event.preventDefault();
    }

    closeModal() {
        this.setState({ openPopup: false });
    }

    render() {
        return (
            <main className="pa4 black-80">
                <form className="measure center" onSubmit={this.handleSubmit}>
                    <fieldset
                        id="sign_up"
                        className="ba b--transparent ph0 mh0"
                    >
                        <legend className="f4 fw6 ph0 mh0"> Sign Up </legend>
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
                                id="email-address_2"
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
                                className="b pa2 input-reset ba bg-transparent hover-bg-white w-100"
                                type="password"
                                name="password"
                                id="password_2"
                                onBlur={this.handleEnter}
                            />
                        </div>
                        <div className="mv3">
                            <label
                                className="db fw6 lh-copy f6"
                                htmlFor="password"
                            >
                                {" "}
                                Confirm password{" "}
                            </label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-white w-100"
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                onBlur={this.handleEnter}
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib bg-animate"
                            type="submit"
                            value="Sign up"
                        />
                    </div>
                </form>
                <Messages
                    type={this.state.msgInfo.type}
                    message={this.state.msgInfo.message}
                />
                <Popup
                    open={this.state.openPopup}
                    closeOnDocumentClick={false}
                >
                    <div className="modal">
                        <a className="close" onClick={this.closeModal}>
                            &times;
                        </a>
                        <EnterCode uid={this.state.uid} type="account" />
                    </div>
                </Popup>
            </main>
        );
    }
}
