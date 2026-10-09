import { Building } from '../types';

export const buildingsData: Building[] = [
  {
    id: 'architecture-moondys',
    name: 'Architecture Moondys',
    subtitle: 'Kalicaah Commercial Zone',
    zone: 'Kalicaah Commercial Zone',
    buildingArea: '320m²',
    landArea: '600m²',
    floor: '10 Floor',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset\'s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    ],
    viewerPath: '/viewers/loox-ostrowo/small.html',
    mapPosition: { x: -0.5, y: 0.0, z: -3.8 },
    mapRotation: { x: 0, y: 0.0, z: 0 },
    mapScale: 1.0,
  },
  {
    id: 'reading-room',
    name: 'Kalicaah Reading Pavilion',
    subtitle: 'Kalicaah Cultural & Creative Zone',
    zone: 'Kalicaah Cultural & Creative Zone',
    buildingArea: '210m²',
    landArea: '450m²',
    floor: '2 Floor',
    description:
      'Tranquil architectural reading pavilion blending warm timber elements with open-air terrace spaces, designed for creative co-working, curated libraries, and boutique retreat experiences. Nestled within lush coastal greenery with natural ventilation and reading verandas.',
    heroImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    ],
    viewerPath: '/viewers/reading-room/small.html',
    mapPosition: { x: -8.5, y: 0.0, z: -14.0 },
    mapRotation: { x: 0, y: 0.25, z: 0 },
    mapScale: 0.9,
  },
  {
    id: 'utlida-residence',
    name: 'Utlida 180 Premium Villa',
    subtitle: 'Tanjung Lesung Waterfront Sanctuary',
    zone: 'Tanjung Lesung Waterfront Sanctuary',
    buildingArea: '180m²',
    landArea: '380m²',
    floor: '3 Floor',
    description:
      'Ultra-luxury coastal private villa residence offering seamless indoor-outdoor living, infinity plunge pool, and elevated sundeck oriented toward the Sunda Strait horizon. Features expansive glass curtain walls and private ocean-view cabana terraces.',
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    ],
    viewerPath: '/viewers/utlida-180/small.html',
    mapPosition: { x: 9.5, y: 0.0, z: -11.5 },
    mapRotation: { x: 0, y: -0.3, z: 0 },
    mapScale: 1.1,
  },
];

export function getBuildingById(id: string): Building | undefined {
  return buildingsData.find((b) => b.id === id);
}
