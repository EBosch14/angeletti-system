"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoriesColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { CopyIcon, EditIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: CategoriesColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copiado en el portapapeles.");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/${params.store_id}/categories/${data.id}`);
      // router.refresh();
      toast.success("Categoria eliminada exitosamente");
    } catch (error) {
      toast.error(
        "Ups! Algo salio mal, no se pudo eliminar la categoria seleccionado."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0">
            <span className="sr-only">Abrir Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.id)}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            Copiar id
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/categories/${data.id}`)}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
