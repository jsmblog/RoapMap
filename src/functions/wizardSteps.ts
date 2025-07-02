export const wizardSteps = [
    {
        title: "¿Cómo planeas usar RoadMap?",
        subtitle: "Selecciona una opción para continuar.",
        maxSelect: 2,
        options: [
            {
                label: "Visitante curioso o turista explorador",
                value: "turista_visitante",
                category: "perfil"
            },
            {
                label: "Residente comprometido con su entorno",
                value: "residente_local",
                category: "perfil"
            },
            {
                label: "Guía turístico con experiencia local",
                value: "guia_turistico",
                category: "perfil"
            },
            {
                label: "Estudiante con ganas de descubrir",
                value: "estudiante",
                category: "perfil"
            },
            {
                label: "Trabajador activo en la comunidad",
                value: "trabajador_local",
                category: "perfil"
            },
            {
                label: "Organizar un viaje inolvidable",
                value: "planificacion_viaje",
                category: "interes"
            },
            {
                label: "Explorar paisajes únicos y vibrantes",
                value: "explorar_lugares",
                category: "interes"
            },
            {
                label: "Descubrir rincones auténticos y especiales",
                value: "descubrir_sitios",
                category: "interes"
            },
            {
                label: "Conocer la cultura local en profundidad",
                value: "conocer_cultura_local",
                category: "interes"
            },
            {
                label: "Participar en actividades emocionantes",
                value: "participar_en_actividades_emocionantes",
                category: "interes"
            },
            {
                label: "Disfrutar de la gastronomía regional",
                value: "lugares_comer",
                category: "servicio"
            },
            {
                label: "Alojarse en espacios cómodos y acogedores",
                value: "lugares_dormir",
                category: "servicio"
            },
            {
                label: "Comprar en tiendas con encanto local",
                value: "lugares_compras",
                category: "servicio"
            },
            {
                label: "Vivir experiencias divertidas y sociales",
                value: "lugares_diversion",
                category: "experiencias"
            },
            {
                label: "Asistir a eventos únicos y culturales",
                value: "eventos_locales",
                category: "interes"
            }
        ]
    },
    {
        title: "¿Qué tipos de lugares o actividades te interesan?",
        subtitle: "Elige lo que más te atraiga para personalizar tu experiencia.",
        maxSelect: 4,
        options: [
            { label: "Restaurantes", value: "restaurantes", category: "actividad" },
            { label: "Bares y vida nocturna", value: "vida_nocturna", category: "actividad_nocturna" },
            { label: "Cafeterías", value: "cafeterias", category: "actividad" },
            { label: "Museos y cultura", value: "museos_cultura", category: "actividad" },
            { label: "Naturaleza y parques", value: "naturaleza_parques", category: "actividad" },
            { label: "Mercados", value: "mercados", category: "actividad" },
            { label: "Eventos en vivo", value: "eventos_en_vivo", category: "actividad" },
            { label: "Actividades al aire libre", value: "actividades_exterior", category: "actividad" },
            { label: "Tiendas de ropa", value: "tiendas_ropa", category: "actividad" },
            { label: "Experiencias locales", value: "experiencias_locales", category: "actividad" },
            { label: "Lugares instagrameables", value: "lugares_instagram", category: "actividad" }
        ]
    },
    {
        title: "¿Tienes alguna preferencia o restricción alimentaria?",
        subtitle: "Selecciona tus restricciones o preferencias alimentarias si las tienes.",
        maxSelect: 3,
        options: [
            { label: "Vegetariano/a", value: "vegetariano", category: "alimentacion" },
            { label: "Vegano/a", value: "vegano", category: "alimentacion" },
            { label: "Sin gluten", value: "sin_gluten", category: "alimentacion" },
            { label: "Alérgico/a a mariscos", value: "alergia_mariscos", category: "alimentacion" },
            { label: "Sin azúcar", value: "sin_azucar", category: "alimentacion" },
            { label: "Sin lactosa", value: "sin_lactosa", category: "alimentacion" },
            { label: "Alérgico/a al maní", value: "alergia_mani", category: "alimentacion" },
            { label: "Dieta Keto", value: "keto", category: "alimentacion" }
        ]
    },
    {
        title: "¿Qué tipo de comida te interesa?",
        subtitle: "Selecciona tus preferencias gastronómicas.",
        maxSelect: 7,
        options: [
            { label: "Comida local", value: "comida_local", category: "interes_comida" },
            { label: "Internacional", value: "internacional", category: "interes_comida" },
            { label: "Alta cocina", value: "alta_cocina", category: "interes_comida" },
            { label: "Comida rápida", value: "comida_rapida", category: "interes_comida" },
            { label: "Dulces", value: "dulces", category: "interes_dulces" },
            { label: "Postres", value: "postres", category: "interes_postres" },
            { label: "Café", value: "cafe", category: "interes_bebidas" }
        ]
    },
    {
        title: "¿Cuándo sueles tener tiempo libre?",
        subtitle: "Esto nos ayuda a recomendarte actividades disponibles.",
        maxSelect: 2,
        options: [
            { label: "Mañana (08:00 - 12:00)", value: "manana_08:00_12:00", category: "tiempo_libre" },
            { label: "Tarde (12:00 - 18:00)", value: "tarde_12:00_18:00", category: "tiempo_libre" },
            { label: "Noche (18:00 - 22:00)", value: "noche_18:00_22:00", category: "tiempo_libre" },
            { label: "Fines de semana", value: "fines_de_semana", category: "tiempo_libre" },
            { label: "Entre semana", value: "entre_semana", category: "tiempo_libre" }
        ]
    },
    {
        title: "¿Qué tipo de ambiente prefieres?",
        subtitle: "Escoge el tipo de ambiente ideal para ti.",
        maxSelect: 2,
        options: [
            { label: "Relajado", value: "relajado", category: "ambiente" },
            { label: "Aventura", value: "aventura", category: "ambiente" },
            { label: "Romántico", value: "romantico", category: "ambiente" },
            { label: "Familiar", value: "familiar", category: "ambiente" },
            { label: "Social", value: "social", category: "social" },
            { label: "Cultural", value: "cultural", category: "cultural" }
        ]
    },
    {
        title: "¿Con que frecuencia te gustaría recibir sugerencias?",
        subtitle: "Selecciona la frecuencia con la que te gustaría recibir recomendaciones.",
        maxSelect: 1,
        options: [
            { label: "Diariamente", value: "diariamente", category: "frecuencia_para_recibir_notificaciones" },
            { label: "Semanalmente", value: "semanalmente", category: "frecuencia_para_recibir_notificaciones" },
            { label: "Mensualmente", value: "mensualmente", category: "frecuencia_para_recibir_notificaciones" },
            { label: "Solo cuando hay novedades", value: "cuando_hay_novedades", category: "frecuencia_para_recibir_notificaciones" }
        ]
    }
];
