
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { FaArrowLeft, FaFilePdf, FaEye } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

import api from "../services/api";

const ViewMarketplaceNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let createdUrls = [];

    const loadNote = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        // Fetch uploaded notes
        const response = await api.get("/marketplace/my-notes");

        const notes = response.data.notes || response.data;

        const foundNote = notes.find(
          (item) => Number(item.id) === Number(id)
        );

        if (!foundNote) {
          toast.error("Note not found");
          navigate("/my-uploaded-notes");
          return;
        }

        if (!mounted) return;

        setNote(foundNote);

        // Fetch first PDF page
        const firstPage = await api.get(
          `/marketplace/preview/${id}?page=0`,
          {
            responseType: "blob",
          }
        );

        const totalPages = Number(
          firstPage.headers["x-page-count"]
        );

        if (!totalPages || totalPages < 1) {
          throw new Error("PDF page count not received");
        }

        if (!mounted) return;

        setPageCount(totalPages);

        // Fetch remaining PDF pages
        const requests = [];

        for (let page = 1; page < totalPages; page++) {
          requests.push(
            api.get(
              `/marketplace/preview/${id}?page=${page}`,
              {
                responseType: "blob",
              }
            )
          );
        }

        const otherPages = await Promise.all(requests);

        const allResponses = [firstPage, ...otherPages];

        // Convert PDF page blobs into image URLs
        const imageUrls = allResponses.map((pageResponse) =>
          URL.createObjectURL(pageResponse.data)
        );

        createdUrls = imageUrls;

        if (!mounted) {
          imageUrls.forEach((url) => URL.revokeObjectURL(url));
          createdUrls = [];
          return;
        }

        setPages(imageUrls);

      } catch (error) {
        console.error("VIEW MARKETPLACE NOTE ERROR:", error);
        console.error("SERVER RESPONSE:", error.response?.data);

        if (error.response?.status === 403) {
          toast.error("You are not authorized to view this note.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to load note"
          );
        }

        if (mounted) {
          navigate("/my-uploaded-notes");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      mounted = false;

      createdUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />

        <main
          className="
            w-full
            ml-0
            md:ml-[215px]
            lg:ml-[215px]
            pt-[85px]
            md:pt-[90px]
            px-4
            sm:px-6
            lg:px-8
            pb-24
            md:pb-10
            min-h-screen
            bg-gray-50
            dark:bg-[#070d1d]
            overflow-x-hidden
          "
        >
          <div className="w-full min-h-[70vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className="
                  w-10 h-10 rounded-full
                  border-4 border-cyan-500/20
                  border-t-cyan-500 animate-spin
                "
              />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading your uploaded note...
              </p>
            </div>
          </div>
        </main>

        <BottomNav />
      </>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <Sidebar />

        <main className="lg:ml-56 p-6 flex flex-col items-center justify-center min-h-[70vh]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Note not found.
          </h2>

          <button
            onClick={() => navigate("/my-uploaded-notes")}
            className="mt-4 px-5 py-2 rounded-lg bg-cyan-600 text-white"
          >
            Back to My Uploaded Notes
          </button>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main
        className="
          ml-0 lg:ml-56
          p-4 sm:p-6 lg:p-8
          pb-24
          min-h-[calc(100vh-4rem)]
          bg-gray-50 dark:bg-[#070d1d]
          overflow-x-hidden
        "
      >
        <div className="w-full max-w-[1200px] mx-auto">

          {/* Back Button */}

          <div className="mb-5 md:mb-7">
            <button
              onClick={() => navigate("/my-uploaded-notes")}
              className="
                inline-flex items-center gap-2
                px-3 py-2 rounded-lg
                text-sm font-medium
                text-gray-600 dark:text-gray-300
                hover:text-cyan-600 dark:hover:text-cyan-400
                hover:bg-gray-100 dark:hover:bg-[#111c32]
                transition-all
              "
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to My Uploaded Notes</span>
            </button>
          </div>

          {/* Note Details */}

          <section
            className="
              w-full
              bg-white dark:bg-[#101a2e]
              border border-gray-200 dark:border-[#243451]
              rounded-2xl
              p-4 sm:p-5 md:p-6
              shadow-sm dark:shadow-none
              mb-5 md:mb-6
            "
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">

              <div
                className="
                  shrink-0
                  w-12 h-12 sm:w-14 sm:h-14
                  rounded-xl
                  bg-red-500/10
                  flex items-center justify-center
                "
              >
                <FaFilePdf className="text-red-500 text-xl sm:text-2xl" />
              </div>

              <div className="min-w-0 flex-1">

                <h1
                  className="
                    text-xl sm:text-2xl md:text-3xl
                    font-bold leading-tight
                    break-words
                    text-gray-900 dark:text-white
                  "
                >
                  {note?.title}
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">
                  {note?.file_name}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  <span
                    className="
                      px-3 py-1.5 rounded-full
                      bg-cyan-500/10
                      text-cyan-600 dark:text-cyan-400
                      text-xs font-semibold
                    "
                  >
                    {note?.subject}
                  </span>

                  <span
                    className="
                      px-3 py-1.5 rounded-full
                      bg-purple-500/10
                      text-purple-600 dark:text-purple-400
                      text-xs font-semibold
                    "
                  >
                    {note?.unit}
                  </span>

                  <span
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1.5 rounded-full
                      bg-green-500/10
                      text-green-600 dark:text-green-400
                      text-xs font-semibold
                    "
                  >
                    <FaEye className="text-[10px]" />
                    Your Uploaded Note
                  </span>

                </div>
              </div>
            </div>

            {/* Description */}

            {note?.description && (
              <div
                className="
                  mt-5 pt-5
                  border-t
                  border-gray-200 dark:border-[#243451]
                "
              >
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {note.description}
                </p>
              </div>
            )}
          </section>

          {/* PDF Preview */}

          <section
            className="
              w-full
              bg-[#e5e7eb] dark:bg-[#0b1220]
              border border-gray-200 dark:border-[#1c2a43]
              rounded-2xl
              overflow-hidden
              shadow-sm dark:shadow-none
            "
          >
            <div
              className="
                px-4 sm:px-5 md:px-6
                py-4
                bg-white dark:bg-[#101a2e]
                border-b border-gray-200 dark:border-[#243451]
                flex flex-col sm:flex-row
                sm:items-center sm:justify-between
                gap-2
              "
            >
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Uploaded PDF
                </h2>

                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {pageCount} {pageCount === 1 ? "page" : "pages"}
                </p>
              </div>

              <div
                className="
                  self-start sm:self-auto
                  px-3 py-1.5 rounded-full
                  bg-green-500/10
                  text-green-600 dark:text-green-400
                  text-xs font-semibold
                "
              >
                Full Access
              </div>
            </div>

            <div className="w-full p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-5">

              {pages.map((pageUrl, index) => (
                <div
                  key={index}
                  className="
                    w-full max-w-[900px]
                    mx-auto
                    bg-white
                    rounded-md sm:rounded-lg
                    overflow-hidden
                    shadow-md sm:shadow-lg
                  "
                >
                  <div
                    className="
                      flex items-center justify-between
                      px-3 py-2
                      bg-gray-50
                      border-b border-gray-200
                      text-[10px] sm:text-xs
                      text-gray-500
                    "
                  >
                    <span>Page {index + 1}</span>
                    <span>{index + 1} / {pageCount}</span>
                  </div>

                  <img
                    src={pageUrl}
                    alt={`Page ${index + 1}`}
                    className="block w-full h-auto max-w-full select-none"
                    draggable="false"
                  />
                </div>
              ))}

            </div>
          </section>

          {/* Bottom Back Button */}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/my-uploaded-notes")}
              className="
                inline-flex items-center gap-2
                px-5 py-2.5 rounded-xl
                bg-[#111c32] dark:bg-[#172238]
                border border-[#263653]
                text-gray-300
                hover:bg-[#1a2941]
                text-sm font-medium
                transition-colors
              "
            >
              <FaArrowLeft />
              Back to My Uploaded Notes
            </button>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ViewMarketplaceNote;
