import fetch from "isomorphic-unfetch";
import Messages from "../Snippets/Messages";
import FormData from "form-data";

export default class UploadPDFForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: null, msgInfo: { type: "", message: "" } };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ selectedFile: event.target.files[0] });
        this.setState({ msgInfo: { type: "", message: "" } });
    }

    handleSubmit(event) {
        if (this.state.selectedFile === null) {
            this.setState({ msgInfo: { type: "Alert", message: "You haven't select any file to upload." } });
        } else if (!this.props.pdfWH.downloaded) {
            this.setState({ msgInfo: { type: "Alert", message: "You have never download a template in this project so it is impossible for us to split the file into individual characters." } });
        } else {
            this.setState({ msgInfo: { type: "", message: "" } });
            const data = new FormData();
            data.append("file", this.state.selectedFile);
            const json_data = JSON.stringify({
                uid: this.props.uid,
                pid: this.props.pid,
                pdfWH: this.props.pdfWH,
                uploaded: this.props.uploaded,
                timeStamp: new Date(),
            });
            data.append("data", json_data);
            fetch("/api/uploadPDF", {
                method: "POST",
                credentials: "include",
                body: data,
            })
                .then((response) => response.json())
                .then(() => {
                    this.props.hasUploaded();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className="ba b--dashed ma1 pb3">
                <p className="ma2 pa1">
                    Here Upload the PDF template that you have downloaded and
                    filled out.
                </p>
                <form className="mh2 ph2" onSubmit={this.handleSubmit}>
                    <input
                        className="center f6 ma1 pv3 ph2 dib black bg-white"
                        type="file"
                        name="file"
                        accept="application/pdf"
                        onChange={this.handleChange}
                    />
                    <br />
                    <input
                        className="f6 ba mv2 pv1 dib black"
                        type="submit"
                        value="Upload PDF"
                    />
                </form>
                <Messages
                    type={this.state.msgInfo.type}
                    message={this.state.msgInfo.message}
                />
            </div>
        );
    }
}
