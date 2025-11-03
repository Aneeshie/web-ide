"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import TemplateSelectionModal from "@/features/dashboard/components/template-selection-modal";
import {createPlayground} from "@/features/dashboard/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const AddNewButton = () => {

  const [isModalOpen, setIsModalOpen] =useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACTJS" | "NEXTJS" | "EXPRESSJS" | "VUE" | "HONO"| "ANGULAR";
    description?: string;
  } | null>(null)

  const router = useRouter()

  const handleSubmit = async (data: {
    title: string;
    template: "REACTJS" | "NEXTJS" | "EXPRESSJS" | "VUE" | "HONO"| "ANGULAR";
    description?: string;
  } ) => {
    setSelectedTemplate(data);
    const res = await createPlayground(data);
    toast.success("Playground created successfully.");

    setIsModalOpen(false);
    router.push(`/playground/${res?.id}`)
  }


  return (
    <>
    <div
      onClick={() => setIsModalOpen(true)}
      className="group relative px-6 py-6 flex flex-row justify-between items-center rounded-xl border border-border bg-muted/70 cursor-pointer
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F]/60 hover:scale-[1.015]
        shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(233,63,63,0.18)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E93F3F]/40
        hover:ring-2 hover:ring-[#E93F3F]/30"
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-center items-start gap-4">
        <Button
          variant={"outline"}
          className="flex h-12 w-12 justify-center items-center rounded-lg bg-background/90 border-border text-foreground
            transition-all duration-300
            group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F]
            group-active:scale-[0.98]"
          size={"icon"}
        >
          <Plus
            size={28}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
            Add New
          </h1>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            Create a new playground
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <Image
          src={"/add-new.svg"}
          alt="Create new playground"
          width={120}
          height={120}
          className="opacity-95 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      {/* Decorative gradient glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(233,63,63,0.18)_0%,rgba(233,63,63,0)_70%)]
        blur-sm transition-opacity duration-300 opacity-70 group-hover:opacity-100"
      />
    </div>
      <TemplateSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit}/>
    </>
  );
};

export default AddNewButton;
