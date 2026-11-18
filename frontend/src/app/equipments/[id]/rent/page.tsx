import RentalCreatePage from "@/components/RentalCreatePage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RentalCreatePage equipmentId={id} />;
}
