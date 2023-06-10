import react from "react";
import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js";

const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{
    constructor(props){
        super(props);

        this.state = {
            screen: undefined,
            // username: undefined,
            room: undefined,
        }
    }

    componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
        fetch(server_url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.message === "logged in"){
                    this.setState({screen: "lobby"});
                }
                else{
                    this.setState({screen: "auth"});
                }
            });
        });
    }

    changeScreen = (screen) => {
        this.setState({screen: screen});
    }

    // changeUser = (username) => {
    //     this.setState({username: username});
    // }

    changeRoom = (room) => {
        this.setState({room: room});
    }

    render(){
        let display = "loading...";
        if (this.state.screen == "auth"){
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen} /*changeUser={this.changeUser}*/ />;
        }
        else if (this.state.screen == "lobby"){
            display = <Lobby server_url = {server_url} changeScreen={this.changeScreen} changeRoom={this.changeRoom} /*changeUser={this.changeUser} */ />;
        }
        else if (this.state.screen == "chatroom"){
            display = <Chatroom server_url = {server_url} changeScreen={this.changeScreen} changeRoom={this.changeRoom} /*username={this.state.username}*/ room={this.state.room} />;
        }
        return(
            <div>
                {display}
            </div>
        );
    }
}

export default ScreenHandler;
