"use client";

import type { QuizData, QuizResult } from "@/app/page";
import { Button, Card } from "@heroui/react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";

interface QuizResultsProps {
  quizData: QuizData;
  results: QuizResult[];
  onRestart: () => void;
  onRetake: () => void;
}

export function QuizResults({ quizData, results, onRestart, onRetake }: QuizResultsProps) {
  const correctAnswers = results.filter(({ isCorrect }) => isCorrect).length;
  const score = results.length ? Math.round((correctAnswers / results.length) * 100) : 0;
  const averageTime = results.length
    ? Math.round(results.reduce((total, result) => total + result.timeSpent, 0) / results.length / 100) / 10
    : 0;

  return (
    <div className="app-frame results-frame motion-enter">
      <header className="page-header">
        <div>
          <span className="page-kicker">{quizData.title}</span>
          <strong>Resultados</strong>
        </div>
      </header>

      <Card className="oled-card score-card" variant="secondary">
        <div className="score-value"><strong>{score}</strong><span>%</span></div>
        <div className="score-stats">
          <span><strong>{correctAnswers}/{results.length}</strong> correctas</span>
          <span><strong>{averageTime}s</strong> por pregunta</span>
        </div>
        <div className="result-actions">
          <Button variant="primary" className="signal-button" onPress={onRetake}><RotateCcw size={16} /> Repetir</Button>
          <Button variant="outline" onPress={onRestart}>Nuevo quiz <ArrowRight size={16} /></Button>
        </div>
      </Card>

      <Card className="oled-card detail-card" variant="secondary">
        <Card.Header className="detail-header">
          <Card.Title className="panel-title">Respuestas</Card.Title>
        </Card.Header>
        <Card.Content className="detail-list">
          {results.map((result, index) => {
            const question = quizData.questions.find(({ id }) => id === result.questionId);
            if (!question) return null;
            return (
              <article key={`${result.questionId}-${index}`} className="result-row">
                <span className={`result-state ${result.isCorrect ? "success" : "danger"}`}>
                  {result.isCorrect ? <Check size={17} /> : <X size={17} />}
                </span>
                <div className="result-detail">
                  <span>Pregunta {String(index + 1).padStart(2, "0")}</span>
                  <h3>{question.question}</h3>
                  <p>
                    Tu respuesta: <strong>{result.selectedAnswerText ?? question.options[result.selectedAnswer]}</strong>
                  </p>
                  {!result.isCorrect && (
                    <p className="correct-answer">Correcta: {result.correctAnswerText ?? question.options[question.correctAnswer]}</p>
                  )}
                  {question.explanation && <small>{question.explanation}</small>}
                </div>
                <span className="result-time">{(result.timeSpent / 1000).toFixed(1)} s</span>
              </article>
            );
          })}
        </Card.Content>
      </Card>
    </div>
  );
}
