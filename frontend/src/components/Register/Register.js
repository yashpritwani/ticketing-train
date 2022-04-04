import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import './Register.css'
import swal from "sweetalert"

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName:"", phoneNum:"",email:"", password:"", firstName:"", lastName:""
    })
    // const [registeredUser, setRegisteredUser] = useState()
    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value
        setUser({...user, [name]:value});
    }
    const PostData = async(e) => {
        e.preventDefault();
        const {userName, phoneNum,email } = user;
        const res = await fetch(`https://ticketing-train.herokuapp.com/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName, email, phoneNum
            })
        })
        const data = await res.json();
        console.log(data.message)
        if(res.status === 200 || res.status === 201) {
            // setRegisteredUser(data.user)
            swal({
                title: "Good job!",
                text: `${data.message}`,
                icon: "success",
                button: "Continue",
            });
            navigate("/trains", {state: data});
        }
        else{
            swal({
                title: "Error Occured",
                text: `${data.message}`,
                icon: "error",
                button: "Continue",
            });
        }
    }
    return (
            <div class="register__page">
            <div class="right__content">
                <div class="content__text">
                <h1>Train Tickets</h1>
                        <p>Ticket Booking For trains</p>
                </div>
            </div>
            <div class="left__content">
                <div class="title">
                    <h1>Create Account to Book Tickets</h1>
                </div>
                <form action="POST" class="login__form">
                    <input type="text" placeholder="User Name" name="userName" value={user.userName} onChange={handleInputs} required="true" />
                    <input type="email" placeholder="Email Address" name="email" value={user.email} onChange={handleInputs} required="true" />
                    <input type="phoneNum" placeholder="Phone Number" name="phoneNum" value={user.phoneNum} onChange={handleInputs} required="true" />
                    <button type="submit" value="register" onClick={PostData}>Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default Register
