import politica from "./assets/politica.webp"
/**
 * content.ts
 * ──────────────────────────────────────────────────────────────
 * Archivo centralizado de contenido y configuración del sitio.
 * Modificá aquí textos, datos de contacto, redes sociales,
 * imágenes y cualquier valor que pueda cambiar con el tiempo.
 * ──────────────────────────────────────────────────────────────
 */

// ── Datos del sitio ──────────────────────────────────────────
export const SITE = {
  name: 'Ariana Mellao',
  tagline: 'Liderazgo Argentino',
  description:
    'Ariana Mellao, liderazgo argentino para una nueva etapa. Salud Pública, Transparencia Institucional y Bienestar Ciudadano.',
  heroPhoto: politica,  
  heroPhotoAlt: 'Ariana Mellao',
} as const;

// ── Redes sociales ────────────────────────────────────────────
export const SOCIAL = {
  twitter: {
    handle: '@arianamellao',
    url: 'https://twitter.com/arianamellao',
  },
  instagram: {
    handle: '@arianamellao.oficial',
    url: 'https://www.instagram.com/arianamellao.oficial',
  },
  youtube: {
    handle: '@arianamellao',
    url: 'https://www.youtube.com/@arianamellao',
  },
} as const;

// ── Contacto de prensa ────────────────────────────────────────
export const PRESS = {
  label: 'Contacto de prensa',
  /** Número en formato internacional sin espacios ni guiones */
  whatsappNumber: '5491130538404',
  /** Mensaje pre-cargado opcional; dejar vacío para omitir */
  whatsappMessage: 'Hola, me comunico por consulta de prensa.',
  get whatsappUrl() {
    const msg = this.whatsappMessage
      ? `?text=${encodeURIComponent(this.whatsappMessage)}`
      : '';
    return `https://wa.me/${this.whatsappNumber}${msg}`;
  },
  /** Número formateado para mostrar en pantalla */
  displayNumber: '+54 9 11 3053-8404',
} as const;

// ── Navegación ────────────────────────────────────────────────
export const NAV_LINKS = [
  { to: '/quien-soy',                  label: '¿Quién soy?' },
  { to: '/salud-publica',              label: 'Salud Pública' },
  { to: '/transparencia-institucional',label: 'Transparencia' },
  { to: '/bienestar-ciudadano',        label: 'Bienestar Ciudadano' },
  { to: '/medios',                     label: 'Medios' },
  { to: '/sumate',                     label: 'Sumate' },
] as const;

// ── Home ──────────────────────────────────────────────────────
export const HOME = {
  tagline:'visibilizar lo invisible',
  heroHeadline: ['Que ','te duela en silencio'],
  heroHeadlineAccent: 'no',
  heroSubtitle:
    ['La ','existe y los/as ','políticos y empresariales se hacen cargo.'],
  heroSubtitleColored:
    ['endometriosis ','verdaderos líderes '],
  heroCta: 'Conocé la campaña',
  heroCtaSecondary: 'Sumate a la campaña',
  quote:
    '"Para que las cosas cambien de verdad, no basta con una buena idea; necesitamos que vos y yo caminemos hacia el mismo lado, con total honestidad"',
  quoteAuthor: SITE.name,
  sections: [
    {
      to: '/quien-soy',
      label: '01',
      title: '¿Quién soy?',
      description:
        'Trayectoria, valores y visión de una dirigente comprometida con el futuro de Argentina.',
      highlight: true,
    },
    {
      to: '/salud-publica',
      label: '02',
      title: 'Salud Pública con un Enfoque Humano',
      description:
        'Cada persona es dueña de su cuerpo y de sus decisiones, y el sistema debe estar al servicio de esa libertad.',
        highlight: true,
    },
    {
      to: '/transparencia-institucional',
      label: '03',
      title: 'Transparencia Institucional',
      description:
        'Gobierno abierto, pluralismo sindical y rendición de cuentas sin privilegios.',
        highlight: true,
    },
    {
      to: '/bienestar-ciudadano',
      label: '04',
      title: 'Bienestar Ciudadano',
      description:
        'Dignidad, salud comunitaria y desarrollo integral para cada argentino.',
        highlight: true,
    },
    {
      to: '/medios',
      label: '05',
      title: 'Medios',
      description:
        'Entrevistas, artículos y apariciones en prensa, televisión y radio.',
        highlight: true,
    },
    {
      to: '/sumate',
      label: '06',
      title: 'Sumate',
      description:
        'Unite al proyecto. Tu participación hace posible el cambio que Argentina necesita.',
      highlight: true,
    },
  ],
} as const;

// ── Páginas interiores ────────────────────────────────────────

export const QUIEN_SOY = {
  pageTitle: '¿Quién soy?',
  pageLabel: 'Sobre mí',
  intro: undefined, // sin párrafo introductorio
  sections: [
    {
      title: 'Mi trayectoria',
      paragraphs: [
        'Fui excandidata a diputada nacional en 2025 con más de 16 mil votos. Hoy quiero tiempo para mi familia y favorecer al pais con una mirada humana, libre e institucional.',
      ],
    },
    {
      title: 'Mis valores',
      paragraphs: [
        'Creo firmemente en la transparencia, la honestidad y el trabajo en equipo. Mi compromiso es con todos los argentinos, sin distinción de origen, ideología o condición social.',
      ],
    },
    {
      title: 'Mi visión',
      paragraphs: [
        'Argentina necesita un liderazgo renovado que ponga el foco en la producción, la transparencia y el bienestar de todos sus ciudadanos. Trabajemos juntos para construir el país que merecemos.',
      ],
    },
  ],
} as const;

export const SALUD_PUBLICA = {
  pageTitle: 'Salud Pública con un Enfoque Humano',
  pageLabel: '',
  intro:
    [
    'La salud con enfoque humano parte de una idea simple: cada persona es dueña de su cuerpo y de sus decisiones, y el sistema debe estar al servicio de esa libertad, no obstaculizarla.',
    'Implica un modelo donde:',
    'El paciente deja de ser un número y pasa a ser protagonista informado.',
    'El Estado garantiza acceso, información clara y reglas justas.',
    'Los profesionales actúan con criterios científicos y respeto por la persona.',
    'Se eliminan barreras burocráticas que retrasan diagnósticos y tratamientos.',
    'En este marco, enfermedades como la Endometriosis muestran una falla concreta: cuando el sistema no escucha, la libertad real se reduce, porque las personas no pueden decidir ni tratarse a tiempo.',
    'Quiero impulsar 3 principios innegociables:'],
  pillars: [
    {
      num: '01',
      title: 'Libertad con información',
      paragraphs: [
        'No hay elección real sin diagnóstico ni conocimiento.',
      ],
    },
    {
      num: '02',
      title: 'Igualdad de oportunidades',
      paragraphs: [
        'Acceso temprano, sin importar ingresos.',
      ],
    },
    {
      num: '03',
      title: 'Eficiencia',
      paragraphs: [
        'Detectar antes cuesta menos que tratar tarde.',
      ],
    },
  ],
  postPillars:'Cuando una mujer tarda años en ser diagnosticada, no es un problema ideológico: es un sistema que no está funcionando. Impulso y entiendo que una salud con enfoque humano no impone, no ignora y no llega tarde. Escucha, informa y actúa a tiempo.',
  peticion:['Firmá nuestra petición en ','No sale nada, aunque vale mucho'],
  
} as const;

export const TRANSPARENCIA = {
  pageTitle: 'Transparencia Institucional',
  pageLabel: 'Reforma del Estado',
  paragraphs:
    [
      'Hablar de transparencia institucional en salud es, para mí, hablar de algo muy concreto: que cada persona sepa qué puede esperar del sistema y que no tenga que atravesar incertidumbre, demoras o falta de información en un momento que ya es difícil de por sí.',
      'No vengo de la política partidaria tradicional ni busco construir una carrera en ese sentido. Me involucro como ciudadana, como alguien que escucha, que ve los problemas de cerca y que entiende que hay cosas que ya no pueden seguir igual. La salud es una de ellas.',
      'Creo en una idea simple: el sistema de salud tiene que estar al servicio de las personas. No al revés. Y eso implica que el acceso sea real, que la información sea clara y que la atención llegue a tiempo.',
      'Hoy sabemos que en muchos casos esto no ocurre. Hay diagnósticos que se demoran años, turnos que no llegan y recorridos innecesariamente complejos dentro del sistema. Cuando eso pasa, no estamos frente a un problema abstracto: estamos frente a personas que no pueden decidir con libertad sobre su propia salud porque no cuentan con información ni respuestas a tiempo.',
      'La Endometriosis es un ejemplo claro de esto. Durante mucho tiempo se naturalizó el dolor y se demoraron diagnósticos que podrían haberse hecho antes. No se trata de un caso aislado, sino de una señal de que necesitamos un sistema que escuche más y actúe mejor.',
      'En este contexto, también es necesario decir algo que muchas veces se evita: el sistema de salud está atravesado por estructuras que han acumulado privilegios y que, en muchos casos, priorizan su propio funcionamiento antes que las necesidades de las personas. Parte del problema no es solo la falta de recursos, sino cómo se administran y quién decide sobre ellos.',
      'Cuando los intereses corporativos —incluidos sectores del sindicalismo— se vuelven más importantes que el acceso real de la gente a la salud, el sistema se distorsiona. Se generan desigualdades, se burocratiza la atención y se pierde de vista lo esencial: cuidar a las personas.',
      'Por eso, cuando hablo de transparencia, también hablo de revisar esos privilegios. De saber cómo se asignan los recursos, quiénes toman decisiones y con qué criterios. Sin esa información, no hay posibilidad de corregir lo que no funciona.',
      'En paralelo, la salud mental ocupa un lugar central. No puede seguir siendo tratada como algo secundario. Es parte de la salud integral y afecta directamente la vida cotidiana, el trabajo, los vínculos y las oportunidades de cada persona.',
      'Muchas veces, quienes necesitan atención en salud mental se encuentran con barreras similares: dificultades de acceso, falta de continuidad en los tratamientos o incluso estigmatización. Eso también es una forma de exclusión. Y también es una falla del sistema.',
      'Por eso propongo un enfoque claro: reducir los tiempos de espera, garantizar diagnósticos tempranos, integrar la salud mental como parte de la atención general y asegurar que cada persona entienda qué le pasa y cómo puede tratarlo.',
      'Mi compromiso es trabajar desde un lugar distinto: no desde la lógica partidaria, sino desde la responsabilidad ciudadana. Escuchar, señalar lo que no funciona y proponer soluciones concretas.',
      'Porque al final, la calidad de una política de salud no se mide por los discursos ni por las estructuras de poder, sino por algo mucho más simple: si le mejora la vida a la gente o no.',
    ],
  // pillars: [
  //   {
  //     num: '01',
  //     title: 'Gobierno Abierto',
  //     paragraphs: [
  //       'Los ciudadanos tienen derecho a saber cómo se utilizan los recursos públicos. Impulsaremos la implementación de plataformas digitales que permitan el acceso abierto a la información sobre gestión pública, presupuestos, contrataciones y decisiones de gobierno.',
  //       'La transparencia no es solo publicar datos, es garantizar que sean comprensibles y útiles para que la ciudadanía pueda ejercer un control efectivo sobre sus representantes.',
  //     ],
  //   },
  //   {
  //     num: '02',
  //     title: 'Pluralismo Sindical',
  //     paragraphs: [
  //       'Los trabajadores deben tener libertad real para elegir quién los representa. El modelo de sindicato único concentra poder y limita la democracia sindical. Debemos avanzar hacia un sistema que permita la coexistencia de diferentes organizaciones sindicales en cada sector.',
  //       'El pluralismo sindical fortalece los derechos de los trabajadores, promueve la competencia entre representantes y garantiza que las organizaciones sindicales respondan verdaderamente a los intereses de sus afiliados.',
  //     ],
  //   },
  //   {
  //     num: '03',
  //     title: 'Eliminación de fueros',
  //     paragraphs: [
  //       'Todos los ciudadanos deben ser iguales ante la ley. Los privilegios y fueros especiales que protegen a algunos funcionarios de la Justicia erosionan la confianza en las instituciones y crean una sensación de impunidad.',
  //       'Propongo la eliminación gradual de los fueros, manteniendo únicamente las garantías mínimas necesarias para el ejercicio de las funciones públicas, pero sin convertirlos en escudos contra la Justicia.',
  //     ],
  //   },
  // ],
} as const;

export const BIENESTAR = {
  pageTitle: 'Bienestar Ciudadano',
  pageLabel: 'Desarrollo social',
  intro:
    'El bienestar de los ciudadanos es el objetivo central de toda política pública eficaz. Promover condiciones que permitan a cada argentino desarrollarse con autonomía, acceder a oportunidades y mejorar su calidad de vida es un compromiso esencial. Esto implica generar entornos donde el esfuerzo, la iniciativa y la libertad individual puedan traducirse en progreso real.',
  pillars: [
    {
      num: '01',
      title: '  Legado Alfredo Moffat',
      paragraphs: [
        'El pensamiento de Alfredo Moffat, pionero en psicología social comunitaria, resalta la importancia de comprender las dinámicas sociales desde la realidad concreta de las personas. Su trabajo en barrios populares evidenció que las comunidades poseen capacidades propias para organizarse, adaptarse y generar soluciones sostenibles.',
        'Inspirados en ese enfoque, es fundamental impulsar marcos que potencien esas capacidades, facilitando la participación y promoviendo entornos donde las iniciativas locales puedan desarrollarse con mayor independencia. La salud mental y el desarrollo comunitario deben abordarse con herramientas eficientes, cercanas a la gente y orientadas a resultados concretos.',
      ],
    },
    {
      num: '02',
      title: 'Mis escritos',
      paragraphs: [
        'A lo largo de mi trayectoria he analizado los principales desafíos que enfrenta Argentina, con foco en la necesidad de generar crecimiento sostenido, instituciones confiables y reglas claras. Mis escritos abordan temas como el desarrollo económico, la calidad institucional y la importancia de una gestión transparente.',
        'Creo en el valor de las ideas como motor de cambio. Cada texto busca aportar claridad, fomentar el debate informado y contribuir a la construcción de un país donde las oportunidades dependan cada vez más del mérito, la innovación y el compromiso de cada individuo.',
      ],
    },
    {
      num: '03',
      title: 'Recuperar la dignidad',
      paragraphs: [
        'La dignidad está profundamente vinculada a la capacidad de las personas para construir su propio proyecto de vida. Hoy, muchos argentinos enfrentan obstáculos que limitan esa posibilidad: dificultades para acceder al empleo, condiciones habitacionales precarias y servicios de baja calidad.',
        'Recuperar la dignidad implica remover esas barreras y generar condiciones para el desarrollo genuino: promover el empleo productivo, mejorar el acceso a servicios esenciales y asegurar que las instituciones funcionen con respeto, previsibilidad y cercanía. Se trata de crear un entorno donde cada persona tenga la oportunidad real de progresar a partir de su propio esfuerzo.',
      ],
    },
  ],
} as const;

export const MEDIOS = {
  pageTitle: 'Medios',
  pageLabel: 'Comunicación',
  intro:
    'El diálogo con los medios de comunicación es fundamental para acercar las propuestas a la ciudadanía. Aquí encontrarás mis apariciones, entrevistas y artículos.',
  pressNote:
    'Para solicitudes de entrevistas o información, contactá a través de nuestras redes sociales o el formulario en la sección Sumate.',
  // TODO: Agregar apariciones reales cuando estén disponibles
  appearances: [] as Array<{ date: string; outlet: string; title: string; url?: string }>,
} as const;

export const SUMATE = {
  pageTitle: 'Sumate',
  pageLabel: 'Unite al proyecto',
  intro:
    'Argentina necesita el compromiso de todos. Unite a nuestro proyecto para construir juntos el país que merecemos.',
  quote:
    '¿Por qué sumarte? Porque creemos en un país mejor para todos. Porque el cambio es posible si trabajamos juntos.',
  ways: [
    {
      key: 'participar' as const,
      title: 'Participá',
      description: 'Formá parte de nuestros encuentros y actividades territoriales.',
    },
    {
      key: 'colaborar' as const,
      title: 'Colaborá',
      description: 'Tu aporte, sea de tiempo o recursos, hace la diferencia.',
    },
    {
      key: 'difundir' as const,
      title: 'Difundí',
      description: 'Compartí nuestras propuestas en tu comunidad y redes.',
    },
  ],
  formas: [
    {
      key: 'Militancia activa',
      desc: 'Participá en nuestras actividades territoriales y eventos políticos.',
    },
    {
      key: 'Voluntariado',
      desc: 'Colaborá con tu tiempo y habilidades en proyectos comunitarios.',
    },
    {
      key: 'Difusión',
      desc: 'Ayudanos a comunicar nuestras propuestas en redes sociales y tu comunidad.',
    },
    {
      key: 'Aportes',
      desc: 'Tu contribución económica nos permite sostener nuestras actividades.',
    },
  ],
} as const;
