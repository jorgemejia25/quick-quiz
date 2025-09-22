# Quick Quiz

Aplicación web para crear y jugar quizzes personalizados. Permite cargar un JSON con preguntas, iniciar el juego con orden fijo o aleatorio, y ver resultados con métricas. Incluye un creador visual de quizzes para exportar archivos JSON.

## Características

- Carga de archivos JSON con preguntas y validación de estructura
- Juego de preguntas con feedback visual de respuestas correctas/incorrectas
- Resultados con porcentaje, conteo de correctas y tiempo promedio
- Creador visual de quizzes: añade/edita preguntas y opciones, marca la opción correcta y descarga JSON
- Diseño oscuro con tema morado/rojo consistente, fuentes Geist Sans/Mono
- Accesibilidad básica (labels, roles, atajos de teclado en creador)

## Requisitos

- Node.js 18+
- pnpm (gestor de paquetes preferido)

## Instalación y ejecución

```bash
pnpm install
pnpm dev
```

Build y producción:

```bash
pnpm build
pnpm start
```

Lint (si aplica):

```bash
pnpm lint
```

## Estructura del proyecto (principal)

```
app/
  layout.tsx              # Layout global y metadatos
  page.tsx                # Flujo principal (setup → quiz → results)
  create-quiz/page.tsx    # Creador visual de quizzes y exportación JSON
components/
  quiz-setup.tsx          # Pantalla de carga de JSON y configuración
  quiz-game.tsx           # Pantalla de juego
  quiz-results.tsx        # Pantalla de resultados
  theme-provider.tsx      # Wrapper de theming con next-themes
components/ui/            # Componentes UI reutilizables (shadcn/radix)
styles / app/globals.css  # Variables de tema y estilos globales
```

## Formato del JSON del quiz

Ejemplo mínimo válido:

```json
{
  "title": "Conocimientos Generales",
  "questions": [
    {
      "id": "1",
      "question": "¿Cuál es la capital de Francia?",
      "options": ["Londres", "París", "Madrid", "Roma"],
      "correctAnswer": 1,
      "explanation": "París es la capital y ciudad más poblada de Francia."
    }
  ]
}
```

Reglas de validación:

- title: string requerido
- questions: array requerido
- Cada pregunta requiere: id (string), question (string), options (string[]), correctAnswer (number, índice 0-based). explanation es opcional

## Flujo de uso

1. Pantalla inicial (Setup)

- Sube tu archivo JSON o crea uno desde cero en “Crea tu quiz”
- Alterna “Orden fijo/Orden aleatorio” con el Toggle
- Inicia el juego con “Empezar Quiz”

2. Juego

- Selecciona una opción, confirma y avanza automáticamente
- Se muestran estados visuales correctos/incorrectos con alto contraste

3. Resultados

- Porcentaje total, correctas, tiempo promedio por pregunta
- Repite el quiz o regresa para crear/cargar uno nuevo

## Creador de Quizzes (app/create-quiz)

- Añade preguntas con “Nueva pregunta”. Los IDs son autoincrementales ("1", "2", ...)
- Edita en línea: texto de la pregunta, opciones y explicación
- Marca una opción como correcta con un clic o Enter/Espacio sobre la tarjeta de la opción
- Descarga:
  - “Descargar ejemplo”: JSON de ejemplo base
  - “Descargar mi quiz”: JSON con tus cambios

Atajos accesibles en opciones:

- Enter o Barra espaciadora: marca la opción enfocada como correcta

## Tema y diseño

- Paleta morado/rojo en modo oscuro con fondos dinámicos sutiles
- Fuentes: GeistSans y GeistMono desde el paquete `geist`
- Estilos globales y animaciones en `app/globals.css`

## Accesibilidad

- Inputs y controles con etiquetas o atributos ARIA
- Estados visuales con suficiente contraste
- Controles interactivos con teclado

## Documentación interna (JSDoc)

- app/layout.tsx: metadata, RootLayout
- app/page.tsx: interfaces Question, QuizData, QuizResult y componente QuickQuizApp
- app/create-quiz/page.tsx: tipo EditableQuestion y componente CreateQuizPage
- components/quiz-setup.tsx: props, handlers y propósito del componente
- components/quiz-game.tsx: props, estado y handlers
- components/quiz-results.tsx: props y helpers
- components/theme-provider.tsx: wrapper de theming

## Paquetes y herramientas principales

- Next.js 14, React 18
- Tailwind CSS 4, Radix UI/shadcn components
- lucide-react para iconos
- next-themes para modo de tema
- pnpm como gestor de paquetes

## Troubleshooting

- No se carga el JSON: verifica extensión .json y estructura del archivo. El cargador permite MIME o extensión
- Volver a subir el mismo archivo no dispara onChange: se resetea el value del input tras cada intento
- Fondos/tema: asegúrate de que `html` tenga la clase `dark` (se aplica desde layout) y que no haya estilos externos sobrescribiendo

## Scripts

- `pnpm dev`: desarrollo
- `pnpm build`: compilación
- `pnpm start`: producción
- `pnpm lint`: linting (si está configurado)

## Licencia

Este proyecto se distribuye con fines educativos y demostrativos. Ajusta o añade una licencia según tus necesidades.
