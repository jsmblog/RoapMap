import { bandageOutline, barbellOutline, bedOutline, beerOutline, bookOutline, cafeOutline, cartOutline, cloudyNightOutline, gameControllerOutline, leafOutline, musicalNoteOutline, restaurantOutline, shirtOutline, ticketOutline, waterOutline } from "ionicons/icons";

let i = 1;
export const categories = [
  {
    id: i++,
    name:'Restaurantes',
    icon: {restaurantOutline},
    type:'comida y bebida',
    place:'restaurant'
  },
  {
    id: i++,
    name:'Cafetería',
    icon: {cafeOutline},
    type:'comida y bebida',
    place:'cafe'
  },
  {
    id: i++,
    name:'Bares',
    icon: {beerOutline},
    type:'comida y bebida',
    place:'bar'
  },
  {
    id: i++,
    name:'Hoteles',
    icon: {bedOutline},
    type:'servicios',
    place:'lodging'
  },
   {
    id: i++,
    name:'Clubes nocturnos',
    icon: {cloudyNightOutline},
    type:'actividades',
    place:'night_club'
  },
  {
    id: i++,
    name:'Gasolineras',
    icon: {waterOutline},
    type:'servicios',
    place:'gas_station'
  },
  {
    id: i++,
    name:'Supermercados',
    icon: {cartOutline},
    type:'compras',
    place:'supermarket'
  },
  {
    id: i++,
    name:'Cines',
    icon: {ticketOutline},
    type:'actividades',
    place:'movie_theater'
  },
  {
    id: i++,
    name:'Farmacias',
    icon: {bandageOutline},
    type:'servicios',
    place:'pharmacy'
  },
  {
    id:i++,
    name:'Bibliotecas',
    icon:{bookOutline},
    type:'actividades',
    place:'library'
  },
  {
    id: i++,
    name:'Ropa',
    icon: {shirtOutline},
    type:'compras',
    place:'clothing_store'
  },
  {
    id: i++,
    name:'Gimnasios',
    icon: {barbellOutline},
    type:'actividades',
    place:'gym'
  },
  {
    id: i++,
    name:'Atracciones',
    icon: {gameControllerOutline},
    type:'actividades',
    place:'amusement_park'
  },
  {
    id: i++,
    name:'Parques',
    icon: {leafOutline},
    type:'actividades',
    place:'park'
  },
  {
    id:i++,
    name:'Música',
    icon:{musicalNoteOutline},
    type:'actividades',
    place:'music_store'
  }
]