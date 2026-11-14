
import db from "../config/db.js";

// Reusable error handler
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ==========================================
// 1. CATEGORY CONTROLLERS
// ==========================================

// Get all categories
export const getCategories = asyncHandler(async (req, res) => {
  const [categories] = await db.promise().query(
    "SELECT * FROM mock_categories ORDER BY id DESC"
  );

  res.status(200).json({
    success: true,
    categories,
  });
});

// Add category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  const [result] = await db.promise().query(
    "INSERT INTO mock_categories (name, description) VALUES (?, ?)",
    [name.trim(), description || null]
  );

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    categoryId: result.insertId,
  });
});

// Update category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  const [result] = await db.promise().query(
    "UPDATE mock_categories SET name = ?, description = ? WHERE id = ?",
    [name.trim(), description || null, id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.json({
    success: true,
    message: "Category updated successfully",
  });
});

// Delete category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.promise().query(
    "DELETE FROM mock_categories WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.json({
    success: true,
    message: "Category deleted successfully",
  });
});

// ==========================================
// 2. SUBJECT CONTROLLERS
// ==========================================

// Get all subjects
export const getSubjects = asyncHandler(async (req, res) => {
  const { category_id } = req.query;

  let sql = `
    SELECT s.*, c.name AS category_name
    FROM mock_subjects s
    JOIN mock_categories c ON s.category_id = c.id
  `;

  const params = [];

  if (category_id) {
    sql += " WHERE s.category_id = ?";
    params.push(category_id);
  }

  sql += " ORDER BY s.id DESC";

  const [subjects] = await db.promise().query(sql, params);

  res.json({
    success: true,
    subjects,
  });
});

// Add subject
export const createSubject = asyncHandler(async (req, res) => {
  const { category_id, name } = req.body;

  if (!category_id || !name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category and subject name are required",
    });
  }

  const [result] = await db.promise().query(
    "INSERT INTO mock_subjects (category_id, name) VALUES (?, ?)",
    [category_id, name.trim()]
  );

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    subjectId: result.insertId,
  });
});

// Update subject
export const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category_id, name } = req.body;

  if (!category_id || !name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category and subject name are required",
    });
  }

  const [result] = await db.promise().query(
    `UPDATE mock_subjects
     SET category_id = ?, name = ?
     WHERE id = ?`,
    [category_id, name.trim(), id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Subject not found",
    });
  }

  res.json({
    success: true,
    message: "Subject updated successfully",
  });
});

// Delete subject
export const deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.promise().query(
    "DELETE FROM mock_subjects WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Subject not found",
    });
  }

  res.json({
    success: true,
    message: "Subject deleted successfully",
  });
});

// ==========================================
// 3. TOPIC CONTROLLERS
// ==========================================

// Get topics
export const getTopics = asyncHandler(async (req, res) => {
  const { subject_id } = req.query;

  let sql = `
    SELECT t.*, s.name AS subject_name
    FROM mock_topics t
    JOIN mock_subjects s ON t.subject_id = s.id
  `;

  const params = [];

  if (subject_id) {
    sql += " WHERE t.subject_id = ?";
    params.push(subject_id);
  }

  sql += " ORDER BY t.id DESC";

  const [topics] = await db.promise().query(sql, params);

  res.json({
    success: true,
    topics,
  });
});

// Add topic
export const createTopic = asyncHandler(async (req, res) => {
  const { subject_id, name } = req.body;

  if (!subject_id || !name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Subject and topic name are required",
    });
  }

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    // 1. Create topic
    const [topicResult] = await connection.query(
      "INSERT INTO mock_topics (subject_id, name) VALUES (?, ?)",
      [subject_id, name.trim()]
    );

    const topicId = topicResult.insertId;

    // 2. Automatically create a test set for this topic
    const [testResult] = await connection.query(
      `INSERT INTO mock_test_sets
       (topic_id, title, duration, total_marks, negative_marks, difficulty, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        topicId,
        `${name.trim()} Test`,
        30,
        10,
        0,
        "Medium",
        "Published",
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Topic and test set created successfully",
      topicId,
      testSetId: testResult.insertId,
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// Update topic
export const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject_id, name } = req.body;

  if (!subject_id || !name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Subject and topic name are required",
    });
  }

  const [result] = await db.promise().query(
    `UPDATE mock_topics
     SET subject_id = ?, name = ?
     WHERE id = ?`,
    [subject_id, name.trim(), id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Topic not found",
    });
  }

  res.json({
    success: true,
    message: "Topic updated successfully",
  });
});

// Delete topic
export const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.promise().query(
    "DELETE FROM mock_topics WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Topic not found",
    });
  }

  res.json({
    success: true,
    message: "Topic deleted successfully",
  });
});

// ==========================================
// 4. TEST SET CONTROLLERS
// ==========================================

// Get test sets
export const getTestSets = asyncHandler(async (req, res) => {
  const { topic_id } = req.query;

  let sql = `
    SELECT
      ts.*,
      t.name AS topic_name,
      s.name AS subject_name,
      c.name AS category_name,
      COUNT(q.id) AS question_count
    FROM mock_test_sets ts
    JOIN mock_topics t ON ts.topic_id = t.id
    JOIN mock_subjects s ON t.subject_id = s.id
    JOIN mock_categories c ON s.category_id = c.id
    LEFT JOIN mock_questions q ON ts.id = q.test_set_id
  `;

  const params = [];

  if (topic_id) {
    sql += " WHERE ts.topic_id = ?";
    params.push(topic_id);
  }

  sql += `
    GROUP BY ts.id
    ORDER BY ts.id DESC
  `;

  const [testSets] = await db.promise().query(sql, params);

  res.json({
    success: true,
    testSets,
  });
});

// Create test set
export const createTestSet = asyncHandler(async (req, res) => {
  const {
    topic_id,
    title,
    duration,
    total_marks,
    negative_marks,
    difficulty,
    status,
  } = req.body;

  if (!topic_id || !title || !title.trim() || !duration || !total_marks) {
    return res.status(400).json({
      success: false,
      message: "Topic, title, duration and total marks are required",
    });
  }

  const [result] = await db.promise().query(
    `INSERT INTO mock_test_sets
     (topic_id, title, duration, total_marks,
      negative_marks, difficulty, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      topic_id,
      title.trim(),
      duration,
      total_marks,
      negative_marks ?? 0,
      difficulty || "Medium",
      status || "Draft",
    ]
  );

  res.status(201).json({
    success: true,
    message: "Test set created successfully",
    testSetId: result.insertId,
  });
});

// Update test set
export const updateTestSet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    topic_id,
    title,
    duration,
    total_marks,
    negative_marks,
    difficulty,
    status,
  } = req.body;

  if (!topic_id || !title || !title.trim() || !duration || !total_marks) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required test set details",
    });
  }

  const [result] = await db.promise().query(
    `UPDATE mock_test_sets
     SET topic_id = ?, title = ?, duration = ?,
         total_marks = ?, negative_marks = ?,
         difficulty = ?, status = ?
     WHERE id = ?`,
    [
      topic_id,
      title.trim(),
      duration,
      total_marks,
      negative_marks ?? 0,
      difficulty || "Medium",
      status || "Draft",
      id,
    ]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Test set not found",
    });
  }

  res.json({
    success: true,
    message: "Test set updated successfully",
  });
});

// Delete test set
export const deleteTestSet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.promise().query(
    "DELETE FROM mock_test_sets WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Test set not found",
    });
  }

  res.json({
    success: true,
    message: "Test set deleted successfully",
  });
});

// ==========================================
// 5. QUESTION CONTROLLERS
// ==========================================

// Get questions
export const getQuestions = asyncHandler(async (req, res) => {
  const { test_set_id } = req.query;

  if (!test_set_id) {
    return res.status(400).json({
      success: false,
      message: "Test set ID is required",
    });
  }

  const [questions] = await db.promise().query(
    `SELECT *
     FROM mock_questions
     WHERE test_set_id = ?
     ORDER BY id ASC`,
    [test_set_id]
  );

  res.json({
    success: true,
    questions,
  });
});

// Add question
export const createQuestion = asyncHandler(async (req, res) => {
  const {
    test_set_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    marks,
  } = req.body;

  if (
    !test_set_id ||
    !question ||
    !option_a ||
    !option_b ||
    !option_c ||
    !option_d ||
    !["A", "B", "C", "D"].includes(correct_answer)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide the question, all options and correct answer",
    });
  }

  const [result] = await db.promise().query(
    `INSERT INTO mock_questions
     (test_set_id, question, option_a, option_b,
      option_c, option_d, correct_answer, explanation, marks)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      test_set_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation || null,
      marks ?? 1,
    ]
  );

  res.status(201).json({
    success: true,
    message: "Question added successfully",
    questionId: result.insertId,
  });
});

// Update question
export const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    marks,
  } = req.body;

  if (
    !question ||
    !option_a ||
    !option_b ||
    !option_c ||
    !option_d ||
    !["A", "B", "C", "D"].includes(correct_answer)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide the question, all options and correct answer",
    });
  }

  const [result] = await db.promise().query(
    `UPDATE mock_questions
     SET question = ?, option_a = ?, option_b = ?,
         option_c = ?, option_d = ?, correct_answer = ?,
         explanation = ?, marks = ?
     WHERE id = ?`,
    [
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation || null,
      marks ?? 1,
      id,
    ]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  res.json({
    success: true,
    message: "Question updated successfully",
  });
});

// Delete question
export const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await db.promise().query(
    "DELETE FROM mock_questions WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  res.json({
    success: true,
    message: "Question deleted successfully",
  });
});