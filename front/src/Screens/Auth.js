import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";
const qrcode = require('qrcode');

class Auth extends react.Component{
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }

    }



    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        // DONE: write codes to login
        console.log(data);

        fetch(this.props.server_url+"/api/auth/login", {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header above.
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg === "Logged in"){
                    // this.props.changeUser(data.username);
                    this.props.changeScreen("lobby");
                }else{
                    alert(data.msg);
                }
            });
        });    
    }

    register = (data) => {
        // DONE: write codes to register
        console.log(data);
        // let r = JSON.stringify(data);
        fetch(this.props.server_url+"/api/auth/signup", {
            method: "POST",
            mode: 'cors',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header above.
        }).then((res) => {
            res.clone().json().then((data) => {
                qrcode.toDataURL(data.otpauth_url, function(err,data){
                    console.log(data);
                    document.getElementById("forQRcode").innerHTML = 'Use this QR code for 2FA <img src="' + data + '" alt="QR code"/>';
                })
            }).catch(()=>{
                res.text().then((textData) => {
                alert(textData);
                })
            });
        });
    };

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['username', 'password', 'OneTimePassword'];
                console.log();
                display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'password', 'name'];
                display =
                    <div>
                    <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>
                    <div id="forQRcode"></div>
                </div>;
            }   
        }
        else{
            display = <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
                </div>;
        }
        return(
            <div class="welcome">
                <h1 class="title"> Welcome to our website! </h1>
                {display}

            </div>
        );
    }
}

export default Auth;
