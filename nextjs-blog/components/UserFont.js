import React from 'react';

import { Download, Heart } from 'react-bootstrap-icons';


class UserFont extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.info }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        window.open(`/community/${this.props.info.pid}`, '_self');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.info !== this.props.info) {
            this.setState({ value: this.props.info });
        }
    }

    render() {

        return (
            <div
                className="f4 dt center pt2 pb2 flex pointer bg-animate hover-bg-light-gray" onClick={this.handleClick}
                style={{ width: this.props.width * 100 + '%' }}
            >
                <div className="db dtc-ns v-mid w-75">
                    <div className="mb2 ml2">{this.props.info.projectName} by {this.props.info.userName} </div>
                    <img src={"http://localhost:8080" + this.props.info.publish.Sample_pics[0]} alt={this.props.info.projectName} />
                </div>

                <div className="db dtc-ns v-mid ph2 pl3-ns w-25">

                    <div className="ma2 flex">
                        <div><Download size='16' /> {this.props.info.publish.downloads} &nbsp;</div>
                        <div><Heart size='16' /> {this.props.info.publish.likes.length} </div>
                    </div>
                    <div className="ma2 flex flex-wrap">
                        {this.props.info.publish.tags.map(value => value == "" ? null :
                            <div className="bg-gray mr1 pa1 near-white" key={value}>{value}</div>
                        )}
                    </div>
                    <div className="mt2 ml2">License: {this.props.info.publish.license} </div>
                    <div className="mt2 ml2">Last updated: {' ' + new Date(this.props.info.last_modified).toLocaleString().split(',')[0]}</div>
                </div>
            </div>
        );
    }
}

export default UserFont;
