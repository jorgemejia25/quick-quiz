"use client";

import { ArrowLeft, Download, FileJson, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

/**
 * EditableQuestion
 * Estructura de pregunta editable dentro del creador de quiz.
 */
type EditableQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

/**
 * CreateQuizPage
 * Página para crear un quiz manualmente, permitiendo añadir preguntas,
 * editar opciones y descargar el JSON resultante o uno de ejemplo.
 */
export default function CreateQuizPage() {
  const [title, setTitle] = useState("Mi Quiz");
  const [questions, setQuestions] = useState<EditableQuestion[]>([
    {
      id: "1",
      question: "Nueva pregunta",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correctAnswer: 0,
      explanation: "",
    },
  ]);

  /**
   * addQuestion
   * Añade una nueva pregunta al quiz.
   */
  const addQuestion = () => {
    setQuestions((prev) => {
      const nextId = String(prev.length + 1);
      return [
        ...prev,
        {
          id: nextId,
          question: "Nueva pregunta",
          options: ["Opción A", "Opción B"],
          correctAnswer: 0,
          explanation: "",
        },
      ];
    });
  };

  /**
   * removeQuestion
   * Elimina una pregunta del quiz.
   * @param id ID de la pregunta a eliminar.
   */
  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  /**
   * updateQuestion
   * Actualiza una pregunta del quiz.
   * @param id ID de la pregunta a actualizar.
   * @param patch Partes de la pregunta a actualizar.
   */
  const updateQuestion = (id: string, patch: Partial<EditableQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  /**
   * addOption
   * Añade una nueva opción a una pregunta.
   * @param qid ID de la pregunta a la que se añadirá la opción.
   */
  const addOption = (qid: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, "Nueva opción"] } : q,
      ),
    );
  };

  /**
   * removeOption
   * Elimina una opción de una pregunta.
   * @param qid ID de la pregunta de la que se eliminará la opción.
   * @param idx Índice de la opción a eliminar.
   */
  const removeOption = (qid: string, idx: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== idx),
              correctAnswer: Math.min(
                q.correctAnswer,
                Math.max(0, q.options.length - 2),
              ),
            }
          : q,
      ),
    );
  };

  /**
   * updateOption
   * Actualiza una opción de una pregunta.
   * @param qid ID de la pregunta de la que se actualizará la opción.
   * @param idx Índice de la opción a actualizar.
   * @param value Valor de la opción a actualizar.
   */
  const updateOption = (qid: string, idx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : q,
      ),
    );
  };

  /**
   * download
   * Descarga un archivo JSON.
   * @param filename Nombre del archivo a descargar.
   * @param data Datos a descargar.
   */
  const download = (filename: string, data: unknown) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * handleDownloadCurrent
   * Descarga el quiz actual.
   */
  const handleDownloadCurrent = () => {
    const payload = {
      title,
      questions: questions.map((q, qi) => ({
        id: q.id || String(qi + 1),
        question: q.question,
        options: q.options,
        correctAnswer: Number(q.correctAnswer) || 0,
        explanation: q.explanation || undefined,
      })),
    };
    download("quiz.json", payload);
  };

  /**
   * handleDownloadSample
   * Descarga un JSON de ejemplo.
   */
  const handleDownloadSample = () => {
    const sample = {
      title: "Conocimientos Generales",
      questions: [
        {
          id: "1",
          question: "¿Cuál es la capital de Francia?",
          options: ["Londres", "París", "Madrid", "Roma"],
          correctAnswer: 1,
          explanation: "París es la capital y ciudad más poblada de Francia.",
        },
      ],
    };
    download("quiz-ejemplo.json", sample);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-950 via-purple-900 to-rose-950">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header con navegación y título principal */}
        <div className="mb-8 mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-purple-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>

          <div className="text-center mb-2">
            <h1 className="text-5xl md:text-6xl font-black text-balance mb-3 bg-gradient-to-r from-purple-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
              Crea tu Quiz
            </h1>
            <p className="text-lg text-purple-200/80 font-medium">
              Diseña tu archivo de preguntas y descárgalo en formato JSON
            </p>
          </div>
        </div>

        {/* Configuración básica */}
        <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-800/30 via-purple-700/20 to-rose-800/30 shadow-2xl ring-1 ring-purple-400/30 backdrop-blur-sm mb-8 pt-0">
          <CardHeader className="bg-gradient-to-r from-purple-900/60 to-rose-900/60 pb-6 pt-6">
            <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
              Configuración del Quiz
            </CardTitle>
            <CardDescription className="text-purple-100/70 text-base">
              Establece el título y personaliza cada pregunta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="quiz-title"
                className="text-lg font-bold text-white block mb-4"
              >
                Título del quiz
              </Label>
              <Input
                id="quiz-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Mi Quiz"
                className="h-12 text-lg bg-purple-950/40 border-purple-400/40 text-white placeholder:text-purple-300/60 focus:border-rose-400/60"
              />
            </div>

            {/* Sección de preguntas */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">
                  Preguntas ({questions.length})
                </h3>
                <Button
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nueva pregunta
                </Button>
              </div>
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-purple-300/30 bg-gradient-to-br from-purple-900/40 to-rose-900/30 p-6 space-y-5 shadow-xl backdrop-blur-sm"
                >
                  {/* Header de pregunta */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Label className="text-lg font-bold text-white">
                          Pregunta {qIndex + 1}
                        </Label>
                      </div>
                      <Input
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(q.id, { question: e.target.value })
                        }
                        placeholder="Escribe la pregunta"
                        className="h-12 text-base bg-purple-950/50 border-purple-400/40 text-white placeholder:text-purple-300/60 focus:border-rose-400/60"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => removeQuestion(q.id)}
                      className="border-2 border-red-400/40 hover:border-red-300 bg-red-950/30 hover:bg-red-900/40 text-red-200 hover:text-white transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Opciones de respuesta */}
                  <div className="space-y-2">
                    <Label className="text-base font-bold text-purple-200 mb-4 block">
                      Opciones de respuesta
                    </Label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {q.options.map((opt, idx) => (
                        <button
                          type="button"
                          key={idx}
                          className={`text-left rounded-xl p-4 border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 ${
                            q.correctAnswer === idx
                              ? "border-emerald-400/60 bg-emerald-950/40 ring-2 ring-emerald-400/20"
                              : "border-purple-400/30 bg-purple-950/30 hover:border-purple-300/50 focus:ring-purple-300/30"
                          }`}
                          aria-label={`Seleccionar opción ${String.fromCharCode(
                            65 + idx,
                          )} como correcta`}
                          onClick={() =>
                            updateQuestion(q.id, { correctAnswer: idx })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              updateQuestion(q.id, { correctAnswer: idx });
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-white">
                              Opción {String.fromCharCode(65 + idx)}
                            </span>
                            {q.correctAnswer === idx ? (
                              <span className="px-2 py-0.5 text-xs rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                                Correcta
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs rounded-md bg-purple-500/10 text-purple-200 border border-purple-400/20">
                                Marcar correcta
                              </span>
                            )}
                          </div>
                          <Input
                            value={opt}
                            onChange={(e) =>
                              updateOption(q.id, idx, e.target.value)
                            }
                            placeholder={`Opción ${idx + 1}`}
                            className="mb-3 bg-purple-950/50 border-purple-400/30 text-white placeholder:text-purple-300/60 focus:border-rose-400/60"
                          />
                          <div className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(q.id, idx)}
                              className="border border-red-400/40 hover:border-red-300 bg-red-950/30 hover:bg-red-900/40 text-red-200 hover:text-white text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botón agregar opción */}
                  <div className="flex items-center justify-start">
                    <Button
                      onClick={() => addOption(q.id)}
                      size="sm"
                      variant="outline"
                      className="border-2 border-purple-400/40 hover:border-purple-300 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Añadir opción
                    </Button>
                  </div>

                  {/* Explicación */}
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-purple-200">
                      Explicación (opcional)
                    </Label>
                    <Input
                      value={q.explanation || ""}
                      onChange={(e) =>
                        updateQuestion(q.id, { explanation: e.target.value })
                      }
                      placeholder="Explicación o detalle de la respuesta"
                      className="bg-purple-950/50 border-purple-400/30 text-white placeholder:text-purple-300/60 focus:border-rose-400/60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botones de descarga */}
        <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-800/30 via-purple-700/20 to-rose-800/30 shadow-2xl ring-1 ring-purple-400/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-black text-white mb-4 text-center">
              Descargar archivos JSON
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                className="h-12 text-base font-bold border-2 border-cyan-400/40 hover:border-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 hover:text-white transition-all"
              >
                <Download className="h-5 w-5 mr-3" /> Descargar ejemplo
              </Button>
              <Button
                onClick={handleDownloadCurrent}
                className="h-12 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 shadow-lg"
              >
                <FileJson className="h-5 w-5 mr-3" /> Descargar mi quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
