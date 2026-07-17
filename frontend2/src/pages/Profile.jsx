import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";

function Profile() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleShare = async () => {
    const url = `${window.location.origin}/user/${user.id}`;

    if (navigator.share) {
      await navigator.share({
        title: "StudyHub",

        text: "Check out my StudyHub profile",

        url,
      });
    } else {
      await navigator.clipboard.writeText(url);

      alert("Profile link copied!");
    }
  };

  return (
    <div className="page">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 flex justify-center items-center p-10">
          <div className="card w-full max-w-xl p-10">
            <div className="flex flex-col items-center">
              <Avatar name={user?.name} email={user?.email} size={120} />

              <h1 className="text-3xl font-bold mt-5">{user?.name}</h1>

              <p className="text-gray-500 dark:text-gray-300 mt-2">
                {user?.email}
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <button
                onClick={() => navigate("/profile/edit-name")}
                className="w-full bg-blue-400 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                ✏️ Edit Display Name
              </button>

            

              <button
                onClick={handleShare}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                📤 Share Profile
              </button>

              
            </div>
          </div>
          <BottomNav />
        </main>
      </div>
    </div>
  );
}

export default Profile;
