import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";

export default function Icono({ name, size = 24, color = "black" }) {
  // Primero intenta encontrar el icono en la librería FaIcons
  let IconComponent = FaIcons[name];

  // Si no lo encuentra, intenta con GiIcons
  if (!IconComponent) {
    IconComponent = GiIcons[name];
  }

  // Si no lo encuentra en ninguna de las dos
  if (!IconComponent) {
    return <span>⚠️ Icono no encontrado</span>;
  }

  return <IconComponent size={size} color={color} />;
}
