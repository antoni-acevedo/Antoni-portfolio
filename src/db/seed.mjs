import Database from 'better-sqlite3';

const db = new Database('portfolio.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    highlight_text TEXT,
    years_experience INTEGER,
    experience_text TEXT,
    profile_image TEXT,
    secondary_image TEXT,
    bullet_1 TEXT,
    bullet_2 TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    tag TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    company TEXT,
    role TEXT,
    date TEXT,
    desc TEXT,
    long_desc TEXT,
    tags TEXT, -- JSON array
    images TEXT -- JSON array of image filenames
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY,
    company TEXT,
    role TEXT,
    date TEXT,
    description TEXT,
    tag TEXT,
    image TEXT
  );
`);

// Seed Data

// Profile
const insertProfile = db.prepare(`
  INSERT INTO profile (id, title, description, highlight_text, years_experience, experience_text, profile_image, secondary_image, bullet_1, bullet_2)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertProfile.run(
    1,
    "Sobre Mí",
    "Desarrollador Full-Stack con más de 4 años de experiencia creando aplicaciones web y móviles escalables con JavaScript/TypeScript. Especializado en React, Vue, Node.js, y desarrollo híbrido con Ionic, React Native y Flutter.",
    "¿Listo para iniciar tu próximo proyecto?",
    4,
    "Años de experiencia liderando el desarrollo de soluciones digitales completas.",
    "profile2.jpeg", // Using filenames that will be in public/images/
    "profile2.jpg",
    "Enfoque en arquitecturas eficientes y escalables, optimizando tanto el rendimiento del frontend como la robustez del backend para clientes globales.",
    "Experiencia integral abarcando desde la concepción del diseño UI/UX hasta el despliegue en producción, integrando pasarelas de pago y servicios cloud."
);

// Services
const insertService = db.prepare(`
  INSERT INTO services (title, description, tag, image) VALUES (?, ?, ?, ?)
`);

insertService.run("Desarrollo Web Full-Stack", "Aplicaciones web modernas y escalables con React y Node.js.", "Web & PWA", "mockImg.png");
insertService.run("Desarrollo Móvil", "Apps nativas e híbridas para iOS y Android con React Native y Flutter.", "Mobile", "mockImg.png");
insertService.run("Arquitectura & Cloud", "Sistemas robustos, bases de datos y despliegue en la nube (AWS).", "Backend", "mockImg.png");

// Projects
const insertProject = db.prepare(`
  INSERT INTO projects (company, role, date, desc, long_desc, tags, images) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertProject.run(
    "Soluciones Star",
    "Desarrollador Full-Stack",
    "Agosto 2024 – Presente",
    "Desarrollo de soluciones digitales completas (Web & Mobile)",
    "Contribución activa en plataformas como Validocus y Wasapi. Enfoque en arquitecturas eficientes y escalables, optimizando tanto el rendimiento del frontend como la robustez del backend utilizando React, Node.js y tecnologías móviles híbridas.",
    JSON.stringify(["FullStack", "Mobile"]),
    JSON.stringify(["mockImg.png", "mockImg.png", "mockImg.png"])
);

insertProject.run(
    "Vinix Code",
    "Desarrollador de Software",
    "Junio 2022 – Junio 2024",
    "Desarrollo de aplicaciones web y móviles con React y Vue.js",
    "Implementación de pasarelas de pago (Stripe, PayU), gestión de bases de datos (MySQL, Firebase) y contenerización con Docker. Colaboración estrecha en diseño UI/UX y despliegues consistentes en AWS.",
    JSON.stringify(["Frontend", "Backend"]),
    JSON.stringify(["mockImg.png", "mockImg.png", "mockImg.png"])
);

insertProject.run(
    "Konecta",
    "Desarrollador Web",
    "Octubre 2019 – Marzo 2020",
    "Construcción de aplicaciones web con Angular y Node.js",
    "Desarrollo de interfaces de usuario modernas y experiencias digitales. Creación de aplicaciones robustas utilizando Angular (CLI, Material) e integración de servicios backend con Express.js.",
    JSON.stringify(["Web", "UI/UX"]),
    JSON.stringify(["mockImg.png", "mockImg.png", "mockImg.png"])
);

// Jobs (LatestJob)
const insertJob = db.prepare(`
  INSERT INTO jobs (company, role, date, description, tag, image) VALUES (?, ?, ?, ?, ?, ?)
`);

insertJob.run(
    "Soluciones Star",
    "Desarrollador Full-Stack",
    "Agosto 2024 – Presente",
    "Liderando el desarrollo de soluciones digitales completas y arquitecturas escalables.",
    "Full-Stack",
    "mockImg.png"
);

insertJob.run(
    "Vinix Code",
    "Desarrollador de Software",
    "Junio 2022 – Junio 2024",
    "Desarrollo remoto de aplicaciones web y móviles, integrando pagos y servicios cloud.",
    "Software",
    "mockImg.png"
);

insertJob.run(
    "Konecta",
    "Desarrollador Web",
    "Oct 2019 – Mar 2020",
    "Construcción de interfaces modernas y experiencias digitales con Angular y Node.js.",
    "Web Dev",
    "mockImg.png"
);

console.log("Database seeded successfully!");
