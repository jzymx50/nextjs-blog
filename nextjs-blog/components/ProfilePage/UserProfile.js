import Link from "next/link";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { updateOpen: false, profile: {} };
    this.getUserInfo();
    this.actionLogout = this.actionLogout.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.openUpdatePanel = this.openUpdatePanel.bind(this);
  }

  getUserInfo() {
    fetch("/api/getUserInfo", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        uid: this.props.uid,
        timeStamp: new Date(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.fail) {
          this.setState({ profile: data.profile });
        }
      });
  }

  openUpdatePanel() {
    this.setState({ updateOpen: true });
  }

  updateUserInfo(event) {
    let name = document.getElementById("name").value;
    let bio = document.getElementById("bio").value;
    fetch("/api/userUpdate", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        uid: this.props.uid,
        profileName: name,
        profileBio: bio,
        timeStamp: new Date(),
      }),
    }).then(() => { this.setState({ updateOpen: false, profile: { profilePic: this.state.profile.profilePic, profileName: name, profileBio: bio } }); });
  }


  actionLogout() {
    let temp = this.props.uid;
    gapi.load("auth2", function () {
      let auth2 = gapi.auth2.getAuthInstance();
      console.log(auth2);
      if (auth2) {
        auth2.signOut().then(() => {
        });
      }
      fetch("/api/cookiesRelated", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          uid: temp,
          cookie: "",
          timeStamp: new Date(),
        }),
      }).then(() => {
        document.getElementById("homepage").click();
      });
    });
  }

  render() {
    return (
      <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10">
        <h1 className="f3 tc">Profile</h1>
        {this.state.updateOpen ?
          (<div><div class="tc">
            <img src={this.state.profile.profilePic} class="br-100 h3 w3 dib" title="Profile picture"></img>
          </div>
            <h1 class="f4">Name:</h1>
            <input id="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="name-desc" defaultValue={this.state.profile.profileName || ''}></input>
            <h1 class="f4 center">Bio:</h1>
            <textarea id="bio" name="comment" class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc" defaultValue={this.state.profile.profileBio || ''}></textarea>
            <div class="flex items-center justify-center pa1">
              <a href="#" class="f6 no-underline black bg-animate inline-flex items-center pa2 ba border-box br3 mr4" onClick={this.updateUserInfo}>
                <span class="tc">Save & Return</span>
              </a></div></div>) : (
            <div><div className="tc">
              <img src={this.state.profile.profilePic} className="br-100 h3 w3 dib" title="Profile picture"></img>
              <h1 className="f4">{this.state.profile.profileName}</h1>
              <hr className="mw3 bb bw1 b--black-10"></hr>
            </div>
              <p className="lh-copy measure center f6 black-70">
                {this.state.profile.profileBio}
              </p>
              <div className="flex items-center justify-center pa1">
                <a href="#" onClick={this.openUpdatePanel} className="pointer f6 no-underline black bg-animate inline-flex items-center pa2 ba border-box br3 mr4">
                  <span className="tc">Settings</span>
                </a>
                <a href="#" onClick={this.actionLogout} className="pointer f6 no-underline black bg-animate inline-flex items-center pa2 ba border-box br3">
                  <span className="tc">Logout</span>
                </a>
              </div></div>)}
        <Link href="/">
          <a href="/" id="homepage"></a>
        </Link>
      </article>
    );
  }
}
