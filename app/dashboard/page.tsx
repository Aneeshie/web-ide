import EmptyState from "@/components/ui/empty-state";
import AddNewButton from "@/features/dashboard/components/add-new-button";
import AddRepoButton from "@/features/dashboard/components/add-repo-button";

const Page = () => {
  const playgrounds: any[] = [];
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-2 gap-6 w-full">
        <AddNewButton />
        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No Projects Found."
            description="Create a new project to get started!"
            image="/empty-state.svg"
          />
        ) : (
          // todo add playground table
          <p>Playground table</p>
        )}
      </div>
    </div>
  );
};

export default Page;
