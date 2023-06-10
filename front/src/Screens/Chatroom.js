import react from "react";
import {io} from 'socket.io-client'

class Chatroom extends react.Component{
    constructor(props){
        super(props);
        this.socket = io(this.props.server_url, {
            cors: {
                origin: 'http://localhost:3001',
                credentials: true
            }, transports : ['websocket']
        });
        

        // Client socket properties
        this.state = {
            // text: '',
            messages: [],
        }

        // Set up server socket room
        // this.socket.emit("join", {room: this.props.room, userName: this.props.username});
    }
    
    createEntry = (msg) => {
        const usr = msg.sender.name;
        const txt = msg.message.text;
        return (<li>
            <div>{usr}</div>
            <div>{txt}</div>
        </li>); 
    }

    //
    sendMessage = (msg) => {
        this.socket.emit("chat message", {msg: msg});
        console.log(msg);
    }

    render(){
        // If chat history has been updated
        this.socket.on("chat message", (messages)=>{
            this.setState({messages: messages});
        });

        return(
            <div>
                <h1>{this.props.room}</h1>
                <ul>
                {/* show chats */
                    this.state.messages.map((m) => {
                        return this.createEntry(m);
                    })
                }
                </ul>
                {/* show chat input box*/}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const message = e.target.message.value;
                    this.sendMessage(message);
                }}>
                    <input type="text" name="message"/>
                    <button type="submit">Send</button>
                </form>
                Chatroom
            </div>
        );
    }
}

export default Chatroom;