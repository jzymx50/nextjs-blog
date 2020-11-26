import { parseCookies } from "nookies";

export default async function checkCookie() {
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
        return data.uid
    }



}