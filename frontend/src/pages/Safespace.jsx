import { useCallback, useEffect, useRef, useState } from "react";
import mannlythicsLogo from "../assets/logo pic.png";
import meditationImg from "../assets/Relaxing.png";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChess,
  FaGamepad,
  FaHeadphones,
  FaSpa,
  FaHandsHelping,
  FaLaughBeam,
  FaMusic,
  FaWind,
  FaHeart,
  FaPlay,
  FaMoon,
  FaSun,
  FaSearch,
  FaUndo,
  FaFlag,
} from "react-icons/fa";

const fallbackData = {
  "mini-games": [
    { _id: "g1", title: "Color Match Calm", description: "A light focus game to gently shift your attention.", url: "https://www.crazygames.com/", mediaType: "game", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80" },
    { _id: "g2", title: "Puzzle Break", description: "A simple brain game for a calm mental reset.", url: "https://poki.com/", mediaType: "game", img: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&q=80" },
    { _id: "g3", title: "Memory Relax", description: "A short memory challenge to refresh your mind.", url: "https://www.memozor.com/", mediaType: "game", img: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80" },
  ],
  music: [
    { _id: "m1", title: "Soft Rain Ambience", description: "Gentle rain sounds for calm and comfort.", url: "https://www.youtube.com/results?search_query=soft+rain+sounds", mediaType: "audio", duration: "10 min", img: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80" },
    { _id: "m2", title: "Piano Peace", description: "Slow piano tones for relaxation.", url: "https://www.youtube.com/results?search_query=calm+piano+music", mediaType: "audio", duration: "8 min", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80" },
    { _id: "m3", title: "Nature Calm", description: "Birds, breeze, and nature sounds to relax.", url: "https://www.youtube.com/results?search_query=nature+relaxing+sounds", mediaType: "audio", duration: "12 min", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
  ],
  meditation: [
    { _id: "med1", title: "5-Minute Calm Reset", description: "A short guided meditation for grounding.", url: "https://www.youtube.com/results?search_query=5+minute+guided+meditation", mediaType: "video", duration: "5 min", img: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" },
    { _id: "med2", title: "Morning Mindfulness", description: "Start gently with a focused meditation session.", url: "https://www.youtube.com/results?search_query=morning+mindfulness+meditation", mediaType: "video", duration: "7 min", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
    { _id: "med3", title: "Sleep Relaxation", description: "A soft meditation session to reduce night anxiety.", url: "https://www.youtube.com/results?search_query=sleep+meditation+for+anxiety", mediaType: "video", duration: "10 min", img: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80" },
  ],
  therapy: [
    { _id: "t1", title: "Grounding for Panic", description: "Quick grounding support for panic moments.", url: "https://www.youtube.com/results?search_query=panic+attack+grounding+exercise", mediaType: "video", duration: "6 min", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80" },
    { _id: "t2", title: "Overthinking Relief", description: "Therapy-style support for racing thoughts.", url: "https://www.youtube.com/results?search_query=overthinking+relief+therapy", mediaType: "video", duration: "8 min", img: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&q=80" },
    { _id: "t3", title: "Anxiety Reset", description: "A gentle calming session for anxious moments.", url: "https://www.youtube.com/results?search_query=anxiety+relief+session", mediaType: "video", duration: "7 min", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80" },
  ],
  "funny-videos": [
    { _id: "f1", title: "Cute Animal Moments", description: "A cheerful break to lift your mood.", url: "https://www.youtube.com/results?search_query=funny+animal+videos", mediaType: "video", img: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80" },
    { _id: "f2", title: "Funny Kids Compilation", description: "Light and playful videos for a quick smile.", url: "https://www.youtube.com/results?search_query=funny+kids+videos", mediaType: "video", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80" },
    { _id: "f3", title: "Comedy Shorts", description: "Small, funny clips for a stress break.", url: "https://www.youtube.com/results?search_query=funny+short+videos", mediaType: "video", img: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80" },
  ],
  "dance-videos": [
    { _id: "d1", title: "Feel-Good Dance Break", description: "A positive movement break to refresh your energy.", url: "https://www.youtube.com/results?search_query=feel+good+dance+workout", mediaType: "video", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80" },
    { _id: "d2", title: "Happy Dance Session", description: "Move a little and shake off stress.", url: "https://www.youtube.com/results?search_query=happy+dance+video", mediaType: "video", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80" },
    { _id: "d3", title: "Fun Zumba Break", description: "A short dance routine for mood lifting.", url: "https://www.youtube.com/results?search_query=zumba+fun+beginner", mediaType: "video", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80" },
  ],
  breathing: [
    { _id: "b1", title: "Box Breathing", description: "Inhale 4, hold 4, exhale 4, hold 4.", mediaType: "text", duration: "3 min", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
    { _id: "b2", title: "4-4-6 Breathing", description: "Inhale for 4, hold for 4, exhale for 6.", mediaType: "text", duration: "2 min", img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80" },
    { _id: "b3", title: "Slow Deep Breathing", description: "Breathe in deeply and exhale slowly for calm.", mediaType: "text", duration: "5 min", img: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" },
  ],
  affirmations: [
    { _id: "a1", title: "You are safe right now.", description: "Pause, breathe, and remind yourself that this feeling will pass.", mediaType: "text", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80" },
    { _id: "a2", title: "You are doing your best.", description: "Even small steps matter. You are trying, and that counts.", mediaType: "text", img: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80" },
    { _id: "a3", title: "This moment is temporary.", description: "Let yourself slow down. Calm can return gradually.", mediaType: "text", img: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80" },
  ],
};

const CARD_IMAGES = {
  "mini-games": [
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80",
    "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&q=80",
    "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  ],
  music: [
    "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80",
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  ],
  meditation: [
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
  ],
  therapy: [
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&q=80",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=800&q=80",
  ],
  "funny-videos": [
    "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=800&q=80",
  ],
  "dance-videos": [
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
    "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&q=80",
  ],
  breathing: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80",
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
    "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80",
  ],
  affirmations: [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80",
    "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
  ],
};
const sectionMeta = {
  "mini-games": {
    title: "Mini Games",
    icon: FaGamepad,
    tone: "from-violet-500 via-indigo-500 to-blue-500",
    keywords: "games mini play puzzle memory focus relax",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    tagline: "Shift your focus with playful mental breaks",
    accent: "#6366f1",
  },
  music: {
    title: "Soothing Music",
    icon: FaHeadphones,
    tone: "from-fuchsia-500 via-purple-500 to-indigo-500",
    keywords: "music audio rain piano nature sound calm",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tagline: "Let sound carry your stress away",
    accent: "#a855f7",
  },
  meditation: {
    title: "Meditation Sessions",
    icon: FaSpa,
    tone: "from-indigo-500 via-blue-500 to-cyan-400",
    keywords: "meditation mindfulness sleep grounding",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    tagline: "Quiet the mind, restore the soul",
    accent: "#06b6d4",
  },
  therapy: {
    title: "Therapy Support",
    icon: FaHandsHelping,
    tone: "from-sky-500 via-blue-500 to-indigo-500",
    keywords: "therapy support panic anxiety overthinking relief",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    tagline: "Gentle guidance for difficult moments",
    accent: "#3b82f6",
  },
  "funny-videos": {
    title: "Funny Videos",
    icon: FaLaughBeam,
    tone: "from-pink-500 via-rose-500 to-violet-500",
    keywords: "funny comedy laugh light mood",
    img: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    tagline: "Laughter is the fastest mood reset",
    accent: "#ec4899",
  },
  "dance-videos": {
    title: "Dance Videos",
    icon: FaMusic,
    tone: "from-indigo-500 via-purple-500 to-pink-500",
    keywords: "dance zumba movement energy",
    img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
    tagline: "Move your body, free your mind",
    accent: "#8b5cf6",
  },
  breathing: {
    title: "Breathing Exercises",
    icon: FaWind,
    tone: "from-cyan-500 via-sky-500 to-indigo-500",
    keywords: "breathing breath inhale exhale box breathing calm",
    img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80",
    tagline: "One breath at a time, find your calm",
    accent: "#0ea5e9",
  },
  affirmations: {
    title: "Comfort Notes",
    icon: FaHeart,
    tone: "from-rose-400 via-pink-500 to-fuchsia-500",
    keywords: "comfort notes affirmations safe zone comfort zone reassurance",
    img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
    tagline: "Words that hold you when you need it most",
    accent: "#f43f5e",
  },
};

// ── CHESS ENGINE ────────────────────────────────────────────────────────────
const INIT_BOARD = () => {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  const order = ['R','N','B','Q','K','B','N','R'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: order[c], color: 'b' };
    b[1][c] = { type: 'P', color: 'b' };
    b[6][c] = { type: 'P', color: 'w' };
    b[7][c] = { type: order[c], color: 'w' };
  }
  return b;
};

const PIECE_UNICODE = {
  wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
  bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
};

const cloneBoard = b => b.map(r => r.map(c => c ? {...c} : null));
const inBounds = (r,c) => r>=0&&r<8&&c>=0&&c<8;

const getRawMoves = (board, r, c) => {
  const piece = board[r][c];
  if (!piece) return [];
  const {type, color} = piece;
  const moves = [];
  const enemy = color==='w'?'b':'w';
  const push = (nr,nc) => { if(inBounds(nr,nc)) moves.push([nr,nc]); };
  const slide = (dr,dc) => {
    let nr=r+dr, nc=c+dc;
    while(inBounds(nr,nc)) {
      if(board[nr][nc]) { if(board[nr][nc].color===enemy) moves.push([nr,nc]); break; }
      moves.push([nr,nc]); nr+=dr; nc+=dc;
    }
  };
  if (type==='P') {
    const dir = color==='w'?-1:1;
    const start = color==='w'?6:1;
    if(inBounds(r+dir,c)&&!board[r+dir][c]) {
      moves.push([r+dir,c]);
      if(r===start&&!board[r+2*dir][c]) moves.push([r+2*dir,c]);
    }
    [[r+dir,c-1],[r+dir,c+1]].forEach(([nr,nc]) => {
      if(inBounds(nr,nc)&&board[nr][nc]?.color===enemy) moves.push([nr,nc]);
    });
  } else if (type==='N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
      .forEach(([dr,dc]) => { const nr=r+dr,nc=c+dc; if(inBounds(nr,nc)&&board[nr][nc]?.color!==color) push(nr,nc); });
  } else if (type==='B') { [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc)); }
  else if (type==='R') { [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc)); }
  else if (type==='Q') { [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc)); }
  else if (type==='K') {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
      .forEach(([dr,dc]) => { const nr=r+dr,nc=c+dc; if(inBounds(nr,nc)&&board[nr][nc]?.color!==color) push(nr,nc); });
  }
  return moves;
};

const isInCheck = (board, color) => {
  let kr=-1,kc=-1;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(board[r][c]?.type==='K'&&board[r][c]?.color===color){kr=r;kc=c;}
  const enemy = color==='w'?'b':'w';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(board[r][c]?.color===enemy)
      if(getRawMoves(board,r,c).some(([nr,nc])=>nr===kr&&nc===kc)) return true;
  return false;
};

const getLegalMoves = (board, r, c) => {
  const piece = board[r][c];
  if (!piece) return [];
  return getRawMoves(board,r,c).filter(([nr,nc]) => {
    const nb = cloneBoard(board);
    nb[nr][nc] = nb[r][c]; nb[r][c] = null;
    return !isInCheck(nb, piece.color);
  });
};

const applyMove = (board, fr, fc, tr, tc) => {
  const nb = cloneBoard(board);
  const piece = nb[fr][fc];
  if (piece.type==='P'&&(tr===0||tr===7)) nb[tr][tc] = {...piece, type:'Q'};
  else nb[tr][tc] = piece;
  nb[fr][fc] = null;
  return nb;
};

const PIECE_VALUE = {P:10,N:30,B:30,R:50,Q:90,K:900};
const scoreBoard = (board) => {
  let s=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    const p=board[r][c];
    if(p) s += (p.color==='b'?1:-1)*PIECE_VALUE[p.type];
  }
  return s;
};

const minimax = (board, depth, alpha, beta, maximizing) => {
  if (depth===0) return { score: scoreBoard(board) };
  const color = maximizing?'b':'w';
  let best = maximizing?-Infinity:Infinity;
  let bestMove = null;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    if(board[r][c]?.color!==color) continue;
    for(const [nr,nc] of getLegalMoves(board,r,c)) {
      const nb = applyMove(board,r,c,nr,nc);
      const {score} = minimax(nb,depth-1,alpha,beta,!maximizing);
      if(maximizing?score>best:score<best){best=score;bestMove={fr:r,fc:c,tr:nr,tc:nc};}
      if(maximizing) alpha=Math.max(alpha,best); else beta=Math.min(beta,best);
      if(beta<=alpha) break;
    }
  }
  return { score:best, move:bestMove };
};

const hasAnyLegalMove = (board, color) => {
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(board[r][c]?.color===color&&getLegalMoves(board,r,c).length>0) return true;
  return false;
};

// ── CHESS COMPONENT ──────────────────────────────────────────────────────────
function ChessGame({ darkMode, onClose }) {
  const [board, setBoard] = useState(INIT_BOARD);
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [turn, setTurn] = useState('w');
  const [status, setStatus] = useState('playing');
  const [history, setHistory] = useState([]);
  const [captured, setCaptured] = useState({ w:[], b:[] });
  const [difficulty, setDifficulty] = useState(2);
  const [lastMove, setLastMove] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [showPromo, setShowPromo] = useState(null);
  const thinkRef = useRef(null);

  useEffect(() => {
    if (turn!=='b'||status!=='playing') return;
    setThinking(true);
    thinkRef.current = setTimeout(() => {
      const {move} = minimax(board, difficulty, -Infinity, Infinity, true);
      if (move) {
        const {fr,fc,tr,tc} = move;
        const cap = board[tr][tc];
        const nb = applyMove(board,fr,fc,tr,tc);
        if(cap) setCaptured(p=>({...p,w:[...p.w,cap]}));
        setHistory(h=>[...h,{board:cloneBoard(board),from:[fr,fc],to:[tr,tc],piece:board[fr][fc]}]);
        setLastMove({fr,fc,tr,tc}); setBoard(nb); setMoveCount(m=>m+1);
        if(!hasAnyLegalMove(nb,'w')) setStatus(isInCheck(nb,'w')?'checkmate':'stalemate');
        else if(isInCheck(nb,'w')) setStatus('check');
        else setStatus('playing');
        setTurn('w');
      }
      setThinking(false);
    }, 400);
    return () => clearTimeout(thinkRef.current);
  }, [turn, board, status]);

  const handleSquare = (r,c) => {
    if(turn!=='w'||status==='checkmate'||status==='stalemate'||status==='resigned'||thinking) return;
    if(selected) {
      const isLegal = legalMoves.some(([lr,lc])=>lr===r&&lc===c);
      if(isLegal) {
        const piece = board[selected[0]][selected[1]];
        const cap = board[r][c];
        if(piece.type==='P'&&r===0){setShowPromo({fr:selected[0],fc:selected[1],tr:r,tc:c});setSelected(null);setLegalMoves([]);return;}
        const nb = applyMove(board,selected[0],selected[1],r,c);
        if(cap) setCaptured(p=>({...p,b:[...p.b,cap]}));
        setHistory(h=>[...h,{board:cloneBoard(board),from:selected,to:[r,c],piece}]);
        setLastMove({fr:selected[0],fc:selected[1],tr:r,tc:c}); setBoard(nb); setMoveCount(m=>m+1);
        setSelected(null); setLegalMoves([]);
        if(!hasAnyLegalMove(nb,'b')) setStatus(isInCheck(nb,'b')?'checkmate':'stalemate');
        else if(isInCheck(nb,'b')) setStatus('check');
        else setStatus('playing');
        setTurn('b'); return;
      }
      setSelected(null); setLegalMoves([]);
      if(board[r][c]?.color==='w'){setSelected([r,c]);setLegalMoves(getLegalMoves(board,r,c));}
    } else {
      if(board[r][c]?.color==='w'){setSelected([r,c]);setLegalMoves(getLegalMoves(board,r,c));}
    }
  };

  const handlePromotion = (type) => {
    if(!showPromo) return;
    const {fr,fc,tr,tc} = showPromo;
    const nb = cloneBoard(board);
    nb[tr][tc]={type,color:'w'}; nb[fr][fc]=null;
    setBoard(nb); setShowPromo(null); setMoveCount(m=>m+1);
    if(!hasAnyLegalMove(nb,'b')) setStatus(isInCheck(nb,'b')?'checkmate':'stalemate');
    else setStatus('playing');
    setTurn('b');
  };

  const undoMove = () => {
    if(history.length<2) return;
    const prev = history[history.length-2];
    setBoard(cloneBoard(prev.board));
    setHistory(h=>h.slice(0,-2));
    setCaptured(p=>({w:p.w.slice(0,-1),b:p.b.slice(0,-1)}));
    setTurn('w'); setStatus('playing'); setSelected(null); setLegalMoves([]);
    setLastMove(null); setMoveCount(m=>Math.max(0,m-2));
  };

  const resetGame = () => {
    setBoard(INIT_BOARD()); setSelected(null); setLegalMoves([]);
    setTurn('w'); setStatus('playing'); setHistory([]); setCaptured({w:[],b:[]});
    setLastMove(null); setMoveCount(0); setThinking(false);
  };

  const files=['a','b','c','d','e','f','g','h'];
  const ranks=['8','7','6','5','4','3','2','1'];

  const statusMsg = thinking ? '🤖 AI is thinking...'
    : status==='check' ? '⚠️ You are in Check!'
    : status==='checkmate' ? (turn==='w' ? '💀 Checkmate — AI wins!' : '🏆 You win!')
    : status==='stalemate' ? '🤝 Stalemate — Draw!'
    : status==='resigned' ? '🏳️ You resigned.'
    : turn==='w' ? '♟ Your turn (White)' : '🤖 AI thinking...';

  const statusColor = status==='check'?'text-amber-500':status==='checkmate'||status==='resigned'?'text-rose-500':status==='stalemate'?'text-sky-500':darkMode?'text-slate-300':'text-slate-600';

  return (
    <div className={`rounded-3xl border shadow-2xl overflow-hidden ${darkMode?'border-slate-700 bg-slate-900':'border-indigo-100 bg-white'}`}>
      {/* header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b ${darkMode?'border-slate-700':'border-indigo-50'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-xl shadow">♟</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Mind Game</p>
            <h3 className={`text-xl font-black ${darkMode?'text-slate-100':'text-slate-900'}`}>Chess vs AI</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[['Easy',1],['Medium',2],['Hard',3]].map(([label,val])=>(
            <button key={val} onClick={()=>{setDifficulty(val);resetGame();}}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${difficulty===val?'bg-indigo-600 text-white shadow':darkMode?'border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700':'border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>{label}</button>
          ))}
          <button onClick={undoMove} disabled={history.length<2||thinking}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1 ${darkMode?'border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40':'border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40'}`}>
            <FaUndo className="text-[10px]" /> Undo
          </button>
          <button onClick={()=>setStatus('resigned')}
            className="rounded-full px-3 py-1.5 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition flex items-center gap-1">
            <FaFlag className="text-[10px]" /> Resign
          </button>
          <button onClick={resetGame}
            className="rounded-full px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow hover:opacity-90 transition">New Game</button>
          <button onClick={onClose}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${darkMode?'border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700':'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>✕ Close</button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 lg:flex-row">
        {/* board */}
        <div className="relative shrink-0">
          {showPromo && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-2xl">
              <div className={`rounded-2xl p-6 shadow-2xl ${darkMode?'bg-slate-800':'bg-white'}`}>
                <p className={`mb-4 text-center font-bold ${darkMode?'text-slate-100':'text-slate-900'}`}>Promote Pawn</p>
                <div className="flex gap-4">
                  {['Q','R','B','N'].map(t=>(
                    <button key={t} onClick={()=>handlePromotion(t)}
                      className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-3xl text-white shadow hover:bg-indigo-700 transition">
                      {PIECE_UNICODE['w'+t]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex">
            <div className="flex flex-col justify-around pr-1">
              {ranks.map(r=><span key={r} className={`text-xs font-mono ${darkMode?'text-slate-500':'text-slate-400'}`}>{r}</span>)}
            </div>
            <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-indigo-200/40">
              {board.map((row,r)=>(
                <div key={r} className="flex">
                  {row.map((piece,c)=>{
                    const isLight=(r+c)%2===0;
                    const isSel=selected?.[0]===r&&selected?.[1]===c;
                    const isLegal=legalMoves.some(([lr,lc])=>lr===r&&lc===c);
                    const isLast=lastMove&&((lastMove.fr===r&&lastMove.fc===c)||(lastMove.tr===r&&lastMove.tc===c));
                    const isCap=isLegal&&!!piece;
                    let bg=isLight?(darkMode?'bg-slate-600':'bg-indigo-100'):(darkMode?'bg-slate-800':'bg-indigo-300');
                    if(isSel) bg='bg-yellow-400';
                    else if(isLast) bg=isLight?'bg-yellow-200':'bg-yellow-300';
                    return (
                      <div key={c} onClick={()=>handleSquare(r,c)}
                        className={`relative flex h-12 w-12 items-center justify-center cursor-pointer select-none transition-colors duration-150 ${bg} ${isSel?'ring-2 ring-yellow-500 ring-inset':''}`}>
                        {isLegal&&!isCap&&<div className="absolute h-3.5 w-3.5 rounded-full bg-indigo-600/50 pointer-events-none" />}
                        {isCap&&<div className="absolute inset-0 ring-4 ring-rose-500/70 ring-inset pointer-events-none" />}
                        {piece&&<span className={`text-2xl leading-none select-none z-10 ${piece.color==='w'?'drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]':'drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]'}`}>{PIECE_UNICODE[piece.color+piece.type]}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around pl-5 pt-1">
            {files.map(f=><span key={f} className={`text-xs font-mono ${darkMode?'text-slate-500':'text-slate-400'}`}>{f}</span>)}
          </div>
        </div>

        {/* sidebar */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          <div className={`rounded-2xl border px-5 py-4 ${darkMode?'border-slate-700 bg-slate-800':'border-indigo-100 bg-indigo-50'}`}>
            <p className={`text-sm font-bold ${statusColor}`}>{statusMsg}</p>
            <p className={`mt-1 text-xs ${darkMode?'text-slate-400':'text-slate-500'}`}>Move #{moveCount} &nbsp;·&nbsp; {['','Easy','Medium','Hard'][difficulty]}</p>
            {(status==='checkmate'||status==='stalemate'||status==='resigned')&&(
              <button onClick={resetGame} className="mt-3 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">Play Again</button>
            )}
          </div>

          <div className={`rounded-2xl border px-5 py-4 ${darkMode?'border-slate-700 bg-slate-800':'border-indigo-100 bg-white'}`}>
            <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${darkMode?'text-slate-400':'text-slate-500'}`}>Captured</p>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-1">
                <span className={`text-xs mr-1 ${darkMode?'text-slate-400':'text-slate-500'}`}>You took:</span>
                {captured.b.length===0?<span className={`text-xs ${darkMode?'text-slate-600':'text-slate-300'}`}>—</span>:captured.b.map((p,i)=><span key={i} className="text-lg leading-none">{PIECE_UNICODE[p.color+p.type]}</span>)}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className={`text-xs mr-1 ${darkMode?'text-slate-400':'text-slate-500'}`}>AI took:</span>
                {captured.w.length===0?<span className={`text-xs ${darkMode?'text-slate-600':'text-slate-300'}`}>—</span>:captured.w.map((p,i)=><span key={i} className="text-lg leading-none">{PIECE_UNICODE[p.color+p.type]}</span>)}
              </div>
            </div>
          </div>

          <div className={`flex-1 overflow-hidden rounded-2xl border ${darkMode?'border-slate-700 bg-slate-800':'border-indigo-100 bg-white'}`}>
            <p className={`px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-widest ${darkMode?'text-slate-400':'text-slate-500'}`}>Move History</p>
            <div className="max-h-48 overflow-y-auto px-5 pb-4">
              {history.length===0
                ?<p className={`text-xs ${darkMode?'text-slate-600':'text-slate-300'}`}>No moves yet.</p>
                :<div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {history.map((h,i)=>(
                    <div key={i} className={`flex items-center gap-1.5 text-xs ${darkMode?'text-slate-300':'text-slate-600'}`}>
                      <span className={`font-mono ${darkMode?'text-slate-500':'text-slate-400'}`}>{i+1}.</span>
                      <span className="text-base leading-none">{PIECE_UNICODE[h.piece.color+h.piece.type]}</span>
                      <span>{files[h.from[1]]}{ranks[h.from[0]]}→{files[h.to[1]]}{ranks[h.to[0]]}</span>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          <div className={`rounded-2xl border px-5 py-3 ${darkMode?'border-slate-700 bg-slate-800/60':'border-indigo-100 bg-indigo-50/60'}`}>
            <p className={`text-xs ${darkMode?'text-slate-400':'text-slate-500'}`}>
              💡 <strong>Tip:</strong> Click a piece to see legal moves, then click a highlighted square to move.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafeSpace() {
  const navigate = useNavigate();
  const [groupedItems, setGroupedItems] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showChess, setShowChess] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [scrollTop, setScrollTop] = useState(false);
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef(null);

  // ── Feature 1: Mood-Based Recommendation ──────────────────────────────────
  const [lastEmotion, setLastEmotion] = useState(null);
  const [showMoodBanner, setShowMoodBanner] = useState(true);

  const EMOTION_RECOMMENDATION = {
    anxiety:   { section: "breathing",    msg: "Breathing exercises can calm your nervous system right now.",   emoji: "🌬️" },
    stress:    { section: "meditation",   msg: "A short meditation session can help release your stress.",       emoji: "🧘" },
    sadness:   { section: "music",        msg: "Soothing music and comfort notes can gently lift your mood.",    emoji: "🎵" },
    sad:       { section: "affirmations", msg: "Some warm affirmations are waiting for you below.",             emoji: "💛" },
    anger:     { section: "dance-videos",msg: "Move your body — dance it out and release that energy.",         emoji: "💃" },
    happiness: { section: "mini-games",  msg: "You're in a great mood! Enjoy some fun mini games.",             emoji: "🎮" },
    joy:       { section: "mini-games",  msg: "Celebrate your joy with a fun game break!",                      emoji: "🎉" },
    neutral:   { section: "meditation",  msg: "A calm meditation session is perfect for a neutral day.",        emoji: "☁️" },
  };

  useEffect(() => {
    const saved = localStorage.getItem("lastDetectedEmotion");
    if (saved) {
      try { setLastEmotion(JSON.parse(saved)); } catch {}
    }
  }, []);

  const moodRec = lastEmotion
    ? EMOTION_RECOMMENDATION[(lastEmotion.emotion || "").toLowerCase()] || EMOTION_RECOMMENDATION.neutral
    : null;

  const scrollToSection = (sectionKey) => {
    setActiveCategory(sectionKey);
    setTimeout(() => {
      document.getElementById(`section-${sectionKey}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ── Feature 2: Animated Breathing Exercise ────────────────────────────────
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);
  const [breathRunning, setBreathRunning] = useState(false);
  const breathTimerRef = useRef(null);

  const BREATH_PHASES = [
    { phase: "inhale", label: "Inhale",  duration: 4, gradient: "from-cyan-400 to-blue-500",    scale: "scale-[1.6]" },
    { phase: "hold1",  label: "Hold",    duration: 4, gradient: "from-blue-400 to-indigo-500",  scale: "scale-[1.6]" },
    { phase: "exhale", label: "Exhale",  duration: 4, gradient: "from-indigo-400 to-purple-500",scale: "scale-100" },
    { phase: "hold2",  label: "Hold",    duration: 4, gradient: "from-purple-400 to-pink-500",  scale: "scale-100" },
  ];

  const currentBreathPhase = BREATH_PHASES.find(p => p.phase === breathPhase) || BREATH_PHASES[0];

  useEffect(() => {
    if (!breathRunning) return;
    const phaseIndex = BREATH_PHASES.findIndex(p => p.phase === breathPhase);
    setBreathCount(BREATH_PHASES[phaseIndex].duration);
    breathTimerRef.current = setInterval(() => {
      setBreathCount(prev => {
        if (prev <= 1) {
          clearInterval(breathTimerRef.current);
          const next = (phaseIndex + 1) % BREATH_PHASES.length;
          if (next === 0) setBreathCycles(c => c + 1);
          setBreathPhase(BREATH_PHASES[next].phase);
          return BREATH_PHASES[next].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breathTimerRef.current);
  }, [breathPhase, breathRunning]);

  const startBreathing = () => { setBreathRunning(true); setBreathPhase("inhale"); setBreathCycles(0); };
  const stopBreathing  = () => { setBreathRunning(false); clearInterval(breathTimerRef.current); setBreathPhase("inhale"); setBreathCount(4); };

  // scroll-to-top visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ripple on click
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  };

  const categories = Object.keys(sectionMeta);
  const normalizedQuery = query.trim().toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const isSearching = queryTokens.length > 0;

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchSafeSpaceItems = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/safe-space`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const grouped = data.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
          }, {});
          setGroupedItems((prev) => ({ ...prev, ...grouped }));
        }
      } catch (error) {
        console.log("Using fallback safe space data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSafeSpaceItems();
  }, []);

  const getFilteredItems = (category) => {
    const source = groupedItems[category] || [];
    if (!isSearching) return source;
    const q = normalizedQuery;
    return source.filter((item) => {
      const haystack = `${item.title} ${item.description || ""} ${category.replace(/-/g, " ")} ${sectionMeta[category].title} ${sectionMeta[category].keywords}`.toLowerCase();
      return haystack.includes(q);
    });
  };

  const hasAnyVisibleResult = categories.some((cat) => {
    if (!isSearching && activeCategory !== "all" && activeCategory !== cat) return false;
    return getFilteredItems(cat).length > 0;
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dropdownRef = useRef(null);
  const currentUserEmail = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser") || "";
  const currentUserName = sessionStorage.getItem("currentUserName") || localStorage.getItem("currentUserName") || "User";

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* ── Side Navbar ─────────────────────────────────────────────────── */}
      <aside className={`fixed left-0 top-0 z-40 h-full flex-col transition-all duration-300 hidden lg:flex ${
        sidebarOpen ? "w-64" : "w-16"
      } ${
        darkMode
          ? "bg-slate-900/95 border-r border-slate-700/60"
          : "bg-white/95 border-r border-indigo-100"
      } backdrop-blur-xl shadow-2xl`}>

        {/* Logo + Name */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b ${
          darkMode ? "border-slate-700/60" : "border-indigo-100"
        }`}>
          <div onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer transition duration-300">
            <img src={mannlythicsLogo} alt="Mannlytics" className="h-12 w-12 rounded-2xl object-contain shadow-sm transition duration-300 group-hover:scale-110" />
            <div className="transition duration-300 group-hover:scale-105">
              <p className="text-xl font-bold text-indigo-600 tracking-wide">Mannlytics</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>AI-Powered Mental Health Analytics</p>
            </div>
          </div>

        </div>

        {/* Modes List */}
        <nav className={`flex-1 overflow-y-auto py-4 px-2 space-y-1 ${
          darkMode ? "bg-slate-900" : "bg-white"
        }`}>
          {sidebarOpen && (
            <p className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-widest ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}>Modes</p>
          )}
          {categories.map((cat) => {
            const Icon = sectionMeta[cat].icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => scrollToSection(cat)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700/60 bg-transparent"
                      : "text-slate-600 hover:bg-indigo-50 bg-transparent"
                }`}
              >
                <Icon className="text-base shrink-0" />
                {sidebarOpen && <span className="truncate">{sectionMeta[cat].title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className={`px-4 mb-6 mt-auto border-t pt-4 ${
          darkMode ? "border-slate-700/60" : "border-indigo-100"
        }`}>
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-3">
              {darkMode ? <FaSun className="text-yellow-300 text-base shrink-0" /> : <FaMoon className="text-indigo-500 text-base shrink-0" />}
              {sidebarOpen && <p className={`text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}>Dark Mode</p>}
            </div>
            {sidebarOpen && (
              <div
                onClick={() => setDarkMode(prev => !prev)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                  darkMode ? "bg-indigo-500" : "bg-gray-300"
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`} />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={`flex-1 relative min-h-screen overflow-x-hidden overflow-y-auto transition-all duration-300 lg:${
          sidebarOpen ? "ml-64" : "ml-16"
        } ml-0 ${
        darkMode
          ? "bg-[linear-gradient(180deg,#0f172a_0%,#111827_45%,#0b1220_100%)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_26%),linear-gradient(180deg,#f1f5ff_0%,#f8faff_38%,#eef2ff_68%,#f7f9ff_100%)] text-slate-900"
      }`}
      >


      <div className="w-full px-3 sm:px-6 py-4 sm:py-8">
        {/* TOP BAR */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 self-start ${
              darkMode
                ? "border border-slate-600 bg-slate-800/80 text-slate-100 hover:bg-slate-700"
                : "border border-indigo-200/80 bg-white/80 text-indigo-600 hover:bg-white"
            }`}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <FaSearch className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                darkMode ? "text-slate-400" : "text-indigo-400"
              }`} />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (e.target.value.trim()) setActiveCategory("all"); }}
                placeholder="Search..."
                className={`rounded-full border pl-9 pr-4 py-2 text-sm outline-none w-full sm:w-44 ${
                  darkMode
                    ? "border-slate-600 bg-slate-800/80 text-slate-100 placeholder:text-slate-400"
                    : "border-indigo-200 bg-white/80 text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>

            {/* Avatar */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setOpenDropdown(p => !p)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-md text-sm"
                style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)" }}
              >
                {currentUserName?.charAt(0)?.toUpperCase()}
              </div>
              {openDropdown && (
                <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border p-2 z-50 ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-indigo-100 text-gray-800"
                }`}>
                  <div className={`px-4 py-3 border-b ${ darkMode ? "border-gray-700" : "border-gray-100" }`}>
                    <p className="font-semibold text-sm">{currentUserName}</p>
                    <p className="text-xs opacity-70 truncate">{currentUserEmail}</p>
                  </div>
                  <div className="py-2 space-y-1">
                    <button onClick={() => { setOpenDropdown(false); navigate("/profile"); }} style={{ backgroundColor: "transparent" }} className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left text-sm ${ darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50" }`}>👤 Profile</button>
                    <button onClick={() => { setOpenDropdown(false); navigate("/settings"); }} style={{ backgroundColor: "transparent" }} className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left text-sm ${ darkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50" }`}>⚙️ Settings</button>
                  </div>
                  <div className={`border-t pt-2 ${ darkMode ? "border-gray-700" : "border-gray-100" }`}>
                    <button onClick={() => { sessionStorage.removeItem("token"); sessionStorage.removeItem("currentUser"); sessionStorage.removeItem("currentUserName"); localStorage.removeItem("currentUser"); localStorage.removeItem("currentUserName"); setOpenDropdown(false); window.dispatchEvent(new Event("userLogout")); navigate("/"); }} style={{ backgroundColor: "transparent" }} className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-500 rounded-lg ${ darkMode ? "hover:bg-red-900/30" : "hover:bg-red-50" }`}>🚪 Logout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE CATEGORY CHIPS */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : darkMode ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-white text-slate-600 border border-indigo-100"
            }`}
          >All</button>
          {categories.map((cat) => {
            const Icon = sectionMeta[cat].icon;
            return (
              <button
                key={cat}
                onClick={() => scrollToSection(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white"
                    : darkMode ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-white text-slate-600 border border-indigo-100"
                }`}
              >
                <Icon className="text-[10px]" />
                {sectionMeta[cat].title}
              </button>
            );
          })}
        </div>

        <section className={`hero-soft relative mb-6 overflow-hidden rounded-3xl border shadow-[0_8px_32px_rgba(99,102,241,0.10)] ${
          darkMode ? "border-slate-700/60" : "border-indigo-100"
        }`} style={{background: darkMode ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(to right, #a5b4fc 0%, #93c5fd 40%, #e0f2fe 100%)'}}>
          <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-2 left-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />

          {/* Background image on right side */}
          <div className="absolute inset-0">
            <img src={meditationImg} alt="" className="absolute inset-0 h-full w-full object-cover object-right opacity-100 sm:w-auto sm:right-0 sm:left-auto" style={{transform: 'sm:translateX(-160px)'}} />
            <div className="absolute inset-0 bg-black/50 sm:hidden" />
            <div className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-r from-[#1e293b] via-[#1e293b]/80 to-[#1e293b]/40"
                : "bg-gradient-to-r from-[#818cf8] via-[#3b82f6]/80 to-[#7dd3fc]/30"
            }`} />
          </div>

          <div className="relative px-4 py-5 sm:px-8 sm:py-6 md:px-10 md:py-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs sm:text-sm text-white/90 backdrop-blur-xl">
              🌿 Calm Corner
            </div>
            <h1 className="mt-3 text-xl sm:text-3xl md:text-4xl font-black leading-tight text-white max-w-lg">
              Your calm recovery zone
            </h1>
            <p className="mt-3 max-w-sm sm:max-w-md text-sm sm:text-base leading-6 text-white/85">
              Soothing music, meditation, breathing exercises, and uplifting support — all in one place.
            </p>
            <button
              onClick={() => setShowBreathing(p => !p)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold text-white hover:bg-white/30 transition duration-300"
            >
              Start Relaxing
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
        </section>

        {/* ── Animated Breathing Exercise (Start Relaxing) ── */}
        {showBreathing && (
          <div className={`mb-6 overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(6,182,212,0.18)] ${
            darkMode
              ? "border-cyan-500/20 bg-gradient-to-br from-slate-900 via-cyan-950/50 to-slate-900"
              : "border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-white to-sky-50"
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-7 py-5 border-b ${
              darkMode ? "border-cyan-500/15" : "border-cyan-100"
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg text-xl">🌬️</div>
                <div>
                  <p className={`text-base font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>Animated Breathing Exercise</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? "text-cyan-400/70" : "text-cyan-600/80"}`}>Box breathing · 4-4-4-4 pattern · Reduces anxiety instantly</p>
                </div>
              </div>
              <button
                onClick={() => { setShowBreathing(false); stopBreathing(); }}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition hover:scale-110 ${
                  darkMode ? "bg-slate-700/70 text-slate-400 hover:bg-slate-600" : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
                }`}
              >✕</button>
            </div>

            <div className="px-7 py-8">
              <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">

                {/* Left — phase steps */}
                <div className="flex-1 space-y-3">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${
                    darkMode ? "text-cyan-400/60" : "text-cyan-600/70"
                  }`}>Box Breathing — 4 phases × 4 seconds</p>
                  {BREATH_PHASES.map((p, i) => {
                    const isActive = breathPhase === p.phase && breathRunning;
                    return (
                      <div key={p.phase} className={`flex items-center gap-4 rounded-2xl p-4 border transition-all duration-500 ${
                        isActive
                          ? darkMode
                            ? "bg-cyan-900/40 border-cyan-500/50 shadow-[0_0_24px_rgba(6,182,212,0.15)] scale-[1.02]"
                            : "bg-cyan-50 border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.15)] scale-[1.02]"
                          : darkMode
                            ? "bg-slate-800/40 border-slate-700/40"
                            : "bg-white/80 border-slate-100"
                      }`}>
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-sm font-black text-white shadow-md transition-all duration-300 ${
                          isActive ? "scale-110 shadow-lg" : ""
                        }`}>{i + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{p.label}</p>
                            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                              isActive
                                ? "bg-cyan-500 text-white"
                                : darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"
                            }`}>{p.duration}s</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${
                            isActive
                              ? darkMode ? "text-cyan-300" : "text-cyan-700"
                              : darkMode ? "text-slate-400" : "text-slate-500"
                          }`}>
                            {p.phase === "inhale" ? "Breathe in slowly through your nose"
                              : p.phase === "exhale" ? "Breathe out slowly through your mouth"
                              : "Hold your breath gently and stay still"}
                          </p>
                        </div>
                        {isActive && (
                          <div className="flex gap-0.5 items-end shrink-0">
                            {[0,1,2,1,0].map((h, idx) => (
                              <span key={idx} className="inline-block w-1 rounded-full bg-cyan-400 animate-bounce"
                                style={{ height: `${8 + h * 5}px`, animationDelay: `${idx * 0.1}s` }} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right — circle + controls */}
                <div className="flex flex-col items-center gap-6">
                  {/* Animated ring */}
                  <div className="relative flex h-60 w-60 items-center justify-center">
                    <div className="relative flex h-60 w-60 items-center justify-center overflow-hidden rounded-full">
                    {/* outer glow */}
                    <div className={`absolute h-full w-full rounded-full bg-gradient-to-br ${currentBreathPhase.gradient} opacity-[0.07] blur-xl transition-all duration-1000 ease-in-out ${currentBreathPhase.scale}`} />
                    <div className={`absolute h-[80%] w-[80%] rounded-full bg-gradient-to-br ${currentBreathPhase.gradient} opacity-10 transition-all duration-1000 ease-in-out ${currentBreathPhase.scale}`} />
                    <div className={`absolute h-[60%] w-[60%] rounded-full bg-gradient-to-br ${currentBreathPhase.gradient} opacity-15 transition-all duration-1000 ease-in-out ${currentBreathPhase.scale}`} />
                    {/* core circle */}
                    <div className={`relative flex h-[42%] w-[42%] flex-col items-center justify-center rounded-full bg-gradient-to-br ${currentBreathPhase.gradient} shadow-[0_0_48px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-in-out ${currentBreathPhase.scale}`}>
                      <span className="text-4xl font-black text-white leading-none tabular-nums">{breathCount}</span>
                      <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest mt-1">{currentBreathPhase.label}</span>
                    </div>
                  </div>
                  {/* dashed ring outside overflow — fixed size, no scale */}
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed pointer-events-none opacity-30 ${
                    darkMode ? "border-cyan-400" : "border-cyan-500"
                  }`} />
                  </div>

                  {/* Status text */}
                  <p className={`text-sm font-semibold text-center ${
                    breathRunning
                      ? darkMode ? "text-cyan-300" : "text-cyan-600"
                      : darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {breathRunning
                      ? `Cycle ${breathCycles + 1} · ${currentBreathPhase.label}...`
                      : "Press Start to begin your session"}
                  </p>

                  {/* Cycle badge */}
                  {breathCycles > 0 && (
                    <div className={`rounded-2xl px-5 py-2.5 text-sm font-bold text-center ${
                      darkMode ? "bg-emerald-900/40 border border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    }`}>
                      ✅ {breathCycles} cycle{breathCycles > 1 ? "s" : ""} completed!
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {!breathRunning
                      ? <button onClick={startBreathing} className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(6,182,212,0.4)] transition hover:scale-105 hover:shadow-[0_12px_32px_rgba(6,182,212,0.5)]">▶ Start Session</button>
                      : <button onClick={stopBreathing} className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(239,68,68,0.35)] transition hover:scale-105">⏹ Stop</button>
                    }
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}

        {/* ── Feature 1: Mood-Based Recommendation Banner ── */}
        {moodRec && showMoodBanner && (
          <div className={`mb-6 relative overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(99,102,241,0.18)] section-anim ${
            darkMode ? "border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80" : "border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-violet-50"
          }`} style={{ "--revealDelay": "60ms", "--floatDelay": "400ms" }}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-5 p-6">
              <div className="flex items-center gap-5">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg text-3xl ${
                  darkMode ? "bg-indigo-900/60 border border-indigo-500/30" : "bg-white border border-indigo-100"
                }`}>
                  {moodRec.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                      🤖 AI Recommendation
                    </span>
                    <span className={`text-[11px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Based on your last analysis</span>
                  </div>
                  <p className={`text-lg font-bold leading-snug ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                    Detected: <span className="capitalize bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{lastEmotion?.emotion}</span>
                  </p>
                  <p className={`mt-0.5 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{moodRec.msg}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollToSection(moodRec.section)}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(99,102,241,0.45)]"
                >
                  <span className="absolute -left-8 top-0 h-full w-6 rotate-12 bg-white/25 blur-sm transition-all duration-500 group-hover:translate-x-20" />
                  <span className="relative">Go to {sectionMeta[moodRec.section]?.title} →</span>
                </button>
                <button onClick={() => setShowMoodBanner(false)} className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110 ${
                  darkMode ? "bg-slate-700/60 text-slate-400 hover:bg-slate-600" : "bg-white/80 text-slate-400 hover:bg-slate-100"
                }`}>✕</button>
              </div>
            </div>
          </div>
        )}


        
        {loading && (
          <div
            className={`mb-8 rounded-2xl p-4 shadow-lg backdrop-blur-xl ${
              darkMode
                ? "border border-slate-700 bg-slate-800/80 text-slate-300"
                : "border border-white/80 bg-white/80 text-slate-600"
            }`}
          >
            Loading safe space content...
          </div>
        )}

        {!loading && !hasAnyVisibleResult && (
          <div
            className={`mb-8 rounded-2xl border p-4 text-sm ${
              darkMode
                ? "border-slate-700 bg-slate-800/70 text-slate-300"
                : "border-indigo-100 bg-white/80 text-slate-600"
            }`}
          >
            No result found. Try another search or switch mode filter.
          </div>
        )}

        <div className="space-y-12">
          {categories.map((category, catIndex) => {
            if (!isSearching && activeCategory !== "all" && activeCategory !== category) {
              return null;
            }

            const items = getFilteredItems(category);
            const Icon = sectionMeta[category].icon;
            if (!items.length) return null;

            return (
              <section
                key={category}
                id={`section-${category}`}
                className="section-anim"
                style={{
                  "--revealDelay": `${120 + catIndex * 90}ms`,
                  "--floatDelay": `${700 + catIndex * 140}ms`,
                }}
              >
                {/* Section header */}
                <div className={`mb-8 flex items-center gap-4 pl-4 border-l-4 border-indigo-500`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${sectionMeta[category].tone} shadow-md`}>
                    <Icon className="text-xl text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black md:text-3xl ${darkMode ? "text-slate-100" : "text-slate-800"}`}>{sectionMeta[category].title}</h2>
                    <p className={`text-sm mt-0.5 italic ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{sectionMeta[category].tagline}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {/* Chess card — only in mini-games */}
                  {category === "mini-games" && (
                    <div className={`card-in group relative overflow-hidden rounded-[1.8rem] border transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                      darkMode
                        ? "border-slate-700 bg-slate-800/90 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
                        : "border-white/80 bg-white shadow-[0_18px_48px_rgba(79,70,229,0.10)]"
                    }`}>
                      <div className="relative h-36 overflow-hidden rounded-t-[1.8rem]">
                        <img
                          src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80"
                          alt="Chess"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 opacity-60" />
                        <div className="absolute bottom-3 left-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-white text-lg">♟</div>
                        </div>
                        <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">vs AI</div>
                      </div>
                      <div className="p-5">
                        <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode?'text-slate-400':'text-indigo-400'}`}>Mind Game</p>
                        <h3 className={`mt-1 text-lg font-bold ${darkMode?'text-slate-100':'text-slate-900'}`}>Chess vs AI</h3>
                        <p className={`mt-2 text-sm leading-6 ${darkMode?'text-slate-400':'text-slate-500'}`}>
                          Full chess with Minimax AI. Undo moves, track captures, pawn promotion & move history.
                        </p>
                        <button
                          onClick={() => setShowChess(true)}
                          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-[1.04] hover:shadow-xl"
                        >
                          Play Chess <FaChess className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )}
                  {items.slice(0, 4).map((item, index) => (
                    <div
                      key={item._id}
                      className={`card-in card-loop group relative overflow-hidden rounded-[1.8rem] border transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                        darkMode
                          ? "border-slate-700 bg-slate-800/90 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
                          : "border-white/80 bg-white shadow-[0_18px_48px_rgba(79,70,229,0.10)]"
                      }`}
                      style={{ "--cardDelay": `${catIndex * 120 + index * 90}ms` }}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
                        const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
                        e.currentTarget.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
                      }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                      onClick={addRipple}
                    >
                      {/* ripple effects */}
                      {ripples.map(rp => (
                        <span key={rp.id} className="ripple-effect pointer-events-none absolute rounded-full bg-indigo-400/30"
                          style={{ left: rp.x, top: rp.y }} />
                      ))}

                      {/* card image banner */}
                      <div className="relative h-36 overflow-hidden rounded-t-[1.8rem]">
                        <img
                          src={item.img || CARD_IMAGES[category]?.[index % 4] || sectionMeta[category].img}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${sectionMeta[category].tone} opacity-60`} />
                        <div className="absolute bottom-3 left-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/25 backdrop-blur-md border border-white/30">
                            <Icon className="text-sm text-white" />
                          </div>
                        </div>
                        {item.duration && (
                          <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            {item.duration}
                          </div>
                        )}
                      </div>

                      {/* card body */}
                      <div className="p-5">
                        <h3
                          className={`text-lg font-bold leading-snug cursor-help ${
                            darkMode ? "text-slate-100" : "text-slate-900"
                          }`}
                          onMouseEnter={(e) => {
                            const r = e.currentTarget.getBoundingClientRect();
                            setTooltip({ text: item.description, x: r.left + r.width/2, y: r.top });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        >{item.title}</h3>

                        <p className={`mt-2 text-sm leading-6 ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>{item.description}</p>

                        {item.mediaType === "text" ? (
                          <div className={`mt-4 rounded-2xl border p-4 ${
                            darkMode
                              ? "border-slate-700 bg-slate-900/70 text-slate-200"
                              : "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-700"
                          }`}>
                            <p className="text-sm leading-6">{item.description}</p>
                          </div>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:scale-[1.04] hover:shadow-xl bg-gradient-to-r ${sectionMeta[category].tone}`}
                          >
                            Open Now <FaPlay className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ── Chess fullscreen overlay ──────────────────────────────────────── */}
      {showChess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <ChessGame darkMode={darkMode} onClose={() => setShowChess(false)} />
          </div>
        </div>
      )}

      {/* ── Tooltip popup ─────────────────────────────────────────────── */}
      {tooltip && (
        <div
          className="tooltip-popup pointer-events-none fixed z-[60] max-w-xs rounded-2xl border border-white/20 bg-slate-900/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-xl"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -110%)" }}
        >
          {tooltip.text}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}

      {/* ── Scroll to top ───────────────────────────────────────────────── */}
      {scrollTop && (
        <button
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-top-btn fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-xl transition hover:scale-110 hover:shadow-indigo-500/40"
          aria-label="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      )}

      </div>
    </div>
  );
}

export default SafeSpace;
