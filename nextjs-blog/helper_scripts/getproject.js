const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    pid: Number,
    projectName: String,
    userOwn: Number,
    last_modified: Date,
    related: {
        ratio_w: Number,
        ratio_h: Number,
        uploaded: Number,
        downloaded: Boolean,
        Sample_pics: String,
    },
    publish: {
        published: Boolean,
        name: String,
        Sample_pics: Array,
        info: String,
        tags: Array,
        license: String,
        likes: Number,
        downloads: Number,
    }
});

let Project;

try {
    Project = mongoose.model("Project");
} catch (error) {
    Project = mongoose.model("Project", projectSchema, 'project1');
}

export function getProject(id) {
    mongoose.connect("mongodb+srv://jzy:xJPKRGAE1IAHjeLo@cluster0.mrdmc.mongodb.net/test?retryWrites=true ", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    console.log(db.readyState);
    db.on(
        "error",
        console.error.bind(console, "connection error:")
    );

    let output

    db.once("open", async function () {
        console.log('open');
        Project.findOne(
            {
                pid: id,
            },
            function (err, result) {
                if (err) return console.error(err);
                console.log('123' + result)
                db.close();
                output = result
            }
        );
    });

    return output
}
