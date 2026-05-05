/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Subject {
  id: string;
  name: string;
  board: 'cambridge' | 'sindh';
  isRTL?: boolean;
}

export interface SubjectQuiz extends Subject {
  questions: Question[];
}

export const CAMBRIDGE_SUBJECTS: Subject[] = [
  { id: 'C-4024', name: 'Mathematics', board: 'cambridge' },
  { id: 'C-5054', name: 'Physics', board: 'cambridge' },
  { id: 'C-5070', name: 'Chemistry', board: 'cambridge' },
  { id: 'C-5090', name: 'Biology', board: 'cambridge' },
  { id: 'C-2210', name: 'Computer Science', board: 'cambridge' },
  { id: 'C-1123', name: 'English', board: 'cambridge' },
  { id: 'C-2058', name: 'Islamiyat', board: 'cambridge' },
  { id: 'C-3248', name: 'Urdu', board: 'cambridge', isRTL: true },
  { id: 'C-2059', name: 'Pakistan Studies', board: 'cambridge' },
  { id: 'C-7115', name: 'Business Studies', board: 'cambridge' },
  { id: 'C-2281', name: 'Economics', board: 'cambridge' },
  { id: 'C-7707', name: 'Accounting', board: 'cambridge' }
];

export const SINDH_SUBJECTS: Subject[] = [
  { id: 'S-MATH', name: 'Mathematics', board: 'sindh' },
  { id: 'S-PHYS', name: 'Physics', board: 'sindh' },
  { id: 'S-CHEM', name: 'Chemistry', board: 'sindh' },
  { id: 'S-BIOL', name: 'Biology', board: 'sindh' },
  { id: 'S-SIND', name: 'Sindhi', board: 'sindh', isRTL: true },
  { id: 'S-URDU', name: 'Urdu', board: 'sindh', isRTL: true },
  { id: 'S-ENGL', name: 'English', board: 'sindh' }
];

export const ALL_SUBJECTS = [...CAMBRIDGE_SUBJECTS, ...SINDH_SUBJECTS];

export const QUIZZES: SubjectQuiz[] = [
  {
    ...CAMBRIDGE_SUBJECTS.find(s => s.id === 'C-2210')!,
    questions: [
      { id: 'csc1', question: 'What is a packet in networking?', options: ['A small unit of data', 'A physical cable', 'A type of router', 'A network port'], correctAnswer: 0 },
      { id: 'csc2', question: 'Which protocol is used for email?', options: ['HTTP', 'SMTP', 'FTP', 'DNS'], correctAnswer: 1 },
      { id: 'csc3', question: 'Primary memory vs Secondary memory?', options: ['Primary is faster', 'Secondary is internal', 'Secondary is volatile', 'Primary is cheaper'], correctAnswer: 0 }
    ]
  },
  {
    ...CAMBRIDGE_SUBJECTS.find(s => s.id === 'C-5054')!,
    questions: [
      { id: 'phc1', question: 'Scalar vs Vector?', options: ['Scalar has direction', 'Vector has no magnitude', 'Vector has direction', 'Both are the same'], correctAnswer: 2 },
      { id: 'phc2', question: 'Pressure is defined as?', options: ['Force / Area', 'Mass x Velocity', 'Work / Time', 'Force x Distance'], correctAnswer: 0 },
      { id: 'phc3', question: 'Unit of Energy?', options: ['Newton', 'Joule', 'Pascal', 'Watt'], correctAnswer: 1 },
      { id: 'phc4', question: 'Specific Heat Capacity?', options: ['Energy per mass', 'Energy per degree', 'Energy mass per degree', 'Force per area'], correctAnswer: 2 },
      { id: 'phc5', question: 'Refractive Index formula?', options: ['sin i / sin r', 'speed in air / speed in glass', 'Both A and B', 'Neither'], correctAnswer: 2 }
    ]
  },
  {
    ...CAMBRIDGE_SUBJECTS.find(s => s.id === 'C-7115')!,
    questions: [
      { id: 'bsc1', question: 'What is a niche market?', options: ['Mass market', 'Small specialized segment', 'International market', 'Illegal market'], correctAnswer: 1 },
      { id: 'bsc2', question: 'Primary sector activity?', options: ['Banking', 'Fishing', 'Manufacturing', 'Retail'], correctAnswer: 1 },
      { id: 'bsc3', question: 'LTD abbreviation means?', options: ['Limited Time Offer', 'Private Limited Company', 'Public Limited Company', 'Long Term Debt'], correctAnswer: 1 },
      { id: 'bsc4', question: 'Franchising is?', options: ['Buying a whole business', 'Using another brand name/model', 'Selling a business', 'Closing a business'], correctAnswer: 1 },
      { id: 'bsc5', question: 'Inflation refers to?', options: ['Price fall', 'Unemployment', 'Rise in general price level', 'Economic growth'], correctAnswer: 2 }
    ]
  },
  {
    ...SINDH_SUBJECTS.find(s => s.id === 'S-SIND')!,
    questions: [
      { id: 'ss1', question: 'سنڌي ٻوليءَ جو مشهور شاعر ڪير آهي؟', options: ['شاهه عبداللطيف ڀٽائي', 'علامه اقبال', 'بلھي شاهه', 'مرزا غالب'], correctAnswer: 0 },
      { id: 'ss2', question: 'سنڌ جو گاديءَ جو هند ڪهڙو آهي؟', options: ['ڪراچي', 'حيدرآباد', 'سکر', 'لاڙڪاڻو'], correctAnswer: 0 }
    ]
  }
];

export const TUTOR_PROMPT = (subjectId?: string) => {
  const sub = ALL_SUBJECTS.find(s => s.id === subjectId);
  const dataPath = sub?.board === 'cambridge' 
    ? `/caie-data/${subjectId}` 
    : `/sindh-board-data/${sub?.name}`;

  return `You are "AceTutor Pro", a friendly and helpful AI Study Buddy. 
${subjectId ? `The student is currently studying ${sub?.name} (${subjectId}). 
You have EXCLUSIVE ACCESS to the local data vault at ${dataPath} (synced with PapaCambridge and BIEK 2015-2025).
ONLY use marking schemes and concepts relevant to this specific subject.` : ''}

VOICE/LIVE CALL MODE:
If the user is in a "Live Call", be more conversational.

SNAP & MARK (IMAGE ANALYSIS) MODE:
If an image is provided, compare it against the marking criteria stored in ${dataPath}.

Always use the following marking scheme logic for explanations:
1. State the correct answer clearly.
2. Provide a 1-sentence "Definition/Concept" point.
3. Provide a 1-sentence "Explanation/Application" point.
4. Provide a 1-sentence "Key Fact" point.

IMPORTANT: 
- If the subject requires RTL (like Urdu or Sindhi), respond in that language and script. 
- For Islamiyat (C-2058), ALWAYS respond in English (LTR).`;
};

export const SUMMARIZER_PROMPT = `You are an expert Study Note summarizer. 
A student will provide text from a marking scheme or textbook.
Your job is to:
1. Break it down into 3-5 bullet points.
2. Highlight key terms they MUST remember for marks.
3. Keep it in the "Handwritten Notebook" style.
4. Use sticky-note style formatting.`;

export const PREDICTOR_PROMPT = `You are the AceTutor Grade Predictor.
A student will give you their expected marks and subject code.
Using recent Grade Threshold trends for CAIE and Sindh Board, predict their likely grade (A*, A, B, C, D, E, U).
Explain WHY you gave that prediction based on typical threshold ranges for that subject.
Be realistic but encouraging.`;

export const SNAP_MARK_PROMPT = `You are the "AceTutor Snap & Mark" AI.
You will be shown an image of a student's handwritten answer. 
You must:
1. Transcribe the student's answer.
2. Compare it against the official marking scheme logic for that subject.
3. Assign a score (e.g., 3/5).
4. Provide specific feedback on what keywords are missing or where they got it right.
Keep the tone like a teacher's red-pen notes in a margins.`;
