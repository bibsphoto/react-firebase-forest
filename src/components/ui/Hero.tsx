import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Bienvenue sur Squirel EYES
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            La solution de supervision de sites web par Squirel by SNCF. Surveillez la disponibilité de vos applications en temps réel.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" className="bg-accent hover:bg-accent-hover">
              Commencer la supervision
            </Button>
            <Button variant="outline" size="lg" className="text-primary hover:text-primary-hover">
              Découvrir Squirel EYES
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-xl bg-primary/5 p-2 ring-1 ring-inset ring-primary/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="h-[300px] w-[500px] rounded-lg bg-primary-light shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};