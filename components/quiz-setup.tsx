"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Download,
  FileText,
  Play,
  Shuffle,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { QuizData } from "@/app/page";
import type React from "react";
import { Toggle } from "@/components/ui/toggle";

/**
 * validateQuizData
 * Valida la estructura mínima del JSON de quiz y devuelve un objeto tipado.
 * @param input JSON parseado.
 * @throws Error si la estructura no es válida.
 */
function validateQuizData(input: unknown): QuizData {
  if (!input || typeof input !== "object") {
    throw new Error("El JSON del quiz no es un objeto válido");
  }

  const record = input as Record<string, unknown>;
  const title = record.title;
  const questions = record.questions;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("El JSON debe tener un título (string) válido");
  }
  if (!Array.isArray(questions)) {
    throw new Error("El JSON debe tener un array de preguntas");
  }

  for (const question of questions) {
    if (!question || typeof question !== "object") {
      throw new Error("Cada pregunta debe ser un objeto");
    }
    const q = question as Record<string, unknown>;
    if (typeof q.id !== "string" || q.id.trim().length === 0) {
      throw new Error("Cada pregunta debe tener un id (string)");
    }
    if (typeof q.question !== "string" || q.question.trim().length === 0) {
      throw new Error("Cada pregunta debe tener question (string)");
    }
    if (!Array.isArray(q.options) || q.options.length === 0) {
      throw new Error("Cada pregunta debe tener options (array) no vacío");
    }
    if (typeof q.correctAnswer !== "number") {
      throw new Error("Cada pregunta debe tener correctAnswer (número)");
    }
  }

  return record as unknown as QuizData;
}

/**
 * Props para `QuizSetup`.
 * - onStartQuiz: callback que inicia el quiz con los datos cargados y si el orden es aleatorio.
 */
interface QuizSetupProps {
  onStartQuiz: (data: QuizData, randomOrder: boolean) => void;
}

/**
 * QuizSetup
 * Pantalla de configuración: permite cargar un JSON, alternar el orden
 * aleatorio y comenzar el quiz.
 */
export function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const [loadedQuiz, setLoadedQuiz] = useState<QuizData | null>(null);
  const [randomOrder, setRandomOrder] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample quiz data for demonstration
  const sampleQuiz = {
    title: "Conocimientos Generales",
    questions: [
      {
        id: "1",
        question: "¿Cuál es la capital de Francia?",
        options: ["Londres", "París", "Madrid", "Roma"],
        correctAnswer: 1,
        explanation: "París es la capital y ciudad más poblada de Francia.",
      },
      {
        id: "2",
        question: "¿En qué año llegó el hombre a la Luna?",
        options: ["1967", "1968", "1969", "1970"],
        correctAnswer: 2,
        explanation:
          "Neil Armstrong y Buzz Aldrin llegaron a la Luna el 20 de julio de 1969.",
      },
      {
        id: "3",
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: ["Saturno", "Júpiter", "Neptuno", "Urano"],
        correctAnswer: 1,
        explanation: "Júpiter es el planeta más grande del sistema solar.",
      },
      {
        id: "4",
        question: "¿Quién escribió 'Don Quijote de la Mancha'?",
        options: [
          "Lope de Vega",
          "Miguel de Cervantes",
          "Federico García Lorca",
          "Calderón de la Barca",
        ],
        correctAnswer: 1,
        explanation:
          "Miguel de Cervantes Saavedra escribió esta obra maestra de la literatura española.",
      },
      {
        id: "5",
        question: "¿Cuál es el océano más grande del mundo?",
        options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
        correctAnswer: 3,
        explanation:
          "El océano Pacífico es el más grande y profundo del mundo.",
      },
    ],
  };

  /**
   * predefQuizzes
   * Lista de quizzes almacenados en `public/`.
   */
  const predefQuizzes: Array<{ id: string; label: string; path: string }> = [
    {
      id: "quiz-biopsicologia",
      label: "Biopsicología",
      path: "/quiz-biopsicologia.json",
    },
    {
      id: "quiz-danio-cerebral",
      label: "Daño Cerebral",
      path: "/quiz-danio-cerebral.json",
    },
  ];

  /** Maneja la carga y validación del archivo JSON. */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isJsonByMime = file.type.includes("json");
      const isJsonByExt = file.name.toLowerCase().endsWith(".json");
      if (!isJsonByMime && !isJsonByExt) {
        setError("Por favor selecciona un archivo JSON (.json)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const quizData = validateQuizData(JSON.parse(content));
          setLoadedQuiz(quizData);
          setError("");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al procesar el JSON",
          );
          setLoadedQuiz(null);
        } finally {
          setIsLoading(false);
          // Permite volver a seleccionar el mismo archivo reiniciando el input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.onerror = () => {
        setError("Error al leer el archivo");
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    } else {
      setError("No se seleccionó ningún archivo");
    }
  };

  /**
   * handleLoadPreset
   * Carga un quiz predefinido desde `public/` y lo establece como quiz activo.
   * @param preset Quiz predefinido.
   */
  const handleLoadPreset = async (preset: {
    id: string;
    label: string;
    path: string;
  }) => {
    setError("");
    setIsLoading(true);
    setLoadingPreset(preset.id);
    try {
      const res = await fetch(preset.path, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(
          `No se pudo cargar "${preset.label}" (HTTP ${res.status})`,
        );
      }
      const parsed: unknown = await res.json();
      const quizData = validateQuizData(parsed);
      setLoadedQuiz(quizData);
    } catch (err) {
      setLoadedQuiz(null);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar el quiz predefinido",
      );
    } finally {
      setIsLoading(false);
      setLoadingPreset(null);
    }
  };

  /** Abre el selector de archivos. */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /** Resetea el estado de carga y vuelve a abrir el selector. */
  const handleResetUpload = () => {
    setLoadedQuiz(null);
    setError("");
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  /** Descarga un JSON de ejemplo de quiz. */
  const handleDownloadSample = () => {
    const dataStr = JSON.stringify(sampleQuiz, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "quiz-ejemplo.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  /** Llama al callback para iniciar el quiz con el estado actual. */
  const handleStartQuiz = () => {
    if (loadedQuiz) {
      onStartQuiz(loadedQuiz, randomOrder);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-bounce-in">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-balance mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Quick Quiz
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Desarrollado por Jorge Mejía
          </p>
        </div>

        <Card className="border-0 overflow-hidden bg-gradient-to-br from-purple-600/15 via-purple-500/10 to-rose-500/15 shadow-xl ring-1 ring-purple-400/20 pt-0">
          <CardHeader className="text-center bg-gradient-to-br from-purple-800/50 via-purple-700/40 to-rose-800/50 pt-10 pb-8 backdrop-blur-sm border-b mt-0 border-purple-400/20">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-black text-white drop-shadow-sm">
              ¡Bienvenido!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="rounded-2xl border border-purple-400/20 bg-purple-950/20 p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/60 to-rose-600/60 flex items-center justify-center ring-1 ring-purple-400/25">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">
                      Quizes Predefinidos
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Carga un quiz listo desde el proyecto
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {predefQuizzes.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    onClick={() => handleLoadPreset(preset)}
                    disabled={isLoading}
                    className="h-auto py-4 px-4 rounded-xl border-2 border-purple-400/25 bg-purple-950/20 hover:bg-purple-900/30 hover:border-rose-400/35 text-left justify-start"
                  >
                    <span className="flex flex-col items-start gap-1 w-full">
                      <span className="font-black text-base text-foreground">
                        {preset.label}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        {loadingPreset === preset.id
                          ? "Cargando..."
                          : preset.path}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {!loadedQuiz ? (
              <div
                className="rounded-2xl p-10 text-center cursor-pointer border border-purple-400/30 hover:border-rose-400/40 bg-purple-900/20 hover:bg-purple-900/30 transition-colors"
                onClick={handleUploadClick}
              >
                <Upload className="h-14 w-14 text-purple-300 mx-auto mb-5" />
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  Arrastra tu archivo aquí o haz clic
                </h3>
                <Button
                  size="sm"
                  className="mt-3 text-white font-bold px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Seleccionar Archivo
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl p-6 bg-emerald-900/20 border border-emerald-500/30 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <h4 className="text-lg font-bold text-foreground">
                    {loadedQuiz.questions.length} preguntas cargadas
                  </h4>
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetUpload}
                  className="border-2 border-purple-400/30 hover:border-purple-300 bg-transparent"
                >
                  Cargar nuevo
                </Button>
              </div>
            )}

            {/* 
              Se agrega un label oculto para accesibilidad y se añade un atributo aria-label al input.
              También se agrega un placeholder para cumplir con las reglas de accesibilidad.
              Explicación: 
              - El input de tipo file debe tener un label asociado para accesibilidad.
              - Se usa aria-label para describir el propósito del input.
              - El placeholder no es soportado en inputs de tipo file, pero se puede usar title.
            */}
            <label htmlFor="quiz-file-upload" className="sr-only">
              Selecciona un archivo JSON de preguntas
            </label>
            <input
              id="quiz-file-upload"
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              aria-label="Selecciona un archivo JSON de preguntas"
              title="Selecciona un archivo JSON de preguntas"
              className="hidden"
            />

            {error && (
              <div className="rounded-2xl p-6 animate-bounce-in bg-red-900/20 border border-red-500/30">
                <p className="text-red-800 font-bold text-lg text-center">
                  {error}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center p-0 rounded-xl h-12">
              <Toggle
                aria-label="Alternar orden"
                pressed={randomOrder}
                onPressedChange={setRandomOrder}
                className="w-full h-full rounded-xl border-2 data-[state=on]:border-emerald-400/50 data-[state=off]:border-cyan-400/40 data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-600 data-[state=on]:to-teal-600 data-[state=off]:bg-gradient-to-r data-[state=off]:from-cyan-700/60 data-[state=off]:to-sky-700/60 data-[state=on]:text-white data-[state=off]:text-white shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {randomOrder ? "Orden aleatorio" : "Orden fijo"}
                  </span>
                </div>
              </Toggle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 text-lg font-bold border-3 border-purple-400/30 hover:border-purple-300 hover:bg-purple-900/20 rounded-xl bg-transparent"
              >
                <a href="/create-quiz">Crea tu quiz</a>
              </Button>
              <Button
                onClick={handleStartQuiz}
                disabled={!loadedQuiz || isLoading}
                size="lg"
                className="h-16 text-lg font-black text-white rounded-xl disabled:opacity-50 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 shadow-md"
              >
                <Play className="h-6 w-6 mr-3" />
                {isLoading ? "Cargando..." : "¡Empezar Quiz!"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
