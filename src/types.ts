export interface KeyConcept {
  concept: string;
  description: string;
}

export interface ExplainResponse {
  explanation: string;
  keyConcepts: KeyConcept[];
  stepByStep: string[];
}

export interface DebugIssue {
  line: number;
  type: string;
  message: string;
  suggestion: string;
}

export interface DebugResponse {
  hasErrors: boolean;
  issues: DebugIssue[];
  correctedCode: string;
  pedagogicalTip: string;
}

export interface GenerateResponse {
  code: string;
  explanation: string;
  complexity: string;
  exampleUsage: string;
}

export interface ProjectFile {
  name: string;
  language: string;
  desc: string;
  content: string;
}
