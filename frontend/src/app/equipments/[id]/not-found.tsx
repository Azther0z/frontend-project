import Link from "next/link";

export default function EquipmentNotFound() {
  return <section className="content-medium">
    <h1>Equipment not found</h1>
    <p>This equipment is no longer available in the catalog.</p>
    <Link href="/equipments">Back to equipment</Link>
  </section>;
}
