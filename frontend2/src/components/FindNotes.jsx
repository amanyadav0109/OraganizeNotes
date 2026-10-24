import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FindNotes = () => {
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/marketplace"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch notes"
                    );
                }

                setNotes(data.notes || []);
            } catch (error) {
                console.error("FETCH NOTES ERROR:", error);
                setError("Unable to load notes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const filteredNotes = notes.filter((note) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return true;

        return (
            note.title?.toLowerCase().includes(search) ||
            note.subject?.toLowerCase().includes(search) ||
            note.unit?.toLowerCase().includes(search) ||
            note.description?.toLowerCase().includes(search) ||
            note.seller_name?.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <section
                className="
                    w-full
                    min-h-[500px]
                    rounded-3xl
                    p-6
                    sm:p-8
                    bg-white
                    dark:bg-[#111827]
                    border
                    border-slate-200
                    dark:border-slate-700
                    shadow-sm
                    transition-colors
                "
            >
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div
                            className="
                                w-10
                                h-10
                                mx-auto
                                mb-4
                                rounded-full
                                border-4
                                border-cyan-500/30
                                border-t-cyan-500
                                animate-spin
                            "
                        />

                        <p className="text-slate-500 dark:text-slate-400">
                            Loading notes...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                className="
                    w-full
                    min-h-[500px]
                    rounded-3xl
                    p-6
                    sm:p-8
                    bg-white
                    dark:bg-[#111827]
                    border
                    border-slate-200
                    dark:border-slate-700
                    shadow-sm
                "
            >
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-4xl mb-3">
                            ⚠️
                        </p>

                        <p className="text-red-500 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="
                w-full
                min-h-[500px]
                rounded-3xl
                p-6
                sm:p-8
                bg-white
                dark:bg-[#111827]
                border
                border-slate-200
                dark:border-slate-700
                shadow-sm
                transition-colors
                flex
                flex-col
            "
        >

            {/* HEADER */}

            <div className="flex items-center gap-3 mb-4">

                <div
                    className="
                        w-10
                        h-10
                        rounded-xl
                        bg-cyan-500/10
                        dark:bg-cyan-400/10
                        flex
                        items-center
                        justify-center
                        text-xl
                    "
                >
                    📚
                </div>

                <div className="min-w-0">

                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Find Your Notes
                    </h1>

                    <p
                        className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                            mt-1
                        "
                    >
                        Discover useful notes from other students
                    </p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="relative mb-3">

                <span
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-lg
                        text-slate-400
                    "
                >
                    🔍
                </span>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search notes, subjects or units..."
                    className="
                        w-full
                        pl-12
                        pr-4
                        py-3.5
                        rounded-xl
                        bg-slate-100
                        dark:bg-[#1e293b]
                        border
                        border-slate-200
                        dark:border-slate-700
                        text-slate-900
                        dark:text-white
                        placeholder-slate-400
                        outline-none
                        focus:border-cyan-500
                        focus:ring-2
                        focus:ring-cyan-500/10
                        transition
                    "
                />

            </div>

            {/* RESULT COUNT */}

            <div className="mb-2">

                <p className="text-sm text-slate-500 dark:text-slate-400">

                    <span className="font-semibold text-cyan-500">
                        {filteredNotes.length}
                    </span>

                    {" "}

                    {filteredNotes.length === 1
                        ? "note"
                        : "notes"}{" "}

                    available

                </p>

            </div>

            {/* NOTES */}

            {filteredNotes.length === 0 ? (

                <div
                    className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        min-h-[260px]
                    "
                >

                    <div className="text-center">

                        <div
                            className="
                                w-16
                                h-16
                                mx-auto
                                mb-4
                                rounded-2xl
                                bg-slate-100
                                dark:bg-slate-800
                                flex
                                items-center
                                justify-center
                                text-3xl
                            "
                        >
                            📚
                        </div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                text-slate-800
                                dark:text-slate-200
                            "
                        >
                            No notes found
                        </h3>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                                mt-1
                            "
                        >
                            Try searching for another subject or unit.
                        </p>

                    </div>

                </div>

            ) : (

                <div
                    className="
                        notes-scroll
                        h-[260px]
                        overflow-y-auto
                        space-y-3
                        pr-2
                    "
                >

                    {filteredNotes.map((note) => (

                        <article
                            key={note.id}
                            className="
                                group
                                shrink-0
                                rounded-2xl
                                border
                                border-slate-200
                                dark:border-slate-700
                                bg-slate-50
                                dark:bg-[#1e293b]
                                p-5
                                transition-all
                                duration-200
                                hover:border-cyan-400
                                dark:hover:border-cyan-500/60
                                hover:shadow-md
                            "
                        >

                            {/* TITLE */}

                            <div className="mb-3">

                                <h2
                                    className="
                                        text-lg
                                        sm:text-xl
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                        leading-tight
                                    "
                                >
                                    {note.title}
                                </h2>

                            </div>

                            {/* BADGES */}

                            <div className="flex flex-wrap gap-2 mb-4">

                                <span
                                    className="
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-medium
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
                                        font-medium
                                        bg-purple-500/10
                                        text-purple-600
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
                                    text-slate-600
                                    dark:text-slate-400
                                    leading-6
                                    mb-4
                                    line-clamp-2
                                "
                            >
                                {note.description ||
                                    "No description provided."}
                            </p>

                            {/* SELLER */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-slate-500
                                    dark:text-slate-400
                                    mb-5
                                "
                            >

                                <span>
                                    👤
                                </span>

                                <span>
                                    Seller:
                                </span>

                                <span
                                    className="
                                        font-medium
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                                >
                                    {note.seller_name}
                                </span>

                            </div>

                            {/* BOTTOM */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    gap-4
                                "
                            >

                                {/* PRICE */}

                                <div>

                                    <p
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        ₹{Number(note.price).toFixed(2)}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-400
                                            mt-1
                                        "
                                    >
                                        One-time purchase
                                    </p>

                                </div>

                                {/* GET NOTES */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/get-notes/${note.id}`
                                        )
                                    }
                                    className="
                                        w-full
                                        sm:w-auto
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-cyan-500
                                        hover:bg-cyan-400
                                        text-black
                                        font-semibold
                                        transition-all
                                        duration-200
                                        hover:shadow-lg
                                        hover:shadow-cyan-500/20
                                        active:scale-95
                                    "
                                >
                                    Get Notes
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            )}

            {/* VIEW MORE */}

            <button
                type="button"
                onClick={() => navigate("/find-notes")}
                className="
                    w-full
                    sm:w-auto
                    mt-3
                    px-5
                    py-3
                    rounded-xl
                    border
                    border-blue-500
                    text-blue-500
                    dark:text-blue-400
                    hover:bg-blue-500
                    hover:text-white
                    font-semibold
                    transition-all
                    duration-200
                    active:scale-95
                "
            >
                View More
            </button>

        </section>
    );
};

export default FindNotes;