const GOOGLE_BUTTON_ID = "google-sign-in-button";
import Link from "next/link";
import { setCookie } from "nookies";
import cryptoRandomString from "crypto-random-string";

export default class GoogleSignIn extends React.Component {
    componentDidMount() {
        window.gapi.signin2.render(GOOGLE_BUTTON_ID, {
            onsuccess: this.onSuccess,
        });
    }

    onSuccess(googleUser) {
        const id_token = googleUser.getAuthResponse().id_token;
        fetch("/api/googleAccount", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                timeStamp: new Date(),
                token: id_token,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
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
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        uid: data.uid,
                        cookie: cookie_value,
                        timeStamp: new Date(),
                    }),
                }).then(() => {
                    let jumplink = document.getElementById("jumplink");
                    jumplink.click();
                });
            });
    }
    render() {
        return (
            <div>
                <div
                    style={{ width: "235px" }}
                    className="mb3 dib black tc"
                    id={GOOGLE_BUTTON_ID}
                />
                <Link href="/Profile">
                    <a id="jumplink"></a>
                </Link>
            </div>
        );
    }
}
