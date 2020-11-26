import fetch from "isomorphic-unfetch";
import Messages from "../Snippets/Messages";
const path = require("path");

export default class DownloadPDFForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.w,
            height: this.props.h,
            msgInfo: { type: "", message: "" },
            url: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        let n = Math.floor(Number(event.target.value));
        if (
            (n !== Infinity && String(n) === event.target.value && n > 0) ||
            event.target.value == ""
        ) {
            this.setState({ [name]: event.target.value });
            this.setState({ msgInfo: { type: "", message: "" } });
        } else {
            this.setState({
                msgInfo: {
                    type: "Warning",
                    message:
                        "You are trying to enter something that doesn't belong to a positive integer.",
                },
            });
        }
    }

    handleSubmit(event) {
        if (this.state.width != "" && this.state.height != "") {
            this.props.updateProjectWH(this.state);
            this.setState({ msgInfo: { type: "", message: "" } });
            fetch("/api/downloadPDF", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    pid: this.props.pid,
                    w: this.state.width,
                    h: this.state.height,
                    uid: this.props.uid,
                    timeStamp: new Date(),
                }),
            }).then(() => {
                const url = path.join(
                    "Backend",
                    "Users",
                    `${this.props.uid}`,
                    "Projects",
                    `${this.props.pid}`,
                    "Blank",
                    "Sample_Latin_Alphabets_" +
                    this.state.width +
                    "_" +
                    this.state.height +
                    ".pdf"
                );
                this.setState({ url: "http://3.139.230.100:8080/" + url }); //"http://3.139.230.100:8080/"
                document.getElementById("downloadurl").click();
            });
        } else {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message: "At least one value is left blank.",
                },
            });
        }
        event.preventDefault();
    }

    render() {
        return (
            <div className="ba b--dashed ma1 pb3">
                <p className="ma2 pa1">
                    {" "}
                    Enter the ratio of width and height for your grids and
                    Download the pdf template. Input must be positive integers.
                </p>
                <form className="mh2 ph2" onSubmit={this.handleSubmit}>
                    <label>
                        Grid Width (positive int): &nbsp;
                        <input
                            type="text"
                            name="width"
                            value={this.state.width}
                            onChange={this.handleChange}
                        />
                    </label>{" "}
                    <br />
                    <label>
                        Grid Height (positive int): &nbsp;
                        <input
                            type="text"
                            name="height"
                            value={this.state.height}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <input
                        className="f6 ba mv2 pv1 dib black"
                        type="submit"
                        value="Download Template"
                    />
                </form>
                <Messages
                    type={this.state.msgInfo.type}
                    message={this.state.msgInfo.message}
                />
                <a id="downloadurl" href={this.state.url} download={this.state.url.split("/").pop()}></a>
            </div>
        );
    }
}
