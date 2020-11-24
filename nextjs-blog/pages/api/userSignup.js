import { User, Website } from "../../helper_scripts/DB_helper.js";
import { sendEmail } from "../../helper_scripts/email.js";
import cryptoRandomString from "crypto-random-string";

export default async (req, res) => {
    return new Promise((resolve) => {
        let this_uid;
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    let verify_code = cryptoRandomString({ length: 6 });

                    let temp_date = new Date().getTime() - 43200000;
                    User.findOneAndDelete(
                        {
                            email: data.email,
                            "verify.verified": false,
                            user_init_time: {
                                $lt: temp_date,
                            },
                        },
                        async function (err) {
                            if (err) return console.error(err);
                            User.findOne(
                                { email: data.email },
                                async function (err, result) {
                                    if (err) return console.error(err);
                                    if (result) {
                                        res.status(200).json({
                                            message:
                                                "The email has already been registered.",
                                        });
                                        return resolve();
                                    } else {
                                        let this_website = await Website.findOne(
                                            { name: "Calligraphy2Digital" }
                                        ).exec();
                                        this_uid = this_website.usrNum;
                                        const new_user = new User({
                                            uid: this_uid,
                                            email: data.email,
                                            googleIdtoken: null,
                                            password: data.password,
                                            salt: data.salt,
                                            user_init_time: new Date().getTime(),
                                            latest_cookie: null,
                                            verify: {
                                                verify_code: verify_code,
                                                verified: false,
                                            },
                                            profile: {
                                                profileName:
                                                    "Default Profile Name",
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
                                            sendEmail(
                                                data.email,
                                                verify_code,
                                                "account"
                                            );

                                            res.status(200).json({
                                                uid: this_uid,
                                            });
                                            return resolve();
                                        });
                                    }
                                }
                            );
                        }
                    );
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
