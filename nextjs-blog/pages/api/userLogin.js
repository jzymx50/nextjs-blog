import { User } from "../../helper_scripts/DB_helper.js";

export default async (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    if (data.password) {
                        User.findOne(
                            { email: data.email, password: data.password },
                            async function (err, result) {
                                if (err) return console.error(err);
                                if (result) {
                                    if (result.verify.verified) {
                                        res.status(200).json({
                                            uid: result.uid,
                                            verified: true,
                                        });
                                    } else {
                                        res.status(200).json({
                                            uid: result.uid,
                                            verified: false,
                                        });
                                    }
                                    return resolve();
                                } else {
                                    res.status(200).json({
                                        message: "The password is incorrect.",
                                    });
                                    return resolve();
                                }
                            }
                        );
                    } else {
                        User.findOne(
                            { email: data.email },
                            async function (err, result) {
                                if (err) return console.error(err);
                                if (!result) {
                                    res.status(200).json({
                                        message:
                                            "The account doesn't exist.",
                                    });
                                    return resolve();
                                } else {
                                    res.status(200).json({
                                        salt: result.salt,
                                    });
                                    return resolve();
                                }
                            }
                        );
                    }


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
