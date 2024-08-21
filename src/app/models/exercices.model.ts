export interface Exercise {
  name: string;
  sets: number[];
  description: string;
}

export interface ExerciseDay {
  day: string;
  exercises: Exercise[];
}