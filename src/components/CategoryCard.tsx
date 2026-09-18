import { Link } from 'react-router-dom';
import {
  Activity,
  Dumbbell,
  Flame,
  Zap,
  Shield,
  Target,
  Disc,
  Layers,
  Box,
  Maximize2,
  Award,
  Sliders,
  TrendingUp,
  Heart,
  ShoppingBag,
  ArrowUpRight,
  LucideIcon,
} from 'lucide-react';
import { Category } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Dumbbell,
  Flame,
  Zap,
  Shield,
  Target,
  Disc,
  Layers,
  Box,
  Maximize2,
  Award,
  Sliders,
  TrendingUp,
  Heart,
  ShoppingBag,
};

interface CategoryCardProps {
  category: Category;
  count?: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  const IconComponent = ICON_MAP[category.icon] || Dumbbell;

  return (
    <Link
      to={`/category/${category.slug}`}
      id={`cat-card-${category.slug}`}
      className="group relative bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-amber-400/5 hover:-translate-y-1"
    >
      {/* Category Image Preview Header */}
      {category.imageUrl && (
        <div className="relative w-full h-28 overflow-hidden bg-zinc-950">
          <img
            src={category.imageUrl}
            alt={category.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-95"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 left-3.5 w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-700/80 group-hover:border-amber-400/80 text-amber-400 flex items-center justify-center backdrop-blur-sm shadow-md transition-all">
            <IconComponent className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="absolute top-2.5 right-2.5 text-zinc-400 group-hover:text-amber-400 transition-colors p-1 rounded-full bg-zinc-950/70 border border-zinc-800">
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {!category.imageUrl && (
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/60 text-amber-400 flex items-center justify-center">
                <IconComponent className="w-5 h-5 stroke-[2]" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
          )}

          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">
            {category.name}
          </h3>
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-mono font-medium text-[11px]">
            {count !== undefined ? `${count} Equipment Models` : 'View Range'}
          </span>
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] group-hover:underline">
            Explore
          </span>
        </div>
      </div>
    </Link>
  );
}
