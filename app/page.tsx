export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Discover the <span className="text-primary italic">Essence</span> of Luxury
      </h1>
      <p className="text-muted-foreground max-w-2xl text-lg md:text-xl mb-10">
        SER presents an exclusive collection of premium fashion designed for those who appreciate unparalleled elegance and sophisticated minimalism.
      </p>
      <div className="flex gap-4">
        <a 
          href="/shop" 
          className="bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-primary/90 transition-all hover:scale-105"
        >
          Shop Collection
        </a>
        <a 
          href="/new-arrivals" 
          className="border border-border bg-transparent text-foreground px-8 py-4 text-sm font-medium tracking-widest uppercase hover:border-primary transition-all hover:scale-105"
        >
          New Arrivals
        </a>
      </div>
    </div>
  );
}
