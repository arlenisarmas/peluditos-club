import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { HeartIcon, PawIcon, PawPrintTrail, SparkleIcon } from "@/components/ui/Decorations";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-sky/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div className="relative z-10 text-center lg:text-left">
          <PawIcon className="absolute -left-2 -top-8 hidden h-10 w-10 text-brand-sky lg:block" />
          <h1 className="font-sans text-4xl font-extrabold leading-[1.08] text-brand-black sm:text-5xl lg:text-6xl">
            Todo para
            <br />
            consentir a
            <br />
            <span className="relative inline-flex items-center gap-2 text-brand-yellow">
              tu peludito
              <HeartIcon className="hidden h-7 w-7 text-brand-coral sm:inline-block" filled={false} />
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-brand-gray sm:text-lg lg:mx-0">
            Productos de calidad para su felicidad y bienestar todos los días.
          </p>
          <div className="mt-6">
            <ButtonLink href="/tienda" className="text-base">
              Ver productos
              <PawIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto h-[85%] w-[85%] translate-y-6 rounded-full bg-brand-yellow" />
          <SparkleIcon className="absolute right-4 top-2 h-6 w-6 text-brand-yellow lg:right-10" />
          <PawPrintTrail className="absolute -bottom-2 left-0 hidden h-12 w-32 text-brand-sky sm:block" />
          <div className="relative flex items-end justify-center gap-2">
            <Image
              src="/images/dogs/hero-golden-retriever.png"
              alt="Golden Retriever adulto sonriendo"
              width={520}
              height={720}
              priority
              className="h-auto w-[62%] max-w-sm object-contain drop-shadow-xl"
            />
            <Image
              src="/images/dogs/hero-doodle-cream.png"
              alt="Perro doodle color crema"
              width={420}
              height={580}
              priority
              className="h-auto w-[42%] max-w-[220px] object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
