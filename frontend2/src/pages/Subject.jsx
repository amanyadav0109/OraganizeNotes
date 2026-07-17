import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal from "../components/AddSubjectModal";
import { deleteSubject } from "../services/subjectService";
import { getSubjects } from "../services/subjectService";

function Subjects() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);

  const [showModal, setShowModal] = useState(false);

 
  const loadSubjects = async () => {
    try {
      const data = await getSubjects();

      setSubjects(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
  const ok = window.confirm(
    "Are you sure you want to delete this subject?"
  );

  if (!ok) return;

  try {
    await deleteSubject(id);
    loadSubjects();
  } catch (err) {
    console.log(err);
  }
};
 useEffect(() => {
    loadSubjects();
  }, []);


 return (
  <div className="page">
 <Navbar />

    
      <Sidebar />

          <main  className="
        lg:ml-56
        
        p-4
        sm:p-6
        lg:p-8
        pb-24
        min-h-[calc(100vh-4rem)]
      ">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 mb-8">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
              📚 Subjects
            </h1>

            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
              Organize your study notes subject wise.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Add Subject
          </button>

        </div>

        {/* Empty State */}

        {subjects.length === 0 ? (

          <div className="card p-8 sm:p-12 text-center">

            <h2 className="text-xl sm:text-2xl font-bold">
              No Subjects Yet 📚
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Create your first subject.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">

            {subjects.map((subject) => (

              <SubjectCard
                key={subject.id}
                subject={subject}
                onClick={() => navigate(`/subject/${subject.id}`)}
                onEdit={(subject) => {
                  setSelectedSubject(subject);
                  setShowEditModal(true);
                }}
                 onDelete={handleDelete}
              />

            ))}

          </div>

        )}

        {/* Bottom Navigation */}

        <BottomNav />

      </main>

   

    {/* Add Subject */}

    {showModal && (

      <AddSubjectModal
        closeModal={() => setShowModal(false)}
        refreshSubjects={loadSubjects}
      />

    )}

    {/* Edit Subject */}

    {showEditModal && (

      <AddSubjectModal
        editSubject={selectedSubject}
        closeModal={() => {
          setShowEditModal(false);
          setSelectedSubject(null);
        }}
        refreshSubjects={loadSubjects}
      />

    )}

  </div>
);
}

export default Subjects;
