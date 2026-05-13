import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [userData, setUserData] = useState({
  name: "",
  email: ""
});

const handleUserChange = (e) => {

  setUserData({
    ...userData,
    [e.target.name]: e.target.value
  });

};
const handleRegister = async () => {
  

  try {

    const response=await axios.post("http://127.0.0.1:8000/register", {
      

      

      name: userData.name,
      email: userData.email
    });
    localStorage.setItem("user_id", response.data.id)
    localStorage.setItem("user_name", response.data.name)

    alert("User Registered");

  } catch (error) {

    console.log(error);
    alert("Registration Failed");

  }

};



  const handleSubmit = async () => {

  try {

    await axios.post("http://127.0.0.1:8000/apis", {
      user_id: localStorage.getItem("user_id"),
      name: formData.name,
      url: formData.url,
      method: formData.method,
      email: "shantanu@test.com",
      interval_seconds: Number(formData.interval_seconds),
      timeout_seconds: Number(formData.timeout_seconds)
    });

    alert("API Added Successfully");
    window.location.reload();

  } catch (error) {

    console.log(error);
    alert("Failed to add API");

  }

};
  const handleDelete = async (apiId) => {

  try {

    await axios.delete(
      `http://127.0.0.1:8000/apis/${apiId}`
    );

    alert("API Deleted");

    window.location.reload();

  } catch (error) {

    console.log(error);

    alert("Failed to delete API");

  }

};
  const [apis, setApis] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "GET",
    interval_seconds: 10,
    timeout_seconds: 5
});

  
  const downApis = apis.filter(api => !api.success);
  const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

};

  

  useEffect(() => {

  const fetchApis = () => {

    axios.get("http://127.0.0.1:8000/apis")
      .then((response) => {
        setApis(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

  };
  

  fetchApis();

  const interval = setInterval(fetchApis, 5000);

  return () => clearInterval(interval);

}, []);

  return (
  <div className="min-h-screen bg-[#0B1020] text-white p-8">

    <div className="max-w-7xl mx-auto">

      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          API Sentinel
        </h1>

        <p className="text-gray-400 text-lg">
          Real-time API monitoring and alert system
        </p>

      </div>

    <div className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6 mb-10">

  <h2 className="text-2xl font-bold mb-6">
    Register User
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <input
      type="text"
      name="name"
      placeholder="Name"
      value={userData.name}
      onChange={handleUserChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={userData.email}
      onChange={handleUserChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

  </div>

  <button
    onClick={handleRegister}
    className="mt-6 bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl font-semibold"
  >
    Register
  </button>

</div>
      <div className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6 mb-10">

  <h2 className="text-2xl font-semibold mb-6">
    Add New API
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      type="text"
      name="name"
      placeholder="API Name"
      value={formData.name}
      onChange={handleChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

    <input
      type="text"
      name="url"
      placeholder="API URL"
      value={formData.url}
      onChange={handleChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

    <input
      type="text"
      name="method"
      placeholder="Method"
      value={formData.method}
      onChange={handleChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

    <input
      type="number"
      name="interval_seconds"
      placeholder="Interval Seconds"
      value={formData.interval_seconds}
      onChange={handleChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

    <input
      type="number"
      name="timeout_seconds"
      placeholder="Timeout Seconds"
      value={formData.timeout_seconds}
      onChange={handleChange}
      className="bg-[#0B1020] border border-gray-700 rounded-xl p-3 text-white"
    />

  </div>
  <button
  onClick={handleSubmit}
  className="mt-6 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl font-semibold"
>
  Add API
</button>

</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-gray-400 text-sm mb-2">
            Total APIs
          </h2>

          <p className="text-4xl font-bold">
            {apis.length}
          </p>
        </div>

        <div className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-gray-400 text-sm mb-2">
            Active Alerts
          </h2>

          <p className="text-4xl font-bold text-red-400">
            {downApis.length}
          </p>
        </div>

        <div className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-gray-400 text-sm mb-2">
            System Status
          </h2>

          <p
  className={`text-2xl font-semibold ${
    downApis.length > 0
      ? "text-red-400"
      : "text-green-400"
  }`}
>
            {downApis.length > 0 ? "Issues Detected" : "Operational"}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {apis.map((api) => (

          <div
            key={api.id}
            className="bg-[#121A2A] border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >

            <div className="flex items-center justify-between mb-4">

  <h2 className="text-2xl font-semibold">
    {api.name}
  </h2>

  <div className="flex items-center gap-2">

    <span
      className={`text-sm px-3 py-1 rounded-full ${
        api.success
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {api.success ? "Active" : "Down"}
    </span>

    <button
      onClick={() => handleDelete(api.id)}
      className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full hover:bg-red-500/30 transition"
    >
      Delete
    </button>

  </div>

</div>

            <div className="space-y-3 text-gray-400">

              <p>
                <span className="text-white font-medium">
                  Method:
                </span>{" "}
                {api.method}
              </p>

              <p className="break-all">
                <span className="text-white font-medium">
                  URL:
                </span>{" "}
                {api.url}
              </p>

              <p>
                <span className="text-white font-medium">
                  Interval:
                </span>{" "}
                {api.interval_seconds}s
              </p>

              <p>
  <span className="text-white font-medium">
    Status Code:
  </span>{" "}
  {api.status_code || "N/A"}
</p>

<p>
  <span className="text-white font-medium">
    Response Time:
  </span>{" "}
  {api.response_time_ms
    ? `${Math.round(api.response_time_ms)} ms`
    : "N/A"}
</p>

<p>
  <span className="text-white font-medium">
    Last Checked:
  </span>{" "}
  {api.checked_at
    ? new Date(api.checked_at).toLocaleTimeString()
    : "N/A"}
</p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>
);
}

export default App;