export interface Exercise {
  id: number;
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
  id: number;
  name?: string;
  exerciseDays?: ExerciseDay[];
}

export interface ExerciseLog {
  id: number;
  date: string;
  exerciseId: number;
  routineId: number;
  dayId: number;
  reps?: number[];
  weight?: number[];
  notes?: string;
}
