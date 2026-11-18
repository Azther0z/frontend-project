import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import EquipmentActions from "@/components/EquipmentActions";
import { ErrorMessage } from "@/components/Feedback";
import { ApiError, equipmentApi, errorMessage } from "@/libs/api";
import { authOptions } from "@/libs/auth";
import { money } from "@/libs/rental-cost";

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, session] = await Promise.all([
    equipmentApi.get(id).then((item) => ({ item, error: null }))
      .catch((error: unknown) => ({ item: null, error })),
    getServerSession(authOptions),
  ]);
  if (result.error instanceof ApiError && result.error.status === 404) notFound();
  if (!result.item) return <ErrorMessage>{errorMessage(result.error)}</ErrorMessage>;
  const item = result.item;

  return (
    <section className="content-medium">
      <h1>{item.name}</h1>
      <div className="detail-panel">
        <p>{item.description}</p>
        <p>Category: {item.category}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Rental Rate: ฿{money(item.rentalRate)} / day</p>
      </div>
      <EquipmentActions equipmentId={item._id} role={session?.user.role ?? null} variant="detail" />
    </section>
  );
}
