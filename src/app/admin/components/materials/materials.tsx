"use client";
import { Material } from "@/app/interfaces/material";
import React, { useEffect, useState } from "react";
import AddNewMaterial from "./add-new-material";
import EditMaterial from "./edit-material";
import { HeaderSection } from "./header-section";
import { MaterialsTable } from "./materials-table";

interface MaterialsProps {
  activeTab: string;
  token: string;
}

const Materials = ({ token }: MaterialsProps) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ID Ascending");
  const [showAddNewMaterial, setShowAddNewMaterial] = useState(false);
  const [showEditMaterial, setShowEditMaterial] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materials`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          }
          throw new Error(`Failed to fetch materials: ${res.statusText}`);
        }

        const data: Material[] = await res.json();
        if (Array.isArray(data)) {
          const sortedMaterials = data.sort((a, b) => a.id - b.id);
          setMaterials(sortedMaterials);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error fetching materials";
        setError(errorMessage);
        console.error("Error fetching materials:", error);
      }
    };

    if (token) {
      fetchMaterials();
    } else {
      setError("Authentication token is missing");
    }
  }, [token]);

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
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        throw new Error(`Failed to delete material: ${res.statusText}`);
      }
      setMaterials(materials.filter((material) => material.id !== id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting material";
      setError(errorMessage);
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
      prevMaterials.map((material) =>
        material.id === updatedMaterial.id ? updatedMaterial : material
      )
    );
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddNewMaterial) {
    return (
      <AddNewMaterial
        setShowAddNewMaterial={setShowAddNewMaterial}
        onAddNewMaterial={handleAddNewMaterial}
        token={token}
      />
    );
  }

  if (showEditMaterial && editMaterialId !== null) {
    return (
      <EditMaterial
        setShowEditMaterial={setShowEditMaterial}
        onUpdateMaterial={handleUpdateMaterial}
        id={editMaterialId}
        token={token}
      />
    );
  }

  if (error) {
    return (
      <div className='p-4 text-red-500'>
        <p>{error}</p>
        {error.includes("Unauthorized") && (
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-primary text-white rounded-md'
          >
            Refresh Page
          </button>
        )}
      </div>
    );
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
