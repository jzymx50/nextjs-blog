import { parseCookies } from "nookies";

export default function checkCookie() {
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
                return data.uid;
            });
    }
}