/*
  # LabCorp QA Automation Dashboard Schema

  ## Overview
  Creates the complete database schema for the LabCorp QA Automation dashboard,
  tracking test suites, test runs, individual scenario results, and execution logs.

  ## New Tables

  ### test_suites
  Represents the two test suites (GET and POST) from the feature files.
  - id: UUID primary key
  - name: Suite display name (e.g., "GET Request Tests")
  - feature_file: Source .feature filename
  - tags: Array of Cucumber tags associated with suite
  - description: Human-readable description
  - created_at: Timestamp

  ### test_scenarios
  Individual test scenarios defined in feature files.
  - id: UUID primary key
  - suite_id: FK to test_suites
  - name: Scenario name
  - tags: Array of Cucumber tags (e.g., @smoke, @regression)
  - steps: JSON array of step definitions
  - line_number: Line in feature file
  - created_at: Timestamp

  ### test_runs
  A complete execution of the test suite.
  - id: UUID primary key
  - run_name: Display name for the run
  - triggered_by: Who triggered (e.g., "manual", "ci")
  - status: pending | running | passed | failed | aborted
  - tags_filter: Which tag filter was used
  - total_scenarios: Count of scenarios in run
  - passed_count: Passed scenario count
  - failed_count: Failed scenario count
  - skipped_count: Skipped scenario count
  - duration_ms: Total execution time in milliseconds
  - started_at: When run began
  - completed_at: When run finished
  - created_at: Timestamp

  ### scenario_results
  Result of each scenario within a test run.
  - id: UUID primary key
  - run_id: FK to test_runs
  - scenario_id: FK to test_scenarios
  - status: passed | failed | skipped | pending
  - duration_ms: Execution time for this scenario
  - error_message: Failure message if failed
  - stack_trace: Full error stack if failed
  - steps_executed: JSON with per-step pass/fail detail
  - executed_at: When scenario was executed

  ## Security
  - RLS enabled on all tables
  - Public read access for dashboard visibility (demo mode)
  - Authenticated write access for managing runs
*/

-- Test Suites table
CREATE TABLE IF NOT EXISTS test_suites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  feature_file text NOT NULL,
  tags text[] DEFAULT '{}',
  description text DEFAULT '',
  scenario_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_suites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view test suites"
  ON test_suites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert test suites"
  ON test_suites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update test suites"
  ON test_suites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Test Scenarios table
CREATE TABLE IF NOT EXISTS test_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suite_id uuid REFERENCES test_suites(id) ON DELETE CASCADE,
  name text NOT NULL,
  tags text[] DEFAULT '{}',
  steps jsonb DEFAULT '[]',
  line_number integer DEFAULT 0,
  is_outline boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view test scenarios"
  ON test_scenarios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert test scenarios"
  ON test_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Test Runs table
CREATE TABLE IF NOT EXISTS test_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_name text NOT NULL,
  triggered_by text DEFAULT 'manual',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'passed', 'failed', 'aborted')),
  tags_filter text DEFAULT '@regression',
  total_scenarios integer DEFAULT 0,
  passed_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  skipped_count integer DEFAULT 0,
  duration_ms integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view test runs"
  ON test_runs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert test runs"
  ON test_runs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update test runs"
  ON test_runs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can insert test runs"
  ON test_runs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update test runs"
  ON test_runs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Scenario Results table
CREATE TABLE IF NOT EXISTS scenario_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES test_runs(id) ON DELETE CASCADE,
  scenario_id uuid REFERENCES test_scenarios(id) ON DELETE CASCADE,
  scenario_name text NOT NULL,
  suite_name text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('passed', 'failed', 'skipped', 'pending')),
  duration_ms integer DEFAULT 0,
  error_message text DEFAULT '',
  stack_trace text DEFAULT '',
  steps_executed jsonb DEFAULT '[]',
  executed_at timestamptz DEFAULT now()
);

ALTER TABLE scenario_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scenario results"
  ON scenario_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert scenario results"
  ON scenario_results FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert scenario results"
  ON scenario_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_test_scenarios_suite_id ON test_scenarios(suite_id);
CREATE INDEX IF NOT EXISTS idx_scenario_results_run_id ON scenario_results(run_id);
CREATE INDEX IF NOT EXISTS idx_scenario_results_scenario_id ON scenario_results(scenario_id);
CREATE INDEX IF NOT EXISTS idx_test_runs_status ON test_runs(status);
CREATE INDEX IF NOT EXISTS idx_test_runs_created_at ON test_runs(created_at DESC);
