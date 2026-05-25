import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
function Signup() {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const handleRegister = async () => {

  try {

    const response = await axios.post(
      "https://api-sentinel-backend-888w.onrender.com/register",
      {
        name: name,
        email: email
      }
    )

    localStorage.setItem("user_id", response.data.id)
    localStorage.setItem("user_name", response.data.name)

    navigate("/dashboard")

  } catch (error) {

    console.log(error)

    alert("Registration Failed")

  }

}

  return (

  <div className="min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center relative text-white">

    {/* background glow */}
    <div className="absolute w-[400px] h-[400px] bg-purple-700 opacity-20 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>

    <div className="absolute w-[400px] h-[400px] bg-blue-700 opacity-20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

    {/* card */}
    <div className="relative z-10 bg-[#10182B]/90 border border-white/10 backdrop-blur-xl p-10 rounded-3xl w-[450px] shadow-2xl">

      {/* logo */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-purple-500/30">
        🛡️
      </div>

      {/* heading */}
      <h1 className="text-5xl font-bold text-center mb-3 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
        API Sentinel
      </h1>

      <p className="text-gray-400 text-center mb-8">
        Register to monitor your APIs
      </p>

      {/* name input */}
      <div className="flex items-center bg-[#0B1020] border border-gray-700 rounded-xl px-4 mb-4">
        <span className="mr-3 text-xl">👤</span>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 bg-transparent outline-none"
        />
      </div>

      {/* email input */}
      <div className="flex items-center bg-[#0B1020] border border-gray-700 rounded-xl px-4 mb-6">
        <span className="mr-3 text-xl">📧</span>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-transparent outline-none"
        />
      </div>

      {/* register button */}
      <button
        onClick={handleRegister}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all duration-300 p-4 rounded-xl font-semibold shadow-lg shadow-purple-500/20"
      >
        Register →
      </button>

      {/* divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-[1px] bg-gray-700"></div>

        <span className="text-gray-500 text-sm">OR</span>

        <div className="flex-1 h-[1px] bg-gray-700"></div>
      </div>

      {/* login section */}
      <p className="text-gray-400 text-center mb-4">
        Already have an account?
      </p>

      <button
        onClick={() => navigate("/login")}
        className="w-full border border-blue-500 text-white hover:bg-blue-500/10 transition-all duration-300 py-4 rounded-xl font-semibold"
      >
        Login →
      </button>

      {/* footer features */}
      <div className="flex justify-between text-sm text-gray-400 mt-8">

        <div className="flex flex-col items-center">
          <span className="text-purple-400 text-lg">🛡️</span>
          <p>Monitoring</p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-blue-400 text-lg">🔔</span>
          <p>Alerts</p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-green-400 text-lg">📈</span>
          <p>Insights</p>
        </div>

      </div>

    </div>

  </div>

)

}

export default Signup