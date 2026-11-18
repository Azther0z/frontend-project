import EquipmentEditor from "@/components/EquipmentEditor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EquipmentEditor equipmentId={id} key={id} />;
}
