import Image from 'next/image';

interface HeroSectionProps {
    config: {
        gradient: string;
        title: string;
        subtitle: string;
        desc: string;
        image: string;
        badge: string;
        textGradient: string;
    };
}

export default function HeroSection({ config }: HeroSectionProps) {
    if (!config) return null;

    return (
        <div className="mb-8 relative rounded-2xl overflow-hidden shadow-2xl min-h-[250px] md:min-h-[280px] grid grid-cols-1 md:grid-cols-2 items-center" style={{ background: config.gradient }}>
            {/* Subtle Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>

            {/* Text Content (Left Column) */}
            <div className="p-8 md:pl-12 text-left relative z-20">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-gray-900 text-[10px] font-bold tracking-widest uppercase mb-3 shadow-lg">
                    {config.badge}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
                    {config.title}
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-300 mb-4">
                    <span className={`bg-gradient-to-r ${config.textGradient} bg-clip-text text-transparent font-medium`}>{config.subtitle}</span>
                </p>
                <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                    {config.desc}
                </p>
            </div>

            {/* Image (Right Column) */}
            <div className="h-full w-full flex items-end justify-center md:justify-center relative z-10 pr-0 md:pr-12 pb-0">
                <Image
                    src={config.image}
                    alt={config.title}
                    width={400}
                    height={300}
                    className="object-contain h-64 w-auto drop-shadow-2xl translate-y-2"
                    priority
                />
            </div>
        </div>
    );
}
