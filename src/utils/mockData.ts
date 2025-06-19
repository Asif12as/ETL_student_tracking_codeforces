// This file is now deprecated - all data should come from the database
// Keeping only the avatar generation function for new students

export const generateRandomAvatar = (): string => {
  const avatars = [
    'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ];
  
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Deprecated functions - remove these imports from other files
export const generateMockStudents = () => [];
export const generateMockContests = () => [];
export const generateMockProblems = () => [];
export const generateSubmissionActivity = () => [];