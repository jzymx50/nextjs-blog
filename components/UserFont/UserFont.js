import React from 'react';
// import FontShow from '../FontShow';
import '../CSS/UserFont.css';

class UserFont extends React.Component {
    constructor(props) {
        super(props);
    }

	render() {
        // We can access the JSON data by calling props.data;
        const FontShow = this.props.data;

        // <img src="https://placeholder.pics/svg/1000x80" alt={FontShow.Font_name} />
		return (
                <div className="container">
                    <div className="img">
                        <img src={FontShow.sample_image} alt={FontShow.Font_name} />
                    </div>

                    <div className="infoContainer">
                        <h2 className="nameAuthor">{FontShow.Font_name} created by {FontShow.Font_author} </h2>
                        <ul className="tags">
                            {FontShow.Font_tags.map((value, index) => {
                                return <li className="tag" key={index}>{value}</li>
                            })}
                        </ul>
                        <h2 className="license">{FontShow.Font_license} </h2>               
                        <h2 className="fontInfo">{FontShow.Font_info} </h2>
                    </div>
                </div>

        );
    }
}
 
export default UserFont;