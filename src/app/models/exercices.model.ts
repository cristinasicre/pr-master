export interface Exercise {
  name: string;
  sets: string[];
  description: string;
  RIR: string;
  external_link?: string;
}

export interface ExerciseDay {
  id: number;
  day: string;
  exercises: Exercise[];
}

export interface Routine {
  id?: number;
  name?: string;
  exerciseDays?: ExerciseDay[];
}
