export interface MMSEQuestion {
  key: string;
  label: string;
  type: "input" | "select";
  options?: string[];
  help?: string;
}

export interface MMSEQuestionsProps {
  onNext: () => void;
  onChange: (answers: Record<string, string>) => void;
  answers: Record<string, string>;
}

export interface MMSEConfirmationProps {
  answers: Record<string, string>;
  onPrev: () => void;
  onNext: () => void;
}

export interface MMSEResultProps {
  result: {
    score: number;
  } | null;
  onPrev: () => void;
}

export interface MMSECriterion {
  key: string;
  points: number;
  correct: (answer: string) => boolean | number;
}
