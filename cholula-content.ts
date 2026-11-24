export const media = {
  panoramaOne: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-04%20at%2006.31.37%20%283%29-nGtfNA6fx6ryADM9SwcqKI1Q2sC0XE.jpeg',
  panoramaTwo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-04%20at%2006.32.18%20%281%29-eemGinK7hh6PWuTxHcfo5s0afXUTYF.jpeg',
  archaeologicalZone: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-04%20at%2006.31.37%20%283%29-nGtfNA6fx6ryADM9SwcqKI1Q2sC0XE.jpeg',
  archaeologicalDetail: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-04%20at%2006.32.20%20%281%29-tYyWFrTxcHIDgpWrkM9oVSfJ7FoiUH.jpeg',
  clapVideo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202026-11-04%20at%2006.32.17-bmrSML6rnC61RU5lUCnZ7gNK1fIIZV.mp4',
}

export type QuizQuestion = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: '¿Cuál es el nombre náhuatl de la Gran Pirámide de Cholula?',
    options: ['Teotihuacan', 'Tlachihualtépetl', 'Tenochtitlan', 'Xochicalco'],
    answer: 1,
    explanation:
      'Tlachihualtépetl significa «cerro hecho a mano», porque la pirámide parece una colina natural.',
  },
  {
    question: '¿Qué edificio colonial se encuentra en la cima de la pirámide?',
    options: [
      'La Catedral de Puebla',
      'El Templo de Santo Domingo',
      'El Santuario de Nuestra Señora de los Remedios',
      'La Capilla Real',
    ],
    answer: 2,
    explanation:
      'El santuario fue construido por los españoles en el siglo XVI sobre el basamento prehispánico.',
  },
  {
    question: '¿Por qué es famosa la pirámide a nivel mundial?',
    options: [
      'Es la pirámide más alta del mundo',
      'Es la pirámide con mayor volumen de base del mundo',
      'Es la pirámide más reciente de México',
      'Está hecha completamente de oro',
    ],
    answer: 1,
    explanation:
      'Con aproximadamente 400 metros por lado, es considerada la pirámide con la base más grande del mundo.',
  },
]

export type EthicsItem = {
  question: string
  answer: string
}

export const ethicsItems: EthicsItem[] = [
  {
    question: '1. ¿Para qué utilicé la Inteligencia Artificial en este proyecto?',
    answer:
      'La usé como apoyo para organizar ideas, redactar textos de forma clara y diseñar la presentación. La IA fue una herramienta de ayuda, no un sustituto de mi investigación ni de mi visita a Cholula.',
  },
  {
    question: '2. ¿Cómo verifiqué que la información generada fuera correcta?',
    answer:
      'Comparé los datos con fuentes confiables como el INAH, libros de historia y sitios oficiales de turismo de Puebla. También contrasté la información con lo que observé y escuché durante el recorrido.',
  },
  {
    question: '3. ¿Qué riesgos tiene confiar ciegamente en la IA?',
    answer:
      'La IA puede inventar datos, fechas o nombres que suenan reales pero son falsos. Por eso es necesario aplicar pensamiento crítico y revisar cada dato antes de compartirlo.',
  },
  {
    question: '4. ¿Cómo cuidé las imágenes y videos propios?',
    answer:
      'Utilicé únicamente fotografías y videos tomados por mí durante la visita. No compartí imágenes de otras personas sin su permiso y evité mostrar datos personales o rostros identificables.',
  },
  {
    question: '5. ¿Por qué es importante dar crédito a las fuentes?',
    answer:
      'Reconocer a los autores e instituciones respeta su trabajo, evita el plagio y permite que otras personas consulten y verifiquen la información original.',
  },
  {
    question: '6. ¿Cómo respeté la cultura y el patrimonio al usar la IA?',
    answer:
      'Evité estereotipos y descripciones inexactas sobre los pueblos originarios. Revisé que el lenguaje fuera respetuoso y que la historia de Cholula se presentara con dignidad.',
  },
  {
    question: '7. ¿Qué aprendí sobre el uso responsable de la tecnología?',
    answer:
      'Aprendí que la IA es poderosa cuando se usa con honestidad, transparencia y criterio propio. La responsabilidad final de lo que se publica siempre es de la persona, no de la máquina.',
  },
]
