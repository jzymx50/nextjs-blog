const { OAuth2Client } = require("google-auth-library");
import { User, Website } from "../../helper_scripts/DB_helper.js";
const CLIENT_ID =
    "2632322765-1q6o3aucrg484d4poc95vbio3025hde9.apps.googleusercontent.com";

export default (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    async function verify() {
                        const client = new OAuth2Client(CLIENT_ID);
                        const ticket = await client.verifyIdToken({
                            idToken: data.token,
                            audience: CLIENT_ID,
                        });
                        const payload = ticket.getPayload();
                        const userid = payload["sub"];
                        User.findOne(
                            { googleIdtoken: userid },
                            async function (err, result) {
                                if (err) return console.error(err);
                                if (result) {
                                    res.status(200).json({
                                        uid: result.uid,
                                    });
                                    return resolve();
                                } else {
                                    let this_website = await Website.findOne({
                                        name: "Calligraphy2Digital",
                                    }).exec();
                                    let this_uid = this_website.usrNum;
                                    const new_user = new User({
                                        uid: this_uid,
                                        email: null,
                                        googleIdtoken: userid,
                                        password: null,
                                        salt: null,
                                        user_init_time: new Date().getTime(),
                                        latest_cookie: null,
                                        verify: {
                                            verify_code: "",
                                            verified: true,
                                        },
                                        profile: {
                                            profileName: "Default Profile Name",
                                            profilePic:
                                                "/Backend/Resources/default-profile-icon.png",
                                            profileBio: "",
                                        },
                                        related: {
                                            projects: [],
                                            liked: [],
                                        },
                                    });
                                    this_website.usrNum += 1;
                                    await this_website.save();
                                    new_user.save(function (err) {
                                        if (err) return console.error(err);
                                        console.log(
                                            "Document inserted succussfully!"
                                        );
                                        res.status(200).json({
                                            uid: this_uid,
                                        });
                                        return resolve;
                                    });
                                }
                            }
                        );
                    }
                    verify().catch(console.error);
                } else {
                    throw String("timeout");
                }
            } else {
                throw String("Method not allowed");
            }
        } catch (error) {
            res.status(400).json({ message: JSON.stringify(error, null, 2) });
            return resolve();
        }
    });
};
