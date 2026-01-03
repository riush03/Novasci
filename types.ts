
export enum ScienceModule {
  ATOM = 'ATOM',
  NEWTON_LAWS = 'NEWTON_LAWS',
  SOLAR_SYSTEM = 'SOLAR_SYSTEM',
  MOLECULAR_BONDING = 'MOLECULAR_BONDING',
  DNA_STRUCTURE = 'DNA_STRUCTURE',
  MAGNETISM = 'MAGNETISM',
  PHOTOSYNTHESIS = 'PHOTOSYNTHESIS',
  SOUND_WAVES = 'SOUND_WAVES',
  ANIMALIA = 'ANIMALIA',
  PLANTAE = 'PLANTAE'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ModuleData {
  id: ScienceModule;
  title: string;
  description: string;
  lectureText: string;
  color: string;
  quiz: QuizQuestion[];
}

export interface ScienceModuleConfig {
  [key: string]: ModuleData;
}
