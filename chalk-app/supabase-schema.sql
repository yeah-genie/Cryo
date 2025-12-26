-- Chalk MVP Schema
-- AI-Powered Tutoring Companion

-- 1. Curriculum (Hierarchical Topic Tree)
CREATE TABLE curriculum (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL, -- 'math', 'english', etc
  parent_id UUID REFERENCES curriculum(id),
  name TEXT NOT NULL,
  level INT DEFAULT 0, -- 0=subject, 1=unit, 2=topic
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT, -- 'Grade 7', 'Grade 10', etc
  subject TEXT,
  parent_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Lessons (Core data collection)
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  
  -- Basic info
  date DATE DEFAULT CURRENT_DATE,
  duration_minutes INT,
  
  -- Structured data (Smart Tags)
  topics UUID[] DEFAULT '{}', -- References to curriculum
  emoji_rating TEXT CHECK (emoji_rating IN ('good', 'okay', 'struggled')),
  struggle_types TEXT[] DEFAULT '{}', -- 'calculation', 'concept', 'application', 'focus'
  
  -- Free-form + AI
  notes TEXT,
  ai_extracted JSONB DEFAULT '{}', -- AI-extracted insights
  
  -- Parent communication
  parent_report TEXT,
  sent_to_parent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Deficit Patterns (Auto-calculated)
CREATE TABLE deficit_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES curriculum(id),
  topic_name TEXT,
  
  occurrence_count INT DEFAULT 1,
  last_occurrence DATE,
  struggle_types TEXT[] DEFAULT '{}',
  
  -- AI suggestions
  suggested_action TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS Policies
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE deficit_patterns ENABLE ROW LEVEL SECURITY;

-- Curriculum is public (read-only for all)
CREATE POLICY "Curriculum is public" ON curriculum
  FOR SELECT USING (true);

-- Students: tutors manage their own
CREATE POLICY "Tutors manage own students" ON students
  FOR ALL USING (auth.uid() = tutor_id);

-- Lessons: tutors manage their own
CREATE POLICY "Tutors manage own lessons" ON lessons
  FOR ALL USING (auth.uid() = tutor_id);

-- Deficit patterns: via student ownership
CREATE POLICY "Tutors view student deficits" ON deficit_patterns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM students WHERE students.id = deficit_patterns.student_id AND students.tutor_id = auth.uid())
  );

-- 6. Indexes
CREATE INDEX idx_lessons_student ON lessons(student_id);
CREATE INDEX idx_lessons_date ON lessons(date DESC);
CREATE INDEX idx_deficit_student ON deficit_patterns(student_id);
CREATE INDEX idx_curriculum_parent ON curriculum(parent_id);

-- 7. Seed Curriculum Data (Math)
INSERT INTO curriculum (id, subject, parent_id, name, level, sort_order) VALUES
  -- Math subject
  ('11111111-1111-1111-1111-111111111111', 'math', NULL, 'Mathematics', 0, 1),
  
  -- Algebra unit
  ('22222222-2222-2222-2222-222222222222', 'math', '11111111-1111-1111-1111-111111111111', 'Algebra', 1, 1),
  ('22222222-2222-2222-2222-222222222223', 'math', '22222222-2222-2222-2222-222222222222', 'Linear Equations', 2, 1),
  ('22222222-2222-2222-2222-222222222224', 'math', '22222222-2222-2222-2222-222222222222', 'Quadratic Equations', 2, 2),
  ('22222222-2222-2222-2222-222222222225', 'math', '22222222-2222-2222-2222-222222222222', 'Factoring', 2, 3),
  ('22222222-2222-2222-2222-222222222226', 'math', '22222222-2222-2222-2222-222222222222', 'Polynomials', 2, 4),
  
  -- Functions unit
  ('33333333-3333-3333-3333-333333333333', 'math', '11111111-1111-1111-1111-111111111111', 'Functions', 1, 2),
  ('33333333-3333-3333-3333-333333333334', 'math', '33333333-3333-3333-3333-333333333333', 'Linear Functions', 2, 1),
  ('33333333-3333-3333-3333-333333333335', 'math', '33333333-3333-3333-3333-333333333333', 'Quadratic Functions', 2, 2),
  ('33333333-3333-3333-3333-333333333336', 'math', '33333333-3333-3333-3333-333333333333', 'Exponential Functions', 2, 3),
  
  -- Geometry unit
  ('44444444-4444-4444-4444-444444444444', 'math', '11111111-1111-1111-1111-111111111111', 'Geometry', 1, 3),
  ('44444444-4444-4444-4444-444444444445', 'math', '44444444-4444-4444-4444-444444444444', 'Triangles', 2, 1),
  ('44444444-4444-4444-4444-444444444446', 'math', '44444444-4444-4444-4444-444444444444', 'Circles', 2, 2),
  ('44444444-4444-4444-4444-444444444447', 'math', '44444444-4444-4444-4444-444444444444', 'Coordinate Geometry', 2, 3);

-- English subject  
INSERT INTO curriculum (id, subject, parent_id, name, level, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555555', 'english', NULL, 'English', 0, 2),
  
  ('66666666-6666-6666-6666-666666666666', 'english', '55555555-5555-5555-5555-555555555555', 'Grammar', 1, 1),
  ('66666666-6666-6666-6666-666666666667', 'english', '66666666-6666-6666-6666-666666666666', 'Tenses', 2, 1),
  ('66666666-6666-6666-6666-666666666668', 'english', '66666666-6666-6666-6666-666666666666', 'Conditionals', 2, 2),
  ('66666666-6666-6666-6666-666666666669', 'english', '66666666-6666-6666-6666-666666666666', 'Passive Voice', 2, 3),
  
  ('77777777-7777-7777-7777-777777777777', 'english', '55555555-5555-5555-5555-555555555555', 'Reading', 1, 2),
  ('77777777-7777-7777-7777-777777777778', 'english', '77777777-7777-7777-7777-777777777777', 'Comprehension', 2, 1),
  ('77777777-7777-7777-7777-777777777779', 'english', '77777777-7777-7777-7777-777777777777', 'Vocabulary', 2, 2);
