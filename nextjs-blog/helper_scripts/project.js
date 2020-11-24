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

mongoose.connect("mongodb+srv://jzy:xJPKRGAE1IAHjeLo@cluster0.mrdmc.mongodb.net/test?retryWrites=true ", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on(
    "error",
    console.error.bind(console, "connection error:")
);
db.once("open", async function () {
    let project = mongoose.model('project1', projectSchema)
    const newProject = new project({
        pid: 0,
        projectName: 'abc',
        userOwn: 123,
        last_modified: new Date(),
        related: {},
        publish: {
            published: true,
            name: '123',
            Sample_pics: '',
            info: 'abc',
            tags: ['aaa'],
            license: 'abcde',
            likes: 1,
            downloads: 2,
        }
    })
    await newProject.save()
});