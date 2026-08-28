"use client";

import type { QuizData } from "@/app/page";
import { Button, Card, Link } from "@heroui/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Upload,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

function validateQuizData(input: unknown): QuizData {
  if (!input || typeof input !== "object") {
    throw new Error("El archivo no contiene un quiz válido.");
  }

  const record = input as Record<string, unknown>;
  if (typeof record.title !== "string" || !record.title.trim()) {
    throw new Error("El quiz necesita un título válido.");
  }
  if (!Array.isArray(record.questions) || record.questions.length === 0) {
    throw new Error("El quiz necesita al menos una pregunta.");
  }

  record.questions.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`La pregunta ${index + 1} no es válida.`);
    }
    const question = item as Record<string, unknown>;
    if (typeof question.id !== "string" || !question.id.trim()) {
      throw new Error(`La pregunta ${index + 1} necesita un id.`);
    }
    if (typeof question.question !== "string" || !question.question.trim()) {
      throw new Error(`La pregunta ${index + 1} no tiene enunciado.`);
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error(`La pregunta ${index + 1} necesita dos opciones o más.`);
    }
    if (
      typeof question.correctAnswer !== "number" ||
      question.correctAnswer < 0 ||
      question.correctAnswer >= question.options.length
    ) {
      throw new Error(`La respuesta correcta de la pregunta ${index + 1} no es válida.`);
    }
  });

  return record as unknown as QuizData;
}

interface QuizSetupProps {
  onStartQuiz: (data: QuizData, randomOrder: boolean) => void;
}

export function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const [loadedQuiz, setLoadedQuiz] = useState<QuizData | null>(null);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json") && !file.type.includes("json")) {
      setError("Selecciona un archivo con formato .json.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        setLoadedQuiz(validateQuizData(JSON.parse(String(target?.result ?? ""))));
        setError("");
      } catch (cause) {
        setLoadedQuiz(null);
        setError(cause instanceof Error ? cause.message : "No fue posible leer el quiz.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => setError("No fue posible leer el archivo.");
    reader.readAsText(file);
  };

  const handleLoadLibraryQuiz = async () => {
    setIsLoadingLibrary(true);
    setError("");
    try {
      const response = await fetch("/quiz-procesos-negocio.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo cargar el quiz.");
      setLoadedQuiz(validateQuizData(await response.json()));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el quiz.");
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  return (
    <div className="app-frame setup-frame">
      <header className="home-header motion-enter">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">Q</span>
          <span>QUICK QUIZ</span>
        </div>
        <Link href="/create-quiz" className="header-link">
          Diseña un quiz <ArrowRight size={15} />
        </Link>
      </header>

      <section className="home-copy motion-enter">
        <h1>Elige un quiz</h1>
      </section>

      <Card className="oled-card setup-panel motion-enter motion-delay-1" variant="secondary">
        <Card.Content className="setup-content">
          <div className="library-label">Biblioteca</div>
          <button
            type="button"
            className={`library-item ${loadedQuiz?.title === "Parcial 1 Modela 2" ? "is-selected" : ""}`}
            aria-pressed={loadedQuiz?.title === "Parcial 1 Modela 2"}
            disabled={isLoadingLibrary}
            onClick={handleLoadLibraryQuiz}
          >
            <span className="library-icon"><BookOpen size={19} /></span>
            <div className="library-copy">
              <strong>Parcial 1 Modela 2</strong>
              <small>30 preguntas · orden aleatorio</small>
            </div>
            <span className="library-state" aria-hidden="true">
              {isLoadingLibrary ? "…" : loadedQuiz?.title === "Parcial 1 Modela 2" ? <Check size={17} /> : <ArrowRight size={17} />}
            </span>
          </button>

          <div className="section-separator"><span>o sube un archivo</span></div>

          <button
            type="button"
            className={`upload-zone ${loadedQuiz ? "is-loaded" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">
              {loadedQuiz ? <Check size={22} /> : <Upload size={22} />}
            </span>
            <span className="upload-copy">
              <strong>{loadedQuiz ? loadedQuiz.title : "Buscar archivo JSON"}</strong>
              <small>
                {loadedQuiz
                  ? `${loadedQuiz.questions.length} preguntas cargadas`
                  : "Selecciona un archivo desde tu equipo"}
              </small>
            </span>
            <span className="upload-action">{loadedQuiz ? "Cambiar" : "Buscar"}</span>
          </button>

          <label htmlFor="quiz-file-upload" className="sr-only">
            Selecciona un archivo JSON de preguntas
          </label>
          <input
            id="quiz-file-upload"
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {error && <p className="inline-error" role="alert">{error}</p>}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="signal-button"
            isDisabled={!loadedQuiz}
            onPress={() => loadedQuiz && onStartQuiz(loadedQuiz, true)}
          >
            Comenzar quiz <ArrowRight size={18} />
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}
