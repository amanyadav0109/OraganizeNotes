import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Settings() {

    const email = localStorage.getItem("email");

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-8">

                    <h1 className="text-3xl font-bold mb-8">

                        ⚙️ Settings

                    </h1>

                    {/* Profile Card */}

                    <div className="bg-white rounded-xl shadow p-8 mb-8">

                        <h2 className="text-2xl font-semibold mb-6">

                            Profile

                        </h2>

                        <div className="space-y-5">

                            <div>

                                <label className="text-gray-500">

                                    Email

                                </label>

                                <input
                                    value={email || ""}
                                    disabled
                                    className="w-full border rounded-lg p-3 mt-2 bg-gray-100"
                                />

                            </div>

                        </div>

                    </div>

                    {/* About */}

                    <div className="bg-white rounded-xl shadow p-8">

                        <h2 className="text-2xl font-semibold mb-6">

                            About

                        </h2>

                        <p className="text-gray-600">

                            StudyHub v1.0

                        </p>

                        <p className="text-gray-500 mt-2">

                            Organize your subjects and notes in one place.

                        </p>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default Settings;