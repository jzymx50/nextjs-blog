import fetch from "isomorphic-unfetch";
import Messages from "../Snippets/Messages";

export default class PublishFont extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: this.props.pid,
            msgInfo: { type: "", message: "" },
            tags: this.props.tags,
            info: this.props.info,
            license: this.props.license
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        if (name !== "check") {
            this.setState({ [name]: event.target.value });
        } else {
            this.setState({ license: event.target.checked ? "Downloadable" : "Copyrighted" });
        }
    }

    handleSubmit() {
        if (this.props.bool_prep) {
            this.setState({ msgInfo: { type: "", message: "" } });
            fetch("/api/projectUpdate", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    pid: this.state.pid,
                    "publish.published": true,
                    "publish.info": this.state.info,
                    "publish.tags": this.state.tags.split(",").slice(0, 3),
                    "publish.license": this.state.license,
                    "last_modified": new Date(),
                    timeStamp: new Date(),
                }),
            }).then();
        } else {
            this.setState({
                msgInfo: {
                    type: "Alert",
                    message: "Font has not been generated yet.",
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
                    Enter the info you want other users to see when publishing the font.
                </p>
                <form className="mh2 ph2" onSubmit={this.handleSubmit}>
                    <label>
                        Info: &nbsp;<br />
                        <textarea
                            type="text"
                            name="info"
                            rows={4}
                            value={this.state.info}
                            onChange={this.handleChange}
                            className='w-100'
                        />
                    </label>{" "}
                    <br />
                    <label>{" "}
                        Tags(seperate by comma, max 3): &nbsp;
                        <input
                            type="text"
                            name="tags"
                            value={this.state.tags}
                            onChange={this.handleChange}
                        />
                    </label>
                    <br />
                    <label>{" "}
                        <input type="checkbox" name="check" checked={this.state.license === "Downloadable"} onChange={this.handleChange} />
                        <span>{" Allow Download"}</span>

                    </label>
                    <br />
                    <input
                        className="f6 ba mv2 pv1 dib black"
                        type="submit"
                        value="Publish / Update Publish"
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