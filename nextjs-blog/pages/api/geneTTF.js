import { spawnSync } from "child_process";
const path = require("path");

export default (req, res) => {
    try {
        if (req.method === "POST") {
            let data = req.body;
            if (new Date() - new Date(data.timeStamp) < 1000) {
                spawnSync("python3", [
                    path.join("public", "generate_ttf_related.py"),
                    "2",
                    `${data.uid}`,
                    `${data.pid}`,
                    data.font_name,
                    `${data.uploaded}`,
                ]);
            } else {
                throw String("timeout");
            }
        } else {
            throw String("Method not allowed");
        }
    } catch (error) {
        res.status(400).json({ message: JSON.stringify(error, null, 2) });
    }
    return res.status(200).end();
};
