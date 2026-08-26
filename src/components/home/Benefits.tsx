import Image from "next/image";
import { getBenefits } from "@/lib/data/benefits";

export function Benefits() {
  const benefits = getBenefits();
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="flex items-center gap-3 rounded-2xl bg-brand-gray-light p-4">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${benefit.iconBgClass}`}>
              <Image src={benefit.icon} alt="" width={28} height={28} className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-black">{benefit.title}</p>
              <p className="text-xs text-brand-gray">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
