export interface TestSuite {
  id: string;
  name: string;
  feature_file: string;
  tags: string[];
  description: string;
  scenario_count: number;
  created_at: string;
}

export interface TestScenario {
  id: string;
  suite_id: string;
  name: string;
  tags: string[];
  steps: Step[];
  line_number: number;
  is_outline: boolean;
  created_at: string;
}

export interface Step {
  keyword: string;
  text: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
}

export interface TestRun {
  id: string;
  run_name: string;
  triggered_by: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'aborted';
  tags_filter: string;
  total_scenarios: number;
  passed_count: number;
  failed_count: number;
  skipped_count: number;
  duration_ms: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ScenarioResult {
  id: string;
  run_id: string;
  scenario_id: string;
  scenario_name: string;
  suite_name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration_ms: number;
  error_message: string;
  stack_trace: string;
  steps_executed: Step[];
  executed_at: string;
}
