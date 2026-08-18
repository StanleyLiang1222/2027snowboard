import { gallery } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { PhotoSlot } from "../components/PhotoSlot";

export function Gallery() {
  return (
    <SectionContainer tone="light" eyebrow="Memories" title="旅程精選影像">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.map((g) => (
          <figure key={g.slug} className="flex flex-col gap-2">
            <PhotoSlot slug={g.slug} alt={g.caption} aspect="aspect-square" />
            <figcaption className="text-sm text-ash-text">{g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </SectionContainer>
  );
}
