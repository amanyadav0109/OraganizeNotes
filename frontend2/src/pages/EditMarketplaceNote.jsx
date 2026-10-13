import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaFilePdf } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

const EditMarketplaceNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        unit: "",
        description: "",
        price: "",
    });

    const [currentFileName, setCurrentFileName] = useState("");
    const [pdf, setPdf] = useState(null);

    const token = localStorage.getItem("token");

    // =========================
    // FETCH NOTE
    // =========================
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/marketplace/my-notes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const notes = response.data.notes || response.data;

                const foundNote = notes.find(
                    (note) => Number(note.id) === Number(id)
                );

                if (!foundNote) {
                    alert("Note not found");
                    navigate("/my-uploaded-notes");
                    return;
                }

                setFormData({
                    title: foundNote.title || "",
                    subject: foundNote.subject || "",
                    unit: foundNote.unit || "",
                    description: foundNote.description || "",
                    price: foundNote.price || "",
                });

                setCurrentFileName(foundNote.file_name || "");

            } catch (error) {
                console.error("FETCH NOTE ERROR:", error);
                alert("Failed to load note");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id, navigate, token]);

    // =========================
    // INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // PDF CHANGE
    // =========================
    const handlePdfChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("PDF size must be less than 10MB");
            return;
        }

        setPdf(selectedFile);
    };

    // =========================
    // SAVE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.subject.trim() ||
            !formData.unit.trim() ||
            formData.price === ""
        ) {
            alert("Please fill all required fields");
            return;
        }

        try {
            setSaving(true);

            let filePath = undefined;
            let fileName = undefined;

            // =================================
            // IF NEW PDF SELECTED
            // =================================
            if (pdf) {
                const uploadData = new FormData();

                uploadData.append("pdf", pdf);

                const uploadResponse = await axios.post(
                    "http://localhost:5000/api/marketplace/upload-pdf",
                    uploadData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                filePath = uploadResponse.data.filePath;
                fileName = uploadResponse.data.fileName;
            }

            // =================================
            // UPDATE NOTE
            // =================================
            const updateData = {
                title: formData.title,
                subject: formData.subject,
                unit: formData.unit,
                description: formData.description,
                price: Number(formData.price),
            };

            // Add new PDF only if user selected one
            if (filePath) {
                updateData.filePath = filePath;
                updateData.fileName = fileName;
            }

            await axios.put(
                `http://localhost:5000/api/marketplace/${id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Note updated successfully");

            navigate("/my-uploaded-notes");

        } catch (error) {
            console.error("UPDATE NOTE ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update note"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Sidebar />

                <main className="ml-0 md:ml-[215px] lg:ml-[220px] pt-[90px] px-4 sm:px-6 lg:px-8 min-h-screen">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <p className="text-gray-600 dark:text-gray-300">
                            Loading note...
                        </p>
                    </div>
                </main>

                <BottomNav />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Sidebar />

            <main
                className="
                    ml-0
                    md:ml-[215px]
                    lg:ml-[220px]

                    pt-[90px]

                    px-4
                    sm:px-6
                    lg:px-8

                    pb-10

                    min-h-screen

                    bg-gray-50
                    dark:bg-[#0f172a]

                    transition-all
                    duration-200
                "
            >

                {/* HEADER */}

                <div className="max-w-4xl mx-auto">

                    <button
                        onClick={() => navigate("/my-uploaded-notes")}
                        className="
                            flex
                            items-center
                            gap-2

                            mb-6

                            text-sm
                            font-medium

                            text-gray-600
                            dark:text-gray-300

                            hover:text-black
                            dark:hover:text-white

                            transition-colors
                        "
                    >
                        <FaArrowLeft />

                        Back to My Uploaded Notes
                    </button>


                    <div className="mb-7">

                        <h1
                            className="
                                text-2xl
                                sm:text-3xl

                                font-bold

                                text-gray-900
                                dark:text-white
                            "
                        >
                            Edit Marketplace Note
                        </h1>

                        <p
                            className="
                                mt-2

                                text-sm

                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Update your note details and pricing.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            bg-white
                            dark:bg-[#111c2e]

                            border
                            border-gray-200
                            dark:border-[#263653]

                            rounded-2xl

                            p-5
                            sm:p-7

                            shadow-sm
                        "
                    >

                        {/* TITLE */}

                        <div className="mb-5">

                            <label
                                className="
                                    block
                                    mb-2

                                    text-sm
                                    font-medium

                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Note Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter note title"
                                className="
                                    w-full

                                    px-4
                                    py-3

                                    rounded-xl

                                    border
                                    border-gray-300
                                    dark:border-[#30415e]

                                    bg-white
                                    dark:bg-[#172238]

                                    text-gray-900
                                    dark:text-white

                                    placeholder-gray-400

                                    outline-none

                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* SUBJECT + UNIT */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2

                                gap-5

                                mb-5
                            "
                        >

                            <div>

                                <label
                                    className="
                                        block
                                        mb-2

                                        text-sm
                                        font-medium

                                        text-gray-700
                                        dark:text-gray-300
                                    "
                                >
                                    Subject *
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. DBMS"
                                    className="
                                        w-full

                                        px-4
                                        py-3

                                        rounded-xl

                                        border
                                        border-gray-300
                                        dark:border-[#30415e]

                                        bg-white
                                        dark:bg-[#172238]

                                        text-gray-900
                                        dark:text-white

                                        outline-none

                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>


                            <div>

                                <label
                                    className="
                                        block
                                        mb-2

                                        text-sm
                                        font-medium

                                        text-gray-700
                                        dark:text-gray-300
                                    "
                                >
                                    Unit *
                                </label>

                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    placeholder="e.g. Unit 3"
                                    className="
                                        w-full

                                        px-4
                                        py-3

                                        rounded-xl

                                        border
                                        border-gray-300
                                        dark:border-[#30415e]

                                        bg-white
                                        dark:bg-[#172238]

                                        text-gray-900
                                        dark:text-white

                                        outline-none

                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                        </div>


                        {/* PRICE */}

                        <div className="mb-5">

                            <label
                                className="
                                    block
                                    mb-2

                                    text-sm
                                    font-medium

                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Price (₹) *
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                placeholder="Enter price"
                                className="
                                    w-full

                                    px-4
                                    py-3

                                    rounded-xl

                                    border
                                    border-gray-300
                                    dark:border-[#30415e]

                                    bg-white
                                    dark:bg-[#172238]

                                    text-gray-900
                                    dark:text-white

                                    outline-none

                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="mb-5">

                            <label
                                className="
                                    block
                                    mb-2

                                    text-sm
                                    font-medium

                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Describe what your notes contain..."
                                className="
                                    w-full

                                    px-4
                                    py-3

                                    rounded-xl

                                    border
                                    border-gray-300
                                    dark:border-[#30415e]

                                    bg-white
                                    dark:bg-[#172238]

                                    text-gray-900
                                    dark:text-white

                                    placeholder-gray-400

                                    resize-none

                                    outline-none

                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* CURRENT PDF */}

                        <div className="mb-5">

                            <label
                                className="
                                    block
                                    mb-2

                                    text-sm
                                    font-medium

                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Current PDF
                            </label>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3

                                    p-4

                                    rounded-xl

                                    bg-gray-50
                                    dark:bg-[#172238]

                                    border
                                    border-gray-200
                                    dark:border-[#30415e]
                                "
                            >

                                <FaFilePdf
                                    className="text-red-500 text-xl"
                                />

                                <span
                                    className="
                                        text-sm
                                        text-gray-700
                                        dark:text-gray-300

                                        truncate
                                    "
                                >
                                    {currentFileName || "No PDF available"}
                                </span>

                            </div>

                        </div>


                        {/* REPLACE PDF */}

                        <div className="mb-7">

                            <label
                                className="
                                    block
                                    mb-2

                                    text-sm
                                    font-medium

                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Replace PDF
                            </label>

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfChange}
                                className="
                                    w-full

                                    px-4
                                    py-3

                                    rounded-xl

                                    border
                                    border-gray-300
                                    dark:border-[#30415e]

                                    bg-white
                                    dark:bg-[#172238]

                                    text-gray-700
                                    dark:text-gray-300

                                    text-sm
                                "
                            />

                            {pdf && (
                                <p
                                    className="
                                        mt-2
                                        text-xs
                                        text-green-600
                                        dark:text-green-400
                                    "
                                >
                                    New PDF selected: {pdf.name}
                                </p>
                            )}

                        </div>


                        {/* BUTTONS */}

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row

                                gap-3

                                justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/my-uploaded-notes")
                                }
                                className="
                                    px-5
                                    py-3

                                    rounded-xl

                                    border
                                    border-gray-300
                                    dark:border-[#30415e]

                                    text-gray-700
                                    dark:text-gray-300

                                    hover:bg-gray-100
                                    dark:hover:bg-[#172238]

                                    font-medium

                                    transition-colors
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2

                                    px-5
                                    py-3

                                    rounded-xl

                                    bg-blue-600
                                    hover:bg-blue-700

                                    disabled:opacity-50
                                    disabled:cursor-not-allowed

                                    text-white

                                    font-medium

                                    transition-colors
                                "
                            >

                                <FaSave />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </div>

            </main>

            <BottomNav />
        </>
    );
};

export default EditMarketplaceNote;