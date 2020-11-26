import { User } from "../../helper_scripts/DB_helper.js";

export default (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 1000) {
                    if (typeof data.uid !== "undefined") {
                        let temp_obj = {};
                        for (const [key, value] of Object.entries(data)) {
                            if(key !== "uid" && key !== "timeStamp"){
                                temp_obj["profile." + key] = value;
                            }
                        }
                        User.findOneAndUpdate(
                            {
                                uid: data.uid,
                            },
                            temp_obj,
                            async function (err, result) {
                                if (err) return console.error(err);
                                res.status(200).end();
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
            console.log(error);
            res.status(400).json({ message: JSON.stringify(error, null, 2) });
            return resolve();
        }
    });
};
