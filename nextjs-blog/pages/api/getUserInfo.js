import { User } from "../../helper_scripts/DB_helper.js";

export default (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    User.findOne(
                        {
                            uid: data.uid,
                        },
                        function (err, result) {
                            if (err) return console.error(err);
                            if (result) {
                                res.status(200).json(result);
                            } else {
                                res.status(200).json({ fail: true });
                            }
                            return resolve();
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
