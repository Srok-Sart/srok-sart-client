"use client";
import React, { useEffect, useState } from "react";
import { Material } from "@/app/interfaces/material";
import AddNewMaterial from "./add-new-material";
import EditMaterial from "./edit-material";
import { HeaderSection } from "./header-section";
import { MaterialsTable } from "./materials-table";

const Materials = ({ activeTab }: { activeTab: string }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewMaterial, setShowAddNewMaterial] = useState(false);
  const [showEditMaterial, setShowEditMaterial] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
        if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
        
        const data: Material[] = await res.json();
        if (Array.isArray(data)) {
          const sortedMaterials = data.sort((a, b) => a.id - b.id);
          setMaterials(sortedMaterials);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    const sortedMaterials = [...materials].sort((a, b) => {
      return option === "ID Ascending" ? a.id - b.id : b.id - a.id;
    });
    setMaterials(sortedMaterials);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`Failed to delete material: ${res.statusText}`);
      setMaterials(materials.filter((material) => material.id !== id));
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleEdit = (id: number) => {
    setEditMaterialId(id);
    setShowEditMaterial(true);
  };

  const handleAddNewMaterial = (newMaterial: Material) => {
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
  };

  const handleUpdateMaterial = (updatedMaterial: Material) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) => (material.id === updatedMaterial.id ? updatedMaterial : material))
    );
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddNewMaterial) {
    return <AddNewMaterial setShowAddNewMaterial={setShowAddNewMaterial} onAddNewMaterial={handleAddNewMaterial} />;
  }

  if (showEditMaterial && editMaterialId !== null) {
    return <EditMaterial setShowEditMaterial={setShowEditMaterial} onUpdateMaterial={handleUpdateMaterial} id={editMaterialId} />;
  }

  return (
    <div className='p-4'>
      <HeaderSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        handleSortChange={handleSortChange}
        setShowAddNewMaterial={setShowAddNewMaterial}
      />
      {filteredMaterials.length === 0 ? (
        <p>No materials available.</p>
      ) : (
        <MaterialsTable
          materials={filteredMaterials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Materials;