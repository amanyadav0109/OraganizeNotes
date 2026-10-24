import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";


function EditNote() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
const [updating, setUpdating] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [reminder, setReminder] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePdfChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {
            alert("Please select a PDF file only.");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("PDF size should be less than 10 MB.");
            e.target.value = "";
            return;
        }

        setPdfFile(file);
    };

    const removePdf = () => {
        setPdfFile(null);

        const input = document.getElementById("pdf-upload");

        if (input) {
            input.value = "";
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
        alert("Please enter note title.");
        return;
    }

    try {
        setUpdating(true);

        await axios.put(
            `http://localhost:5000/api/notes/${id}`,
            {
                title: title.trim(),
                content: content.trim(),
                dueDate: reminder || null
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Note updated successfully!");

        navigate(`/note/${id}`);

    } catch (error) {

        console.error("UPDATE NOTE ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Failed to update note"
        );

    } finally {
        setUpdating(false);
    }
}; 
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
            <Navbar />
            <Sidebar />

            <main
                className="
                    ml-0 lg:ml-[215px]
    sm:pt-10   
    sm:p-6
    lg:p-8 
    min-h-[calc(100vh-4rem)]
    min-w-0
    transition-all
    duration-200">
                <div
                    className="
                        mb-5
                        sm:mb-6
                        lg:mb-8

                        w-full

                        bg-white
                        dark:bg-slate-900

                        border
                        border-gray-200
                        dark:border-slate-800

                        rounded-xl
                        sm:rounded-2xl

                        px-4
                        sm:px-6
                        lg:px-8

                        py-4
                        sm:py-5
                        lg:py-6

                        shadow-sm
                        dark:shadow-none

                        transition-colors
                    "
                >
                    <button
                        type="button"
                        onClick={() => navigate(`/subject/${id}`)}
                        className="
                            inline-flex
                            items-center
                            gap-2

                            mb-4
                            sm:mb-5

                            text-sm
                            sm:text-base

                            font-medium

                            text-gray-500
                            dark:text-gray-400

                            hover:text-blue-600
                            dark:hover:text-blue-400

                            transition-colors
                        "
                    >
                        <span className="text-lg sm:text-xl">
                            ←
                        </span>

                        <span>
                            Back to Old Note
                        </span>
                    </button>

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center

                            gap-3
                            sm:gap-4
                        "
                    >
                        <div
                            className="
                                w-11
                                h-11

                                sm:w-14
                                sm:h-14

                                shrink-0

                                flex
                                items-center
                                justify-center

                                rounded-xl

                                bg-blue-50
                                dark:bg-blue-500/10

                                border
                                border-blue-100
                                dark:border-blue-500/20

                                text-xl
                                sm:text-2xl
                            "
                        >
                            📝
                        </div>

                        <div className="min-w-0">
                            <h1
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    lg:text-4xl

                                    font-bold
                                    tracking-tight

                                    text-gray-900
                                    dark:text-white
                                "
                            >
                               Update Note
                            </h1>

                           
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="
                        w-full
                        min-w-0

                        bg-white
                        dark:bg-slate-900

                        border
                        border-gray-200
                        dark:border-slate-800

                        rounded-xl
                        sm:rounded-2xl

                        p-4
                        sm:p-6
                        lg:p-8

                        shadow-sm
                        dark:shadow-none

                        transition-colors
                    "
                >
                    <div className="mb-6">
                        <label
                            className="
                                block
                                mb-2

                                text-sm
                                sm:text-base

                                font-semibold

                                text-gray-800
                                dark:text-gray-200
                            "
                        >
                         Update   Note Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            className="
                                w-full
                                min-w-0

                                h-12
                                sm:h-[52px]

                                rounded-xl

                                border
                                border-gray-300
                                dark:border-slate-700

                                bg-gray-50
                                dark:bg-slate-800

                                px-4

                                text-sm
                                sm:text-base

                                text-gray-900
                                dark:text-white

                                placeholder:text-gray-400
                                dark:placeholder:text-gray-500

                                outline-none

                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20

                                transition
                            "
                        />
                    </div>

                    <div className="mb-6">
                        <div
                            className="
                                mb-2

                                flex
                                flex-col
                                sm:flex-row

                                sm:items-center
                                sm:justify-between

                                gap-1
                            "
                        >
                            <label
                                className="
                                    text-sm
                                    sm:text-base

                                    font-semibold

                                    text-gray-800
                                    dark:text-gray-200
                                "
                            >
                                Update  Content
                            </label>

                            <span
                                className="
                                    text-xs
                                    sm:text-sm

                                    text-gray-400
                                    dark:text-gray-500
                                "
                            >
                                Optional if PDF is attached
                            </span>
                        </div>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your notes here..."
                            className="
                                w-full
                                min-w-0

                                min-h-[180px]
                                sm:min-h-[220px]
                                lg:min-h-[260px]

                                resize-y

                                rounded-xl

                                border
                                border-gray-300
                                dark:border-slate-700

                                bg-gray-50
                                dark:bg-slate-800

                                px-4
                                py-3

                                text-sm
                                sm:text-base

                                text-gray-900
                                dark:text-white

                                placeholder:text-gray-400
                                dark:placeholder:text-gray-500

                                outline-none

                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20

                                transition
                            "
                        />
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            my-6
                        "
                    >
                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />

                        <span
                            className="
                                text-xs
                                sm:text-sm

                                font-medium

                                text-gray-400
                                dark:text-gray-500
                            "
                        >
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
                    </div>

                    <div className="mb-6">
                        <label
                            className="
                                block
                                mb-2

                                text-sm
                                sm:text-base

                                font-semibold

                                text-gray-800
                                dark:text-gray-200
                            "
                        >
                           Update Attach PDF
                        </label>

                        {!pdfFile ? (
                            <label
                                htmlFor="pdf-upload"
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center

                                    w-full

                                    min-h-[150px]
                                    sm:min-h-[170px]

                                    px-4
                                    py-6

                                    rounded-xl

                                    border-2
                                    border-dashed

                                    border-gray-300
                                    dark:border-slate-700

                                    bg-gray-50
                                    dark:bg-slate-800/50

                                    cursor-pointer

                                    hover:border-blue-400
                                    dark:hover:border-blue-500

                                    hover:bg-blue-50/50
                                    dark:hover:bg-blue-500/5

                                    transition
                                "
                            >
                                <div
                                    className="
                                        w-12
                                        h-12

                                        flex
                                        items-center
                                        justify-center

                                        rounded-full

                                        bg-red-50
                                        dark:bg-red-500/10

                                        text-2xl
                                    "
                                >
                                    📄
                                </div>

                                <p
                                    className="
                                        mt-3

                                        text-sm
                                        sm:text-base

                                        font-medium

                                        text-gray-700
                                        dark:text-gray-300

                                        text-center
                                    "
                                >
                                    Click to upload PDF
                                </p>

                                <p
                                    className="
                                        mt-1

                                        text-xs
                                        sm:text-sm

                                        text-gray-400
                                        dark:text-gray-500

                                        text-center
                                    "
                                >
                                    PDF only • Maximum 10 MB
                                </p>
                            </label>
                        ) : (
                            <div
                                className="
                                    w-full

                                    flex
                                    flex-col
                                    sm:flex-row

                                    sm:items-center
                                    sm:justify-between

                                    gap-4

                                    p-4

                                    rounded-xl

                                    border
                                    border-green-200
                                    dark:border-green-500/20

                                    bg-green-50
                                    dark:bg-green-500/10
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3

                                        min-w-0
                                    "
                                >
                                    <div
                                        className="
                                            w-10
                                            h-10

                                            shrink-0

                                            flex
                                            items-center
                                            justify-center

                                            rounded-lg

                                            bg-red-100
                                            dark:bg-red-500/10

                                            text-xl
                                        "
                                    >
                                        📄
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-sm
                                                sm:text-base

                                                font-medium

                                                text-gray-800
                                                dark:text-gray-200

                                                truncate
                                            "
                                        >
                                            {pdfFile.name}
                                        </p>

                                        <p
                                            className="
                                                text-xs

                                                text-gray-500
                                                dark:text-gray-400
                                            "
                                        >
                                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={removePdf}
                                    className="
                                        shrink-0

                                        px-4
                                        py-2

                                        rounded-lg

                                        text-sm
                                        font-medium

                                        text-red-600
                                        dark:text-red-400

                                        bg-red-50
                                        dark:bg-red-500/10

                                        hover:bg-red-100
                                        dark:hover:bg-red-500/20

                                        transition
                                    "
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        <input
                            id="pdf-upload"
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfChange}
                            className="hidden"
                        />
                    </div>

                    <div className="mb-8">
                        <label
                            className="
                                block
                                mb-2

                                text-sm
                                sm:text-base

                                font-semibold

                                text-gray-800
                                dark:text-gray-200
                            "
                        >
                            Reminder
                        </label>

                        <input
                            type="datetime-local"
                            value={reminder}
                            onChange={(e) => setReminder(e.target.value)}
                            className="
                                w-full
                                sm:max-w-md

                                h-12

                                rounded-xl

                                border
                                border-gray-300
                                dark:border-slate-700

                                bg-gray-50
                                dark:bg-slate-800

                                px-4

                                text-sm
                                sm:text-base

                                text-gray-900
                                dark:text-white

                                outline-none

                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20

                                transition
                            "
                        />
                    </div>

                    <div
                        className="
                            flex
                            flex-col-reverse
                            sm:flex-row

                            sm:justify-end

                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={() => navigate(`/subject/${id}`)}
                            disabled={loading}
                            className="
                                w-full
                                sm:w-auto

                                px-5
                                py-3

                                rounded-xl

                                border
                                border-gray-300
                                dark:border-slate-700

                                text-sm
                                sm:text-base

                                font-medium

                                text-gray-700
                                dark:text-gray-300

                                hover:bg-gray-100
                                dark:hover:bg-slate-800

                                transition

                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                sm:w-auto

                                px-6
                                py-3

                                rounded-xl

                                bg-blue-600
                                hover:bg-blue-700

                                dark:bg-blue-500
                                dark:hover:bg-blue-600

                                text-white

                                text-sm
                                sm:text-base

                                font-semibold

                                shadow-sm

                                transition

                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Updating..." : "Update Note"}
                        </button>
                    </div>
                </form>
            </main>

            <BottomNav />
        </div>
    );
}

export default EditNote;