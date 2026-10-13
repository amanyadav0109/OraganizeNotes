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

  <main
  className="
    ml-0
    lg:ml-[215px]

   
    sm:pt-10

    
    sm:p-6
    lg:p-8

    

    min-h-[calc(100vh-4rem)]
    min-w-0
    

    transition-all
    duration-200
  "
>

  {/* ================= HEADER ================= */}

  <div
    className="
      bg-white
      dark:bg-slate-900
      border
      border-gray-200
      dark:border-slate-800
      rounded-2xl
      px-4
      sm:px-6
      lg:px-8
      py-4
      sm:py-5
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-4
      shadow-sm
      dark:shadow-none
      transition-colors
    "
  >

    {/* LEFT SIDE */}

    <div className="flex items-center gap-3 min-w-0">

      <div className="min-w-0">

        <h1
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          📚 Subjects
        </h1>

        <p className="
          text-xs
          sm:text-sm
          text-gray-500
          dark:text-gray-400
          mt-1
        ">
          Manage your subjects
        </p>

      </div>

    </div>


    {/* ADD SUBJECT */}

    <button
      onClick={() => setShowModal(true)}
      className="
        w-full
        sm:w-auto
        min-h-[44px]
        bg-blue-600
        hover:bg-blue-700
        active:bg-blue-800
        text-white
        px-5
        sm:px-6
        py-3
        rounded-xl
        font-semibold
        flex
        items-center
        justify-center
        transition
        shadow-sm
        shrink-0
      "
    >
      + Add Subject
    </button>

  </div>


  {/* ================= EMPTY STATE ================= */}

  {subjects.length === 0 ? (

    <div
      className="
        mt-5
        sm:mt-6
        bg-white
        dark:bg-slate-900
        border
        border-gray-200
        dark:border-slate-800
        rounded-2xl
        p-8
        sm:p-12
        text-center
        shadow-sm
        dark:shadow-none
        transition-colors
      "
    >

      <h2 className="
        text-xl
        sm:text-2xl
        font-bold
        text-gray-900
        dark:text-white
      ">
        No Subjects Yet 📚
      </h2>

      <p className="
        text-sm
        sm:text-base
        text-gray-500
        dark:text-gray-400
        mt-3
      ">
        Create your first subject.
      </p>

    </div>

  ) : (

    /* ================= SUBJECT GRID ================= */

    <div
      className="
        mt-5
        sm:mt-6
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-4
        sm:gap-5
        lg:gap-6
      "
    >

      {subjects.map((subject) => (

        <SubjectCard

          key={subject.id}

          subject={subject}

          onClick={() =>
            navigate(`/subject/${subject.id}`)
          }

          onEdit={(subject) => {
            setSelectedSubject(subject);
            setShowEditModal(true);
          }}

          onDelete={handleDelete}

        />

      ))}

    </div>

  )}


  {/* ================= BOTTOM NAV ================= */}

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
