import { MeasureUnit } from '@/modules/product/enums'

interface Product {
  name: string
  brand: string
  category: string
  measureUnit: MeasureUnit
  unitPrice: number
}

export const PRODUCTS: Product[] = [
  {
    name: 'aromatizante',
    brand: 'oxxo',
    category: 'limpieza',
    measureUnit: MeasureUnit.liters,
    unitPrice: 150,
  },
  {
    name: 'cepillo con cabo',
    brand: 'dime',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 30,
  },
  {
    name: 'cloro',
    brand: 'cloralex',
    category: 'limpieza',
    measureUnit: MeasureUnit.liters,
    unitPrice: 80,
  },
  {
    name: 'fibra esponja',
    brand: 'brillo',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 20,
  },
  {
    name: 'fibra negra',
    brand: 'brillo',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 20,
  },
  {
    name: 'fibras de acero',
    brand: 'durex',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 25,
  },
  {
    name: 'fibras verde',
    brand: 'brillo',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 20,
  },
  {
    name: 'franela blanca',
    brand: 'huggies',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 15,
  },
  {
    name: 'franela gris',
    brand: 'huggies',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 15,
  },
  {
    name: 'franela roja',
    brand: 'huggies',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 15,
  },
  {
    name: 'guantes de vinil',
    brand: 'vulcan',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'jabón arcoiris',
    brand: 'arcoiris',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 90,
  },
  {
    name: 'jabón roma',
    brand: 'roma',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 80,
  },
  {
    name: 'jabón salvo',
    brand: 'salvo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 90,
  },
  {
    name: 'jalador de espuma',
    brand: 'dime',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 40,
  },
  {
    name: 'piedra pómex',
    brand: 'sasa',
    category: 'limpieza',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 40,
  },
  {
    name: 'pinol',
    brand: 'pinol',
    category: 'limpieza',
    measureUnit: MeasureUnit.liters,
    unitPrice: 120,
  },
  {
    name: 'quita cochambre',
    brand: 'sasa',
    category: 'limpieza',
    measureUnit: MeasureUnit.liters,
    unitPrice: 150,
  },
  {
    name: 'recogedor',
    brand: 'sasa',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 30,
  },
  {
    name: 'sarricida',
    brand: 'sasa',
    category: 'limpieza',
    measureUnit: MeasureUnit.liters,
    unitPrice: 200,
  },
  {
    name: 'shampoo p / manos',
    brand: 'sasa',
    category: 'abarrotes',
    measureUnit: MeasureUnit.liters,
    unitPrice: 60,
  },
  {
    name: 'trapeador',
    brand: 'dime',
    category: 'limpieza',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'bolsa 20 x 30',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 20,
  },
  {
    name: 'bolsa 30 x 40',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 30,
  },
  {
    name: 'bolsa 40 x 60',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 40,
  },
  {
    name: 'bolsa 60 x 90',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 50,
  },
  {
    name: 'bolsa jumbo azul',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 80,
  },
  {
    name: 'bolsa jumbo negra',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.rolls,
    unitPrice: 100,
  },
  {
    name: 'bolsa jumbo verde',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 80,
  },
  {
    name: 'charola 66',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 150,
  },
  {
    name: 'charola 855',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 200,
  },
  {
    name: 'contenedor 8 x 8 div.',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 120,
  },
  {
    name: 'cubre bocas triple capa',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 100,
  },
  {
    name: 'cubre pelo',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'cuchara desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.packages,
    unitPrice: 20,
  },
  {
    name: 'cuchara desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 15,
  },
  {
    name: 'cuchillo desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 25,
  },
  {
    name: 'cuchillo desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.packages,
    unitPrice: 30,
  },
  {
    name: 'guantes de látex',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 80,
  },
  {
    name: 'guantes desechables',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 70,
  },
  {
    name: 'mantel desechable p/tablón',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'molde p/gelatina #4',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 250,
  },
  {
    name: 'molde para jericalla',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 150,
  },
  {
    name: 'palillos',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 20,
  },
  {
    name: 'papel higiénico',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.rolls,
    unitPrice: 40,
  },
  {
    name: 'plato ph6',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 100,
  },
  {
    name: 'plato ph8',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 120,
  },
  {
    name: 'servilleta barramesa',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 60,
  },
  {
    name: 'servilleta',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 80,
  },
  {
    name: 'tenedor desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 20,
  },
  {
    name: 'tenedor desechable',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.packages,
    unitPrice: 25,
  },
  {
    name: 'toalla interdoblada',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 60,
  },
  {
    name: 'vaso plástico no. 12',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 150,
  },
  {
    name: 'vaso térmico #10',
    brand: 'sasa',
    category: 'desechables',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 200,
  },
  {
    name: 'camarones 31/35',
    brand: 'sasa',
    category: 'congelados',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'salmón chileno',
    brand: 'sasa',
    category: 'congelados',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 250,
  },
  {
    name: 'filete pescado 5/7 basa',
    brand: 'sasa',
    category: 'congelados',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 200,
  },
  {
    name: 'pulpo 2/4',
    brand: 'sasa',
    category: 'congelados',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 300,
  },
  {
    name: 'surimi',
    brand: 'sasa',
    category: 'congelados',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 120,
  },
  {
    name: 'arrachera marinada',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'bandera',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 150,
  },
  {
    name: 'bisteck de res especial',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 250,
  },
  {
    name: 'cabeza de cerdo',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 100,
  },
  {
    name: 'chamabrete de res s/hueso',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 200,
  },
  {
    name: 'chamorro de cerdo',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'chicharrón de cerdo duro',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 150,
  },
  {
    name: 'costilla de cerdo',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 200,
  },
  {
    name: 'espaldilla de cerdo',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 190,
  },
  {
    name: 'espinazo de cerdo',
    brand: 'sasa',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'fajitas de cerdo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 160,
  },
  {
    name: 'fajitas de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'falda de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 220,
  },
  {
    name: 'filete de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 300,
  },
  {
    name: 'hamburguesa de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 150,
  },
  {
    name: 'lengua de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 200,
  },
  {
    name: 'lomo de cerdo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 250,
  },
  {
    name: 'menudo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 80,
  },
  {
    name: 'molida de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 120,
  },
  {
    name: 'new york',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 280,
  },
  {
    name: 'pierna de cerdo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'puntas de cerdo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 150,
  },
  {
    name: 'puntas de res',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 160,
  },
  {
    name: 'rib - eye',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 320,
  },
  {
    name: 'roast beef (pulpa negra)',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 300,
  },
  {
    name: 't-bone',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 350,
  },
  {
    name: 'recorte de pechuga',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 180,
  },
  {
    name: 'pechuga empanizada cj',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 200,
  },
  {
    name: 'pechuga mariposa s/h de pollo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 220,
  },
  {
    name: 'pierna y muslo',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 150,
  },
  {
    name: 'pollo en canal',
    brand: 'super carnes',
    category: 'carnes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 120,
  },
  {
    name: 'pan bimbo blanco',
    brand: 'bimbo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 30,
  },
  {
    name: 'pan bimbo integral',
    brand: 'bimbo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 35,
  },
  {
    name: 'pan bimbollos',
    brand: 'bimbo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 40,
  },
  {
    name: 'pan medias noches',
    brand: 'bimbo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'pan molido',
    brand: 'bimbo',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 30,
  },
  {
    name: 'huaraches',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 80,
  },
  {
    name: 'sopes',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 70,
  },
  {
    name: 'tortilla de maíz',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 40,
  },
  {
    name: 'tortilla p/buñuelo',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 40,
  },
  {
    name: 'tortilla p/crepa',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'tortillas de harina',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 50,
  },
  {
    name: 'tostadas',
    brand: 'maceka',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 60,
  },
  {
    name: 'concentrado p/agua',
    brand: 'pepsi',
    category: 'abarrotes',
    measureUnit: MeasureUnit.liters,
    unitPrice: 30,
  },
  {
    name: 'refresco coca cola lata',
    brand: 'coca cola',
    category: 'bebidas',
    measureUnit: MeasureUnit.cans,
    unitPrice: 15,
  },
  {
    name: 'refresco coca cola light lata',
    brand: 'coca cola',
    category: 'bebidas',
    measureUnit: MeasureUnit.cans,
    unitPrice: 15,
  },
  {
    name: 'refresco surtido lata',
    brand: 'quimc',
    category: 'bebidas',
    measureUnit: MeasureUnit.cans,
    unitPrice: 15,
  },
  {
    name: 'refresco coca-cola sin azúcar',
    brand: 'coca cola',
    category: 'bebidas',
    measureUnit: MeasureUnit.cans,
    unitPrice: 15,
  },
  {
    name: 'concentrado frudi naranja',
    brand: 'pepsi',
    category: 'bebidas',
    measureUnit: MeasureUnit.pieces,
    unitPrice: 30,
  },
  {
    name: 'chile serrano',
    brand: 'abastos',
    category: 'abarrotes',
    measureUnit: MeasureUnit.kilograms,
    unitPrice: 20,
  },
]
