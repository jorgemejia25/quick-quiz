"use client";

import { QuizGame } from "@/components/quiz-game";
import { QuizResults } from "@/components/quiz-results";
import { QuizSetup } from "@/components/quiz-setup";
import { useState } from "react";

export interface Question {
  /**
   * Identificador de la pregunta. Debe ser único dentro del quiz.
   */
  id: string;
  /** Texto de la pregunta mostrada al usuario. */
  question: string;
  /** Lista de opciones de respuesta en orden. */
  options: string[];
  /** Índice (0-based) de la opción correcta dentro de `options`. */
  correctAnswer: number;
  /** Explicación opcional que se muestra tras responder. */
  explanation?: string;
}

export interface QuizData {
  /** Título del quiz. */
  title: string;
  /** Preguntas que componen el quiz. */
  questions: Question[];
}

export interface QuizResult {
  /** ID de la pregunta respondida. */
  questionId: string;
  /** Índice seleccionado por el usuario. */
  selectedAnswer: number;
  /** Indica si la respuesta fue correcta. */
  isCorrect: boolean;
  /** Tiempo en milisegundos que tomó responder. */
  timeSpent: number;
}

/**
 * QuickQuizApp
 *
 * Componente principal que orquesta el flujo del quiz:
 * - Configuración (carga del JSON y opciones)
 * - Juego (presentación de preguntas)
 * - Resultados (resumen y acciones)
 */
export default function QuickQuizApp() {
  const [currentScreen, setCurrentScreen] = useState<
    "setup" | "quiz" | "results"
  >("setup");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [randomOrder, setRandomOrder] = useState(false);

  /**
   * handleStartQuiz
   * Inicia el juego con los datos del quiz y el orden aleatorio.
   * @param data Datos del quiz.
   * @param random Orden aleatorio.
   */
  const handleStartQuiz = (data: QuizData, random: boolean) => {
    setQuizData(data);
    setRandomOrder(random);
    setCurrentScreen("quiz");
  };

  /**
   * handleQuizComplete
   * Maneja el final del juego, mostrando los resultados.
   * @param results Resultados del juego.
   */
  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    setCurrentScreen("results");
  };

  /**
   * handleRestart
   * Reinicia el juego, reiniciando los datos y el estado.
   */
  const handleRestart = () => {
    setQuizData(null);
    setQuizResults([]);
    setCurrentScreen("setup");
  };

  /**
   * handleRetakeQuiz
   * Reinicia el juego, reiniciando los datos y el estado.
   * @param results Resultados del juego.
   */
  const handleRetakeQuiz = () => {
    setQuizResults([]);
    setCurrentScreen("quiz");
  };

  return (
    <main className="min-h-screen site-bg">
      <div className="container mx-auto px-4 py-8">
        {currentScreen === "setup" && (
          <QuizSetup onStartQuiz={handleStartQuiz} />
        )}

        {currentScreen === "quiz" && quizData && (
          <QuizGame
            quizData={quizData}
            randomOrder={randomOrder}
            onComplete={handleQuizComplete}
          />
        )}

        {currentScreen === "results" && quizData && (
          <QuizResults
            quizData={quizData}
            results={quizResults}
            onRestart={handleRestart}
            onRetake={handleRetakeQuiz}
          />
        )}
      </div>
    </main>
  );
}
