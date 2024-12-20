"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar/NavBar";
import ModalAgregar from "../components/Modal/ModalAdd";
import {
  FaToilet,
  FaWarehouse,
  FaBuilding,
  FaUtensils,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import { ImOffice } from "react-icons/im";

export default function Home() {
  const [items, setItems] = useState({
    baños: [],
    bodegas: [],
    oficinas: [],
    oficinasconbaño :[],
    comedores: [],
    camarines: [],
    guardias: [],
  });

  const [selectedType, setSelectedType] = useState("");
   const [isAgregarOpen, setIsAgregarOpen] = useState(false);
   const handleCloseAgregar = () => setIsAgregarOpen(false);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/getItems");
      const data = await response.json();

      const groupedItems = data.reduce((acc, item) => {
        if (!acc[item.tipo]) acc[item.tipo] = [];
        acc[item.tipo].push(item);
        return acc;
      }, {});

      setItems({
        baños: groupedItems.baño || [],
        bodegas: groupedItems.bodega || [],
        oficinas: groupedItems.oficina || [],
        oficinasconbaño: groupedItems["oficina con baño"] || [],
        comedores: groupedItems.comedor || [],
        camarines: groupedItems.camarin || [],
        guardias: groupedItems.guardia || [],
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleOpenAgregar = () => setIsAgregarOpen(true);
  useEffect(() => {
    fetchItems();
  }, []);

  const calculateStateCounts = (items, state) => {
    return items
      .filter((item) => item.estado === state)
      .reduce((sum, item) => sum + (item.cantidad || 0), 0); // Sum the "cantidad" field
  };
  
  const renderBlock = (type, items, Icon) => {
    const availableCount = calculateStateCounts(items, "disponible");
    const maintenanceCount = calculateStateCounts(items, "mantencion");
    const occupiedCount = calculateStateCounts(items, "ocupado");
  
    return (
      <div
        key={type}
        className="bg-white rounded-xl shadow-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Icon className="h-8 w-8 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-800">{type}</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4 mt-6 text-center">
          <div>
            <div className="text-2xl font-extrabold text-green-600">
              {availableCount}
            </div>
            <div className="text-sm text-gray-600">Disponible</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-yellow-500">
              {maintenanceCount}
            </div>
            <div className="text-sm text-gray-600">En Mantención</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-500">
              {occupiedCount}
            </div>
            <div className="text-sm text-gray-600">Ocupado</div>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar onAddClick={handleOpenAgregar}  onFilterChange={setSelectedType} />
      
      <ModalAgregar
        isOpen={isAgregarOpen}
        onClose={handleCloseAgregar}
        onSave={async (data) => {
          try {
            const formData = new FormData();
            for (const key in data) {
              formData.append(key, data[key]);
            }

            const response = await fetch("/api/addItem", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) throw new Error("Failed to add item");

            const result = await response.json();
            const newItem = result.data;

            if (newItem.tipo === "baño") setBaños((prev) => [...prev, newItem]);
            if (newItem.tipo === "bodega")
              setBodegas((prev) => [...prev, newItem]);
            if (newItem.tipo === "oficina")
              setOficinas((prev) => [...prev, newItem]);
            if (newItem.tipo === "oficina con baño")
              setOficinasconbaño((prev) => [...prev, newItem]);
            if (newItem.tipo === "camarin")
              setCamarines((prev) => [...prev, newItem]);
            if (newItem.tipo === "comedor")
              setComedores((prev) => [...prev, newItem]);
            if (newItem.tipo === "guardia")
              setGuardias((prev) => [...prev, newItem]);

            handleCloseAgregar();
          } catch (error) {
            console.error(error);
          }
        }}
      />
      <h1 className="text-3xl font-extrabold text-center text-gray-800 my-6">
        Stock de los container
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderBlock("Baños", items.baños, FaToilet)}
        {renderBlock("Bodegas", items.bodegas, FaWarehouse)}
        {renderBlock("Oficinas", items.oficinas, FaBuilding)}
        {renderBlock("Oficinas con baño", items.oficinasconbaño, ImOffice )}
        {renderBlock("Comedores", items.comedores, FaUtensils)}
        {renderBlock("Camarines", items.camarines, FaUsers)}
        {renderBlock("Guardias", items.guardias, FaShieldAlt)}
      </div>
    </div>
  );
}
