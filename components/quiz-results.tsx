"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, Play, RotateCcw, XCircle } from "lucide-react";
import type { QuizData, QuizResult } from "@/app/page";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/** Props del componente `QuizResults`. */
interface QuizResultsProps {
  /** Datos del quiz, usado para mostrar el título y mapear preguntas. */
  quizData: QuizData;
  /** Resultados individuales por pregunta. */
  results: QuizResult[];
  /** Reinicia el flujo para crear/cargar un nuevo quiz. */
  onRestart: () => void;
  /** Repite el quiz actual con las mismas preguntas. */
  onRetake: () => void;
}

/**
 * QuizResults
 * Muestra el resumen del desempeño, métricas y permite reiniciar o repetir.
 */
export function QuizResults({
  quizData,
  results,
  onRestart,
  onRetake,
}: QuizResultsProps) {
  const correctAnswers = results.filter((result) => result.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const totalTime = results.reduce((sum, result) => sum + result.timeSpent, 0);
  const averageTime = Math.round(totalTime / totalQuestions / 1000); // in seconds

  /**
   * getScoreMessage
   * Obtiene el mensaje de la puntuación.
   */
  const getScoreMessage = () => {
    if (percentage >= 90) return "Eres un sigma.";
    if (percentage >= 70) return "Bastante pro";
    if (percentage >= 50) return "No es muy sigma de tu parte";
    return "Burro";
  };

  /**
   * getScoreColor
   * Obtiene el color de la puntuación.
   */
  const getScoreColor = () => {
    if (percentage >= 70) return "text-primary";
    if (percentage >= 50) return "text-secondary";
    return "text-destructive";
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      {/* Results Summary */}
      <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-rose-500/15 ring-1 ring-purple-400/20 shadow-xl pt-0">
        <CardHeader className="text-center bg-gradient-to-r from-purple-800/40 to-rose-800/40 mt-0  py-6">
          <CardTitle className="text-2xl text-white">Quiz Completado</CardTitle>
          <CardDescription className="text-lg text-rose-100/80">
            {quizData.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {percentage}%
            </div>
            <div className="text-lg font-semibold">{getScoreMessage()}</div>
            <div className="text-muted-foreground">
              {correctAnswers} de {totalQuestions} respuestas correctas
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Correctas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-5 w-5" />
                {averageTime}s
              </div>
              <div className="text-sm text-muted-foreground">
                Promedio por pregunta
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onRetake}
              className="flex-1 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Repetir Quiz
            </Button>
            <Button onClick={onRestart} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Nuevo Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-rose-500/15 ring-1 ring-purple-400/20 shadow-xl pt-0">
        <CardHeader className="bg-gradient-to-r from-purple-800/20 to-rose-800/20 pt-6 py-6">
          <CardTitle className="text-white">Resultados Detallados</CardTitle>
          <CardDescription className="text-rose-100/80">
            Revisa tus respuestas pregunta por pregunta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((result, index) => {
            const question = quizData.questions.find(
              (q) => q.id === result.questionId,
            );
            if (!question) return null;

            return (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border ${
                  result.isCorrect
                    ? "bg-emerald-900/20 border-emerald-500/30"
                    : "bg-red-900/20 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {result.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-medium">
                      Pregunta {index + 1}: {question.question}
                    </div>
                    <div className="text-sm space-y-1">
                      <div
                        className={
                          result.isCorrect ? "text-emerald-300" : "text-red-300"
                        }
                      >
                        Tu respuesta: {question.options[result.selectedAnswer]}
                      </div>
                      {!result.isCorrect && (
                        <div className="text-emerald-300">
                          Respuesta correcta:{" "}
                          {question.options[question.correctAnswer]}
                        </div>
                      )}
                      {question.explanation && (
                        <div className="text-muted-foreground italic">
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
