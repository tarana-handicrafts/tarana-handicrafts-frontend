import Link from "next/link";
import { siteConfig } from "@/lib/constants";

// Plain-text introduction for visitors and search engines: who we are, what we
// make and where. Keep it factual, and link to the matching collections.
export function AboutJaipurCraft() {
  const { address } = siteConfig;
  return (
    <section className="bg-[#F9F8F6] px-4 py-20" aria-labelledby="jaipur-craft-heading">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">Made in Jaipur</span>
          <h2 id="jaipur-craft-heading" className="mb-6 font-serif text-3xl sm:text-4xl">
            Handicrafts from Jaipur, carved by hand
          </h2>
          <div className="space-y-4 leading-relaxed text-stone-600">
            <p>
              Tarana Handicrafts is a Jaipur handicrafts maker specialising in{" "}
              <Link href="/collections/elephants" className="text-[#B8934E] underline-offset-2 hover:underline">wooden elephants</Link>.
              Every piece is hand-carved by artisan families in Rajasthan, from a single block of Kadamb, teak or sheesham wood.
            </p>
            <p>
              Our range includes{" "}
              <Link href="/collections/jaali-elephants" className="text-[#B8934E] underline-offset-2 hover:underline">jaali elephants</Link>{" "}
              with pierced openwork drapes,{" "}
              <Link href="/collections/shikargah-elephants" className="text-[#B8934E] underline-offset-2 hover:underline">shikargah elephants</Link>{" "}
              carved with Rajput hunting scenes, animal and folk{" "}
              <Link href="/collections/figurines" className="text-[#B8934E] underline-offset-2 hover:underline">figurines</Link>,{" "}
              <Link href="/collections/spiritual" className="text-[#B8934E] underline-offset-2 hover:underline">spiritual sculptures</Link>{" "}
              and carved{" "}
              <Link href="/collections/home-decor" className="text-[#B8934E] underline-offset-2 hover:underline">home decor</Link>.
            </p>
          </div>
        </div>
        <div className="space-y-4 leading-relaxed text-stone-600 lg:pt-14">
          <p>
            We sell single pieces for your home and offer{" "}
            <Link href="/rfq" className="text-[#B8934E] underline-offset-2 hover:underline">wholesale and bulk pricing</Link>{" "}
            for shops, interior designers, hotels and corporate gifting. Orders ship across India and worldwide.
          </p>
          <p>
            Looking for wooden handicrafts in Jaipur? We are at {address.street}, {address.city}, {address.region} {address.postalCode}.
            Open {siteConfig.hours}. <Link href="/contact" className="text-[#B8934E] underline-offset-2 hover:underline">Contact us</Link>{" "}
            or message us on WhatsApp at {siteConfig.contact.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
