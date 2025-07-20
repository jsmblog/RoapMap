import {
    logoLinkedin, logoGithub
} from "ionicons/icons";
import photoGimbly from "/photoGimbly.webp"

export const InfoApp = {
    info: {
        logo: "",
        name: "RoadMap",
        version: "1.0.0",
        AcercaDelProyecto: "RoadMap es una aplicacion hibrida es decir para Android/Web/IOS creada especialmente facilitar descubrir lugares, eventos cercanos según tu ubicación, preferencias y tiempo disponible. Es Ideal para viajeros y locales"
    },
    licencia: {
        title: "Licencia",
        description: " Esta aplicación fue desarrollada como parte de un proyecto académico para la asignatura Desarrollo de Aplicaciones Móviles.Su uso es educativo y no comercial."
    },
}

export const creditos = [
    {
        photo: "",
        name: "Jefferson Joel Saldarriga Mera",
        contacto: {
            linkedin: {
                icon: logoLinkedin,
                url: "none"
            },
            github: {
                icon:logoGithub,
                url: "none"
            },
        },
        portafolio: "",
        desarrollo: "FrontEnd - BackEnd - Logica de Recomendación"
    },
    {
        photo: photoGimbly,
        name: "María Salomé Loor Vélez",
        contacto: {
            linkedin: {
                icon: logoLinkedin,
                url: "none"
            },
            github: {
                icon:logoGithub,
                url: "none"
            },
        },
        portafolio: "none",
        desarrollo: "FrontEnd - Diseño UI/UX"
    }
]