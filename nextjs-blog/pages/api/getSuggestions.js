import { connectToDatabase } from '../../helper_scripts/mongodb'

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            let data = req.body;

            if (new Date() - new Date(data.timeStamp) < 1000) {
                const query = data.query

                const { db } = await connectToDatabase();

                const fonts = await await db
                    .collection("projects")
                    .find({
                        "publish.published": true,
                        projectName: new RegExp(query, 'i'),
                    })
                    .limit(10)
                    .toArray()

                const fontNames = fonts.map(font => font.projectName)

                if (fontNames.length == 0) {
                    res.status(200).json({ fail: true })
                } else {
                    res.status(200).json({ 'results': fontNames })
                }
            } else {
                throw String("timeout");
            }
        } else {
            throw String("Method not allowed");
        }
    } catch (error) {
        res.status(400).json({ message: JSON.stringify(error, null, 2) });
    }
};