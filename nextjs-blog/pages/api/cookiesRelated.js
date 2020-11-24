import { User } from "../../helper_scripts/DB_helper.js";

export default (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    if (typeof data.uid !== "undefined") {
                        User.findOneAndUpdate(
                            {
                                uid: data.uid,
                            },
                            { latest_cookie: data.cookie },
                            function (err) {
                                if (err) return console.error(err);
                                res.status(200).end();
                                return resolve();
                            }
                        );
                    } else {
                        User.findOne(
                            {
                                latest_cookie: data.cookie,
                            },
                            function (err, result) {
                                if (err) return console.error(err);
                                let temp = -1;
                                if (result) {
                                    temp = result.uid;
                                }
                                res.status(200).json({
                                    uid: temp,
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
