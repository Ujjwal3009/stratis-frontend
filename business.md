You are a senior backend architect and performance analytics engineer.

This system already supports:

- User login
- Subject selection
- Difficulty selection
- Test generation (currently AI-based)
- Test submission
- Behaviour tracking
- Basic AI-generated report

Refactor and extend the system into a scalable, cost-optimized
Question Bank-first + Expert Behaviour Analytics architecture.

IMPORTANT:

- Do NOT redesign from scratch.
- Extend modularly.
- AI must NOT be used per test in real time.
- AI allowed only for batch generation and concise summary reports.
- All behavioural analytics must be rule-based.

====================================================
PART 0 — EXISTING PYQ DATA INTEGRATION
====================================================

A CSV dataset exists with:

- Paper
- Passage
- Image Url
- Question
- Option A–D
- Correct Answer
- Explanation
- Subject
- Topic
- Year
- difficulty
- cognitive_level

Tasks:

1. Align `questions` table to include:
   - id (UUID)
   - subject
   - topic
   - difficulty
   - cognitive_level
   - question_text
   - options (JSONB)
   - correct_answer
   - explanation_json (JSONB)
   - year
   - paper
   - passage (nullable)
   - image_url (nullable)
   - normalized_hash (unique)
   - created_source (PYQ/AI)
   - is_active
   - created_at

2. explanation_json for PYQ:
   {
   "correct_reason": Explanation,
   "why_A_wrong": null,
   "why_B_wrong": null,
   "why_C_wrong": null,
   "core_concept_summary": null,
   "trap_insight": null
   }

3. created_source = "PYQ"

4. normalized_hash = lower(trim(subject + topic + question_text))

Indexes:
(subject, difficulty)
(topic, difficulty)
(created_source)
normalized_hash unique

====================================================
PART 1 — TEST GENERATION (PYQ-FIRST MODEL)
====================================================

Modify TestGenerationService:

1. Fetch unseen PYQ questions:
   - subject
   - difficulty
   - exclude attempted

2. If PYQ >= required:
   Serve PYQ only.

3. If insufficient:
   Fetch AI-generated unseen questions.

4. If still insufficient:
   Trigger async InventoryRefillService.

5. Remove AI generation from request-response flow.

====================================================
PART 2 — INVENTORY REFILL SERVICE
====================================================

Scheduled job:

For each subject + topic + difficulty:
If total AI-generated questions < target_count:
Generate batch (20–40)
Generate structured explanation_json
Check duplicate via normalized_hash
Check fuzzy similarity (>85% reject)
Store as created_source = "AI"

AI used ONLY here.

====================================================
PART 3 — USER ATTEMPTS TABLE
====================================================

user_attempts:

- user_id
- question_id
- selected_option
- first_selected_option
- option_change_count
- time_taken
- is_correct
- attempted_at

Indexes:
(user_id, question_id)
(user_id, attempted_at)

====================================================
PART 4 — BEHAVIOUR ANALYTICS ENGINE
====================================================

Create BehaviourAnalyticsService.

Rule-based calculations per test:

- Accuracy %
- Attempt Ratio
- Negative Marks
- First Instinct Accuracy
- Elimination Efficiency
- Impulsive Errors
- Overthinking Errors
- Guess Probability Index
- Cognitive Breakdown
- Risk Appetite Score
- Fatigue Curve
- Confidence Index
- Consistency Index

Store results in:
user_test_metrics

====================================================
PART 5 — WEAK TOPIC RETEST
====================================================

WeakRetestService:

- Identify lowest accuracy topics
- Fetch unseen PYQ first
- Then AI
- Return 5–10 questions
- No AI usage

====================================================
PART 6 — COST-OPTIMIZED REPORT
====================================================

Send only structured summary to AI:

{
accuracy,
impulsive_errors,
overthinking_errors,
elimination_score,
weak_topics,
cognitive_breakdown,
fatigue_drop,
risk_score
}

AI returns max 200-word strategy.

ONE AI call per test only.

====================================================
ARCHITECTURE RULES
====================================================

- Thin controllers
- Modular services
- LEFT JOIN instead of NOT IN
- Proper indexing
- Transactional updates
- No ML
