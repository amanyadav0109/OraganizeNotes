
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function GetNotes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    const [previewLoading, setPreviewLoading] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    const [isPurchased, setIsPurchased] = useState(false);

    const [isDownloading, setIsDownloading] = useState(false);

    const [previewVersion, setPreviewVersion] = useState(Date.now());

    // Stores generated image URLs for PDF pages
    const [previewImages, setPreviewImages] = useState({});

    // ==========================================
    // FETCH NOTE DETAILS
    // ==========================================

    useEffect(() => {
        const fetchNote = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    "http://localhost:5000/api/marketplace"
                );

                const notes = response.data?.notes || [];

                const foundNote = notes.find(
                    (item) => Number(item.id) === Number(id)
                );

                if (!foundNote) {
                    alert("Note not found");
                    navigate("/find-notes");
                    return;
                }

                const isPdf =
                    foundNote.isPdf !== undefined
                        ? foundNote.isPdf
                        : foundNote.file_name
                        ? foundNote.file_name
                              .toLowerCase()
                              .endsWith(".pdf")
                        : false;

                setNote({
                    ...foundNote,

                    seller:
                        foundNote.seller_name || "Student",

                    fileName:
                        foundNote.file_name || "notes.pdf",

                    isPdf,

                    content:
                        foundNote.content || ""
                });
            } catch (error) {
                console.error(
                    "FETCH NOTE ERROR:",
                    error.response?.data || error
                );

                alert("Failed to load note");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id, navigate]);

    // ==========================================
    // LOAD FIRST PDF PAGE + PAGE COUNT
    // ==========================================

    useEffect(() => {
        const loadPdfPreview = async () => {
            if (!note?.isPdf) {
                return;
            }

            try {
                setPreviewLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    console.error(
                        "TOKEN NOT FOUND"
                    );

                    setPageCount(1);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:5000/api/marketplace/preview/${note.id}?page=0`,
                    {
                        responseType: "blob",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            Accept: "image/png"
                        }
                    }
                );

                // ======================================
                // GET PAGE COUNT
                // ======================================

                const totalPages = Number(
                    response.headers[
                        "x-page-count"
                    ]
                );

                if (
                    Number.isInteger(totalPages) &&
                    totalPages > 0
                ) {
                    setPageCount(totalPages);
                } else {
                    setPageCount(1);
                }

                // ======================================
                // FIRST PAGE IMAGE
                // ======================================

                const imageUrl =
                    window.URL.createObjectURL(
                        response.data
                    );

                setPreviewImages({
                    0: imageUrl
                });

            } catch (error) {
                console.error(
                    "PDF PREVIEW ERROR:",
                    error.response?.data || error
                );

                setPageCount(1);
            } finally {
                setPreviewLoading(false);
            }
        };

        loadPdfPreview();
    }, [note]);

    // ==========================================
    // LOAD ALL PDF PAGES AFTER PURCHASE
    // ==========================================

    const loadAllPdfPages = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            if (!note?.id) {
                return;
            }

            setPreviewLoading(true);

            const images = {};

            // ======================================
            // LOAD EVERY PAGE
            // ======================================

            for (
                let page = 0;
                page < pageCount;
                page++
            ) {
                try {
                    const response =
                        await axios.get(
                            `http://localhost:5000/api/marketplace/preview/${note.id}?page=${page}`,
                            {
                                responseType:
                                    "blob",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "image/png"
                                }
                            }
                        );

                    const imageUrl =
                        window.URL.createObjectURL(
                            response.data
                        );

                    images[page] = imageUrl;

                } catch (error) {
                    console.error(
                        `PAGE ${
                            page + 1
                        } LOAD ERROR:`,
                        error.response
                            ?.data || error
                    );
                }
            }

            // ======================================
            // UPDATE ALL PAGE IMAGES
            // ======================================

            setPreviewImages(images);

            setPreviewVersion(
                Date.now()
            );

        } catch (error) {
            console.error(
                "LOAD ALL PDF PAGES ERROR:",
                error
            );
        } finally {
            setPreviewLoading(false);
        }
    };

    // ==========================================
    // BUY NOTE
    // ==========================================

    const handleBuy = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            // ======================================
            // CREATE RAZORPAY ORDER
            // ======================================

            const response = await axios.post(
                "http://localhost:5000/api/marketplace/payment/create-order",

                {
                    noteId: Number(id)
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            const data = response.data;

            if (!data.success) {
                alert(
                    data.message ||
                        "Failed to create payment order"
                );

                return;
            }

            // ======================================
            // RAZORPAY OPTIONS
            // ======================================

            const options = {
                key: data.key,

                amount: data.order.amount,

                currency:
                    data.order.currency,

                name: "OrganizeNotes",

                description:
                    data.note.title,

                order_id:
                    data.order.id,

                prefill: {
                    name: "Aman Yadav"
                },

                theme: {
                    color: "#06b6d4"
                },

                modal: {
                    ondismiss:
                        function () {
                            console.log(
                                "Payment popup closed"
                            );
                        }
                },

                // ==================================
                // PAYMENT SUCCESS
                // ==================================

                handler:
                    async function (
                        paymentResponse
                    ) {
                        try {
                            console.log(
                                "RAZORPAY RESPONSE:",
                                paymentResponse
                            );

                            const verifyResponse =
                                await axios.post(
                                    "http://localhost:5000/api/marketplace/payment/verify",

                                    {
                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature,

                                        noteId:
                                            Number(
                                                id
                                            )
                                    },

                                    {
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`,

                                            "Content-Type":
                                                "application/json"
                                        }
                                    }
                                );

                            console.log(
                                "VERIFY RESPONSE:",
                                verifyResponse.data
                            );

                            if (
                                verifyResponse
                                    .data
                                    ?.success
                            ) {
                                // =================================
                                // UNLOCK UI
                                // =================================

                                setIsPurchased(
                                    true
                                );

                                // =================================
                                // LOAD ACTUAL PDF PAGES
                                // WITH JWT TOKEN
                                // =================================

                                await loadAllPdfPages();

                                alert(
                                    "Payment successful! Notes unlocked."
                                );
                            } else {
                                alert(
                                    verifyResponse
                                        .data
                                        ?.message ||
                                        "Payment verification failed"
                                );
                            }
                        } catch (error) {
                            console.error(
                                "PAYMENT VERIFY ERROR:",
                                error.response
                                    ?.data ||
                                    error
                            );

                            alert(
                                error.response
                                    ?.data
                                    ?.message ||
                                    "Payment verification failed"
                            );
                        }
                    }
            };

            // ======================================
            // CHECK RAZORPAY SDK
            // ======================================

            if (!window.Razorpay) {
                alert(
                    "Razorpay SDK not loaded"
                );

                return;
            }

            // ======================================
            // OPEN RAZORPAY
            // ======================================

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "PAYMENT FAILED:",
                        response.error
                    );

                    alert(
                        response.error
                            ?.description ||
                            "Payment failed"
                    );
                }
            );

            razorpay.open();

        } catch (error) {
            console.error(
                "CREATE ORDER ERROR:",
                error.response?.data ||
                    error
            );

            if (
                error.response?.status ===
                401
            ) {
                alert(
                    "Session expired. Please login again."
                );
            } else {
                alert(
                    error.response?.data
                        ?.message ||
                        "Unable to start payment"
                );
            }
        }
    };

    // ==========================================
    // DOWNLOAD ORIGINAL PDF
    // ==========================================

    const handleDownload = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            setIsDownloading(true);

            const response = await axios.get(
                `http://localhost:5000/api/marketplace/download/${id}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers[
                            "content-type"
                        ] ||
                        "application/pdf"
                }
            );

            const downloadUrl =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = downloadUrl;

            link.download =
                note.fileName ||
                note.file_name ||
                "notes.pdf";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                downloadUrl
            );

        } catch (error) {
            console.error(
                "DOWNLOAD ERROR:",
                error.response?.data ||
                    error
            );

            if (
                error.response?.status ===
                401
            ) {
                alert(
                    "Please login again."
                );
            } else if (
                error.response?.status ===
                403
            ) {
                alert(
                    "You have not purchased this note."
                );
            } else if (
                error.response?.status ===
                404
            ) {
                alert(
                    "Notes file not found."
                );
            } else {
                alert(
                    "Unable to download notes."
                );
            }

        } finally {
            setIsDownloading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div
                className="
                    min-h-screen
                    bg-gray-50
                    dark:bg-slate-950
                    flex
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        text-gray-700
                        dark:text-gray-300
                        font-semibold
                    "
                >
                    Loading notes...
                </div>
            </div>
        );
    }

    // ==========================================
    // NO NOTE
    // ==========================================

    if (!note) {
        return null;
    }

    // ==========================================
    // PREVIEW BASE URL
    // ==========================================

    const previewBaseUrl =
        `http://localhost:5000/api/marketplace/preview/${note.id}`;

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div
            className="
                page
                min-h-screen
                bg-gray-50
                dark:bg-slate-950
            "
        >
            <Navbar />

            <Sidebar />

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
                    BACK BUTTON
                ================================= */}

                <button
                    onClick={() =>
                        navigate(
                            "/find-notes"
                        )
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-gray-600
                        dark:text-gray-300
                        hover:text-cyan-500
                        dark:hover:text-cyan-400
                        transition
                        mb-5
                    "
                >
                    ← Back to Find Your Notes
                </button>

                {/* =================================
                    HEADER
                ================================= */}

                <div className="mb-6">
                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        {note.title}
                    </h1>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            mt-3
                        "
                    >
                        <span
                            className="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                bg-cyan-500/10
                                text-cyan-600
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
                                font-semibold
                                bg-purple-500/10
                                text-purple-600
                                dark:text-purple-400
                            "
                        >
                            {note.unit}
                        </span>

                        <span
                            className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            👤{" "}
                            {note.seller ||
                                note.seller_name}
                        </span>
                    </div>
                </div>

                {/* =================================
                    GRID
                ================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        xl:grid-cols-[minmax(0,1fr)_360px]
                        gap-6
                        items-start
                    "
                >
                    {/* =================================
                        LEFT PREVIEW
                    ================================= */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-gray-200
                            dark:border-slate-800
                            bg-white
                            dark:bg-slate-900
                            overflow-hidden
                        "
                    >
                        {/* PREVIEW HEADER */}

                        <div
                            className="
                                px-5
                                sm:px-6
                                py-4
                                border-b
                                border-gray-200
                                dark:border-slate-700
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >
                            <div>
                                <h2
                                    className="
                                        font-bold
                                        text-gray-900
                                        dark:text-white
                                    "
                                >
                                    {note.isPdf
                                        ? "📄 PDF Notes Preview"
                                        : "📝 Notes Preview"}
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        dark:text-gray-400
                                        mt-1
                                    "
                                >
                                    {note.isPdf
                                        ? `${pageCount} page${
                                              pageCount >
                                              1
                                                  ? "s"
                                                  : ""
                                          } • ${
                                              isPurchased
                                                  ? "Full PDF unlocked"
                                                  : "First page clear, remaining pages blurred"
                                          }`
                                        : "Read the notes before purchasing"}
                                </p>
                            </div>

                            {note.isPdf && (
                                <span
                                    className="
                                        hidden
                                        sm:block
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        bg-gray-100
                                        dark:bg-slate-800
                                        text-gray-600
                                        dark:text-gray-300
                                        max-w-[220px]
                                        truncate
                                    "
                                    title={
                                        note.fileName
                                    }
                                >
                                    📄{" "}
                                    {note.fileName}
                                </span>
                            )}
                        </div>

                        {/* =================================
                            PREVIEW AREA
                        ================================= */}

                        <div
                            className="
                                h-[70vh]
                                min-h-[500px]
                                overflow-y-auto
                                bg-gray-100
                                dark:bg-slate-950
                                notes-scroll
                            "
                        >
                            {note.isPdf ? (
                                <div className="p-4 sm:p-6">
                                    {previewLoading ? (
                                        <div
                                            className="
                                                max-w-4xl
                                                mx-auto
                                                min-h-[500px]
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                text-gray-500
                                                dark:text-gray-400
                                            "
                                        >
                                            <div
                                                className="
                                                    w-10
                                                    h-10
                                                    border-4
                                                    border-gray-300
                                                    dark:border-slate-700
                                                    border-t-cyan-500
                                                    rounded-full
                                                    animate-spin
                                                    mb-4
                                                "
                                            />

                                            <p className="text-sm font-medium">
                                                Loading PDF preview...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {Array.from(
                                                {
                                                    length:
                                                        pageCount
                                                },
                                                (
                                                    _,
                                                    index
                                                ) => {
                                                    const isLocked =
                                                        !isPurchased &&
                                                        index >
                                                            0;

                                                    return (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="
                                                                mx-auto
                                                                max-w-4xl
                                                            "
                                                        >
                                                            {/* PAGE LABEL */}

                                                            <div
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    mb-2
                                                                    px-1
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        text-xs
                                                                        font-semibold
                                                                        text-gray-500
                                                                        dark:text-gray-400
                                                                    "
                                                                >
                                                                    Page{" "}
                                                                    {index +
                                                                        1}
                                                                </span>

                                                                {isLocked ? (
                                                                    <span
                                                                        className="
                                                                            text-xs
                                                                            font-semibold
                                                                            text-orange-500
                                                                            dark:text-orange-400
                                                                        "
                                                                    >
                                                                        🔒
                                                                        Locked
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className="
                                                                            text-xs
                                                                            font-semibold
                                                                            text-green-600
                                                                            dark:text-green-400
                                                                        "
                                                                    >
                                                                        ✓
                                                                        {isPurchased
                                                                            ? " Unlocked"
                                                                            : " Preview"}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* PAGE */}

                                                            <div
                                                                className="
                                                                    relative
                                                                    bg-white
                                                                    rounded-xl
                                                                    shadow-xl
                                                                    overflow-hidden
                                                                    border
                                                                    border-gray-200
                                                                    dark:border-slate-700
                                                                "
                                                            >
                                                                <img
                                                                    key={`${note.id}-${index}-${previewVersion}`}
                                                                    src={
                                                                        previewImages[
                                                                            index
                                                                        ] ||
                                                                        ""
                                                                    }
                                                                    alt={`PDF page ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="
                                                                        block
                                                                        w-full
                                                                        h-auto
                                                                        select-none
                                                                    "
                                                                    draggable="false"
                                                                />

                                                                {/* =================================
                                                                    LOCK OVERLAY
                                                                ================================= */}

                                                                {isLocked && (
                                                                    <div
                                                                        className="
                                                                            absolute
                                                                            inset-0
                                                                            flex
                                                                            items-center
                                                                            justify-center
                                                                            bg-black/10
                                                                            backdrop-blur-[4px]
                                                                        "
                                                                    >
                                                                        <div
                                                                            className="
                                                                                px-6
                                                                                py-5
                                                                                rounded-xl
                                                                                bg-black/75
                                                                                text-white
                                                                                text-center
                                                                                shadow-xl
                                                                            "
                                                                        >
                                                                            <div className="text-3xl mb-2">
                                                                                🔒
                                                                            </div>

                                                                            <p className="font-bold">
                                                                                Page locked
                                                                            </p>

                                                                            <p className="text-xs text-gray-300 mt-1">
                                                                                Purchase to view
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* PREVIEW WATERMARK */}

                                                                {!isPurchased &&
                                                                    index ===
                                                                        0 && (
                                                                        <div
                                                                            className="
                                                                                absolute
                                                                                inset-0
                                                                                pointer-events-none
                                                                                flex
                                                                                items-center
                                                                                justify-center
                                                                            "
                                                                        >
                                                                            <div
                                                                                className="
                                                                                    rotate-[-25deg]
                                                                                    text-4xl
                                                                                    sm:text-6xl
                                                                                    font-black
                                                                                    text-black/10
                                                                                    select-none
                                                                                "
                                                                            >
                                                                                PREVIEW
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                    {/* =================================
                                        LOCKED MESSAGE
                                    ================================= */}

                                    {!isPurchased &&
                                        pageCount > 1 && (
                                            <div
                                                className="
                                                    max-w-4xl
                                                    mx-auto
                                                    mt-6
                                                    p-6
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    dark:border-slate-700
                                                    bg-white
                                                    dark:bg-slate-900
                                                    text-center
                                                "
                                            >
                                                <div className="text-3xl mb-2">
                                                    🔒
                                                </div>

                                                <p
                                                    className="
                                                        font-bold
                                                        text-gray-900
                                                        dark:text-white
                                                    "
                                                >
                                                    Full notes are locked
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-500
                                                        dark:text-gray-400
                                                        mt-1
                                                    "
                                                >
                                                    First page is available
                                                    for preview. Purchase to
                                                    access the original PDF.
                                                </p>
                                            </div>
                                        )}

                                    {/* =================================
                                        PURCHASED MESSAGE
                                    ================================= */}

                                    {isPurchased && (
                                        <div
                                            className="
                                                max-w-4xl
                                                mx-auto
                                                mt-6
                                                p-5
                                                rounded-xl
                                                border
                                                border-green-200
                                                dark:border-green-900
                                                bg-green-50
                                                dark:bg-green-950/30
                                                text-center
                                            "
                                        >
                                            <p
                                                className="
                                                    font-semibold
                                                    text-green-700
                                                    dark:text-green-400
                                                "
                                            >
                                                ✓ Notes unlocked
                                            </p>

                                            <p
                                                className="
                                                    text-sm
                                                    text-green-600
                                                    dark:text-green-500
                                                    mt-1
                                                "
                                            >
                                                All pages are now
                                                available.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* =================================
                                   NORMAL TYPED NOTES
                                ================================= */

                                <div className="p-4 sm:p-6">
                                    <article
                                        className="
                                            mx-auto
                                            max-w-4xl
                                            bg-white
                                            dark:bg-slate-900
                                            rounded-xl
                                            shadow-lg
                                            p-7
                                            sm:p-10
                                            text-gray-700
                                            dark:text-gray-300
                                        "
                                    >
                                        <h2
                                            className="
                                                text-2xl
                                                font-bold
                                                text-gray-900
                                                dark:text-white
                                                mb-4
                                            "
                                        >
                                            {note.title}
                                        </h2>

                                        {note.description && (
                                            <p
                                                className="
                                                    text-sm
                                                    sm:text-base
                                                    leading-8
                                                    mb-7
                                                "
                                            >
                                                {note.description}
                                            </p>
                                        )}

                                        {note.content ? (
                                            <div
                                                className={`
                                                    whitespace-pre-line
                                                    text-sm
                                                    sm:text-base
                                                    leading-8
                                                    ${
                                                        !isPurchased
                                                            ? "max-h-[500px] overflow-hidden"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={
                                                        !isPurchased
                                                            ? "blur-[2px] opacity-70 select-none"
                                                            : ""
                                                    }
                                                >
                                                    {note.content}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="
                                                    py-10
                                                    text-center
                                                    text-gray-500
                                                    dark:text-gray-400
                                                "
                                            >
                                                Notes content is not
                                                available for preview.
                                            </div>
                                        )}
                                    </article>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* =================================
                        RIGHT PURCHASE CARD
                    ================================= */}

                    <aside
                        className="
                            bg-white
                            dark:bg-slate-900
                            border
                            border-gray-200
                            dark:border-slate-700
                            rounded-2xl
                            shadow-md
                            p-5
                            sm:p-6
                            xl:sticky
                            xl:top-24
                        "
                    >
                        <p
                            className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Get complete access
                        </p>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-gray-900
                                dark:text-white
                                mt-1
                            "
                        >
                            {note.title}
                        </h2>

                        {/* PRICE */}

                        <div
                            className="
                                mt-6
                                p-4
                                rounded-xl
                                bg-gray-50
                                dark:bg-slate-800
                                border
                                border-gray-200
                                dark:border-slate-700
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    dark:text-gray-400
                                "
                            >
                                Price
                            </p>

                            <p
                                className="
                                    text-3xl
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                    mt-1
                                "
                            >
                                ₹{note.price}
                            </p>
                        </div>

                        {/* FEATURES */}

                        <div className="mt-6 space-y-4">
                            <div className="flex gap-3">
                                <span>📄</span>

                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                        Full Notes
                                    </p>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Complete access to notes
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span>⬇️</span>

                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                        Download
                                    </p>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Download after purchase
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span>🔒</span>

                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                        Secure Access
                                    </p>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Original PDF protected
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            BUY / DOWNLOAD
                        ================================= */}

                        {!isPurchased ? (
                            <button
                                onClick={
                                    handleBuy
                                }
                                className="
                                    w-full
                                    mt-7
                                    py-3.5
                                    rounded-xl
                                    bg-cyan-500
                                    hover:bg-cyan-400
                                    text-black
                                    font-bold
                                    transition
                                    active:scale-[0.98]
                                    shadow-lg
                                    shadow-cyan-500/10
                                "
                            >
                                Buy Now — ₹
                                {note.price}
                            </button>
                        ) : (
                            <button
                                onClick={
                                    handleDownload
                                }
                                disabled={
                                    isDownloading
                                }
                                className="
                                    w-full
                                    mt-7
                                    py-3.5
                                    rounded-xl
                                    bg-green-500
                                    hover:bg-green-400
                                    disabled:bg-green-300
                                    text-white
                                    font-bold
                                    transition
                                    active:scale-[0.98]
                                "
                            >
                                {isDownloading
                                    ? "⏳ Downloading..."
                                    : "⬇️ Download Original PDF"}
                            </button>
                        )}

                        <p
                            className="
                                text-center
                                text-xs
                                text-gray-400
                                mt-4
                            "
                        >
                            Secure one-time purchase
                        </p>
                    </aside>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}

export default GetNotes;
