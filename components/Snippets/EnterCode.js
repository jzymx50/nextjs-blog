import fetch from "isomorphic-unfetch";
import Messages from "./Messages";
import Link from "next/link";
import { setCookie } from "nookies";
import cryptoRandomString from "crypto-random-string";

export default class EnterCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verify_code: "",
            msgInfo: { type: "", message: "" },
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resendCode = this.resendCode.bind(this);
    }

    resendCode() {
        fetch("/api/checkVrfCode", {
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
                this.setState({
                    msgInfo: {
                        type: "Warning",
                        message: data.message,
                    },
                });
            });
    }

    handleChange(event) {
        if (event.target.value.length <= 6) {
            this.setState({ [event.target.name]: event.target.value });
            this.setState({ msgInfo: { type: "", message: "" } });
        } else {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message: "The verify code should be 6-digit in length.",
                },
            });
        }
    }

    handleSubmit(event) {
        if (this.state.verify_code.length === 6) {
            this.setState({ msgInfo: { type: "", message: "" } });
            if (this.props.type === "password") {
                if (this.state.verify_code === this.props.code) {
                    fetch("/api/forgetPassword", {
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
                            if (data.temp_ps) {
                                this.setState({
                                    msgInfo: {
                                        type: "Alert",
                                        message:
                                            "The password has been temporarily reset to " +
                                            data.temp_ps +
                                            ". Please log in immediately and change the password.",
                                    },
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
                            message: "The code is not correct.",
                        },
                    });
                }
            } else {
                fetch("/api/checkVrfCode", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        uid: this.props.uid,
                        code: this.state.verify_code,
                        timeStamp: new Date(),
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.message !== "") {
                            this.setState({
                                msgInfo: {
                                    type: "Alert",
                                    message: data.message,
                                },
                            });
                        } else {
                            //generate & save cookies for this session
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
                                    uid: this.props.uid,
                                    cookie: cookie_value,
                                    timeStamp: new Date(),
                                }),
                            }).then(() => {
                                let jumplink = document.getElementById(
                                    "jumplink"
                                );
                                jumplink.click();
                            });
                        }
                    });
            }
        } else {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message: "The verify code should be 6-digit in length.",
                },
            });
        }
        event.preventDefault();
    }

    render() {
        let warning_message_1 =
            "You can leave the page now if you want. Within 12 hours, you can come " +
            "back and log in with the email and password you have set, then you will be asked for " +
            "the verification code. After 12 hours, the code will expires and all your infos will be deleted from the website. If you didn't " +
            "receive the code after waiting for more than one minute, click the <em><u>Resend Code</u></em> button. Please avoid abusing the button.";
        let warning_message_2 =
            "You have receive an email with a 6-digit code at your email address. " +
            "<strong>The code will expired once you close this popup.</strong> If you wait for at least one minute and didn't receive " +
            "the code, close the popup and start over. Once the code entered is vertified, your password will be automatically reset." +
            "Use the reset password to log in and please change to new password immediately.";
        return (
            <div>
                <form className="measure center" onSubmit={this.handleSubmit}>
                    <label>
                        Enter the 6-digit Verify Code you have received in the
                        email:{"    "}
                        {this.props.type !== "password" ? (
                            <a
                                style={{ cursor: "pointer" }}
                                onClick={this.resendCode}
                            >
                                <em>
                                    <u>Resend Code</u>
                                </em>
                            </a>
                        ) : (
                                <a></a>
                            )}
                        <br />
                        <input
                            type="text"
                            name="verify_code"
                            value={this.state.verify_code}
                            onChange={this.handleChange}
                        />
                    </label>{" "}
                    <div>
                        <input
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib bg-animate"
                            type="submit"
                            value="Verify Account"
                        />
                    </div>
                </form>
                <Messages
                    type="Warning"
                    message={
                        this.props.type === "password"
                            ? warning_message_2
                            : warning_message_1
                    }
                />
                <Messages
                    type={this.state.msgInfo.type}
                    message={this.state.msgInfo.message}
                />
                <Link href="/Profile">
                    <a id="jumplink"></a>
                </Link>
            </div>
        );
    }
}
