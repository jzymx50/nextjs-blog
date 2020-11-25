import fetch from "isomorphic-unfetch";
import DownloadPDFForm from "./GeneTTFRelated/DownloadPDFForm";
import UploadPDFForm from "./GeneTTFRelated/UploadPDFForm";
import ShowCaseSVG from "./ShowCaseSVG/ShowCaseSVG";
import GenerateTTF from "./GeneTTFRelated/GenerateTTF";
import PublishFont from "./GeneTTFRelated/PublishFont";

export default class FontProjectInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOwner: false,
            pid: this.props.pid,
            project_name: "Default Project Name",
            uploaded: 0,
            downloaded: false,
            generated: false,
            info: "",
            tags: "",
            license: "",
            editTitleMode: false,
            width: "1",
            height: "1",
        };
        this.changeTitle = this.changeTitle.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTitleLoseFocus = this.handleTitleLoseFocus.bind(this);
        this.handleDownloadSubmit = this.handleDownloadSubmit.bind(this);
        this.handleUploadSubmit = this.handleUploadSubmit.bind(this);
        this.handleGenerateSubmit = this.handleGenerateSubmit.bind(this);
        this.project_info = {};
        this.getProjectinfo(this.props.pid);
    }

    changeTitle() {
        this.setState({ editTitleMode: true });
    }

    handleTitleChange(event) {
        this.setState({ project_name: event.target.value });
    }

    handleTitleLoseFocus() {
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: this.state.pid,
                "projectName": this.state.project_name,
                "last_modified": new Date(),
                timeStamp: new Date(),
            }),
        }).then(() => { this.setState({ editTitleMode: false }); });
    }

    handleDownloadSubmit(child_state) {
        this.setState({
            downloaded: true,
            width: child_state.width,
            height: child_state.height,
        });
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: this.state.pid,
                "related.downloaded": true,
                "related.ratio_w": parseInt(child_state.width, 10),
                "related.ratio_h": parseInt(child_state.height, 10),
                "last_modified": new Date(),
                timeStamp: new Date(),
            }),
        }).then();
    }

    handleUploadSubmit() {
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: this.state.pid,
                "related.uploaded": this.state.uploaded + 1,
                "last_modified": new Date(),
                timeStamp: new Date(),
            }),
        }).then(() => { this.setState({ uploaded: this.state.uploaded + 1 }); });
    }

    handleGenerateSubmit(child_state) {
        let base_path = "/Backend/Users/" + this.props.uid.toString() + "/Projects/" + this.state.pid.toString() + "/Output/";
        console.log(base_path);
        fetch("/api/projectUpdate", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: this.state.pid,
                "publish.TTFname": child_state,
                "related.generated": true,
                "related.Sample_pics": base_path + "font_demo_12_1.jpg",
                "publish.Sample_pics": [base_path + "font_demo_12_1.jpg", base_path + "font_demo_5_3.jpg"],
                "last_modified": new Date(),
                timeStamp: new Date(),
            }),
        }).then(() => { this.setState({ generated: true }); });
    }

    getProjectinfo(pid) {
        fetch("/api/getProjectInfo", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                pid: pid,
                timeStamp: new Date(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.fail !== true) {
                    this.setState({
                        project_name: data.projectName,
                        uploaded: data.related.uploaded,
                        downloaded: data.related.downloaded,
                        generated: data.related.generated,
                        width: data.related.ratio_w.toString(10),
                        height: data.related.ratio_h.toString(10),
                        info: data.publish.info,
                        license: data.publish.license,
                        tags: data.publish.tags.join(),
                    });
                    this.project_info = data;
                    this.setState({
                        isOwner: this.props.uid === this.project_info.userOwn,
                    });
                }
            });
    }

    render() {
        return (
            <div className="h-100 overflow-auto mt5 ml5 f4 flex">
                <div className="bg-light-gray v-top br4 pa3 shadow-3 w-25 mb5">
                    {this.state.isOwner ? (
                        <div className="center">
                            {!this.state.editTitleMode ? (
                                <h2 className="mt0 mb2 pa2" onClick={this.changeTitle}>
                                    {this.state.project_name}
                                </h2>) : <input type="text"
                                    name="title"
                                    value={this.state.project_name} onChange={this.handleTitleChange} onBlur={this.handleTitleLoseFocus} />}
                            <DownloadPDFForm
                                pid={this.state.pid}
                                uid={this.props.uid}
                                w={this.state.width}
                                h={this.state.height}
                                updateProjectWH={this.handleDownloadSubmit}
                            />
                            <UploadPDFForm
                                pid={this.state.pid}
                                uid={this.props.uid}
                                pdfWH={this.state}
                                hasUploaded={this.handleUploadSubmit}
                                uploaded={this.state.uploaded}
                            />
                            <GenerateTTF
                                pid={this.state.pid}
                                uid={this.props.uid}
                                bool_prep={this.state.uploaded}
                                hasGenerated={this.handleGenerateSubmit}
                            />
                            <PublishFont
                                pid={this.state.pid}
                                bool_prep={this.state.generated}
                                info={this.state.info}
                                tags={this.state.tags}
                                license={this.state.license}
                            />
                        </div>
                    ) : (
                            <div></div>
                        )}
                </div>
                <div className="w-two-thirds v-mid mh5">
                    <ShowCaseSVG
                        pid={this.state.pid}
                        uid={this.props.uid}
                        bool_show={this.state.uploaded}
                        col="6"
                        row="4"
                        count="95"
                        type="char"
                    />
                </div>
            </div>
        );
    }
}
