'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, Trophy, Star, BookOpen, Target, Award, Users, Clock, Flame } from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  points: number;
  level: number;
  streak: number;
  completedLessons: string[];
  achievements: string[];
  totalStudyTime: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'alphabet' | 'vocabulary' | 'grammar' | 'culture' | 'pronunciation';
  level: number;
  content: any[];
  points: number;
  completed: boolean;
  accuracy: number;
}

interface LeaderboardUser {
  name: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
}

// Arabic Content Database
const ARABIC_ALPHABET = [
  { arabic: 'ا', name: 'Alif', pronunciation: 'a', audio: '/audio/alif.mp3' },
  { arabic: 'ب', name: 'Ba', pronunciation: 'b', audio: '/audio/ba.mp3' },
  { arabic: 'ت', name: 'Ta', pronunciation: 't', audio: '/audio/ta.mp3' },
  { arabic: 'ث', name: 'Tha', pronunciation: 'th', audio: '/audio/tha.mp3' },
  { arabic: 'ج', name: 'Jim', pronunciation: 'j', audio: '/audio/jim.mp3' },
  { arabic: 'ح', name: 'Ha', pronunciation: 'h', audio: '/audio/ha.mp3' },
  { arabic: 'خ', name: 'Kha', pronunciation: 'kh', audio: '/audio/kha.mp3' },
  { arabic: 'د', name: 'Dal', pronunciation: 'd', audio: '/audio/dal.mp3' },
  { arabic: 'ذ', name: 'Dhal', pronunciation: 'dh', audio: '/audio/dhal.mp3' },
  { arabic: 'ر', name: 'Ra', pronunciation: 'r', audio: '/audio/ra.mp3' },
  { arabic: 'ز', name: 'Zay', pronunciation: 'z', audio: '/audio/zay.mp3' },
  { arabic: 'س', name: 'Sin', pronunciation: 's', audio: '/audio/sin.mp3' },
  { arabic: 'ش', name: 'Shin', pronunciation: 'sh', audio: '/audio/shin.mp3' },
  { arabic: 'ص', name: 'Sad', pronunciation: 's', audio: '/audio/sad.mp3' },
  { arabic: 'ض', name: 'Dad', pronunciation: 'd', audio: '/audio/dad.mp3' },
  { arabic: 'ط', name: 'Ta', pronunciation: 't', audio: '/audio/ta2.mp3' },
  { arabic: 'ظ', name: 'Za', pronunciation: 'z', audio: '/audio/za.mp3' },
  { arabic: 'ع', name: 'Ain', pronunciation: 'a', audio: '/audio/ain.mp3' },
  { arabic: 'غ', name: 'Ghain', pronunciation: 'gh', audio: '/audio/ghain.mp3' },
  { arabic: 'ف', name: 'Fa', pronunciation: 'f', audio: '/audio/fa.mp3' },
  { arabic: 'ق', name: 'Qaf', pronunciation: 'q', audio: '/audio/qaf.mp3' },
  { arabic: 'ك', name: 'Kaf', pronunciation: 'k', audio: '/audio/kaf.mp3' },
  { arabic: 'ل', name: 'Lam', pronunciation: 'l', audio: '/audio/lam.mp3' },
  { arabic: 'م', name: 'Mim', pronunciation: 'm', audio: '/audio/mim.mp3' },
  { arabic: 'ن', name: 'Nun', pronunciation: 'n', audio: '/audio/nun.mp3' },
  { arabic: 'ه', name: 'Ha', pronunciation: 'h', audio: '/audio/ha2.mp3' },
  { arabic: 'و', name: 'Waw', pronunciation: 'w', audio: '/audio/waw.mp3' },
  { arabic: 'ي', name: 'Ya', pronunciation: 'y', audio: '/audio/ya.mp3' }
];

const VOCABULARY_DATABASE = {
  level1: {
    numbers: [
      { arabic: 'واحد', english: 'One', pronunciation: 'wahid', number: 1 },
      { arabic: 'اثنان', english: 'Two', pronunciation: 'ithnan', number: 2 },
      { arabic: 'ثلاثة', english: 'Three', pronunciation: 'thalatha', number: 3 },
      { arabic: 'أربعة', english: 'Four', pronunciation: 'arba\'a', number: 4 },
      { arabic: 'خمسة', english: 'Five', pronunciation: 'khamsa', number: 5 },
      { arabic: 'ستة', english: 'Six', pronunciation: 'sitta', number: 6 },
      { arabic: 'سبعة', english: 'Seven', pronunciation: 'sab\'a', number: 7 },
      { arabic: 'ثمانية', english: 'Eight', pronunciation: 'thamaniya', number: 8 },
      { arabic: 'تسعة', english: 'Nine', pronunciation: 'tis\'a', number: 9 },
      { arabic: 'عشرة', english: 'Ten', pronunciation: 'ashara', number: 10 }
    ],
    colors: [
      { arabic: 'أحمر', english: 'Red', pronunciation: 'ahmar' },
      { arabic: 'أزرق', english: 'Blue', pronunciation: 'azraq' },
      { arabic: 'أخضر', english: 'Green', pronunciation: 'akhdar' },
      { arabic: 'أصفر', english: 'Yellow', pronunciation: 'asfar' },
      { arabic: 'أسود', english: 'Black', pronunciation: 'aswad' },
      { arabic: 'أبيض', english: 'White', pronunciation: 'abyad' },
      { arabic: 'بني', english: 'Brown', pronunciation: 'bunni' },
      { arabic: 'وردي', english: 'Pink', pronunciation: 'wardi' }
    ],
    family: [
      { arabic: 'أب', english: 'Father', pronunciation: 'ab' },
      { arabic: 'أم', english: 'Mother', pronunciation: 'umm' },
      { arabic: 'ابن', english: 'Son', pronunciation: 'ibn' },
      { arabic: 'ابنة', english: 'Daughter', pronunciation: 'ibna' },
      { arabic: 'أخ', english: 'Brother', pronunciation: 'akh' },
      { arabic: 'أخت', english: 'Sister', pronunciation: 'ukht' },
      { arabic: 'جد', english: 'Grandfather', pronunciation: 'jadd' },
      { arabic: 'جدة', english: 'Grandmother', pronunciation: 'jadda' }
    ],
    greetings: [
      { arabic: 'السلام عليكم', english: 'Peace be upon you', pronunciation: 'as-salamu alaykum' },
      { arabic: 'مرحبا', english: 'Hello', pronunciation: 'marhaban' },
      { arabic: 'صباح الخير', english: 'Good morning', pronunciation: 'sabah al-khayr' },
      { arabic: 'مساء الخير', english: 'Good evening', pronunciation: 'masa\' al-khayr' },
      { arabic: 'شكرا', english: 'Thank you', pronunciation: 'shukran' },
      { arabic: 'عفوا', english: 'You\'re welcome', pronunciation: 'afwan' },
      { arabic: 'معذرة', english: 'Excuse me', pronunciation: 'ma\'dhira' },
      { arabic: 'مع السلامة', english: 'Goodbye', pronunciation: 'ma\'a as-salama' }
    ]
  },
  level2: {
    verbs: [
      { arabic: 'يأكل', english: 'Eat', pronunciation: 'ya\'kul' },
      { arabic: 'يشرب', english: 'Drink', pronunciation: 'yashrab' },
      { arabic: 'يذهب', english: 'Go', pronunciation: 'yadhhab' },
      { arabic: 'يأتي', english: 'Come', pronunciation: 'ya\'ti' },
      { arabic: 'يقرأ', english: 'Read', pronunciation: 'yaqra\'' },
      { arabic: 'يكتب', english: 'Write', pronunciation: 'yaktub' },
      { arabic: 'يتكلم', english: 'Speak', pronunciation: 'yatakallam' },
      { arabic: 'يسمع', english: 'Listen', pronunciation: 'yasma\'' }
    ],
    adjectives: [
      { arabic: 'كبير', english: 'Big', pronunciation: 'kabir' },
      { arabic: 'صغير', english: 'Small', pronunciation: 'saghir' },
      { arabic: 'طويل', english: 'Tall/Long', pronunciation: 'tawil' },
      { arabic: 'قصير', english: 'Short', pronunciation: 'qasir' },
      { arabic: 'جميل', english: 'Beautiful', pronunciation: 'jamil' },
      { arabic: 'قبيح', english: 'Ugly', pronunciation: 'qabih' },
      { arabic: 'سريع', english: 'Fast', pronunciation: 'sari\'' },
      { arabic: 'بطيء', english: 'Slow', pronunciation: 'bati\'' }
    ]
  },
  level3: {
    phrases: [
      { arabic: 'كيف حالك؟', english: 'How are you?', pronunciation: 'kayf halak?' },
      { arabic: 'ما اسمك؟', english: 'What is your name?', pronunciation: 'ma ismak?' },
      { arabic: 'من أين أنت؟', english: 'Where are you from?', pronunciation: 'min ayna anta?' },
      { arabic: 'كم عمرك؟', english: 'How old are you?', pronunciation: 'kam umrak?' },
      { arabic: 'أين تسكن؟', english: 'Where do you live?', pronunciation: 'ayna taskun?' },
      { arabic: 'ماذا تعمل؟', english: 'What do you do?', pronunciation: 'madha ta\'mal?' }
    ]
  }
};

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'alphabet_master', name: 'Alphabet Master', description: 'Master all Arabic letters', icon: '📝' },
  { id: 'vocabulary_builder', name: 'Vocabulary Builder', description: 'Learn 100 words', icon: '📚' },
  { id: 'streak_week', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥' },
  { id: 'level_one', name: 'Level One Complete', description: 'Complete all Level 1 lessons', icon: '⭐' },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on 10 quizzes', icon: '🏆' },
  { id: 'pronunciation_pro', name: 'Pronunciation Pro', description: 'Complete pronunciation challenges', icon: '🎤' },
  { id: 'culture_explorer', name: 'Culture Explorer', description: 'Learn about Arabic culture', icon: '🌍' }
];

export default function ArabicLearningApp() {
  // State Management
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Student',
    points: 0,
    level: 1,
    streak: 0,
    completedLessons: [],
    achievements: [],
    totalStudyTime: 0
  });

  const [currentView, setCurrentView] = useState<'home' | 'lessons' | 'games' | 'progress' | 'leaderboard'>('home');
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'learn' | 'quiz'>('learn');
  const [currentCategory, setCurrentCategory] = useState<string>('alphabet');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studyStreak, setStudyStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(30); // minutes
  const [todayStudyTime, setTodayStudyTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Leaderboard Data
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    { name: 'Ahmed', points: 2450, level: 3, rank: 1, streak: 15 },
    { name: 'Fatima', points: 2100, level: 2, rank: 2, streak: 12 },
    { name: 'Omar', points: 1850, level: 2, rank: 3, streak: 8 },
    { name: 'Aisha', points: 1600, level: 2, rank: 4, streak: 5 },
    { name: 'Student', points: currentUser.points, level: currentUser.level, rank: 5, streak: currentUser.streak }
  ]);

  // Lessons Structure
  const lessons = {
    level1: [
      { id: 'alphabet', title: 'Arabic Alphabet', type: 'alphabet', completed: false, points: 100 },
      { id: 'numbers', title: 'Numbers 1-10', type: 'vocabulary', completed: false, points: 80 },
      { id: 'colors', title: 'Colors', type: 'vocabulary', completed: false, points: 60 },
      { id: 'family', title: 'Family Members', type: 'vocabulary', completed: false, points: 70 },
      { id: 'greetings', title: 'Greetings', type: 'vocabulary', completed: false, points: 50 }
    ],
    level2: [
      { id: 'verbs', title: 'Common Verbs', type: 'vocabulary', completed: false, points: 90 },
      { id: 'adjectives', title: 'Adjectives', type: 'vocabulary', completed: false, points: 80 },
      { id: 'grammar1', title: 'Basic Grammar', type: 'grammar', completed: false, points: 120 },
      { id: 'sentences', title: 'Simple Sentences', type: 'grammar', completed: false, points: 100 }
    ],
    level3: [
      { id: 'phrases', title: 'Common Phrases', type: 'vocabulary', completed: false, points: 110 },
      { id: 'conversation', title: 'Basic Conversation', type: 'grammar', completed: false, points: 150 },
      { id: 'culture', title: 'Arabic Culture', type: 'culture', completed: false, points: 100 }
    ]
  };

  // Audio Functions
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Progress Functions
  const completeLesson = (lessonId: string, points: number) => {
    if (!currentUser.completedLessons.includes(lessonId)) {
      const updatedUser = {
        ...currentUser,
        points: currentUser.points + points,
        completedLessons: [...currentUser.completedLessons, lessonId],
        streak: currentUser.streak + 1
      };
      setCurrentUser(updatedUser);
      
      // Update leaderboard
      const updatedLeaderboard = leaderboard.map(user => 
        user.name === 'Student' 
          ? { ...user, points: updatedUser.points, streak: updatedUser.streak }
          : user
      ).sort((a, b) => b.points - a.points).map((user, index) => ({ ...user, rank: index + 1 }));
      
      setLeaderboard(updatedLeaderboard);
      
      // Check for achievements
      checkAchievements(updatedUser);
    }
  };

  const checkAchievements = (user: User) => {
    const newAchievements = [];
    
    if (user.completedLessons.length === 1 && !user.achievements.includes('first_lesson')) {
      newAchievements.push('first_lesson');
    }
    
    if (user.completedLessons.includes('alphabet') && !user.achievements.includes('alphabet_master')) {
      newAchievements.push('alphabet_master');
    }
    
    if (user.streak >= 7 && !user.achievements.includes('streak_week')) {
      newAchievements.push('streak_week');
    }
    
    if (newAchievements.length > 0) {
      setCurrentUser(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }
  };

  // Quiz Functions
  const generateQuizQuestion = (category: string) => {
    let data;
    switch (category) {
      case 'alphabet':
        data = ARABIC_ALPHABET;
        break;
      case 'numbers':
        data = VOCABULARY_DATABASE.level1.numbers;
        break;
      case 'colors':
        data = VOCABULARY_DATABASE.level1.colors;
        break;
      case 'family':
        data = VOCABULARY_DATABASE.level1.family;
        break;
      case 'greetings':
        data = VOCABULARY_DATABASE.level1.greetings;
        break;
      default:
        data = ARABIC_ALPHABET;
    }
    
    const randomIndex = Math.floor(Math.random() * data.length);
    const correct = data[randomIndex];
    const options = [correct];
    
    // Add 3 random wrong answers
    while (options.length < 4) {
      const randomOption = data[Math.floor(Math.random() * data.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    return {
      question: correct,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: correct
    };
  };

  // Component Renders
  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مرحباً - Welcome to Arabic Learning
        </h1>
        <p className="text-lg text-gray-600">Master Arabic through interactive lessons, games, and cultural insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentUser.points}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">Level {currentUser.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentUser.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentUser.completedLessons.length}</div>
            <div className="text-sm text-gray-600">Lessons Done</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={() => setCurrentView('lessons')} 
          className="h-24 flex flex-col space-y-2 bg-blue-500 hover:bg-blue-600"
        >
          <BookOpen className="h-8 w-8" />
          <span>Start Learning</span>
        </Button>
        
        <Button 
          onClick={() => setCurrentView('games')} 
          className="h-24 flex flex-col space-y-2 bg-green-500 hover:bg-green-600"
        >
          <Target className="h-8 w-8" />
          <span>Play Games</span>
        </Button>
        
        <Button 
          onClick={() => setCurrentView('progress')} 
          className="h-24 flex flex-col space-y-2 bg-purple-500 hover:bg-purple-600"
        >
          <Star className="h-8 w-8" />
          <span>View Progress</span>
        </Button>
        
        <Button 
          onClick={() => setCurrentView('leaderboard')} 
          className="h-24 flex flex-col space-y-2 bg-yellow-500 hover:bg-yellow-600"
        >
          <Trophy className="h-8 w-8" />
          <span>Leaderboard</span>
        </Button>
      </div>

      {/* Daily Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Daily Goal Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Study Time Today</span>
              <span>{todayStudyTime}/{dailyGoal} minutes</span>
            </div>
            <Progress value={(todayStudyTime / dailyGoal) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {currentUser.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentUser.achievements.slice(-3).map(achievementId => {
                const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
                return achievement ? (
                  <Badge key={achievementId} variant="secondary" className="flex items-center space-x-1">
                    <span>{achievement.icon}</span>
                    <span>{achievement.name}</span>
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Learning Path</h2>
        <Button onClick={() => setCurrentView('home')} variant="outline">
          Back to Home
        </Button>
      </div>

      <Tabs defaultValue="level1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="level1">Level 1 - Foundations</TabsTrigger>
          <TabsTrigger value="level2" disabled={currentUser.level < 2}>Level 2 - Building</TabsTrigger>
          <TabsTrigger value="level3" disabled={currentUser.level < 3}>Level 3 - Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="level1" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.level1.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{lesson.title}</span>
                    {currentUser.completedLessons.includes(lesson.id) && (
                      <Badge variant="secondary">✓ Complete</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Points: {lesson.points}</span>
                      <span>Type: {lesson.type}</span>
                    </div>
                    <Button 
                      onClick={() => {
                        setCurrentLesson(lesson.id);
                        setCurrentCategory(lesson.id);
                        setCurrentView('games');
                      }}
                      className="w-full"
                      disabled={lesson.id !== 'alphabet' && !currentUser.completedLessons.includes(lessons.level1[lessons.level1.findIndex(l => l.id === lesson.id) - 1]?.id)}
                    >
                      {currentUser.completedLessons.includes(lesson.id) ? 'Review' : 'Start Lesson'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="level2" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.level2.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{lesson.title}</span>
                    {currentUser.completedLessons.includes(lesson.id) && (
                      <Badge variant="secondary">✓ Complete</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Points: {lesson.points}</span>
                      <span>Type: {lesson.type}</span>
                    </div>
                    <Button 
                      onClick={() => {
                        setCurrentLesson(lesson.id);
                        setCurrentCategory(lesson.id);
                        setCurrentView('games');
                      }}
                      className="w-full"
                    >
                      {currentUser.completedLessons.includes(lesson.id) ? 'Review' : 'Start Lesson'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="level3" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.level3.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{lesson.title}</span>
                    {currentUser.completedLessons.includes(lesson.id) && (
                      <Badge variant="secondary">✓ Complete</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Points: {lesson.points}</span>
                      <span>Type: {lesson.type}</span>
                    </div>
                    <Button 
                      onClick={() => {
                        setCurrentLesson(lesson.id);
                        setCurrentCategory(lesson.id);
                        setCurrentView('games');
                      }}
                      className="w-full"
                    >
                      {currentUser.completedLessons.includes(lesson.id) ? 'Review' : 'Start Lesson'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderGames = () => {
    let currentData;
    switch (currentCategory) {
      case 'alphabet':
        currentData = ARABIC_ALPHABET;
        break;
      case 'numbers':
        currentData = VOCABULARY_DATABASE.level1.numbers;
        break;
      case 'colors':
        currentData = VOCABULARY_DATABASE.level1.colors;
        break;
      case 'family':
        currentData = VOCABULARY_DATABASE.level1.family;
        break;
      case 'greetings':
        currentData = VOCABULARY_DATABASE.level1.greetings;
        break;
      case 'verbs':
        currentData = VOCABULARY_DATABASE.level2.verbs;
        break;
      case 'adjectives':
        currentData = VOCABULARY_DATABASE.level2.adjectives;
        break;
      case 'phrases':
        currentData = VOCABULARY_DATABASE.level3.phrases;
        break;
      default:
        currentData = ARABIC_ALPHABET;
    }

    const currentItem = currentData[currentIndex];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold capitalize">{currentCategory} Learning</h2>
          <div className="flex space-x-2">
            <Button onClick={() => setCurrentView('lessons')} variant="outline">
              Back to Lessons
            </Button>
            <Button onClick={() => setCurrentView('home')} variant="outline">
              Home
            </Button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => setGameMode('learn')}
            variant={gameMode === 'learn' ? 'default' : 'outline'}
          >
            Learn Mode
          </Button>
          <Button 
            onClick={() => setGameMode('quiz')}
            variant={gameMode === 'quiz' ? 'default' : 'outline'}
          >
            Quiz Mode
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {currentIndex + 1} / {currentData.length}</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={((currentIndex + 1) / currentData.length) * 100} />
        </div>

        {gameMode === 'learn' ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl font-bold text-blue-600">
                {currentItem.arabic}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">
                  {currentItem.name || currentItem.english}
                </h3>
                <p className="text-lg text-gray-600">
                  {currentItem.pronunciation}
                </p>
                {currentItem.english && currentItem.name && (
                  <p className="text-md text-gray-500">{currentItem.english}</p>
                )}
              </div>

              <Button 
                onClick={() => playAudio(currentItem.arabic)}
                className="flex items-center space-x-2"
              >
                <Volume2 className="h-4 w-4" />
                <span>Play Audio</span>
              </Button>

              <div className="flex justify-between">
                <Button 
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                <Button 
                  onClick={() => {
                    if (currentIndex < currentData.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      // Lesson completed
                      const lessonPoints = lessons.level1.find(l => l.id === currentCategory)?.points || 50;
                      completeLesson(currentCategory, lessonPoints);
                      setCurrentView('lessons');
                    }
                  }}
                >
                  {currentIndex === currentData.length - 1 ? 'Complete Lesson' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {currentItem.arabic}
                </div>
                <p className="text-lg">What does this mean?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {generateQuizQuestion(currentCategory).options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      const isCorrect = option === currentItem;
                      if (isCorrect) {
                        setScore(score + 10);
                      }
                      setShowAnswer(true);
                      setTimeout(() => {
                        setShowAnswer(false);
                        setCurrentIndex((currentIndex + 1) % currentData.length);
                      }, 2000);
                    }}
                    variant="outline"
                    className="h-16 text-lg"
                    disabled={showAnswer}
                  >
                    {option.english || option.name}
                  </Button>
                ))}
              </div>

              {showAnswer && (
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    Correct! {currentItem.english || currentItem.name}
                  </p>
                  <p className="text-green-600">
                    Pronunciation: {currentItem.pronunciation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Progress</h2>
        <Button onClick={() => setCurrentView('home')} variant="outline">
          Back to Home
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Points:</span>
              <span className="font-bold">{currentUser.points}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Level:</span>
              <span className="font-bold">Level {currentUser.level}</span>
            </div>
            <div className="flex justify-between">
              <span>Lessons Completed:</span>
              <span className="font-bold">{currentUser.completedLessons.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak:</span>
              <span className="font-bold">{currentUser.streak} days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level 1</span>
                <span>{Math.min(currentUser.completedLessons.filter(id => lessons.level1.some(l => l.id === id)).length, lessons.level1.length)}/{lessons.level1.length}</span>
              </div>
              <Progress value={(Math.min(currentUser.completedLessons.filter(id => lessons.level1.some(l => l.id === id)).length, lessons.level1.length) / lessons.level1.length) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level 2</span>
                <span>{Math.min(currentUser.completedLessons.filter(id => lessons.level2.some(l => l.id === id)).length, lessons.level2.length)}/{lessons.level2.length}</span>
              </div>
              <Progress value={(Math.min(currentUser.completedLessons.filter(id => lessons.level2.some(l => l.id === id)).length, lessons.level2.length) / lessons.level2.length) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level 3</span>
                <span>{Math.min(currentUser.completedLessons.filter(id => lessons.level3.some(l => l.id === id)).length, lessons.level3.length)}/{lessons.level3.length}</span>
              </div>
              <Progress value={(Math.min(currentUser.completedLessons.filter(id => lessons.level3.some(l => l.id === id)).length, lessons.level3.length) / lessons.level3.length) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ACHIEVEMENTS.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-2 rounded ${
                    currentUser.achievements.includes(achievement.id) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="text-xs">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Progress Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-semibold">Level 1 - Foundations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.level1.map(lesson => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded">
                  <span>{lesson.title}</span>
                  {currentUser.completedLessons.includes(lesson.id) ? (
                    <Badge variant="secondary">✓ Complete</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Leaderboard</h2>
        <Button onClick={() => setCurrentView('home')} variant="outline">
          Back to Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Top Learners</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div 
                key={user.name}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  user.name === 'Student' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">Level {user.level}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">{user.points} pts</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Flame className="h-3 w-3 mr-1" />
                    {user.streak} day streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranking Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🏆 This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold">#{leaderboard.find(u => u.name === 'Student')?.rank || 5}</div>
              <div className="text-sm text-gray-600">Your Rank</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🔥 Streak Leader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.max(...leaderboard.map(u => u.streak))} days</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">⭐ Points Leader</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.max(...leaderboard.map(u => u.points))}</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Arabic Learning App</h1>
              <Badge variant="secondary">Level {currentUser.level}</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{currentUser.points}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold">{currentUser.streak}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {currentView === 'home' && renderHome()}
        {currentView === 'lessons' && renderLessons()}
        {currentView === 'games' && renderGames()}
        {currentView === 'progress' && renderProgress()}
        {currentView === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  );
}