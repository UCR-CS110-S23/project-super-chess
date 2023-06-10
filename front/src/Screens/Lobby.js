import react from "react";
import { Button } from "@mui/material";
import { configure } from "@testing-library/react";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
        }
    }

    componentDidMount(){
        // TODO: write codes to fetch all rooms from server
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                this.setState({rooms:data})
            })
        });
    }

    logout = () => {
        fetch(this.props.server_url + '/api/auth/logout', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                if(data.msg == "Logged out"){
                    // this.props.changeUser('');
                    this.props.changeScreen("auth");
                }else{
                    alert(data.msg);
                }
            })
        });

    }

    create = (roomId) => {
        fetch(this.props.server_url + '/api/rooms/create', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ roomId })
        }).then((res) => {
            console.log("hi");
            res.json().then((data) => {
                console.log("hi");
                if(data.msg == "success"){
                    this.setState({rooms: data.rooms});
                }else{
                    alert(data.msg);
                }
            })
        });
    }

    join = (roomId) => {
        fetch(this.props.server_url + '/api/rooms/join', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId })
        }).then((res) => {
            res.json().then((data) => {
                if(data.msg == "success"){
                    this.setState({rooms: data.rooms});
                    // alert(data.room.name, data.user.username);                    
                }else{
                    alert(data.msg);
                }
            })
        });
    }

    enter = (name) => {
        fetch(this.props.server_url+"/api/rooms/enter", {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ name }) // body data type must match "Content-Type" header above.
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg === "Chatroom entered"){
                    console.log(this.props);
                    console.log(data.room);
                    this.props.changeRoom(data.room);
                    this.props.changeScreen("chatroom");
                }else{
                    alert(data.msg);
                }
            });
        }); 
        // alert(roomId);
    }

    render(){
        return(
            <div>
                <h1>Lobby</h1>
                <div>
                    <Button onClick={this.logout}> Logout </Button>
                </div>

                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} onClick={() => this.enter(room)}>{room}</Button>
                }) : "loading..."}
                {/* write codes to join a new room using room id*/}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const roomId = e.target.roomId.value;
                    this.join(roomId);
                }}>
                    <label for="roomId">RoomId: </label>
                    <input type="text" name="roomId"/>

                    <button type="submit">Join</button>
                </form>
                {/* write codes to enable user to create a new room*/}

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const roomId = e.target.roomId.value;
                    this.create(roomId);
                }}>
                    <label for="roomId">RoomId: </label>
                    <input type="text" name="roomId"/>

                    <button type="submit">Create</button>
                </form>

                
            </div>
        );
    }
}

export default Lobby;