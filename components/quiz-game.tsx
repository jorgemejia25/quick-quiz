"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, XCircle, Zap } from "lucide-react";
import type { Question, QuizData, QuizResult } from "@/app/page";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/** Props del componente `QuizGame`. */
interface QuizGameProps {
  /** Datos del quiz (título y preguntas). */
  quizData: QuizData;
  /** Si true, se presentan las preguntas en orden aleatorio. */
  randomOrder: boolean;
  /** Callback invocado al concluir el quiz con el arreglo de resultados. */
  onComplete: (results: QuizResult[]) => void;
}

/**
 * QuizGame
 * Presenta una pregunta a la vez, maneja selección y validación,
 * y acumula resultados hasta completar el quiz.
 */
export function QuizGame({ quizData, randomOrder, onComplete }: QuizGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  /**
   * useEffect
   * Mezcla las preguntas si el orden aleatorio está habilitado.
   */
  useEffect(() => {
    // Mezcla las preguntas si el orden aleatorio está habilitado.
    const questionsToUse = randomOrder
      ? [...quizData.questions].sort(() => Math.random() - 0.5)
      : quizData.questions;

    setQuestions(questionsToUse);
    setStartTime(Date.now());
  }, [quizData, randomOrder]);

  /**
   * currentQuestion
   * Pregunta actual.
   */
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  /**
   * handleAnswerSelect
   * Maneja la selección de una respuesta.
   * @param answerIndex Índice de la respuesta seleccionada.
   */
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  /**
   * handleSubmitAnswer
   * Maneja el envío de una respuesta.
   */
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - startTime;

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    };

    /**
     * setResults
     * Establece los resultados.
     * @param prev Resultados previos.
     */
    setResults((prev) => [...prev, result]);
    setShowResult(true);
  };

  /**
   * handleNext
   * Avanza manualmente a la siguiente pregunta o finaliza el quiz.
   */
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setStartTime(Date.now());
    } else {
      onComplete(results);
    }
  };

  /**
   * if (!currentQuestion)
   * Si no hay pregunta actual, muestra un mensaje de carga.
   */
  if (!currentQuestion) {
    return <div>Cargando...</div>;
  }

  /**
   * isCorrect
   * Indica si la respuesta seleccionada es correcta.
   */

  const isCorrect =
    showResult && selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className=" w-full overflow-hidden flex items-start justify-center p-3">
      <div className="max-w-4xl w-full animate-bounce-in">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 quiz-hero-gradient rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-foreground">
                  Pregunta {currentQuestionIndex + 1}
                </span>
                <p className="text-muted-foreground text-sm font-medium">
                  de {questions.length} preguntas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 quiz-button-primary px-4 py-2 rounded-full text-white">
              <Zap className="h-4 w-4" />
              <span className="font-bold text-base">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-muted rounded-full" />
        </div>

        <Card className="border-0 overflow-hidden animate-bounce-in bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-rose-500/15 ring-1 ring-purple-400/20 shadow-xl pt-0">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-purple-800/40 to-rose-800/40 mt-0">
            <CardTitle className="text-2xl font-black text-balance leading-relaxed text-foreground px-3 pt-4">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let buttonClass =
                  "w-full justify-start text-left h-auto p-4 text-base font-bold transition-all duration-300 hover:scale-105 rounded-2xl border-2";
                let iconClass =
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg font-black";

                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass +=
                      " text-white bg-emerald-900/40 border-emerald-500/40 animate-pulse-success";
                    iconClass += " bg-green-500 text-white";
                  } else if (
                    index === selectedAnswer &&
                    selectedAnswer !== currentQuestion.correctAnswer
                  ) {
                    buttonClass +=
                      " text-white bg-red-900/40 border-red-500/40 animate-pulse-error";
                    iconClass += " bg-red-500 text-white";
                  } else {
                    buttonClass += " bg-purple-900/20 border-purple-400/30";
                    iconClass += " bg-purple-950/40 text-purple-200";
                  }
                } else if (selectedAnswer === index) {
                  buttonClass +=
                    " text-white bg-gradient-to-r from-purple-700/60 to-rose-700/60 border-purple-400/50 ring-2 ring-rose-400/40 shadow-lg";
                  iconClass += " bg-rose-500 text-white";
                } else {
                  buttonClass +=
                    " hover:bg-purple-900/30 border-purple-400/30 bg-purple-900/20";
                  iconClass += " bg-purple-950/40 text-purple-200";
                }

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <span className="flex items-center gap-4 w-full">
                      <span className={iconClass}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-wrap flex-1 text-left">
                        {option}
                      </span>
                      {showResult &&
                        index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-6 w-6 text-green-600 animate-bounce" />
                        )}
                      {showResult &&
                        index === selectedAnswer &&
                        selectedAnswer !== currentQuestion.correctAnswer && (
                          <XCircle className="h-6 w-6 text-red-600 animate-wiggle" />
                        )}
                      {!showResult && selectedAnswer === index && (
                        <Zap className="h-5 w-5 text-white/80" />
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>

            {showResult && (
              <div
                className={`p-5 rounded-2xl animate-bounce-in border-2 ${
                  isCorrect
                    ? "bg-emerald-950/70 border-emerald-500/40"
                    : "bg-red-950/70 border-red-500/40"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-8 w-8 text-emerald-400 animate-bounce" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400 animate-wiggle" />
                  )}
                  <span className="text-xl font-black text-white">
                    {isCorrect ? "¡Cooooorrecto!" : "¡Incorrecto!"}
                  </span>
                </div>
                {currentQuestion.explanation && (
                  <p className="text-base text-white/90 leading-relaxed font-medium">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}

            {showResult && (
              <Button
                onClick={handleNext}
                className="w-full h-12 text-lg font-black quiz-button-primary text-white rounded-2xl"
                size="lg"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Siguiente"
                  : "Ver resultados"}
              </Button>
            )}

            {!showResult && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full h-12 text-lg font-black quiz-button-secondary text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <Zap className="h-5 w-5 mr-2" />
                ¡Confirmar!
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
