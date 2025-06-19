export const RATING_COLORS = {
  NEWBIE: '#808080',
  PUPIL: '#008000',
  SPECIALIST: '#03A89E',
  EXPERT: '#0000FF',
  CANDIDATE_MASTER: '#AA00AA',
  MASTER: '#FF8C00',
  INTERNATIONAL_MASTER: '#FF8C00',
  GRANDMASTER: '#FF0000',
  INTERNATIONAL_GRANDMASTER: '#FF0000',
  LEGENDARY_GRANDMASTER: '#FF0000'
};

export const getRatingColor = (rating: number): string => {
  if (rating < 1200) return RATING_COLORS.NEWBIE;
  if (rating < 1400) return RATING_COLORS.PUPIL;
  if (rating < 1600) return RATING_COLORS.SPECIALIST;
  if (rating < 1900) return RATING_COLORS.EXPERT;
  if (rating < 2100) return RATING_COLORS.CANDIDATE_MASTER;
  if (rating < 2300) return RATING_COLORS.MASTER;
  if (rating < 2400) return RATING_COLORS.INTERNATIONAL_MASTER;
  if (rating < 2600) return RATING_COLORS.GRANDMASTER;
  if (rating < 3000) return RATING_COLORS.INTERNATIONAL_GRANDMASTER;
  return RATING_COLORS.LEGENDARY_GRANDMASTER;
};

export const getRatingTitle = (rating: number): string => {
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2300) return 'Master';
  if (rating < 2400) return 'International Master';
  if (rating < 2600) return 'Grandmaster';
  if (rating < 3000) return 'International Grandmaster';
  return 'Legendary Grandmaster';
};

export const FILTER_OPTIONS = {
  CONTEST_HISTORY: [
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 365 days', value: 365 }
  ],
  PROBLEM_SOLVING: [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 }
  ]
};