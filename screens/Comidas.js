// screens/Comidas.js (¡Ahora actúa como DietCatalog.js!)

// ====================================================================
// CATÁLOGO MAESTRO DE DIETAS (Estructurado por Plan y Día)
// CON CALORÍAS AJUSTADAS POR PLAN Y DÍAS COMPLETOS
// ====================================================================

export const DIETAS_MAESTRAS = {

  // ----------------------------------------------------------
  // PLAN 1: PÉRDIDA DE PESO (Déficit Calórico Moderado)
  // Calorías diarias estimadas: 1500 - 1800 kcal
  // ----------------------------------------------------------
  'Plan 1': {
    lunes: {
      enfoque: 'Déficit Calórico y Proteico',
      comidas: [
        { nombre: "Desayuno", comida: "Tortilla de 3 claras + 1 yema con espinacas, champiñones y una tostada integral.", calorias: 300 },
        { nombre: "Media Mañana", comida: "Yogur griego natural (sin azúcar) con 10 almendras.", calorias: 180 },
        { nombre: "Almuerzo", comida: "Pechuga de pollo a la plancha (150g) con ensalada grande de hojas verdes, pepino y tomate. Aderezo de limón y aceite de oliva.", calorias: 450 },
        { nombre: "Media Tarde", comida: "Manzana y un puñado pequeño de nueces.", calorias: 150 },
        { nombre: "Cena", comida: "Salmón al vapor (120g) con brócoli y espárragos al horno.", calorias: 380 }
      ]
    },
    martes: {
      enfoque: 'Carbohidratos Controlados',
      comidas: [
        { nombre: "Desayuno", comida: "Batido de proteínas (25g) con agua, un puñado de frutos rojos y semillas de chía.", calorias: 280 },
        { nombre: "Media Mañana", comida: "Huevo cocido y zanahorias baby.", calorias: 120 },
        { nombre: "Almuerzo", comida: "Ternera magra a la plancha (150g) con pimientos y cebolla salteados. Ensalada verde.", calorias: 480 },
        { nombre: "Media Tarde", comida: "Rodajas de pavo y pepino.", calorias: 100 },
        { nombre: "Cena", comida: "Merluza al horno con ensalada de tomate, pepino y aceite de oliva.", calorias: 350 }
      ]
    },
    miércoles: {
      enfoque: 'Equilibrado y Fibra',
      comidas: [
        { nombre: "Desayuno", comida: "Avena (40g) cocida en agua o leche vegetal con canela y 5 nueces.", calorias: 320 },
        { nombre: "Media Mañana", comida: "Pera y un trozo de queso fresco.", calorias: 160 },
        { nombre: "Almuerzo", comida: "Lentejas estofadas con verduras (sin patata ni embutidos).", calorias: 470 },
        { nombre: "Media Tarde", comida: "Puñado de altramuces y pimiento crudo.", calorias: 100 },
        { nombre: "Cena", comida: "Tortilla de champiñones y espinacas con una pequeña porción de atún al natural.", calorias: 370 }
      ]
    },
    jueves: {
      enfoque: 'Proteína y Verduras',
      comidas: [
        { nombre: "Desayuno", comida: "2 Tostadas integrales con aguacate y huevo cocido.", calorias: 380 },
        { nombre: "Media Mañana", comida: "Mandarina y un puñado de cacahuetes naturales.", calorias: 180 },
        { nombre: "Almuerzo", comida: "Pechuga de pavo (150g) con quinoa (60g en seco) y verduras al vapor (brócoli, zanahoria).", calorias: 500 },
        { nombre: "Media Tarde", comida: "Gelatina light o fruta de temporada.", calorias: 80 },
        { nombre: "Cena", comida: "Crema de calabacín y gambas a la plancha.", calorias: 320 }
      ]
    },
    viernes: {
      enfoque: 'Variado',
      comidas: [
        { nombre: "Desayuno", comida: "Yogur natural con 30g de granola baja en azúcar y plátano.", calorias: 350 },
        { nombre: "Media Mañana", comida: "Barrita de cereales integral (baja en azúcar).", calorias: 120 },
        { nombre: "Almuerzo", comida: "Atún a la plancha (150g) con arroz integral (50g en seco) y ensalada de rúcula y tomates cherry.", calorias: 520 },
        { nombre: "Media Tarde", comida: "Zumo de tomate o rodajas de pepino.", calorias: 70 },
        { nombre: "Cena", comida: "Ensalada completa con garbanzos (80g cocidos), queso fresco, tomate, pepino y lechuga.", calorias: 400 }
      ]
    },
    sábado: {
      enfoque: 'Día Flexible / Activo',
      comidas: [
        { nombre: "Desayuno", comida: "Tortitas de avena (sin azúcar) con fruta fresca y un chorrito de sirope de agave.", calorias: 400 },
        { nombre: "Media Mañana", comida: "Puñado de frutos secos mixtos.", calorias: 200 },
        { nombre: "Almuerzo", comida: "Wok de pollo y verduras con fideos de arroz (porción moderada).", calorias: 550 },
        { nombre: "Media Tarde", comida: "Batido de frutas con agua o leche vegetal.", calorias: 180 },
        { nombre: "Cena", comida: "Minipizza casera en base de pan integral con pavo, verduras y queso light.", calorias: 400 }
      ]
    },
    domingo: {
      enfoque: 'Recuperación y Relax',
      comidas: [
        { nombre: "Desayuno", comida: "Tazón de queso cottage con rodajas de melocotón y semillas de calabaza.", calorias: 320 },
        { nombre: "Media Mañana", comida: "Infusión y una galleta de arroz con crema de cacahuete.", calorias: 150 },
        { nombre: "Almuerzo", comida: "Pescado blanco (200g) al papillote con patatas cocidas (150g) y guisantes.", calorias: 480 },
        { nombre: "Media Tarde", comida: "Puñado de bayas de Goji.", calorias: 100 },
        { nombre: "Cena", comida: "Sopa de miso con tofu y algas.", calorias: 300 }
      ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 2: TONIFICACIÓN (Mantenimiento / Ligero Superávit)
  // Calorías diarias estimadas: 1900 - 2300 kcal
  // ----------------------------------------------------------
  'Plan 2': {
    lunes: {
      enfoque: 'Equilibrado con Buen Carbohidrato',
      comidas: [
        { nombre: "Desayuno", comida: "Gachas de avena (60g) con proteína en polvo, plátano y un chorrito de miel.", calorias: 480 },
        { nombre: "Media Mañana", comida: "Yogur griego con frutos secos mixtos (20g).", calorias: 250 },
        { nombre: "Almuerzo", comida: "Pasta integral (80g en seco) con pechuga de pollo (180g) y salsa de tomate casera con verduras.", calorias: 650 },
        { nombre: "Media Tarde", comida: "Sándwich pequeño de pavo y aguacate en pan integral.", calorias: 300 },
        { nombre: "Cena", comida: "Salmón a la plancha (150g) con batata asada (200g) y espárragos.", calorias: 550 }
      ]
    },
    martes: {
      enfoque: 'Variedad de Fuentes',
      comidas: [
        { nombre: "Desayuno", comida: "Tostadas integrales (2) con huevos revueltos (2) y aguacate.", calorias: 420 },
        { nombre: "Media Mañana", comida: "Smoothie de frutas (plátano, espinacas, leche vegetal, proteína).", calorias: 280 },
        { nombre: "Almuerzo", comida: "Ternera a la jardinera (180g carne) con arroz integral (70g en seco) y abundantes verduras.", calorias: 700 },
        { nombre: "Media Tarde", comida: "Barrita de proteína y una pieza de fruta.", calorias: 200 },
        { nombre: "Cena", comida: "Tortilla de 4 claras con atún al natural y ensalada mixta.", calorias: 450 }
      ]
    },
    miércoles: {
      enfoque: 'Legumbres y Fibra',
      comidas: [
        { nombre: "Desayuno", comida: "Cereal integral (50g) con leche y frutos secos.", calorias: 380 },
        { nombre: "Media Mañana", comida: "Puñado de almendras y un plátano.", calorias: 250 },
        { nombre: "Almuerzo", comida: "Garbanzos con espinacas y bacalao (150g).", calorias: 680 },
        { nombre: "Media Tarde", comida: "Yogur natural con miel.", calorias: 180 },
        { nombre: "Cena", comida: "Pechuga de pollo al horno (180g) con un boniato mediano y judías verdes.", calorias: 520 }
      ]
    },
    jueves: {
      enfoque: 'Día Activo',
      comidas: [
        { nombre: "Desayuno", comida: "Panqueques de avena con proteína, frutos rojos y sirope de arce.", calorias: 500 },
        { nombre: "Media Mañana", comida: "Bocadillo de pavo y queso fresco.", calorias: 300 },
        { nombre: "Almuerzo", comida: "Pollo al curry con arroz Basmati (80g en seco) y pimientos.", calorias: 720 },
        { nombre: "Media Tarde", comida: "Batido post-entreno (proteína, leche, plátano).", calorias: 300 },
        { nombre: "Cena", comida: "Ensalada de quinoa con salmón ahumado, aguacate y tomate.", calorias: 500 }
      ]
    },
    viernes: {
      enfoque: 'Grasas Saludables',
      comidas: [
        { nombre: "Desayuno", comida: "Yogur bífidus con granola, semillas de lino y arándanos.", calorias: 400 },
        { nombre: "Media Mañana", comida: "Barrita energética casera (avena, frutos secos, dátiles).", calorias: 250 },
        { nombre: "Almuerzo", comida: "Burrito bowl: Arroz integral, ternera picada (150g), frijoles negros, maíz, aguacate.", calorias: 750 },
        { nombre: "Media Tarde", comida: "Frutos secos mixtos y una manzana.", calorias: 200 },
        { nombre: "Cena", comida: "Pescado blanco al horno (180g) con puré de patata y guisantes.", calorias: 500 }
      ]
    },
    sábado: {
      enfoque: 'Social y Flexible',
      comidas: [
        { nombre: "Desayuno", comida: "Zumo de naranja natural, tostada con jamón serrano y tomate.", calorias: 350 },
        { nombre: "Media Mañana", comida: "Café con leche y un trozo de fruta.", calorias: 150 },
        { nombre: "Almuerzo", comida: "Comida libre (pizza, hamburguesa, etc. con moderación).", calorias: 800 },
        { nombre: "Media Tarde", comida: "Proteína de suero en agua.", calorias: 120 },
        { nombre: "Cena", comida: "Ensalada de pasta integral con atún, huevo cocido y verduras.", calorias: 600 }
      ]
    },
    domingo: {
      enfoque: 'Recuperación y Reabastecimiento',
      comidas: [
        { nombre: "Desayuno", comida: "Tortilla de 3 huevos con verduras y 2 rebanadas de pan de centeno.", calorias: 450 },
        { nombre: "Media Mañana", comida: "Batido de frutas con yogur y chía.", calorias: 280 },
        { nombre: "Almuerzo", comida: "Pollo asado (200g) con patatas al horno (200g) y ensalada.", calorias: 700 },
        { nombre: "Media Tarde", comida: "Puñado de anacardos.", calorias: 180 },
        { nombre: "Cena", comida: "Sopa de verduras con fideos integrales y un trozo de pan.", calorias: 450 }
      ]
    }
  },

  // ----------------------------------------------------------
  // PLAN 3: GANANCIA MUSCULAR (Superávit Calórico Significativo)
  // Calorías diarias estimadas: 2500 - 3000+ kcal
  // ----------------------------------------------------------
  'Plan 3': {
    lunes: {
      enfoque: 'Alto en Proteína y Carbohidratos',
      comidas: [
        { nombre: "Desayuno", comida: "Batido Constructor: 2 scoops proteína, 500ml leche entera, 1 plátano, 80g avena, 2 cdas crema cacahuete.", calorias: 900 },
        { nombre: "Media Mañana", comida: "Sándwich de pavo (100g) y queso (50g) en pan de molde (4 rebanadas) con aguacate.", calorias: 600 },
        { nombre: "Almuerzo", comida: "Arroz blanco (150g en seco), pechuga de pollo (200g) y verduras al vapor con aceite de oliva.", calorias: 850 },
        { nombre: "Media Tarde", comida: "Yogur griego entero (200g) con frutos secos (30g) y miel.", calorias: 400 },
        { nombre: "Cena", comida: "Lomo de ternera (200g) a la plancha con patatas asadas (300g) y brócoli.", calorias: 950 }
      ]
    },
    martes: {
      enfoque: 'Densidad Nutricional',
      comidas: [
        { nombre: "Desayuno", comida: "Tortilla de 4 huevos con jamón y 2 tostadas integrales con mantequilla de cacahuete.", calorias: 650 },
        { nombre: "Media Mañana", comida: "Gachas de avena (80g) con leche entera, proteína y frutos rojos.", calorias: 500 },
        { nombre: "Almuerzo", comida: "Pasta integral (120g en seco) con atún (2 latas), aceitunas y salsa pesto.", calorias: 900 },
        { nombre: "Media Tarde", comida: "Batido de proteínas con leche y plátano.", calorias: 350 },
        { nombre: "Cena", comida: "Salmón (200g) al horno con quinoa (100g en seco) y espárragos.", calorias: 800 }
      ]
    },
    miércoles: {
      enfoque: 'Varie y Vaya',
      comidas: [
        { nombre: "Desayuno", comida: "Cereal integral (80g) con leche entera, proteína y frutos secos.", calorias: 550 },
        { nombre: "Media Mañana", comida: "Ensalada de frutas (grande) con queso cottage (150g).", calorias: 300 },
        { nombre: "Almuerzo", comida: "Burrito bowl: Arroz blanco (150g), pollo desmenuzado (200g), frijoles, maíz, aguacate, crema agria.", calorias: 1000 },
        { nombre: "Media Tarde", comida: "Barrita de proteína y un puñado de almendras.", calorias: 300 },
        { nombre: "Cena", comida: "Curry de garbanzos (200g cocidos) y pollo (180g) con arroz basmati (100g en seco).", calorias: 900 }
      ]
    },
    jueves: {
      enfoque: 'Carbohidratos Potentes',
      comidas: [
        { nombre: "Desayuno", comida: "Tortitas de avena (100g avena) con 2 huevos, proteína en polvo, plátano y nueces.", calorias: 750 },
        { nombre: "Media Mañana", comida: "Pan integral (4 rebanadas) con crema de cacahuete y mermelada.", calorias: 500 },
        { nombre: "Almuerzo", comida: "Patatas cocidas (400g) con ternera estofada (200g) y verduras.", calorias: 900 },
        { nombre: "Media Tarde", comida: "Yogur entero con granola y miel.", calorias: 400 },
        { nombre: "Cena", comida: "Pechuga de pavo (200g) con boniato (300g) y ensalada.", calorias: 800 }
      ]
    },
    viernes: {
      enfoque: 'Recarga y Sabor',
      comidas: [
        { nombre: "Desayuno", comida: "Avena (100g) cocida en leche entera con proteína, frutos secos y un chorrito de aceite de coco.", calorias: 800 },
        { nombre: "Media Mañana", comida: "Sándwich de pollo (150g) y aguacate en pan de pita.", calorias: 550 },
        { nombre: "Almuerzo", comida: "Wok de ternera (200g) con fideos udon (120g en seco) y abundantes verduras.", calorias: 1000 },
        { nombre: "Media Tarde", comida: "Batido de leche entera, plátano y proteína.", calorias: 400 },
        { nombre: "Cena", comida: "Pizza casera (base grande) con pollo, champiñones y queso extra.", calorias: 900 }
      ]
    },
    sábado: {
      enfoque: 'Día de Festín (pero inteligente)',
      comidas: [
        { nombre: "Desayuno", comida: "Desayuno inglés completo: Huevos, bacon (moderado), judías, tostadas, zumo.", calorias: 700 },
        { nombre: "Media Mañana", comida: "Fruta fresca y un puñado de frutos secos.", calorias: 250 },
        { nombre: "Almuerzo", comida: "Hamburguesa doble de ternera (2x150g) en pan brioche con queso, patatas fritas (porción grande) y ensalada.", calorias: 1200 },
        { nombre: "Media Tarde", comida: "Batido de proteína de suero en agua.", calorias: 150 },
        { nombre: "Cena", comida: "Pollo asado (250g) con arroz (100g en seco) y verduras al vapor.", calorias: 800 }
      ]
    },
    domingo: {
      enfoque: 'Preparación y Recuperación',
      comidas: [
        { nombre: "Desayuno", comida: "Batido: leche entera, 2 scoops proteína, 2 plátanos, 100g avena.", calorias: 950 },
        { nombre: "Media Mañana", comida: "Ensalada de pasta (100g en seco) con atún y verduras.", calorias: 600 },
        { nombre: "Almuerzo", comida: "Carne de cerdo (200g) guisada con patatas (300g) y ensalada.", calorias: 1000 },
        { nombre: "Media Tarde", comida: "Yogur entero con muesli y un dátil.", calorias: 400 },
        { nombre: "Cena", comida: "Omelette de 5 huevos con queso y pavo. Pan de centeno.", calorias: 700 }
      ]
    }
  }
};