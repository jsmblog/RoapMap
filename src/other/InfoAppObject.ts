import {
  logoLinkedin,
  logoGithub
} from "ionicons/icons";
import photoGimbly from "/photoGimbly.webp";
import gimblyJoel from "/gimblyJoel.webp";

export const InfoApp = {
  info: {
    logo: "",
    name: "RoadMap",
    version: "1.0.0",
  },
  licencia: {
    title: "infoApp.licenseTitle",
    description: "infoApp.licenseDescription",
  },
};

export const creditos = [
  {
    photo: gimblyJoel,
    name: "Jefferson Joel Saldarriga Mera",
    contacto: {
      linkedin: {
        icon: logoLinkedin,
        url: "https://www.linkedin.com/in/jefferson-m-8194a8360/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      github: {
        icon: logoGithub,
        url: "https://github.com/jsmblog",
      },
    },
    portafolio: "",
    desarrollo: "FrontEnd - BackEnd - Logica de Recomendación",
    roleKey: "jeff",
  },
  {
    photo: photoGimbly,
    name: "María Salomé Loor Vélez",
    contacto: {
      linkedin: {
        icon: logoLinkedin,
        url: "https://www.linkedin.com/in/salome-loor-717587318/",
      },
      github: {
        icon: logoGithub,
        url: "https://github.com/SalomeLoor",
      },
    },
    portafolio: "none",
    desarrollo: "FrontEnd - Diseño UI/UX",
    roleKey: "salome",
  },
];
