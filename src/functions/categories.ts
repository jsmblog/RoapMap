import { bandageOutline, barbellOutline, bedOutline, beerOutline, bookOutline, cafeOutline, cartOutline, gameControllerOutline, leafOutline, musicalNoteOutline, restaurantOutline, shirtOutline, ticketOutline, waterOutline } from "ionicons/icons";

let i = 1;
export const categories = [
  {
    id: i++,
    name:'Restaurantes',
    icon: {restaurantOutline},
    type:'comida y bebida'
  },
  {
    id: i++,
    name:'Cafetería',
    icon: {cafeOutline},
    type:'comida y bebida'
  },
  {
    id: i++,
    name:'Bares',
    icon: {beerOutline},
    type:'comida y bebida'
  },
  {
    id: i++,
    name:'Hoteles',
    icon: {bedOutline},
    type:'servicios'
  },
  {
    id: i++,
    name:'Gasolineras',
    icon: {waterOutline},
    type:'servicios'
  },
  {
    id: i++,
    name:'Supermercados',
    icon: {cartOutline},
    type:'compras'
  },
  {
    id: i++,
    name:'Cines',
    icon: {ticketOutline},
    type:'actividades'
  },
  {
    id: i++,
    name:'Farmacias',
    icon: {bandageOutline},
    type:'servicios'
  },
  {
    id:i++,
    name:'Bibliotecas',
    icon:{bookOutline},
    type:'actividades'
  },
  {
    id: i++,
    name:'Ropa',
    icon: {shirtOutline},
    type:'compras'
  },
  {
    id: i++,
    name:'Gimnasios',
    icon: {barbellOutline},
    type:'actividades'
  },
  {
    id: i++,
    name:'Atracciones',
    icon: {gameControllerOutline},
    type:'actividades'
  },
  {
    id: i++,
    name:'Parques',
    icon: {leafOutline},
    type:'actividades'
  },
  {
    id:i++,
    name:'Música',
    icon:{musicalNoteOutline},
    type:'actividades'
  }
]