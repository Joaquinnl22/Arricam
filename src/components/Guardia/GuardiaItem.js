import { FaTrash } from "react-icons/fa";

export default function GuardiaItem({ guardia, onEdit, onDelete }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-300"
      onClick={() => onEdit(guardia)}
    >
      {guardia.imagen && (
        <img
          src={guardia.imagen} // URL de la imagen
          alt={guardia.title} // Texto alternativo con el título
          className="w-full h-40 object-cover rounded-md mb-4" // Estilo de la imagen
        />
      )}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">{guardia.title}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            guardia.estado === "disponible"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {guardia.estado === "disponible" ? "Disponible" : "Ocupado"}
        </span>
        {/* Icono de basura */}
        <FaTrash
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Evitar la propagación al contenedor
            onDelete(guardia); // Abrir el modal de eliminación
          }}
        />
      </div>
      <p className="text-gray-600 mb-1">{guardia.descripcion}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-500">Cantidad:</p>
        <span className="text-lg font-semibold text-gray-700">
          {guardia.cantidad}
        </span>
      </div>
    </div>
  );
}
