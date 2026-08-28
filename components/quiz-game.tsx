"use client";

import type { Question, QuizData, QuizResult } from "@/app/page";
import { Button, Card, ProgressBar } from "@heroui/react";
import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

function shuffleInPlace<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function shuffleQuestionOptions(question: Question): Question {
  const options = question.options.map((text, originalIndex) => ({ text, originalIndex }));
  shuffleInPlace(options);
  return {
    ...question,
    options: options.map(({ text }) => text),
    correctAnswer: options.findIndex(({ originalIndex }) => originalIndex === question.correctAnswer),
  };
}

interface QuizGameProps {
  quizData: QuizData;
  randomOrder: boolean;
  onComplete: (results: QuizResult[]) => void;
}

export function QuizGame({ quizData, randomOrder, onComplete }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState(() => Date.now());

  useEffect(() => {
    const source = [...quizData.questions];
    if (randomOrder) shuffleInPlace(source);
    setQuestions(source.map(shuffleQuestionOptions));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setResults([]);
    setStartTime(Date.now());
  }, [quizData, randomOrder]);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return <div className="loading-state">Preparando preguntas…</div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      selectedAnswerText: currentQuestion.options[selectedAnswer],
      correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer],
      isCorrect,
      timeSpent: Date.now() - startTime,
    };
    setResults((previous) => [...previous, result]);
    setIsRevealed(true);
  };

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      onComplete(results);
      return;
    }
    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setStartTime(Date.now());
  };

  return (
    <div className="app-frame quiz-frame motion-enter">
      <header className="page-header">
        <div>
          <span className="page-kicker">{quizData.title}</span>
          <strong>Pregunta {currentIndex + 1}</strong>
        </div>
        <span className="page-count">{currentIndex + 1} / {questions.length}</span>
      </header>

      <ProgressBar aria-label="Progreso del quiz" value={progress} color="success" className="quiz-progress">
        <ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track>
      </ProgressBar>

      <Card className="oled-card question-card" variant="secondary">
        <Card.Content className="question-content">
          <h1 className="question-title">{currentQuestion.question}</h1>
          <div className="answer-grid" role="radiogroup" aria-label="Opciones de respuesta">
            {currentQuestion.options.map((option, index) => {
              const selected = selectedAnswer === index;
              const correct = isRevealed && index === currentQuestion.correctAnswer;
              const incorrect = isRevealed && selected && !correct;
              return (
                <button
                  key={`${currentQuestion.id}-${index}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={isRevealed}
                  className={`answer-option ${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""} ${incorrect ? "is-incorrect" : ""}`}
                  onClick={() => setSelectedAnswer(index)}
                >
                  <span className="answer-key">{String.fromCharCode(65 + index)}</span>
                  <span className="answer-text">{option}</span>
                  <span className="answer-state" aria-hidden="true">
                    {correct ? <Check size={17} /> : incorrect ? <X size={17} /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div className={`feedback-panel ${isCorrect ? "success" : "danger"}`} role="status">
              <span className="feedback-icon">{isCorrect ? <Check size={20} /> : <X size={20} />}</span>
              <div>
                <strong>{isCorrect ? "Correcta" : `Correcta: ${currentQuestion.options[currentQuestion.correctAnswer]}`}</strong>
                {currentQuestion.explanation && <p>{currentQuestion.explanation}</p>}
              </div>
            </div>
          )}
          <div className="question-action">
          {!isRevealed ? (
            <Button variant="primary" fullWidth className="signal-button" isDisabled={selectedAnswer === null} onPress={submitAnswer}>
              Comprobar <ArrowRight size={17} />
            </Button>
          ) : (
            <Button variant="primary" fullWidth className="signal-button" onPress={nextQuestion}>
              {currentIndex === questions.length - 1 ? "Resultados" : "Siguiente"}
              <ArrowRight size={17} />
            </Button>
          )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
