
import { ScienceModule, ScienceModuleConfig } from './types';

export const MODULES: ScienceModuleConfig = {
  [ScienceModule.ATOM]: {
    id: ScienceModule.ATOM,
    title: "Atom & Subatomic Particles",
    description: "Explore the building blocks of matter: Protons, Neutrons, and Electrons.",
    lectureText: "Welcome to the Quantum Holo-Deck! I'm your Science Teacher, and today, we are going to shrink down—way down—past the cells, past the molecules, until we are standing right in front of the building blocks of the entire universe. Look around! See those shimmering spheres? Those are Protons and Neutrons, held together by the strong nuclear force. The tiny blue streaks orbiting them? Those are Electrons, moving at incredible speeds!",
    color: "#06b6d4",
    quiz: [
      { question: "What particles are found in the nucleus of an atom?", options: ["Electrons only", "Protons and Neutrons", "Photons", "Neutrinos"], correctAnswer: 1 },
      { question: "Which force holds the nucleus together?", options: ["Gravity", "Electromagnetic force", "Strong nuclear force", "Friction"], correctAnswer: 2 },
      { question: "Electrons carry which type of charge?", options: ["Positive", "Neutral", "Negative", "Variable"], correctAnswer: 2 }
    ]
  },
  [ScienceModule.NEWTON_LAWS]: {
    id: ScienceModule.NEWTON_LAWS,
    title: "Newton's Second Law",
    description: "Force equals mass times acceleration (F=ma). Observe objects in motion.",
    lectureText: "Hello students! Let's talk about force. Isaac Newton discovered that if you push an object, its speed changes depending on how heavy it is. In this simulation, you can see how different masses react to the same force. Larger masses accelerate slower! It's all about that elegant equation: F equals M A.",
    color: "#8b5cf6",
    quiz: [
      { question: "In F=ma, what does 'm' stand for?", options: ["Movement", "Mass", "Magnetism", "Momentum"], correctAnswer: 1 },
      { question: "If force increases and mass stays the same, what happens to acceleration?", options: ["It decreases", "It stays the same", "It increases", "It stops"], correctAnswer: 2 },
      { question: "Who formulated the Second Law of Motion?", options: ["Albert Einstein", "Marie Curie", "Isaac Newton", "Charles Darwin"], correctAnswer: 2 }
    ]
  },
  [ScienceModule.SOLAR_SYSTEM]: {
    id: ScienceModule.SOLAR_SYSTEM,
    title: "Orbital Mechanics",
    description: "Understand gravity and how celestial bodies interact in space.",
    lectureText: "Gravity is the invisible glue of the universe. Watch how the Earth orbits the Sun. Without enough speed, it would crash into the center; without enough gravity, it would fly off into the void. It is a perfect, delicate celestial dance balance.",
    color: "#f59e0b",
    quiz: [
      { question: "What force keeps the Earth in orbit around the Sun?", options: ["Centrifugal force", "Gravity", "Magnetism", "Air resistance"], correctAnswer: 1 },
      { question: "What would happen if Earth had no orbital speed?", options: ["It would float away", "It would stay still", "It would fall into the Sun", "It would spin faster"], correctAnswer: 2 },
      { question: "The Sun contains approximately how much of the solar system's mass?", options: ["10%", "50%", "99%", "75%"], correctAnswer: 2 }
    ]
  },
  [ScienceModule.MOLECULAR_BONDING]: {
    id: ScienceModule.MOLECULAR_BONDING,
    title: "Ionic Bonding: NaCl",
    description: "Observe how Sodium and Chlorine form Table Salt through electron transfer.",
    lectureText: "Look closely! This is Sodium Chloride, common table salt. Unlike covalent bonds where atoms share, here we have an Ionic Bond. The Sodium atom has GIVEN AWAY an electron to the Chlorine atom. Now, Sodium is positively charged, and Chlorine is negatively charged. Like powerful magnets, their opposite charges pull them together in a strong electrostatic attraction. This is the foundation of the crystal lattice!",
    color: "#10b981",
    quiz: [
      { question: "What type of bond is found in Sodium Chloride (NaCl)?", options: ["Covalent Bond", "Ionic Bond", "Metallic Bond", "Hydrogen Bond"], correctAnswer: 1 },
      { question: "In this bond, what does the Sodium atom do with its electron?", options: ["Shares it", "Gives it away", "Takes another", "Destroys it"], correctAnswer: 1 },
      { question: "Why do the Na+ and Cl- ions stay together?", options: ["Glue", "Gravity", "Electrostatic attraction", "Suction"], correctAnswer: 2 }
    ]
  },
  [ScienceModule.DNA_STRUCTURE]: {
    id: ScienceModule.DNA_STRUCTURE,
    title: "Genetics & The Double Helix",
    description: "Discover the blueprint of life encoded in DNA, chromosomes, and cells.",
    lectureText: "Step into the microscopic world! This twisted ladder is DNA, the blueprint of all life. But notice how it doesn't just float around loosely—it tightly coils itself into these large 'X' shapes called Chromosomes. This allows massive amounts of data to fit inside tiny spaces. And look behind you: those red discs are Blood Cells. Every living thing is built from these incredible biological blueprints!",
    color: "#ec4899",
    quiz: [
      { question: "What shape is the DNA molecule?", options: ["Circle", "Triple helix", "Double helix", "Square ladder"], correctAnswer: 2 },
      { question: "DNA coils tightly to form which X-shaped structure?", options: ["Ribosome", "Chromosome", "Mitochondria", "Cell Wall"], correctAnswer: 1 },
      { question: "What are the basic 'rungs' of the DNA ladder called?", options: ["Bones", "Sugar pairs", "Base pairs", "Proteins"], correctAnswer: 2 }
    ]
  },
  [ScienceModule.MAGNETISM]: {
    id: ScienceModule.MAGNETISM,
    title: "Magnetic Fields",
    description: "Visualize the invisible forces surrounding magnets.",
    lectureText: "Magnetism is a force that acts at a distance. Even though you can't see these field lines with your eyes, they are always there. Notice how the lines flow from the North pole to the South pole. This same principle allows compasses to work and protects our Earth from solar radiation via our magnetic shield.",
    color: "#ef4444",
    quiz: [
      { question: "Magnetic field lines flow from which pole to which?", options: ["S to N", "N to S", "W to E", "Inside out"], correctAnswer: 1 },
      { question: "Can you see magnetic field lines with the naked eye?", options: ["Yes, always", "Only at night", "No, they are invisible", "Only if it's cold"], correctAnswer: 2 },
      { question: "What is Earth's natural magnetic shield called?", options: ["Ozone layer", "Magnetosphere", "Atmosphere", "Hydrosphere"], correctAnswer: 1 }
    ]
  },
  [ScienceModule.PHOTOSYNTHESIS]: {
    id: ScienceModule.PHOTOSYNTHESIS,
    title: "Photosynthesis & Growth",
    description: "How plants convert sunlight into chemical energy for growth.",
    lectureText: "Plants are nature's solar power plants. Observe how the photons—light rays from the sun—strike the leaves. This energy triggers a chemical reaction that creates glucose. As the plant absorbs more light, it uses that energy to build its structure, growing from a tiny sprout into a full-grown plant. Sunlight literally becomes the building blocks of life!",
    color: "#22c55e",
    quiz: [
      { question: "Which organelle is responsible for photosynthesis?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Vacuole"], correctAnswer: 2 },
      { question: "What energy source powers plant growth?", options: ["Wind", "Sunlight", "Static electricity", "Gravity"], correctAnswer: 1 },
      { question: "Photosynthesis converts CO2 and water into what?", options: ["Oxygen and Sugar", "Salt", "Carbon", "Nitrogen"], correctAnswer: 0 }
    ]
  },
  [ScienceModule.SOUND_WAVES]: {
    id: ScienceModule.SOUND_WAVES,
    title: "Sound, Vibrations & Speed",
    description: "Visualize how sound travels through air and its incredible speed.",
    lectureText: "Sound is a mechanical wave. When this tuning fork vibrates, it pushes air molecules, creating ripples of pressure that travel outward. Did you know that sound travels at about 343 meters per second in air? That's over 1,200 kilometers per hour! It's fast, but still much slower than light, which is why you see lightning before you hear thunder.",
    color: "#38bdf8",
    quiz: [
      { question: "Sound travels through which type of wave?", options: ["Transverse", "Longitudinal", "Electromagnetic", "Static"], correctAnswer: 1 },
      { question: "What is the approximate speed of sound in air?", options: ["10 m/s", "100 m/s", "343 m/s", "300,000 km/s"], correctAnswer: 2 },
      { question: "Which travels faster: Light or Sound?", options: ["Sound", "Light", "They are equal", "Neither"], correctAnswer: 1 }
    ]
  },
  [ScienceModule.ANIMALIA]: {
    id: ScienceModule.ANIMALIA,
    title: "Kingdom: Animalia",
    description: "Explore the complex structures and behaviors of animals with scientific classification.",
    lectureText: "Welcome to the Biological Wing! Kingdom Animalia is incredibly diverse. To keep track of millions of species, scientists use 'Binomial Nomenclature'—giving every animal a two-part Latin name. Look at these holographic specimens: the Moon Jellyfish, or *Aurelia aurita*, which pulsates with primitive muscles; the Great White Shark, *Carcharodon carcharias*, an apex predator of the ocean; and the Honey Bee, *Apis mellifera*, which shows complex social structure. All these creatures share one thing: they are multicellular organisms that must find their own food!",
    color: "#f472b6",
    quiz: [
      { question: "What is the scientific naming system called?", options: ["Common Naming", "Latin Listing", "Binomial Nomenclature", "Biological ID"], correctAnswer: 2 },
      { question: "Which animal shown is the 'Apis mellifera'?", options: ["The Shark", "The Jellyfish", "The Honey Bee", "The Lion"], correctAnswer: 2 },
      { question: "Animals are 'heterotrophs', which means they...", options: ["Make their own food", "Must consume organic material", "Can live without air", "Are made of one cell"], correctAnswer: 1 }
    ]
  },
  [ScienceModule.PLANTAE]: {
    id: ScienceModule.PLANTAE,
    title: "Kingdom: Plantae",
    description: "Explore diverse plant life, from forest titans to carnivorous predators.",
    lectureText: "Welcome to the Botanical Lab! Kingdom Plantae includes over 300,000 species of autotrophs—organisms that build their own food using sunlight. We use binomial nomenclature to classify them as well. Observe our holographic garden: the English Oak (*Quercus robur*), a titan of the forest; the Venus Flytrap (*Dionaea muscipula*), showcasing a unique carnivorous adaptation; and the Western Sword Fern (*Polystichum munitum*), representing ancient vascular lineages. Every green part you see contains chlorophyll, the magic engine of our planet!",
    color: "#4ade80",
    quiz: [
      { question: "What is the scientific name for the Venus Flytrap?", options: ["Quercus robur", "Dionaea muscipula", "Apis mellifera", "Aurelia aurita"], correctAnswer: 1 },
      { question: "Which plant specimen represents an ancient vascular lineage?", options: ["The Oak Tree", "The Fern", "The Flytrap", "The Rose"], correctAnswer: 1 },
      { question: "Plants are 'autotrophs' because they build food from...?", options: ["Other insects", "Sunlight and CO2", "Soil alone", "Rain water"], correctAnswer: 1 }
    ]
  }
};
