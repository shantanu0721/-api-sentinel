import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Dashboard() {

  const navigate = useNavigate()
  const [apiData, setApiData] = useState({

  name: "",
  url: "",
  method: "GET",
  interval_seconds: 10,
  timeout_seconds: 5

})
  const [apis, setApis] = useState([])

  const handleChange = (e) => {

    setApiData({

        ...apiData,

        [e.target.name]: e.target.value

    })

    }

  useEffect(() => {

  fetchApis()

  const interval = setInterval(() => {

    fetchApis()

  }, 5000)

  const userId = localStorage.getItem("user_id")

  if (!userId) {

    navigate("/")

  }

  return () => clearInterval(interval)

}, [])
  const handleAddApi = async () => {

  try {

    await axios.post(
      "https://api-sentinel-backend-888w.onrender.com/apis",
      {

        user_id: localStorage.getItem("user_id"),

        name: apiData.name,
        url: apiData.url,
        method: apiData.method,
        interval_seconds: Number(apiData.interval_seconds),
        timeout_seconds: Number(apiData.timeout_seconds)

      }
    )

    alert("API Added Successfully")
    fetchApis()

  } catch (error) {

    console.log(error)

    alert("Failed to Add API")

  }

}
const fetchApis = async () => {

  try {

    const response = await axios.get(

      `https://api-sentinel-backend-888w.onrender.com/apis/${localStorage.getItem("user_id")}`

    )

    setApis(response.data)

  } catch (error) {

    console.log(error)

  }

}

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center ">

        <div className="p-8">

            <h1 className="text-5xl font-bold mb-3">
                API Sentinel
            </h1>

            <p className="text-gray-400 text-lg mb-10">
                Welcome, {localStorage.getItem("user_name")}
            </p>
            <button
                onClick={() => {

                    localStorage.clear()

                    navigate("/")

                }}
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold"
                >
                Logout
            </button>
            <div className="bg-[#121A2A] p-6 rounded-2xl mt-10 max-w-4xl">

  <h2 className="text-2xl font-semibold mb-6">
    Add New API
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      type="text"
      name="name"
      placeholder="API Name"
      value={apiData.name}
      onChange={handleChange}
      className="p-4 rounded-xl bg-[#0B1020] border border-gray-700"
    />

    <input
      type="text"
      name="url"
      placeholder="API URL"
      value={apiData.url}
      onChange={handleChange}
      className="p-4 rounded-xl bg-[#0B1020] border border-gray-700"
    />

    <select
      name="method"
      value={apiData.method}
      onChange={handleChange}
      className="p-4 rounded-xl bg-[#0B1020] border border-gray-700"
    >
      <option>GET</option>
      <option>POST</option>
    </select>

    <input
      type="number"
      name="interval_seconds"
      placeholder="Interval"
      value={apiData.interval_seconds}
      onChange={handleChange}
      className="p-4 rounded-xl bg-[#0B1020] border border-gray-700"
    />

    <input
      type="number"
      name="timeout_seconds"
      placeholder="Timeout"
      value={apiData.timeout_seconds}
      onChange={handleChange}
      className="p-4 rounded-xl bg-[#0B1020] border border-gray-700"
    />

  </div>

  <button
    onClick={handleAddApi}
    className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
  >
    Add API
  </button>

</div>
<div className="mt-10">

  <h2 className="text-2xl font-semibold mb-6">
    Your APIs
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {apis.map((api) => (

      <div
        key={api.id}
        className="bg-[#121A2A] p-6 rounded-2xl border border-gray-800"
      >

        <h3 className="text-xl font-bold mb-3">
          {api.name}
        </h3>

        <div className="mb-3">

  {api.success === true ? (

    <span className="bg-green-600 px-3 py-1 rounded-lg text-sm">
      UP
    </span>

  ) : api.success === false ? (

    <span className="bg-red-600 px-3 py-1 rounded-lg text-sm">
      DOWN
    </span>

  ) : (

    <span className="bg-gray-600 px-3 py-1 rounded-lg text-sm">
      UNKNOWN
    </span>

  )}

</div>

        <p className="text-gray-400 mb-2">
          {api.url}
        </p>

        <div className="flex gap-3 mt-4">

          <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm">
            {api.method}
          </span>

          <span className="bg-gray-700 px-3 py-1 rounded-lg text-sm">
            {api.interval_seconds}s
          </span>

        </div>
        <button
  onClick={async () => {

    try {

      await axios.delete(
        `https://api-sentinel-backend-888w.onrender.com/apis/${api.id}`
      )

      fetchApis()

    } catch (error) {

      console.log(error)

      alert("Failed to delete API")

    }

  }}
  className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
>
  Delete
</button>

      </div>

    ))}

  </div>

</div>

        </div>

        

    </div>
    

  )

}

export default Dashboard