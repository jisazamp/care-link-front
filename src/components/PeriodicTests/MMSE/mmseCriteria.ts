import { MMSECriterion } from "./types";

const normalize = (str: string) => (str || "").trim().toLowerCase();
const palabrasRegistro = ["manzana", "mesa", "moneda"];
const palabrasMemoria = ["manzana", "mesa", "moneda"];
const objetos = ["reloj", "lápiz", "lapiz"];
const fraseCorrecta = "en un trigal había cinco perros";

export const mmseCriteria: MMSECriterion[] = [
  {
    key: "orientacion_temporal",
    points: 5,
    correct: (answer: string) => {
      const hoy = new Date();
      const fecha = hoy.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return answer.toLowerCase() === fecha.toLowerCase();
    },
  },
  {
    key: "orientacion_espacial",
    points: 5,
    correct: (answer: string) => {
      const lugares = ["hospital", "clínica", "centro médico", "consultorio"];
      return lugares.some((lugar) => answer.toLowerCase().includes(lugar));
    },
  },
  {
    key: "registro",
    points: 3,
    correct: (answer: string) => {
      const palabras = answer.toLowerCase().split(" ");
      return palabrasRegistro.every((palabra) => palabras.includes(palabra));
    },
  },
  {
    key: "atencion_calculo",
    points: 5,
    correct: (answer: string) => {
      const resultado = 100 - 7 - 7 - 7 - 7 - 7;
      return parseInt(answer) === resultado;
    },
  },
  {
    key: "recuerdo",
    points: 3,
    correct: (answer: string) => {
      const palabras = answer.toLowerCase().split(" ");
      return palabrasMemoria.every((palabra) => palabras.includes(palabra));
    },
  },
  {
    key: "lenguaje_nombres",
    points: 2,
    correct: (answer: string) => {
      return objetos.some((objeto) => answer.toLowerCase().includes(objeto));
    },
  },
  {
    key: "lenguaje_repeticion",
    points: 1,
    correct: (answer: string) => {
      return normalize(answer) === normalize(fraseCorrecta);
    },
  },
  {
    key: "lenguaje_comprension",
    points: 3,
    correct: (answer: string) => {
      return answer.toLowerCase().includes("cerrar los ojos");
    },
  },
  {
    key: "lenguaje_escritura",
    points: 1,
    correct: (answer: string) => {
      return answer.toLowerCase().includes("frase completa");
    },
  },
  {
    key: "lenguaje_dibujo",
    points: 1,
    correct: (answer: string) => {
      return answer.toLowerCase().includes("dibujo correcto");
    },
  },
];
