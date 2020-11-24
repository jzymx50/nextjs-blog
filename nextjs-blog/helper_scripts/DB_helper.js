const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: Number,
    email: String,
    googleIdtoken: String,
    password: String,
    salt: String,
    user_init_time: Number,
    latest_cookie: String,
    verify: {
        verify_code: String,
        verified: Boolean,
    },
    profile: {
        profileName: String,
        profilePic: String,
        profileBio: String,
    },
    related: {
        projects: Array,
        liked: Array,
    },
});

let User;

try {
    User = mongoose.model("User");
} catch (error) {
    User = mongoose.model("User", userSchema, "users");
}

const projectSchema = new mongoose.Schema({
    pid: Number,
    projectName: String,
    userOwn: Number,
    userName: String,
    last_modified: Date,
    related: {
        ratio_w: Number,
        ratio_h: Number,
        uploaded: Number,
        downloaded: Boolean,
        generated: Boolean,
        Sample_pics: String,
    },
    publish: {
        published: Boolean,
        Sample_pics: Array,
        TTFname: String,
        info: String,
        tags: Array,
        license: String,
        likes: Array,
        downloads: Number,
    },
});

let Project;

try {
    Project = mongoose.model("Project");
} catch (error) {
    Project = mongoose.model("Project", projectSchema, "projects");
}

const websiteSchema = new mongoose.Schema({
    name: String,
    usrNum: Number,
    projectNum: Number,
});

let Website;

try {
    Website = mongoose.model("Website");
} catch (error) {
    Website = mongoose.model("Website", websiteSchema, "websites");
}


mongoose.connect(
    "mongodb+srv://YiyinEllenGu:BMTHQN0BAvYSMOkl@cluster0.mrdmc.mongodb.net/test?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
);
const db = mongoose.connection;

export { User, Project, Website, db};
