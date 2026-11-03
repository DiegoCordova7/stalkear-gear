const BASE_URL = import.meta.env.BASE_URL;

export const INITIAL_PRODUCTS = [
    {
        id: "prod-001",
        nombre: "Stalker Bivy & Tarp System",
        categoria: "Refugios & Acampada",
        precio: 3499.00,
        stock: 15,
        imagen: `${BASE_URL}assets/images/stalker-bivy-and-tarp-system.webp`,
        descripcion: "Sistema de refugio modular de camuflaje, impermeable y de bajo perfil.",
        especificaciones: {
            material: "Nylon Ripstop 70D con recubrimiento PU",
            peso: "1.2 kg",
            resistenciaAgua: "5000 mm",
            camuflaje: "MultiCam / Woodland",
            gradoMilitar: "MIL-SPEC"
        }
    },
    {
        id: "prod-002",
        nombre: "Stalker Canteen & Mess Kit",
        categoria: "Hidratación & Cocina",
        precio: 899.00,
        stock: 25,
        imagen: `${BASE_URL}assets/images/stalker-canteen-and-mess-kit.webp`,
        descripcion: "Cantimplora táctica de aluminio anodizado con jarro acoplable y funda MOLLE.",
        especificaciones: {
            material: "Aluminio grado alimenticio 100%",
            peso: "0.45 kg",
            resistenciaAgua: "N/A (Estanqueidad total)",
            camuflaje: "Verde Oliva",
            gradoMilitar: "MIL-SPEC"
        }
    },
    {
        id: "prod-003",
        nombre: "Mochila Táctica Recon 45L",
        categoria: "Carga & Almacenamiento",
        precio: 2199.00,
        stock: 10,
        imagen: `${BASE_URL}assets/images/mochila-tactica-recon-45l.webp`,
        descripcion: "Mochila ergonómica de combate con expansiones MOLLE y compartimento para vejiga de hidratación.",
        especificaciones: {
            material: "Cordura 1000D",
            peso: "1.8 kg",
            resistenciaAgua: "1500 mm (Repelente)",
            camuflaje: "Coyote Tan",
            gradoMilitar: "Táctico Comercial"
        }
    },
    {
        id: "prod-004",
        nombre: "Botas de Combate All-Terrain",
        categoria: "Calzado",
        precio: 2899.00,
        stock: 8,
        imagen: `${BASE_URL}assets/images/botas-de-combate-all-terrain.webp`,
        descripcion: "Calzado de alta tracción con plantilla anti-perforación y soporte de tobillo rígido.",
        especificaciones: {
            material: "Piel de ante y Nylon Balístico",
            peso: "1.4 kg (Par)",
            resistenciaAgua: "Membrana Transpirable Waterproof",
            camuflaje: "Negro Táctico",
            gradoMilitar: "MIL-SPEC"
        }
    },
    {
        id: "prod-005",
        nombre: "Cuchillo de Supervivencia Full-Tang",
        categoria: "Herramientas",
        precio: 1450.00,
        stock: 12,
        imagen: `${BASE_URL}assets/images/cuchillo-de-supervivencia-full-tang.webp`,
        descripcion: "Hoja fija de acero al carbono con rompecristales integrado y funda de Kydex.",
        especificaciones: {
            material: "Acero D2 / Empuñadura G10",
            peso: "0.38 kg",
            resistenciaAgua: "Recubrimiento Anti-corrosión Titanium",
            camuflaje: "Negro Mate",
            gradoMilitar: "Supervivencia Extrema"
        }
    },
    {
        id: "prod-006",
        nombre: "Linterna Táctica 2000 Lumens Strobe",
        categoria: "Iluminación & Óptica",
        precio: 750.00,
        stock: 20,
        imagen: `${BASE_URL}assets/images/linterna-tactica-2000-lumens-strobe.webp`,
        descripcion: "Linterna recargable de alta intensidad con modo estroboscópico de emergencia.",
        especificaciones: {
            material: "Aluminio Aeronáutico T6061",
            peso: "0.22 kg",
            resistenciaAgua: "Sumergible IPX8 (2m)",
            camuflaje: "Anodizado Negro",
            gradoMilitar: "Táctico Policial"
        }
    },
    {
        id: "prod-007",
        nombre: "Chest Rig Modular Stalker",
        categoria: "Vestimenta Táctica",
        precio: 1850.00,
        stock: 14,
        imagen: `${BASE_URL}assets/images/chest-rig-modular-stalker.webp`,
        descripcion: "Arnés pectoral ligero con porta-cargadores intercambiables y panel velcro.",
        especificaciones: {
            material: "Nylon 500D LAMINEX",
            peso: "0.65 kg",
            resistenciaAgua: "Repelente al agua",
            camuflaje: "Ranger Green",
            gradoMilitar: "MIL-SPEC"
        }
    },
    {
        id: "prod-008",
        nombre: "Botiquín Táctico de Trauma IFAK",
        categoria: "Médico & Emergencias",
        precio: 1200.00,
        stock: 18,
        imagen: `${BASE_URL}assets/images/botiquin-tactico-de-trauma-ifak.webp`,
        descripcion: "Bolsa médica de desprendimiento rápido con organizadores elásticos internos.",
        especificaciones: {
            material: "Cordura 500D Ripstop",
            peso: "0.30 kg",
            resistenciaAgua: "Resistente a salpicaduras",
            camuflaje: "Rojo / Coyote",
            gradoMilitar: "Táctico Médico"
        }
    },
    {
        id: "prod-009",
        nombre: "Cuerda Paracord 550 (30m)",
        categoria: "Accesorios & Herramientas",
        precio: 299.00,
        stock: 40,
        imagen: `${BASE_URL}assets/images/cuerda-paracord-550-30m.webp`,
        descripcion: "Cuerda de paracord grado 550 con 7 hebras internas de nylon trenzado.",
        especificaciones: {
            material: "100% Nylon Grado 550",
            peso: "0.25 kg",
            resistenciaAgua: "Resistente a moho y rayos UV",
            camuflaje: "Camuflaje Digital",
            gradoMilitar: "MIL-C-5040H"
        }
    },
    {
        id: "prod-010",
        nombre: "Binoculares Tácticos 10x42 Nitrógeno",
        categoria: "Iluminación & Óptica",
        precio: 3100.00,
        stock: 6,
        imagen: `${BASE_URL}assets/images/binoculares-tacticos-10x42-nitrogeno.webp`,
        descripcion: "Binoculares sellados con nitrógeno para evitar empañamiento bajo condiciones extremas.",
        especificaciones: {
            material: "Polímero de alta resistencia con engomado",
            peso: "0.78 kg",
            resistenciaAgua: "Sumergible IPX7",
            camuflaje: "Coyote Brown",
            gradoMilitar: "Óptica Avanzada"
        }
    }
];

export const INITIAL_USERS = [
    {
        id: "user-admin",
        nombre: "Comandante Admin",
        email: "admin@stalkear.com",
        password: "admin",
        role: "admin"
    },
    {
        id: "user-001",
        nombre: "Stalker Operador",
        email: "cliente@stalkear.com",
        password: "123",
        role: "client"
    }
];