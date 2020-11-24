import { User, Project, Website } from "../../helper_scripts/DB_helper.js";

export default (req, res) => {
    return new Promise((resolve) => {
        try {
            if (req.method === "POST") {
                let data = req.body;
                if (new Date() - new Date(data.timeStamp) < 5000) {
                    if (typeof data.uid !== "undefined") {
                        User.findOne(
                            {
                                uid: data.uid,
                            },
                            async function (err, result) {
                                if (err) return console.error(err);
                                let this_website = await Website.findOne(
                                    { name: "Calligraphy2Digital" }
                                ).exec();
                                let this_pid = this_website.projectNum;
                                const new_project = new Project({
                                    pid: this_pid,
                                    projectName: "Default Project Name",
                                    userOwn: data.uid,
                                    userName: result.profile.profileName,
                                    last_modified: new Date(),
                                    related: {
                                        ratio_w: 1,
                                        ratio_h: 1,
                                        uploaded: 0,
                                        downloaded: false,
                                        generated: false,
                                        Sample_pics: "",
                                    },
                                    publish: {
                                        published: false,
                                        TTFname: "",
                                        Sample_pics: [],
                                        info: "",
                                        tags: [],
                                        license: "",
                                        likes: [],
                                        downloads: 0,
                                    },
                                });
                                this_website.projectNum += 1;
                                await this_website.save();
                                result.related.projects.push(this_pid);
                                await result.save();
                                new_project.save(function (err) {
                                    if (err) return console.error(err);
                                    console.log(
                                        "Document inserted succussfully!"
                                    );
                                    res.status(200).json({ pid: this_pid });
                                    return resolve();
                                });
                            }
                        );
                    } else {
                        let temp_obj = {};
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== "pid" && key !== "timeStamp") {
                                temp_obj[key] = value;
                            }
                        }
                        Project.findOneAndUpdate(
                            {
                                pid: data.pid,
                            },
                            temp_obj,
                            async function (err, result) {
                                if (err) return console.error(err);
                                //console.log(result);
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
