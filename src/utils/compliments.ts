export const COMPLIMENT_HEADLINES = [
  'Task Completed!',
  'Victory Logged!',
  'Crushed It!',
  'Boom! Finished!',
  'Momentum Master!',
  'Goal Smashed!',
  'High-Value Win!',
  'Outstanding Follow-Through!'
];

export const COMPLIMENT_LIST = [
  'Incredible focus! You powered through and made real, measurable progress today.',
  'Look at that momentum! Consistency is your superpower and it’s paying off.',
  'Outstanding execution! You tackled this with discipline and pure craftsmanship.',
  'Spot on! That’s another high-impact victory safely locked in the books.',
  'Brilliant follow-through! Your future self is thanking you right now.',
  'Unstoppable rhythm! Knocking out tasks like this is how big goals are achieved.',
  'Pure efficiency! You set the plan, stayed focused, and crushed it.',
  'Victory logged! Take pride in this step forward — you’re having a stellar day.',
  'Fantastic energy! Keep riding this positive wave of accomplishment.',
  'Masterful productivity! One less item on your mind and more freedom in your day.'
];

export function getRandomCompliment(taskTitle: string) {
  const headline = COMPLIMENT_HEADLINES[Math.floor(Math.random() * COMPLIMENT_HEADLINES.length)];
  const compliment = COMPLIMENT_LIST[Math.floor(Math.random() * COMPLIMENT_LIST.length)];

  return {
    id: `comp-${Date.now()}`,
    headline,
    compliment,
    taskTitle
  };
}
