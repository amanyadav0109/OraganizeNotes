import React, { useState } from "react";
import axios from "axios";
import { FaFilePdf, FaUpload, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const SellNotes = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        unit: "",
        description: "",
        price: "",
    });

    const [pdf, setPdf] = useState(null);

   const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));
};
const handlePdfChange = (e) => {

    const selectedFile = e.target.files[0];

    if (!selectedFile) {
        return;
    }

    if (selectedFile.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        e.target.value = "";
        return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
        alert("PDF size must be less than 10MB.");
        e.target.value = "";
        return;
    }

    setPdf(selectedFile);
};


 const handleSubmit = async (e) => {

    e.preventDefault();


    // ==========================================
    // 1. CHECK PDF
    // ==========================================

    if (!pdf) {
        alert("Please select a PDF file.");
        return;
    }


    // ==========================================
    // 2. CHECK TOKEN
    // ==========================================

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("Token") ||
        localStorage.getItem("jwt");


    if (!token) {
        alert("Please login first.");
        return;
    }


    try {

        // ==========================================
        // STEP 1
        // UPLOAD PDF TO FIREBASE
        // ==========================================

        const pdfFormData = new FormData();

        pdfFormData.append("pdf", pdf);


        console.log("Uploading PDF...");
console.log("PDF BEFORE UPLOAD:", pdf);
console.log("PDF NAME:", pdf?.name);

        const uploadResponse = await axios.post(
            "http://localhost:5000/api/marketplace/upload-pdf",
            pdfFormData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        console.log(
            "PDF UPLOAD RESPONSE:",
            uploadResponse.data
        );


        // ==========================================
        // CHECK PDF UPLOAD
        // ==========================================

        if (!uploadResponse.data.success) {

            alert(
                uploadResponse.data.message ||
                "PDF upload failed."
            );

            return;
        }


        // ==========================================
        // GET FIREBASE FILE DETAILS
        // ==========================================

        const filePath =
            uploadResponse.data.filePath;

        const fileName =
            uploadResponse.data.fileName;


        console.log("FILE PATH:", filePath);
        console.log("FILE NAME:", fileName);


        if (!filePath || !fileName) {

            alert(
                "PDF uploaded but file information was not received."
            );

            return;
        }


        // ==========================================
        // STEP 2
        // CREATE MARKETPLACE NOTE
        // ==========================================

        const noteData = {

            title: formData.title,

            subject: formData.subject,

            unit: formData.unit,

            description: formData.description,

            price: Number(formData.price),

            filePath: filePath,

            fileName: fileName

        };


        console.log(
            "NOTE DATA:",
            noteData
        );


        const createResponse = await axios.post(
            "http://localhost:5000/api/marketplace",
            noteData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,

                    "Content-Type": "application/json"
                }
            }
        );


        console.log(
            "CREATE NOTE RESPONSE:",
            createResponse.data
        );


        // ==========================================
        // SUCCESS
        // ==========================================

        if (createResponse.data.success) {

            alert(
                "Note uploaded and listed successfully!"
            );


            // Clear form

            setPdf(null);

            setFormData({
                title: "",
                subject: "",
                unit: "",
                price: "",
                description: ""
            });


            // Go to Find Your Notes

            navigate("/find-notes");

        }

    } catch (error) {

        console.error(
            "UPLOAD & SELL ERROR:",
            error
        );


        console.error(
            "STATUS:",
            error.response?.status
        );


        console.error(
            "SERVER RESPONSE:",
            error.response?.data
        );


        alert(
            error.response?.data?.message ||
            "Something went wrong while uploading the note."
        );

    }
};

    return (
        <div className="page min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="
          lg:ml-56
          p-4
          sm:p-6
          lg:p-8
          pb-24
          min-h-[calc(100vh-4rem)]
        "
      >
        {/* =================================
            PAGE HEADER
        ================================= */}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            📚 Sell Your Notes
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Discover and purchase useful notes from other students.
          </p>
        </div>

                {/* Form Card */}
               <div className="max-w-[1050px] mx-auto">

    <form
        onSubmit={handleSubmit}
        className="
            bg-white dark:bg-[#111c32]
            border border-gray-200 dark:border-[#263653]
            rounded-2xl p-7
            shadow-sm dark:shadow-lg
            transition-colors duration-200
        "
    >

        {/* PDF Upload */}
        <div className="mb-7">

            <h2 className="text-lg font-semibold
                text-gray-800 dark:text-white
                mb-3"
            >
                Upload PDF
            </h2>

            <label
                htmlFor="pdf"
                className="block cursor-pointer"
            >
                <div
                    className="
                        border-2 border-dashed
                        border-gray-300 dark:border-[#385070]

                        rounded-xl

                        bg-gray-50 dark:bg-[#17243a]

                        hover:bg-gray-100
                        dark:hover:bg-[#1b2b44]

                        transition-colors duration-200

                        p-8 text-center
                    "
                >

                    {pdf ? (
                        <div className="flex flex-col items-center">

                            <FaFilePdf
                                className="
                                    text-red-500 dark:text-red-400
                                    text-4xl mb-3
                                "
                            />

                            <p className="
                                font-semibold
                                text-gray-800 dark:text-white
                            ">
                                {pdf.name}
                            </p>

                            <p className="
                                text-sm
                                text-gray-500 dark:text-gray-400
                                mt-1
                            ">
                                {(pdf.size / (1024 * 1024)).toFixed(2)} MB
                            </p>

                            <p className="
                                text-cyan-600 dark:text-cyan-400
                                text-sm mt-3
                            ">
                                Click to change PDF
                            </p>

                        </div>
                    ) : (
                        <div className="flex flex-col items-center">

                            <FaUpload
                                className="
                                    text-cyan-600 dark:text-cyan-400
                                    text-3xl mb-3
                                "
                            />

                            <p className="
                                font-semibold
                                text-gray-800 dark:text-white
                            ">
                                Click to upload your PDF
                            </p>

                            <p className="
                                text-sm
                                text-gray-500 dark:text-gray-400
                                mt-2
                            ">
                                PDF only • Maximum 10MB
                            </p>

                        </div>
                    )}

                </div>
            </label>

            <input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
            />

        </div>


        {/* Inputs */}
        <div className="grid grid-cols-2 gap-5">

            {/* Title */}
            <div className="col-span-2">

                <label className="
                    block text-sm
                    text-gray-700 dark:text-gray-300
                    mb-2
                ">
                    Note Title
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. DBMS Normalization Notes"
                    className="
                        w-full

                        bg-white dark:bg-[#1b2940]

                        border border-gray-300
                        dark:border-[#344765]

                        rounded-lg px-4 py-3

                        text-gray-900 dark:text-white

                        placeholder-gray-400
                        dark:placeholder-gray-500

                        outline-none

                        focus:border-cyan-500
                        dark:focus:border-cyan-400

                        transition-colors duration-200
                    "
                    required
                />

            </div>


            {/* Subject */}
            <div>

                <label className="
                    block text-sm
                    text-gray-700 dark:text-gray-300
                    mb-2
                ">
                    Subject
                </label>

                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. DBMS"
                    className="
                        w-full
                        bg-white dark:bg-[#1b2940]
                        border border-gray-300 dark:border-[#344765]
                        rounded-lg px-4 py-3
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        outline-none
                        focus:border-cyan-500 dark:focus:border-cyan-400
                        transition-colors duration-200
                    "
                    required
                />

            </div>


            {/* Unit */}
            <div>

                <label className="
                    block text-sm
                    text-gray-700 dark:text-gray-300
                    mb-2
                ">
                   Subtitle
                </label>

                <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g. Unit 3"
                    className="
                        w-full
                        bg-white dark:bg-[#1b2940]
                        border border-gray-300 dark:border-[#344765]
                        rounded-lg px-4 py-3
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        outline-none
                        focus:border-cyan-500 dark:focus:border-cyan-400
                        transition-colors duration-200
                    "
                    required
                />

            </div>


            {/* Price */}
            <div>

                <label className="
                    block text-sm
                    text-gray-700 dark:text-gray-300
                    mb-2
                ">
                    Price (₹)
                </label>

                <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    className="
                        w-full
                        bg-white dark:bg-[#1b2940]
                        border border-gray-300 dark:border-[#344765]
                        rounded-lg px-4 py-3
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        outline-none
                        focus:border-cyan-500 dark:focus:border-cyan-400
                        transition-colors duration-200
                    "
                    required
                />

            </div>


            {/* Description */}
            <div>

                <label className="
                    block text-sm
                    text-gray-700 dark:text-gray-300
                    mb-2
                ">
                    Description
                </label>

                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description"
                    className="
                        w-full
                        bg-white dark:bg-[#1b2940]
                        border border-gray-300 dark:border-[#344765]
                        rounded-lg px-4 py-3
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500
                        outline-none
                        focus:border-cyan-500 dark:focus:border-cyan-400
                        transition-colors duration-200
                    "
                />

            </div>

        </div>


        {/* Bottom Buttons */}
        <div className="
            border-t
            border-gray-200 dark:border-[#293955]
            mt-8 pt-6
        ">

            <div className="flex justify-between items-center">

                {/* Cancel */}
                <button
                    type="button"
                    onClick={() => navigate("/find-notes")}
                    className="
                        flex items-center gap-2

                        px-5 py-3

                        rounded-lg

                        border
                        border-gray-300 dark:border-[#3a4b67]

                        text-gray-600 dark:text-gray-300

                        hover:bg-gray-100
                        dark:hover:bg-[#1b2940]

                        transition-colors duration-200
                    "
                >
                    <FaArrowLeft />
                    Cancel
                </button>


                {/* Submit */}
                <button
                    type="submit"
                    className="
                        px-7 py-3
                        rounded-lg

                        bg-cyan-500
                        hover:bg-cyan-400

                        text-black
                        font-semibold

                        transition-colors duration-200
                    "
                >
                    Upload & Sell
                </button>

            </div>

        </div>

    </form>

</div>

            </main>
        </div>
    );
};

export default SellNotes;