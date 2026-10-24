import React, { useEffect, useState } from "react";
import {
    FaFilePdf,
    FaEdit,
    FaTrash,
    FaPlus
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MyUploadedNotes = () => {

    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);


    // ================= TOKEN =================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("Token") ||
            localStorage.getItem("jwt")
        );
    };


    // ================= FETCH MY NOTES =================

    const fetchMyNotes = async () => {

        try {

            const token = getToken();

            const response = await axios.get(
                "http://localhost:5000/api/marketplace/my-notes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setNotes(response.data.notes || []);
            }

        } catch (error) {

            console.error(
                "MY UPLOADED NOTES ERROR:",
                error
            );

            setNotes([]);

        } finally {

            setLoading(false);

        }
    };


    // ================= LOAD NOTES =================

    useEffect(() => {
        fetchMyNotes();
    }, []);


    // ================= DELETE NOTE =================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = getToken();

            const response = await axios.delete(
                `http://localhost:5000/api/marketplace/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {

                setNotes((prevNotes) =>
                    prevNotes.filter(
                        (note) => note.id !== id
                    )
                );

                alert("Note deleted successfully.");

            }

        } catch (error) {

            console.error(
                "DELETE NOTE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete note."
            );

        }
    };


    // ================= TOTAL VALUE =================

    const totalValue = notes.reduce(
        (total, note) =>
            total + Number(note.price || 0),
        0
    );


    return (

        <div className="
            page min-h-screen bg-gray-50 dark:bg-[#080d18] transition-colors duration-200
        ">

            {/* ================= NAVBAR ================= */}

            <Navbar />


            {/* ================= SIDEBAR ================= */}

            <Sidebar />


            {/* ================= MAIN CONTENT ================= */}

           <main className="
    ml-0
    lg:ml-[215px]

    pt-20
    sm:pt-10

    p-4
    sm:p-6
    lg:p-8

    pb-24

    min-h-[calc(100vh-4rem)]
    min-w-0
    w-80%

    transition-all
    duration-200
  ">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div  className="
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
            mb-5
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
          ">


                    {/* TITLE */}

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            {/* ICON */}

                            <div className="
                                w-11
                                h-11

                                rounded-xl

                                bg-blue-100
                                dark:bg-blue-500/10

                                flex
                                items-center
                                justify-center
                            ">

                                <FaFilePdf
                                    className="
                                        text-blue-600
                                        dark:text-blue-400
                                        text-xl
                                    "
                                />

                            </div>


                            {/* TEXT */}

                            <div className="min-w-0">

                                <h1
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-bold
                  text-gray-900
                  dark:text-white
                  truncate
                "
              >
                                    My Uploaded Notes
                                </h1>


                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1
                                ">
                                    Manage the notes you have uploaded
                                    for sale.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* UPLOAD BUTTON */}

                    <button
                        onClick={() =>
                            navigate("/sell-notes")
                        }
                         className="
              w-full
              sm:w-auto
              min-h-[44px]
              bg-blue-600
              hover:bg-blue-700
              active:bg-blue-800
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              font-semibold
              transition
              shadow-sm
              shrink-0
            "
                    >

                        <FaPlus />

                        Upload New Note

                    </button>

                </div>


                {loading && (

                    <div className="
                        max-w-[1200px]
                        mx-auto

                        bg-white
                        dark:bg-[#111c32]

                        border
                        border-gray-200
                        dark:border-[#263653]

                        rounded-2xl

                        py-20

                        text-center
                    ">

                        <div className="
                            w-10
                            h-10

                            border-4

                            border-gray-200
                            dark:border-gray-700

                            border-t-cyan-500

                            rounded-full

                            animate-spin

                            mx-auto

                            mb-5
                        " />

                        <p className="
                            text-gray-500
                            dark:text-gray-400
                        ">
                            Loading your uploaded notes...
                        </p>

                    </div>

                )}


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                {!loading && notes.length > 0 && (

                    <div className="
                        grid

                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3

                        gap-4

                        mb-8
                    ">


                        {/* TOTAL NOTES */}

                        <div className="
                            bg-white
                            dark:bg-[#111c32]

                            border
                            border-gray-200
                            dark:border-[#263653]

                            rounded-xl

                            p-5

                            shadow-sm
                            dark:shadow-none
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-11
                                    h-11

                                    rounded-lg

                                    bg-blue-100
                                    dark:bg-blue-500/10

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <FaFilePdf
                                        className="
                                            text-blue-600
                                            dark:text-blue-400
                                        "
                                    />

                                </div>


                                <div>

                                    <p className="
                                        text-sm

                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        Uploaded Notes
                                    </p>


                                    <p className="
                                        text-2xl

                                        font-bold

                                        text-gray-900
                                        dark:text-white
                                    ">
                                        {notes.length}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* LISTED VALUE */}

                        <div className="
                            bg-white
                            dark:bg-[#111c32]

                            border
                            border-gray-200
                            dark:border-[#263653]

                            rounded-xl

                            p-5

                            shadow-sm
                            dark:shadow-none
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-11
                                    h-11

                                    rounded-lg

                                    bg-cyan-100
                                    dark:bg-cyan-500/10

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <span className="
                                        text-cyan-600
                                        dark:text-cyan-400

                                        text-xl

                                        font-bold
                                    ">
                                        ₹
                                    </span>

                                </div>


                                <div>

                                    <p className="
                                        text-sm

                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        Listed Value
                                    </p>


                                    <p className="
                                        text-2xl

                                        font-bold

                                        text-gray-900
                                        dark:text-white
                                    ">
                                        ₹{totalValue.toFixed(2)}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* STATUS */}

                        <div className="
                            bg-white
                            dark:bg-[#111c32]

                            border
                            border-gray-200
                            dark:border-[#263653]

                            rounded-xl

                            p-5

                            shadow-sm
                            dark:shadow-none
                        ">

                            <div className="
                                flex
                                items-center
                                gap-4
                            ">

                                <div className="
                                    w-11
                                    h-11

                                    rounded-lg

                                    bg-green-100
                                    dark:bg-green-500/10

                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <span className="
                                        w-3
                                        h-3

                                        rounded-full

                                        bg-green-500
                                    " />

                                </div>


                                <div>

                                    <p className="
                                        text-sm

                                        text-gray-500
                                        dark:text-gray-400
                                    ">
                                        Marketplace Status
                                    </p>


                                    <p className="
                                        text-lg

                                        font-semibold

                                        text-green-600
                                        dark:text-green-400
                                    ">
                                        Active
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* EMPTY STATE */}
                {/* ================================================= */}

                {!loading && notes.length === 0 && (

                    <div className="
                        max-w-[900px]
                        mx-auto

                        bg-white
                        dark:bg-[#111c32]

                        border
                        border-gray-200
                        dark:border-[#263653]

                        rounded-2xl

                        px-6
                        sm:px-10

                        py-14
                        sm:py-16

                        text-center

                        shadow-sm
                        dark:shadow-none
                    ">


                        {/* ICON */}

                        <div className="
                            w-20
                            h-20

                            mx-auto

                            rounded-2xl

                            bg-red-100
                            dark:bg-red-500/10

                            flex
                            items-center
                            justify-center

                            mb-5
                        ">

                            <FaFilePdf
                                className="
                                    text-red-500
                                    dark:text-red-400

                                    text-3xl
                                "
                            />

                        </div>


                        {/* TITLE */}

                        <h2 className="
                            text-xl
                            sm:text-2xl

                            font-bold

                            text-gray-900
                            dark:text-white
                        ">
                            No notes uploaded yet
                        </h2>


                        {/* DESCRIPTION */}

                        <p className="
                            max-w-md

                            mx-auto

                            text-sm
                            sm:text-base

                            text-gray-500
                            dark:text-gray-400

                            mt-2
                            mb-7
                        ">
                            Share your study material with other
                            students and start selling your notes.
                        </p>


                        {/* BUTTON */}

                        <button
                            onClick={() =>
                                navigate("/sell-notes")
                            }
                            className="
                                inline-flex

                                items-center
                                gap-2

                                px-6
                                py-3

                                rounded-xl

                                bg-cyan-500
                                hover:bg-cyan-400

                                text-black

                                font-semibold

                                transition-all
                                duration-200
                            "
                        >

                            <FaPlus />

                            Upload Your First Note

                        </button>

                    </div>

                )}


                {/* ================================================= */}
                {/* NOTES SECTION */}
                {/* ================================================= */}

                {!loading && notes.length > 0 && (

                    <section>


                        {/* SECTION HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between

                            mb-5
                        ">

                            <div>

                                <h2 className="
                                    text-lg

                                    font-semibold

                                    text-gray-900
                                    dark:text-white
                                ">
                                    Your Notes
                                </h2>


                                <p className="
                                    text-sm

                                    text-gray-500
                                    dark:text-gray-400
                                ">
                                    {notes.length} note
                                    {notes.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    listed for sale
                                </p>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* NOTE CARDS */}
                        {/* ================================================= */}

                        <div className="
                            grid

                            grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-3

                            gap-5
                        ">


                           {notes.map((note) => (
    <div
        key={note.id}
        onClick={() =>
            navigate(`/view-marketplace-note/${note.id}`)
        }
        className="
            group
            bg-white
            dark:bg-[#111c32]

            border
            border-gray-200
            dark:border-[#263653]

            rounded-2xl

            p-5

            shadow-sm
            dark:shadow-none

            hover:border-cyan-300
            dark:hover:border-cyan-500/40

            hover:bg-gray-50
            dark:hover:bg-[#142238]

            transition-all
            duration-200

            cursor-pointer
        "
    >

        {/* CARD TOP */}

        <div
            className="
                flex
                items-start
                justify-between
                gap-3
            "
        >

            {/* PDF + TITLE */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                    min-w-0
                "
            >

                <div
                    className="
                        shrink-0

                        w-12
                        h-12

                        rounded-xl

                        bg-red-100
                        dark:bg-red-500/10

                        flex
                        items-center
                        justify-center
                    "
                >

                    <FaFilePdf
                        className="
                            text-red-500
                            dark:text-red-400
                            text-xl
                        "
                    />

                </div>


                <div className="min-w-0">

                    <h3
                        className="
                            font-semibold

                            text-gray-900
                            dark:text-white

                            truncate
                        "
                    >
                        {note.title}
                    </h3>


                    <p
                        className="
                            text-xs

                            text-gray-500
                            dark:text-gray-400

                            mt-1

                            truncate
                        "
                    >
                        {note.file_name}
                    </p>

                </div>

            </div>


            {/* PRICE */}

            <span
                className="
                    shrink-0

                    font-bold

                    text-cyan-600
                    dark:text-cyan-400
                "
            >
                ₹
                {Number(
                    note.price || 0
                ).toFixed(2)}
            </span>

        </div>


        {/* TAGS */}

        <div
            className="
                flex
                flex-wrap

                gap-2

                mt-5
            "
        >

            <span
                className="
                    px-3
                    py-1

                    rounded-full

                    text-xs
                    font-medium

                    bg-cyan-100
                    dark:bg-cyan-500/10

                    text-cyan-700
                    dark:text-cyan-400
                "
            >
                {note.subject}
            </span>


            <span
                className="
                    px-3
                    py-1

                    rounded-full

                    text-xs
                    font-medium

                    bg-purple-100
                    dark:bg-purple-500/10

                    text-purple-700
                    dark:text-purple-400
                "
            >
                {note.unit}
            </span>

        </div>


        {/* DESCRIPTION */}

        <p
            className="
                text-sm

                text-gray-600
                dark:text-gray-400

                mt-4

                min-h-[40px]

                line-clamp-2
            "
        >
            {note.description ||
                "No description provided."}
        </p>


        {/* DIVIDER */}

        <div
            className="
                border-t

                border-gray-200
                dark:border-[#293955]

                mt-5
                pt-4
            "
        >

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row

                    sm:items-center
                    sm:justify-between

                    gap-3
                "
            >

                {/* DATE */}

                <span
                    className="
                        text-xs

                        text-gray-500
                        dark:text-gray-400
                    "
                >
                    Uploaded{" "}
                    {new Date(
                        note.created_at
                    ).toLocaleDateString()}
                </span>


                {/* ACTIONS */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    {/* EDIT */}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            navigate(
                                `/edit-marketplace-note/${note.id}`
                            );
                        }}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-1.5

                            px-3
                            py-2

                            rounded-lg

                            bg-gray-100
                            dark:bg-[#1b2940]

                            text-gray-700
                            dark:text-gray-300

                            hover:bg-gray-200
                            dark:hover:bg-[#263653]

                            text-xs
                            font-medium

                            transition-colors
                        "
                    >

                        <FaEdit />

                        Edit

                    </button>


                    {/* DELETE */}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            handleDelete(note.id);
                        }}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-1.5

                            px-3
                            py-2

                            rounded-lg

                            bg-red-50
                            dark:bg-red-500/10

                            text-red-600
                            dark:text-red-400

                            hover:bg-red-100
                            dark:hover:bg-red-500/20

                            text-xs
                            font-medium

                            transition-colors
                        "
                    >

                        <FaTrash />

                        Delete

                    </button>

                </div>

            </div>

        </div>

    </div>
))}

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
};

export default MyUploadedNotes;