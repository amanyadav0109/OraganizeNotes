
import db from "../config/db.js";

// GET ALL SUBJECTS
export const getPracticeSubjects = async (req, res) => {
  try {
    const [subjects] = await db.promise().query(
      `SELECT
          s.id,
          s.name,
          s.description,
          COUNT(DISTINCT t.id) AS topicCount,
          COUNT(DISTINCT q.id) AS questionCount
       FROM practice_subjects s
       LEFT JOIN practice_topics t ON t.subject_id = s.id
       LEFT JOIN practice_questions q ON q.topic_id = t.id
       GROUP BY s.id
       ORDER BY s.name ASC`
    );

    res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("GET PRACTICE SUBJECTS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects.",
    });
  }
};


// GET TOPICS OF A SUBJECT
export const getPracticeTopics = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [topics] = await db.promise().query(
      `SELECT
          t.id,
          t.subject_id,
          t.name,
          t.description,
          COUNT(q.id) AS questionCount
       FROM practice_topics t
       LEFT JOIN practice_questions q ON q.topic_id = t.id
       WHERE t.subject_id = ?
       GROUP BY t.id
       ORDER BY t.name ASC`,
      [subjectId]
    );

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error("GET PRACTICE TOPICS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch topics.",
    });
  }
};


// GET FILTERED PRACTICE QUESTIONS
export const getPracticeQuestions = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      subjectId,
      topics,
      search,
      difficulty,
      status,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(
      100,
      Math.max(1, Number(limit) || 20)
    );
    const offset = (currentPage - 1) * pageLimit;

    const conditions = [];
    const values = [];

    if (subjectId) {
      conditions.push("q.subject_id = ?");
      values.push(subjectId);
    }

    if (search && search.trim()) {
      conditions.push("q.question LIKE ?");
      values.push(`%${search.trim()}%`);
    }

    if (difficulty && difficulty !== "All") {
      conditions.push("q.difficulty = ?");
      values.push(difficulty);
    }

    if (topics) {
      const topicIds = String(topics)
        .split(",")
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);

      if (topicIds.length > 0) {
        conditions.push(
          `q.topic_id IN (${topicIds.map(() => "?").join(",")})`
        );
        values.push(...topicIds);
      }
    }

    let statusCondition = "";

    if (status === "Solved") {
      statusCondition = `
        AND EXISTS (
          SELECT 1
          FROM practice_attempts pa
          WHERE pa.question_id = q.id
            AND pa.user_id = ?
            AND pa.is_correct = 1
        )
      `;
      values.push(userId);
    } else if (status === "Unsolved") {
      statusCondition = `
        AND NOT EXISTS (
          SELECT 1
          FROM practice_attempts pa
          WHERE pa.question_id = q.id
            AND pa.user_id = ?
            AND pa.is_correct = 1
        )
      `;
      values.push(userId);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    let orderBy = "q.created_at DESC";

    if (sort === "Difficulty") {
      orderBy = `
        FIELD(q.difficulty, 'Easy', 'Medium', 'Hard'),
        q.created_at DESC
      `;
    } else if (sort === "Most Attempted") {
      orderBy = "attemptCount DESC, q.created_at DESC";
    }

    const countValues = [...values];

    const [countRows] = await db.promise().query(
      `SELECT COUNT(*) AS total
       FROM practice_questions q
       ${whereClause}
       ${statusCondition}`,
      countValues
    );

    const total = Number(countRows[0]?.total || 0);

    const [questions] = await db.promise().query(
      `SELECT
          q.id,
          q.subject_id AS subjectId,
          q.topic_id AS topicId,
          t.name AS topic,
          q.question AS title,
          q.type,
          q.difficulty,
          q.created_at AS createdAt,

          COUNT(DISTINCT pa.id) AS attemptCount,

          MAX(
            CASE
              WHEN pa.is_correct = 1 THEN 1
              ELSE 0
            END
          ) AS isSolved

       FROM practice_questions q

       LEFT JOIN practice_topics t
          ON t.id = q.topic_id

       LEFT JOIN practice_attempts pa
          ON pa.question_id = q.id
          AND pa.user_id = ?

       ${whereClause}
       ${statusCondition}

       GROUP BY q.id
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [userId, ...values, pageLimit, offset]
    );

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
        hasNextPage: currentPage * pageLimit < total,
      },
    });
  } catch (error) {
    console.error("GET PRACTICE QUESTIONS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch practice questions.",
    });
  }
};


// GET SINGLE QUESTION
export const getPracticeQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [questions] = await db.promise().query(
      `SELECT
          q.id,
          q.subject_id AS subjectId,
          q.topic_id AS topicId,
          t.name AS topic,
          q.question,
          q.type,
          q.option_a AS optionA,
          q.option_b AS optionB,
          q.option_c AS optionC,
          q.option_d AS optionD,
          q.difficulty,
          q.created_at AS createdAt
       FROM practice_questions q
       LEFT JOIN practice_topics t ON t.id = q.topic_id
       WHERE q.id = ?
       LIMIT 1`,
      [id]
    );

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    res.status(200).json({
      success: true,
      question: questions[0],
    });
  } catch (error) {
    console.error("GET SINGLE PRACTICE QUESTION:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question.",
    });
  }
};


// SUBMIT MCQ ANSWER
export const submitPracticeAnswer = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId, answer } = req.body;

    if (!questionId || answer === undefined || answer === null) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer are required.",
      });
    }

    const [questions] = await db.promise().query(
      `SELECT
          id,
          type,
          correct_answer AS correctAnswer,
          explanation
       FROM practice_questions
       WHERE id = ?
       LIMIT 1`,
      [questionId]
    );

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    const question = questions[0];

    if (question.type !== "mcq") {
      return res.status(400).json({
        success: false,
        message: "Automatic checking is only available for MCQ questions.",
      });
    }

    const isCorrect =
      String(answer).trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase();

    await db.promise().query(
      `INSERT INTO practice_attempts
        (user_id, question_id, submitted_answer, is_correct)
       VALUES (?, ?, ?, ?)`,
      [userId, questionId, String(answer), isCorrect ? 1 : 0]
    );

    res.status(200).json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      message: isCorrect
        ? "Correct answer!"
        : "Incorrect answer. Try again!",
    });
  } catch (error) {
    console.error("SUBMIT PRACTICE ANSWER:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer.",
    });
  }
};


// GET TOPIC-WISE QUESTION COUNTS
export const getPracticeCounts = async (req, res) => {
  try {
    const { subjectId } = req.query;

    let query = `
      SELECT
        s.id AS subjectId,
        s.name AS subject,
        t.id AS topicId,
        t.name AS topic,
        COUNT(q.id) AS questionCount

      FROM practice_subjects s

      LEFT JOIN practice_topics t
        ON t.subject_id = s.id

      LEFT JOIN practice_questions q
        ON q.topic_id = t.id
    `;

    const values = [];

    if (subjectId) {
      query += " WHERE s.id = ?";
      values.push(subjectId);
    }

    query += `
      GROUP BY s.id, t.id
      ORDER BY s.name, t.name
    `;

    const [counts] = await db.promise().query(query, values);

    res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    console.error("GET PRACTICE COUNTS:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question counts.",
    });
  }
};
