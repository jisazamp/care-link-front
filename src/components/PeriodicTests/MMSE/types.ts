export interface MMSEQuestion {
  key: string;
  label: string;
  options: string[];
}

export interface MMSEQuestionsProps {
  onNext: () => void;
  onChange: (values: Record<string, string>) => void;
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
