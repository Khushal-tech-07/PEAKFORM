import { Category } from '../types';
import { CATEGORY_COVER_MAP } from './productImages';

const RAW_CATEGORIES: Omit<Category, 'imageUrl'>[] = [
  {
    id: 'cardio-machines',
    name: 'Cardio Machines',
    slug: 'cardio-machines',
    description: 'Commercial-grade treadmills, bikes, rowers, and climbers engineered for endurance and high-output metabolic conditioning.',
    icon: 'Activity',
  },
  {
    id: 'free-weights',
    name: 'Free Weights',
    slug: 'free-weights',
    description: 'Precision-machined urethane dumbbells, calibrated Olympic barbells, competition plates, and cast-iron kettlebells.',
    icon: 'Dumbbell',
  },
  {
    id: 'strongman-functional-tools',
    name: 'Strongman & Functional Tools',
    slug: 'strongman-functional-tools',
    description: 'Heavy-duty sandbags, steel clubs, macebells, atlas stone molds, sleds, and prowlers built for raw strength.',
    icon: 'Flame',
  },
  {
    id: 'lower-body-machines',
    name: 'Lower Body Machines',
    slug: 'lower-body-machines',
    description: 'Biomechanical leg presses, hack squats, pendulum squats, hip thrusts, and curl stations designed for maximal hypertrophy.',
    icon: 'Zap',
  },
  {
    id: 'back-chest-machines',
    name: 'Back & Chest Machines',
    slug: 'back-chest-machines',
    description: 'Converging chest presses, divergent lat pulldowns, T-bar rows, and pec fly stations with smooth resistance curves.',
    icon: 'Shield',
  },
  {
    id: 'shoulder-arm-machines',
    name: 'Shoulder & Arm Machines',
    slug: 'shoulder-arm-machines',
    description: 'Dedicated lateral raise machines, preacher curls, tricep extensions, and assisted dip/pull-up systems.',
    icon: 'Target',
  },
  {
    id: 'core-machines',
    name: 'Core Machines',
    slug: 'core-machines',
    description: 'Rotary torso units, roman chairs, reverse hyperextensions, and abdominal crunch stations for trunk stability.',
    icon: 'Disc',
  },
  {
    id: 'multi-station-cable-systems',
    name: 'Multi-Station & Cable Systems',
    slug: 'multi-station-cable-systems',
    description: 'Commercial dual adjustable pulleys, 8-stack jungle gyms, cable crossovers, and 3D Smith machines.',
    icon: 'Layers',
  },
  {
    id: 'racks-cages-stands',
    name: 'Racks, Cages & Stands',
    slug: 'racks-cages-stands',
    description: '11-gauge 3x3" structural steel power racks, squat cages, monolifts, and half racks with laser-cut numbering.',
    icon: 'Box',
  },
  {
    id: 'benches',
    name: 'Benches',
    slug: 'benches',
    description: 'Zero-gap adjustable incline benches, IPF-spec flat benches, Olympic press stations, and preacher benches.',
    icon: 'Maximize2',
  },
  {
    id: 'bodyweight-calisthenics-equipment',
    name: 'Bodyweight & Calisthenics Equipment',
    slug: 'bodyweight-calisthenics-equipment',
    description: 'Wall-mounted pull-up rigs, gymnastics wood rings, parallettes, stall bars, and modular pegboards.',
    icon: 'Award',
  },
  {
    id: 'resistance-mobility-tools',
    name: 'Resistance & Mobility Tools',
    slug: 'resistance-mobility-tools',
    description: 'Continuous loop latex resistance bands, occlusion floss bands, high-density foam rollers, and yoga blocks.',
    icon: 'Sliders',
  },
  {
    id: 'conditioning-plyometrics',
    name: 'Conditioning & Plyometrics',
    slug: 'conditioning-plyometrics',
    description: '3-in-1 soft foam plyo boxes, 50ft braided battle ropes, speed agility ladders, and dual-bearing jump ropes.',
    icon: 'TrendingUp',
  },
  {
    id: 'balance-recovery',
    name: 'Balance & Recovery',
    slug: 'balance-recovery',
    description: 'Heavy-duty exercise mats, anti-burst balance balls, dynamic dome trainers, and solid wood rocker boards.',
    icon: 'Heart',
  },
  {
    id: 'support-gear-accessories',
    name: 'Support Gear & Accessories',
    slug: 'support-gear-accessories',
    description: '10mm lever belts, 7mm neoprene knee sleeves, heavy wrist wraps, magnetic barbell collars, and tactical weight vests.',
    icon: 'ShoppingBag',
  },
];

export const INITIAL_CATEGORIES: Category[] = RAW_CATEGORIES.map((cat) => ({
  ...cat,
  imageUrl:
    CATEGORY_COVER_MAP[cat.id] ||
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
}));
