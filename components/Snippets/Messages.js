import ReactHtmlParser from 'react-html-parser';
import { ExclamationCircle, ExclamationTriangleFill} from 'react-bootstrap-icons';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...this.props};
    }

    render() {
        let bgcolor, color, icon;
        switch (this.props.type) {
            case "Warning":
                bgcolor = "bright-yellow";
                color = "black";
                icon = <ExclamationTriangleFill/>;
                break;
            case "Alert":
                bgcolor = "dark-red";
                color = "white";
                icon = <ExclamationCircle/>;
                break;
            default:
                return <div></div>;
        }
        const classtypes = "ma2 pa1 bg-" + bgcolor + " " + color;
        return <div className={classtypes}>{icon}{" "}{ReactHtmlParser(this.props.message)}</div>;
    }
}
