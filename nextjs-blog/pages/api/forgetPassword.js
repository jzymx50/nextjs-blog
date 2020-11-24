import { User } from "../../helper_scripts/DB_helper.js";
import { sendEmail } from "../../helper_scripts/email.js";
import cryptoRandomString from "crypto-random-string";
const mongoose = require("mongoose");
const crypto = require("crypto");

export default async (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    if (!data.uid) {
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
                                        if (!result) {
                                            res.status(200).json({
                                                message:
                                                    "The account doesn't exist.",
                                            });
                                            return resolve();
                                        } else {
                                            let code = cryptoRandomString({
                                                length: 6,
                                            });
                                            sendEmail(
                                                data.email,
                                                code,
                                                "password"
                                            );
                                            res.status(200).json({
                                                message: "",
                                                code: code,
                                                uid: result.uid,
                                            });
                                            return resolve();
                                        }
                                    }
                                );
                            }
                        );
                    } else {
                        User.findOne(
                            { uid: data.uid },
                            async function (err, result) {
                                let temp_ps =
                                    cryptoRandomString({
                                        length: 3,
                                        characters:
                                            "abcdefghijklmnopqrstuvwxyz",
                                    }) +
                                    cryptoRandomString({
                                        length: 2,
                                        characters:
                                            "[~`!@#$%^&*+=-[];,/{}\\|\":<>'?()._]",
                                    }) +
                                    cryptoRandomString({
                                        length: 3,
                                        characters: "1234567890",
                                    }) +
                                    cryptoRandomString({
                                        length: 3,
                                        characters:
                                            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                                    });
                                let new_salt = cryptoRandomString({
                                    length: 20,
                                });
                                if (err) return console.error(err);
                                result.password = crypto
                                    .pbkdf2Sync(
                                        temp_ps,
                                        new_salt,
                                        100000,
                                        512,
                                        "sha512"
                                    )
                                    .toString("hex");
                                result.salt = new_salt;
                                await result.save();
                                res.status(200).json({
                                    temp_ps: temp_ps,
                                });
                                return resolve();
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
