import RentalEditPage from "@/components/RentalEditPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RentalEditPage rentalId={id} />;
}
