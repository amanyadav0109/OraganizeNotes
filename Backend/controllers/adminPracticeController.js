
import db from "../config/db.js";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

const getCleanText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

// ==========================================
// GET ALL SUBJECTS
// ==========================================

export const getAdminPracticeSubjects = async (req, res) => {
  try {
    const [subjects] = await db.promise().query(`
      SELECT
        s.id,
        s.name,
        s.description,
        s.created_at AS createdAt,
        COUNT(DISTINCT t.id) AS topicCount,
        COUNT(DISTINCT q.id) AS questionCount
      FROM practice_subjects s
      LEFT JOIN practice_topics t
        ON t.subject_id = s.id
      LEFT JOIN practice_questions q
        ON q.topic_id = t.id
        AND q.type = 'descriptive'
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("ADMIN PRACTICE SUBJECTS:", error);
    return sendError(res, 500, "Failed to fetch subjects.");
  }
};

// ==========================================
// ADD SUBJECT
// ==========================================

export const createPracticeSubject = async (req, res) => {
  try {
    const name = getCleanText(req.body.name);
    const description = getCleanText(req.body.description);

    if (!name) {
      return sendError(res, 400, "Subject name is required.");
    }

    if (name.length > 150) {
      return sendError(res, 400, "Subject name cannot exceed 150 characters.");
    }

    const [existing] = await db.promise().query(
      `SELECT id FROM practice_subjects
       WHERE LOWER(name) = LOWER(?)
       LIMIT 1`,
      [name]
    );

    if (existing.length) {
      return sendError(res, 409, "This subject already exists.");
    }

    const [result] = await db.promise().query(
      `INSERT INTO practice_subjects (name, description)
       VALUES (?, ?)`,
      [name, description || null]
    );

    return res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subjectId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE PRACTICE SUBJECT:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return sendError(res, 409, "This subject already exists.");
    }

    return sendError(res, 500, "Failed to create subject.");
  }
};

// ==========================================
// UPDATE SUBJECT
// ==========================================

export const updatePracticeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const name = getCleanText(req.body.name);
    const description = getCleanText(req.body.description);

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid subject ID.");
    }

    if (!name) {
      return sendError(res, 400, "Subject name is required.");
    }

    if (name.length > 150) {
      return sendError(res, 400, "Subject name cannot exceed 150 characters.");
    }

    const [subject] = await db.promise().query(
      "SELECT id FROM practice_subjects WHERE id = ?",
      [id]
    );

    if (!subject.length) {
      return sendError(res, 404, "Subject not found.");
    }

    const [duplicate] = await db.promise().query(
      `SELECT id FROM practice_subjects
       WHERE LOWER(name) = LOWER(?) AND id != ?
       LIMIT 1`,
      [name, id]
    );

    if (duplicate.length) {
      return sendError(res, 409, "Another subject has this name.");
    }

    await db.promise().query(
      `UPDATE practice_subjects
       SET name = ?, description = ?
       WHERE id = ?`,
      [name, description || null, id]
    );

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE PRACTICE SUBJECT:", error);
    return sendError(res, 500, "Failed to update subject.");
  }
};

// ==========================================
// DELETE SUBJECT
// ==========================================

export const deletePracticeSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid subject ID.");
    }

    const [subjects] = await db.promise().query(
      "SELECT id FROM practice_subjects WHERE id = ?",
      [id]
    );

    if (!subjects.length) {
      return sendError(res, 404, "Subject not found.");
    }

    const [topics] = await db.promise().query(
      `SELECT id FROM practice_topics
       WHERE subject_id = ?
       LIMIT 1`,
      [id]
    );

    if (topics.length) {
      return sendError(
        res,
        409,
        "Cannot delete this subject. Delete its topics first."
      );
    }

    await db.promise().query(
      "DELETE FROM practice_subjects WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRACTICE SUBJECT:", error);
    return sendError(res, 500, "Failed to delete subject.");
  }
};

// ==========================================
// GET ALL TOPICS
// ==========================================

export const getAdminPracticeTopics = async (req, res) => {
  try {
    const { subjectId } = req.query;

    let query = `
      SELECT
        t.id,
        t.subject_id AS subjectId,
        t.name,
        t.description,
        t.created_at AS createdAt,
        s.name AS subjectName,
        COUNT(DISTINCT q.id) AS questionCount
      FROM practice_topics t
      INNER JOIN practice_subjects s
        ON s.id = t.subject_id
      LEFT JOIN practice_questions q
        ON q.topic_id = t.id
        AND q.type = 'descriptive'
    `;

    const values = [];

    if (subjectId) {
      if (!isValidId(subjectId)) {
        return sendError(res, 400, "Invalid subject ID.");
      }

      query += " WHERE t.subject_id = ?";
      values.push(subjectId);
    }

    query += `
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;

    const [topics] = await db.promise().query(query, values);

    return res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error("ADMIN PRACTICE TOPICS:", error);
    return sendError(res, 500, "Failed to fetch topics.");
  }
};

// ==========================================
// ADD TOPIC
// ==========================================

export const createPracticeTopic = async (req, res) => {
  try {
    const subjectId = req.body.subjectId;
    const name = getCleanText(req.body.name);
    const description = getCleanText(req.body.description);

    if (!isValidId(subjectId)) {
      return sendError(res, 400, "Valid subject is required.");
    }

    if (!name) {
      return sendError(res, 400, "Topic name is required.");
    }

    if (name.length > 150) {
      return sendError(res, 400, "Topic name cannot exceed 150 characters.");
    }

    const [subjects] = await db.promise().query(
      "SELECT id FROM practice_subjects WHERE id = ?",
      [subjectId]
    );

    if (!subjects.length) {
      return sendError(res, 404, "Subject not found.");
    }

    const [duplicate] = await db.promise().query(
      `SELECT id FROM practice_topics
       WHERE subject_id = ? AND LOWER(name) = LOWER(?)
       LIMIT 1`,
      [subjectId, name]
    );

    if (duplicate.length) {
      return sendError(
        res,
        409,
        "This topic already exists in this subject."
      );
    }

    const [result] = await db.promise().query(
      `INSERT INTO practice_topics
       (subject_id, name, description)
       VALUES (?, ?, ?)`,
      [subjectId, name, description || null]
    );

    return res.status(201).json({
      success: true,
      message: "Topic created successfully.",
      topicId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE PRACTICE TOPIC:", error);
    return sendError(res, 500, "Failed to create topic.");
  }
};

// ==========================================
// UPDATE TOPIC
// ==========================================

export const updatePracticeTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectId = req.body.subjectId;
    const name = getCleanText(req.body.name);
    const description = getCleanText(req.body.description);

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid topic ID.");
    }

    if (!isValidId(subjectId)) {
      return sendError(res, 400, "Valid subject is required.");
    }

    if (!name) {
      return sendError(res, 400, "Topic name is required.");
    }

    if (name.length > 150) {
      return sendError(res, 400, "Topic name is too long.");
    }

    const [topics] = await db.promise().query(
      "SELECT id FROM practice_topics WHERE id = ?",
      [id]
    );

    if (!topics.length) {
      return sendError(res, 404, "Topic not found.");
    }

    const [subjects] = await db.promise().query(
      "SELECT id FROM practice_subjects WHERE id = ?",
      [subjectId]
    );

    if (!subjects.length) {
      return sendError(res, 404, "Subject not found.");
    }

    const [duplicate] = await db.promise().query(
      `SELECT id FROM practice_topics
       WHERE subject_id = ?
       AND LOWER(name) = LOWER(?)
       AND id != ?
       LIMIT 1`,
      [subjectId, name, id]
    );

    if (duplicate.length) {
      return sendError(res, 409, "This topic already exists.");
    }

    await db.promise().query(
      `UPDATE practice_topics
       SET subject_id = ?, name = ?, description = ?
       WHERE id = ?`,
      [subjectId, name, description || null, id]
    );

    return res.status(200).json({
      success: true,
      message: "Topic updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE PRACTICE TOPIC:", error);
    return sendError(res, 500, "Failed to update topic.");
  }
};

// ==========================================
// DELETE TOPIC
// ==========================================

export const deletePracticeTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid topic ID.");
    }

    const [topics] = await db.promise().query(
      "SELECT id FROM practice_topics WHERE id = ?",
      [id]
    );

    if (!topics.length) {
      return sendError(res, 404, "Topic not found.");
    }

    const [questions] = await db.promise().query(
      `SELECT id FROM practice_questions
       WHERE topic_id = ?
       LIMIT 1`,
      [id]
    );

    if (questions.length) {
      return sendError(
        res,
        409,
        "Cannot delete this topic. Delete its questions first."
      );
    }

    await db.promise().query(
      "DELETE FROM practice_topics WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRACTICE TOPIC:", error);
    return sendError(res, 500, "Failed to delete topic.");
  }
};

// ==========================================
// GET ALL DESCRIPTIVE QUESTIONS
// ==========================================

export const getAdminPracticeQuestions = async (req, res) => {
  try {
    const {
      subjectId,
      topicId,
      difficulty,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (currentPage - 1) * pageLimit;

    const conditions = ["q.type = 'descriptive'"];
    const values = [];

    if (subjectId) {
      if (!isValidId(subjectId)) {
        return sendError(res, 400, "Invalid subject ID.");
      }

      conditions.push("q.subject_id = ?");
      values.push(subjectId);
    }

    if (topicId) {
      if (!isValidId(topicId)) {
        return sendError(res, 400, "Invalid topic ID.");
      }

      conditions.push("q.topic_id = ?");
      values.push(topicId);
    }

    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
      conditions.push("q.difficulty = ?");
      values.push(difficulty);
    }

    if (search && search.trim()) {
      conditions.push("q.question LIKE ?");
      values.push(`%${search.trim()}%`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const [countRows] = await db.promise().query(
      `SELECT COUNT(*) AS total
       FROM practice_questions q
       ${whereClause}`,
      values
    );

    const total = Number(countRows[0]?.total || 0);

    const [questions] = await db.promise().query(
      `SELECT
        q.id,
        q.subject_id AS subjectId,
        q.topic_id AS topicId,
        s.name AS subjectName,
        t.name AS topicName,
        q.question,
        q.correct_answer AS correctAnswer,
        q.explanation,
        q.difficulty,
        q.created_at AS createdAt
       FROM practice_questions q
       INNER JOIN practice_subjects s
         ON s.id = q.subject_id
       INNER JOIN practice_topics t
         ON t.id = q.topic_id
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, pageLimit, offset]
    );

    return res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error("ADMIN PRACTICE QUESTIONS:", error);
    return sendError(res, 500, "Failed to fetch questions.");
  }
};

// ==========================================
// ADD DESCRIPTIVE QUESTION
// ==========================================

export const createPracticeQuestion = async (req, res) => {
  try {
    const {
      subjectId,
      topicId,
      difficulty = "Medium",
    } = req.body;

    const question = getCleanText(req.body.question);
    const correctAnswer = getCleanText(
      req.body.correctAnswer ?? req.body.correct_answer
    );
    const explanation = getCleanText(req.body.explanation);

    if (!isValidId(subjectId) || !isValidId(topicId)) {
      return sendError(res, 400, "Valid subject and topic are required.");
    }

    if (!question) {
      return sendError(res, 400, "Question is required.");
    }

    if (!correctAnswer) {
      return sendError(res, 400, "Correct answer is required.");
    }

    if (!explanation) {
      return sendError(res, 400, "Explanation is required.");
    }

    if (
      question.length > 20000 ||
      correctAnswer.length > 20000 ||
      explanation.length > 20000
    ) {
      return sendError(res, 400, "Question, answer or explanation is too long.");
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return sendError(res, 400, "Invalid difficulty.");
    }

    const [topics] = await db.promise().query(
      `SELECT id FROM practice_topics
       WHERE id = ? AND subject_id = ?`,
      [topicId, subjectId]
    );

    if (!topics.length) {
      return sendError(
        res,
        400,
        "Selected topic does not belong to this subject."
      );
    }

    const [result] = await db.promise().query(
      `INSERT INTO practice_questions
       (
         subject_id,
         topic_id,
         question,
         correct_answer,
         explanation,
         type,
         difficulty
       )
       VALUES (?, ?, ?, ?, ?, 'descriptive', ?)`,
      [
        subjectId,
        topicId,
        question,
        correctAnswer,
        explanation,
        difficulty,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Practice question created successfully.",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE PRACTICE QUESTION:", error);
    return sendError(res, 500, "Failed to create question.");
  }
};

// ==========================================
// UPDATE DESCRIPTIVE QUESTION
// ==========================================

export const updatePracticeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subjectId,
      topicId,
      difficulty = "Medium",
    } = req.body;

    const question = getCleanText(req.body.question);
    const correctAnswer = getCleanText(
      req.body.correctAnswer ?? req.body.correct_answer
    );
    const explanation = getCleanText(req.body.explanation);

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid question ID.");
    }

    if (!isValidId(subjectId) || !isValidId(topicId)) {
      return sendError(res, 400, "Valid subject and topic are required.");
    }

    if (!question) {
      return sendError(res, 400, "Question is required.");
    }

    if (!correctAnswer) {
      return sendError(res, 400, "Correct answer is required.");
    }

    if (!explanation) {
      return sendError(res, 400, "Explanation is required.");
    }

    if (
      question.length > 20000 ||
      correctAnswer.length > 20000 ||
      explanation.length > 20000
    ) {
      return sendError(res, 400, "Question, answer or explanation is too long.");
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return sendError(res, 400, "Invalid difficulty.");
    }

    const [existing] = await db.promise().query(
      `SELECT id FROM practice_questions
       WHERE id = ? AND type = 'descriptive'`,
      [id]
    );

    if (!existing.length) {
      return sendError(res, 404, "Descriptive question not found.");
    }

    const [topics] = await db.promise().query(
      `SELECT id FROM practice_topics
       WHERE id = ? AND subject_id = ?`,
      [topicId, subjectId]
    );

    if (!topics.length) {
      return sendError(
        res,
        400,
        "Selected topic does not belong to this subject."
      );
    }

    await db.promise().query(
      `UPDATE practice_questions
       SET
         subject_id = ?,
         topic_id = ?,
         question = ?,
         correct_answer = ?,
         explanation = ?,
         difficulty = ?
       WHERE id = ? AND type = 'descriptive'`,
      [
        subjectId,
        topicId,
        question,
        correctAnswer,
        explanation,
        difficulty,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Practice question updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE PRACTICE QUESTION:", error);
    return sendError(res, 500, "Failed to update question.");
  }
};

// ==========================================
// DELETE DESCRIPTIVE QUESTION
// ==========================================

export const deletePracticeQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendError(res, 400, "Invalid question ID.");
    }

    const [questions] = await db.promise().query(
      `SELECT id FROM practice_questions
       WHERE id = ? AND type = 'descriptive'`,
      [id]
    );

    if (!questions.length) {
      return sendError(res, 404, "Descriptive question not found.");
    }

    const [attempts] = await db.promise().query(
      `SELECT id FROM practice_attempts
       WHERE question_id = ?
       LIMIT 1`,
      [id]
    );

    if (attempts.length) {
      return sendError(
        res,
        409,
        "Cannot delete this question because students have already attempted it."
      );
    }

    await db.promise().query(
      `DELETE FROM practice_questions
       WHERE id = ? AND type = 'descriptive'`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Practice question deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRACTICE QUESTION:", error);
    return sendError(res, 500, "Failed to delete question.");
  }
};
