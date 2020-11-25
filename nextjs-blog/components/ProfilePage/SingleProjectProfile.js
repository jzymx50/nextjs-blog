import Link from "next/link";

export default class SingleProjectProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { project_name: "", last_modified: new Date().toISOString(), img_path: "" };
        this.getProjectinfo(this.props.pid);
        this.gotoProject = this.gotoProject.bind(this);
    }

    gotoProject() {
        if (process.browser) {
            document.getElementById("jumplink" + this.props.pid).click();
        }
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
                    console.log(typeof data.last_modified)
                    this.setState({
                        project_name: data.projectName,
                        last_modified: data.last_modified,
                        img_path: 'http://3.139.230.100:8080' + data.related.Sample_pics,
                    });
                    this.project_info = data;
                }
            });
    }
    render() {
        return (
            <div key={this.props.pid} style={{ cursor: "pointer" }} onClick={this.gotoProject}>
                <div className="w-100 ba b--dotted mb2">
                    <img
                        key={this.state.img_path}
                        src={this.state.img_path}
                        className="w-100"
                    ></img>
                    <div className="dt dt--fixed mb1">
                        <span className="f1 lh-solid dtc georgia">
                            {this.state.project_name}
                        </span>
                        <span className="f3 dtc">
                            Last edit:{" "}
                            {this.state.last_modified.slice(0, 10)}
                        </span>
                    </div>
                </div>
                <Link
                    href={{
                        pathname: "/FontProject",
                        query: { pid: this.props.pid },
                    }}
                >
                    <a id={"jumplink" + this.props.pid}></a>
                </Link>
            </div>
        );
    }
}
