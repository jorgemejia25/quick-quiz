"use client";

import { Button, Card, Input, Link } from "@heroui/react";
import { ArrowLeft, Check, FileJson, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type EditableQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

const NEW_QUESTION = (id: string): EditableQuestion => ({
  id,
  question: "Nueva pregunta",
  options: ["Opción A", "Opción B"],
  correctAnswer: 0,
  explanation: "",
});

export default function CreateQuizPage() {
  const [title, setTitle] = useState("Mi quiz");
  const [questions, setQuestions] = useState<EditableQuestion[]>([NEW_QUESTION("1")]);

  const updateQuestion = (id: string, patch: Partial<EditableQuestion>) => {
    setQuestions((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const updateOption = (id: string, index: number, value: string) => {
    setQuestions((items) => items.map((item) => item.id === id
      ? { ...item, options: item.options.map((option, optionIndex) => optionIndex === index ? value : option) }
      : item));
  };

  const removeOption = (id: string, index: number) => {
    setQuestions((items) => items.map((item) => {
      if (item.id !== id || item.options.length <= 2) return item;
      const options = item.options.filter((_, optionIndex) => optionIndex !== index);
      return { ...item, options, correctAnswer: Math.min(item.correctAnswer, options.length - 1) };
    }));
  };

  const download = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const downloadCurrentQuiz = () => download("quiz.json", {
    title,
    questions: questions.map((question, index) => ({
      ...question,
      id: question.id || String(index + 1),
      explanation: question.explanation || undefined,
    })),
  });

  return (
    <main className="site-bg create-page">
      <div className="create-frame motion-enter">
        <header className="create-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Inicio
          </Link>
          <span className="page-count">{questions.length} preguntas</span>
        </header>

        <section className="create-intro">
          <h1>Diseña un quiz</h1>
        </section>

        <Card className="oled-card editor-card" variant="secondary">
          <Card.Content className="editor-content">
            <label className="field-stack">
              <span>Título del quiz</span>
              <Input
                aria-label="Título del quiz"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Anatomía básica"
                fullWidth
                className="oled-input"
              />
            </label>
          </Card.Content>
        </Card>

        <section className="questions-section">
          <div className="questions-heading">
            <h2>Preguntas</h2>
            <Button
              variant="primary"
              className="signal-button"
              onPress={() => setQuestions((items) => [...items, NEW_QUESTION(crypto.randomUUID())])}
            >
              <Plus size={17} /> Nueva pregunta
            </Button>
          </div>

          <div className="question-editor-list">
            {questions.map((question, questionIndex) => (
              <Card key={question.id} className="oled-card question-editor" variant="secondary">
                <Card.Header className="question-editor-header">
                  <span className="question-number">{String(questionIndex + 1).padStart(2, "0")}</span>
                  <label className="field-stack grow">
                    <span>Enunciado</span>
                    <Input
                      aria-label={`Enunciado de la pregunta ${questionIndex + 1}`}
                      value={question.question}
                      onChange={(event) => updateQuestion(question.id, { question: event.target.value })}
                      fullWidth
                      className="oled-input"
                    />
                  </label>
                  <Button
                    variant="danger-soft"
                    isIconOnly
                    aria-label={`Eliminar pregunta ${questionIndex + 1}`}
                    isDisabled={questions.length === 1}
                    onPress={() => setQuestions((items) => items.filter(({ id }) => id !== question.id))}
                  >
                    <Trash2 size={16} />
                  </Button>
                </Card.Header>

                <Card.Content className="question-editor-content">
                  <div className="options-label"><span>Opciones de respuesta</span><small>Selecciona la correcta</small></div>
                  <div className="option-editor-grid">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = question.correctAnswer === optionIndex;
                      return (
                        <div key={optionIndex} className={`option-editor ${isCorrect ? "is-correct" : ""}`}>
                          <button
                            type="button"
                            className="correct-toggle"
                            aria-label={`Marcar opción ${optionIndex + 1} como correcta`}
                            aria-pressed={isCorrect}
                            onClick={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                          >
                            {isCorrect ? <Check size={15} /> : String.fromCharCode(65 + optionIndex)}
                          </button>
                          <Input
                            aria-label={`Opción ${optionIndex + 1}`}
                            value={option}
                            onChange={(event) => updateOption(question.id, optionIndex, event.target.value)}
                            fullWidth
                            className="oled-input option-input"
                          />
                          <Button
                            variant="ghost"
                            isIconOnly
                            aria-label={`Eliminar opción ${optionIndex + 1}`}
                            isDisabled={question.options.length <= 2}
                            onPress={() => removeOption(question.id, optionIndex)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => updateQuestion(question.id, { options: [...question.options, "Nueva opción"] })}
                  >
                    <Plus size={15} /> Añadir opción
                  </Button>
                  <label className="field-stack">
                    <span>Explicación <small>opcional</small></span>
                    <Input
                      aria-label={`Explicación de la pregunta ${questionIndex + 1}`}
                      value={question.explanation ?? ""}
                      onChange={(event) => updateQuestion(question.id, { explanation: event.target.value })}
                      placeholder="Añade contexto para mostrar después de responder"
                      fullWidth
                      className="oled-input"
                    />
                  </label>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>

        <Button variant="primary" size="lg" fullWidth className="signal-button export-button" onPress={downloadCurrentQuiz}>
          <FileJson size={16} /> Descargar quiz
        </Button>
      </div>
    </main>
  );
}
