import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")

    const handleLogin = async () => {

        try {

            const response = await axios.post(
                "https://api-sentinel-backend-888w.onrender.com/login",
                {
                    email: email
                }
            )

            localStorage.setItem("user_id", response.data.id)

            localStorage.setItem("user_name", response.data.name)

            navigate("/dashboard")

        } catch (error) {

            console.log(error)

            alert("User not found")

        }

    }

    return (

        <div className="min-h-screen bg-black flex items-center justify-center">

            <div className="bg-[#121A2A] p-10 rounded-2xl w-[400px]">

                <h1 className="text-white text-4xl font-bold mb-3">
                    Login
                </h1>

                <p className="text-gray-400 mb-8">
                    Login to API Sentinel
                </p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 rounded-xl bg-[#0B1020] border border-gray-700 text-white mb-6"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold"
                >
                    Login
                </button>

            </div>

        </div>

    )

}

export default Login