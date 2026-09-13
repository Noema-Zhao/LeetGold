"use client";

import { useEffect, useMemo, useState } from "react";
import { PROBLEMS, UNITS, byTopic, difficultyLabel, type Problem, type TopicKey } from "./game-data";

type Screen = "map" | "library" | "review";
type Lesson = { unitIndex: number; levelIndex: number } | null;
type FeedbackState = { kind: "idle" | "correct" | "wrong"; answer?: string };
type Lc3Frame = { right: number | null; ch: string; left: number; ans: number; last: Record<string, number>; line: number; message: string };

const INTRO_EXAMPLES: Record<TopicKey, string> = { hash:"1", linked:"206", search:"704", dp:"53", tree:"102", graph:"200", stack:"20", string:"415", array:"54" };
const IGNORED = new Set(["class","Solution","for","while","if","else","elif","in","and","or","not","return","def","True","False","None","range","len","max","min","int","str","enumerate","self","ListNode","TreeNode"]);
const MEANINGS: Record<string,string> = {
  right:"滑动窗口的右边界，也是当前遍历到的下标", ch:"当前由字符串中取出的字符", last:"哈希表：记录每个字符最近一次出现的下标", left:"当前合法滑动窗口的左边界", ans:"到目前为止找到的最优答案",
  seen:"哈希表：记录已经见过的数值及其下标", i:"当前元素的数组下标", x:"当前正在处理的元素值", need:"与当前值配对后能达到目标的补数", target:"题目要求达到的目标值",
  nums:"题目给定的输入数组", current:"以当前位置结尾或当前时刻的状态", answer:"扫描至今得到的最优答案", best:"扫描至今得到的最优值", count:"用于记录出现次数或当前计数", prefix:"从开头累加到当前位置的前缀和",
  prev:"已处理部分的前驱节点或上一状态", cur:"当前正在处理的链表节点", nxt:"修改指针前暂存的下一个节点", slow:"每次移动一步的慢指针", fast:"每次移动两步或提前移动的快指针", dummy:"放在真实头节点前的哑节点，用来统一边界",
  head:"链表的头节点", tail:"结果链表当前的尾节点", node:"当前访问的树或链表节点", root:"二叉树的根节点", queue:"保存等待按顺序访问的节点", stack:"保存尚未完成或需要回退的状态",
  dp:"动态规划状态表，保存已经解决的子问题答案", path:"回溯过程中当前选择出的路径", used:"标记元素是否已经进入当前路径", row:"当前处理的矩阵行", col:"当前处理的矩阵列", mid:"二分区间的中点",
  start:"候选区间或搜索范围的起点", end:"候选区间或搜索范围的终点", total:"当前累加得到的总和", carry:"逐位计算产生、需要带到下一位的进位", value:"当前解析、累积或比较的数值", heap:"维护当前最小或最大候选项的优先队列"
};

function makeLc3Frames(): Lc3Frame[] {
  const frames: Lc3Frame[] = [{right:null,ch:"—",left:0,ans:0,last:{},line:2,message:"初始化：last 为空，窗口左端 left=0，答案 ans=0。"}];
  const text = "abcabcbb"; const last: Record<string,number> = {}; let left=0, ans=0;
  for (const [right,ch] of [...text].entries()) {
    frames.push({right,ch,left,ans,last:{...last},line:3,message:`enumerate 进入新一轮：right=${right}，ch='${ch}'。`});
    const repeated = ch in last && last[ch] >= left;
    frames.push({right,ch,left,ans,last:{...last},line:4,message:repeated?`'${ch}' 上次出现在 ${last[ch]}，且仍在窗口内，条件成立。`:`'${ch}' 没有在当前窗口出现，left 保持 ${left}。`});
    if (repeated) { left=last[ch]+1; frames.push({right,ch,left,ans,last:{...last},line:5,message:`为排除重复字符，left 移到 ${left}。`}); }
    last[ch]=right; frames.push({right,ch,left,ans,last:{...last},line:6,message:`更新 last['${ch}']=${right}，保存它最近出现的位置。`});
    ans=Math.max(ans,right-left+1); frames.push({right,ch,left,ans,last:{...last},line:7,message:`当前窗口是 "${text.slice(left,right+1)}"，长度 ${right-left+1}，ans 更新为 ${ans}。`});
  }
  frames.push({right:7,ch:"b",left,ans,last:{...last},line:8,message:`遍历结束，返回最长无重复子串长度 ${ans}。`});
  return frames;
}
const LC3_FRAMES = makeLc3Frames();

function playSound(kind:"tap"|"correct"|"wrong"|"coin", enabled:boolean) {
  if (!enabled || typeof window === "undefined") return;
  const Audio = window.AudioContext || (window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  if (!Audio) return;
  const ctx=new Audio(); const notes=kind==="correct"?[523,659,784]:kind==="coin"?[880,1175,1568]:kind==="wrong"?[180,145]:[430];
  notes.forEach((frequency,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind==="wrong"?"square":"sine";osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,ctx.currentTime+i*.075);gain.gain.exponentialRampToValueAtTime(kind==="tap"?.02:.065,ctx.currentTime+i*.075+.01);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+i*.075+.15);osc.connect(gain);gain.connect(ctx.destination);osc.start(ctx.currentTime+i*.075);osc.stop(ctx.currentTime+i*.075+.16)});
}

function Header({coins,streak,soundOn,onSound}:{coins:number;streak:number;soundOn:boolean;onSound:()=>void}) {
  return <header className="topbar"><div className="brand"><span className="brand-mark">⛏</span><span>LeetGold</span></div><div className="stats"><span>🔥 {streak}</span><span className="coin-stat">● {coins}</span><button className="sound-toggle" onClick={onSound} aria-label="切换音效">{soundOn?"♪":"×"}</button></div></header>;
}

function Statement({problem,compact=false}:{problem:Problem;compact?:boolean}) {
  return <article className={`statement-card ${compact?"compact":""}`}><div><span>题目</span><b>LC {problem.id} · {problem.title}</b></div><p>{problem.statement}</p></article>;
}

function Lc3Visual({step}:{step:number}) {
  const f=LC3_FRAMES[Math.min(step,LC3_FRAMES.length-1)], chars=[..."abcabcbb"];
  return <div className="visual lc3-visual"><div className="iteration-board"><span><small>right</small><b>{f.right??"—"}</b></span><span><small>ch</small><b>{f.ch}</b></span><span><small>left</small><b>{f.left}</b></span><span><small>ans</small><b>{f.ans}</b></span></div><div className="window-track">{chars.map((c,i)=><span className={`${f.right!==null&&i>=f.left&&i<=f.right?"active":""} ${i===f.right?"cursor":""}`} key={i}>{c}<small>{i}</small></span>)}</div><div className="memory-card"><span>last</span><code>{JSON.stringify(f.last).replaceAll('"',"'")}</code></div><p className="frame-message">{f.message}</p></div>;
}

function DemoVisual({problem,step}:{problem:Problem;step:number}) {
  if(problem.id==="3") return <Lc3Visual step={step}/>;
  const progress=Math.min(4,step);
  if(problem.id==="1") {const nums=[2,7,11,15],index=Math.min(Math.max(step-1,0),1);return <div className="visual"><div className="target-pill">target = 9</div><div className="array-row">{nums.map((n,i)=><div className={`array-cell ${i===index?"focus":""} ${step>3&&i<2?"matched":""}`} key={n}><b>{n}</b><small>{i===index?`i=${i}, x=${n}`:`i=${i}`}</small></div>)}</div><div className="memory-card"><span>seen</span><code>{step<3?"{}":step<5?"{2: 0}":"{2: 0} · 找到补数 2"}</code></div></div>}
  if(problem.topic==="linked") return <div className="visual"><div className="node-chain">{[1,2,3,4].map((n,i)=><div className={`node-wrap ${i<=progress?"visited":""}`} key={n}><span>{n}</span>{i<3&&<b>{i<progress?"←":"→"}</b>}</div>)}</div><div className="memory-card"><span>指针快照</span><code>prev={Math.max(0,progress)} · cur={Math.min(4,progress+1)}</code></div></div>;
  if(problem.topic==="tree") return <div className="visual tree-visual"><div className={`tree-node ${progress>0?"focus":""}`}>5</div><div className="branches">╱　╲</div><div className="tree-row"><span className={progress>1?"focus":""}>3</span><span className={progress>2?"focus":""}>8</span></div><div className="branches small">╱ ╲　╱ ╲</div><div className="tree-row leaves"><span>2</span><span>4</span><span>7</span><span>9</span></div></div>;
  if(problem.topic==="graph") return <div className="visual grid-visual">{Array.from({length:16},(_,i)=><span className={i<=progress*2?"visited":i%3?"land":""} key={i}>{i<=progress*2?"✓":i%3?"1":"0"}</span>)}</div>;
  return <div className="visual"><div className="array-row">{[4,1,7,3,6].map((n,i)=><div className={`array-cell ${i===progress?"focus":""} ${i<progress?"matched":""}`} key={i}><b>{n}</b><small>i={i}</small></div>)}</div><div className="memory-card"><span>{problem.topic==="dp"?"dp 状态":"当前状态"}</span><code>处理下标 {progress}，更新答案</code></div></div>;
}

function Feedback({state,onRetry}:{state:FeedbackState;onRetry:()=>void}) {
  if(state.kind==="idle") return null;
  return <div className={`feedback ${state.kind}`}><b>{state.kind==="correct"?"挖到了！":"岩层塌了，再挖一次"}</b><span>{state.kind==="correct"?"回答正确，可以前往下一步。":"正确答案已经标出；看懂后必须重做本题才能继续。"}</span>{state.kind==="wrong"&&state.answer&&<pre>{state.answer}</pre>}{state.kind==="wrong"&&<button onClick={onRetry}>↻ 重做同一道题</button>}</div>;
}

export default function Home(){
  const [screen,setScreen]=useState<Screen>("map"),[activeUnit,setActiveUnit]=useState(0),[lesson,setLesson]=useState<Lesson>(null);
  const [stage,setStage]=useState(0),[demoStep,setDemoStep]=useState(0),[playing,setPlaying]=useState(false),[completed,setCompleted]=useState<string[]>([]),[coins,setCoins]=useState(120),[soundOn,setSoundOn]=useState(true);
  const [feedback,setFeedback]=useState<FeedbackState>({kind:"idle"}),[selectedQuiz,setSelectedQuiz]=useState<string[]>([]),[orderAnswer,setOrderAnswer]=useState<string[]>([]),[search,setSearch]=useState("");
  const [meaningIndex,setMeaningIndex]=useState(0),[meaningChoice,setMeaningChoice]=useState(""),[clozeIndex,setClozeIndex]=useState(0),[clozeMode,setClozeMode]=useState<"choice"|"type">("choice"),[clozeChoice,setClozeChoice]=useState(""),[typedLine,setTypedLine]=useState("");

  useEffect(()=>{try{const fresh=JSON.parse(localStorage.getItem("leetgold-progress")||"null"),old=JSON.parse(localStorage.getItem("algogo-progress")||"null"),saved=fresh||old;if(saved){setCompleted(saved.completed||[]);setCoins(saved.coins??saved.xp??120);setSoundOn(saved.soundOn??true)}}catch{}},[]);
  useEffect(()=>{localStorage.setItem("leetgold-progress",JSON.stringify({completed,coins,soundOn}))},[completed,coins,soundOn]);

  const unit=UNITS[activeUnit],unitProblems=byTopic(unit.key),problem=lesson&&lesson.levelIndex>0?byTopic(UNITS[lesson.unitIndex].key)[lesson.levelIndex-1]:null;
  const codeLines=useMemo(()=>problem?.code.split("\n").filter(Boolean)??[],[problem]);
  const demoLength=problem?.id==="3"?LC3_FRAMES.length:Math.min(8,Math.max(1,codeLines.length));
  useEffect(()=>{if(!playing)return;const timer=window.setInterval(()=>setDemoStep(s=>(s+1)%demoLength),850);return()=>window.clearInterval(timer)},[playing,demoLength]);
  const activeCodeLine=problem?.id==="3"?LC3_FRAMES[Math.min(demoStep,LC3_FRAMES.length-1)].line:demoStep%Math.max(1,codeLines.length);
  const orderLines=useMemo(()=>codeLines.filter(x=>!x.trim().startsWith("class ")&&!x.trim().startsWith("def ")).slice(0,Math.min(6,codeLines.length)),[codeLines]);
  const shuffledLines=useMemo(()=>rotate(orderLines,2),[orderLines]);
  const meaningQuestions=useMemo(()=>getMeaningQuestions(problem),[problem]);
  const keyLines=useMemo(()=>getKeyLines(problem,codeLines),[problem,codeLines]);
  const currentMeaning=meaningQuestions[Math.min(meaningIndex,meaningQuestions.length-1)],currentKeyLine=keyLines[Math.min(clozeIndex,keyLines.length-1)];
  const lessonKey=lesson?`${UNITS[lesson.unitIndex].key}-${lesson.levelIndex===0?"intro":problem?.id}`:"";
  const introOptions=lesson?[...byTopic(UNITS[lesson.unitIndex].key).slice(0,3),...byTopic(UNITS[(lesson.unitIndex+1)%UNITS.length].key).slice(0,2)]:[];
  const introCorrect=lesson?introOptions.filter(p=>p.topic===UNITS[lesson.unitIndex].key).map(p=>p.id):[];
  const introExample=lesson?PROBLEMS.find(p=>p.id===INTRO_EXAMPLES[UNITS[lesson.unitIndex].key])!:PROBLEMS[0];
  const completedProblems=completed.filter(x=>!x.endsWith("intro")).length,filtered=PROBLEMS.filter(p=>`${p.id}${p.title}`.toLowerCase().includes(search.toLowerCase()));

  const resetInteraction=()=>{setStage(0);setDemoStep(0);setPlaying(false);setFeedback({kind:"idle"});setSelectedQuiz([]);setOrderAnswer([]);setMeaningIndex(0);setMeaningChoice("");setClozeIndex(0);setClozeMode("choice");setClozeChoice("");setTypedLine("")};
  const openLesson=(unitIndex:number,levelIndex:number)=>{setActiveUnit(unitIndex);setLesson({unitIndex,levelIndex});resetInteraction();playSound("tap",soundOn)};
  const closeLesson=()=>{setLesson(null);setPlaying(false);setFeedback({kind:"idle"})};
  const reward=()=>{if(!completed.includes(lessonKey)){setCompleted(c=>[...c,lessonKey]);setCoins(c=>c+20)}setFeedback({kind:"correct"});playSound("coin",soundOn);navigator.vibrate?.([30,40,30])};
  const wrong=(answer:string)=>{setFeedback({kind:"wrong",answer});playSound("wrong",soundOn);navigator.vibrate?.(80)};
  const retry=(clear:()=>void)=>{setFeedback({kind:"idle"});clear();playSound("tap",soundOn)};
  const nextStage=()=>{setFeedback({kind:"idle"});setStage(s=>s+1);playSound("tap",soundOn)};

  const checkIntro=()=>{const ok=selectedQuiz.length===introCorrect.length&&selectedQuiz.every(x=>introCorrect.includes(x));ok?reward():wrong(introOptions.filter(x=>introCorrect.includes(x.id)).map(x=>`LC ${x.id} · ${x.title}`).join("\n"))};
  const checkOrder=()=>{const ok=orderAnswer.length===orderLines.length&&orderAnswer.every((x,i)=>x===orderLines[i]);ok?(setFeedback({kind:"correct"}),playSound("correct",soundOn)):wrong(orderLines.join("\n"))};
  const checkMeaning=()=>{if(!currentMeaning)return;meaningChoice===currentMeaning.answer?(setFeedback({kind:"correct"}),playSound("correct",soundOn)):wrong(currentMeaning.answer)};
  const advanceMeaning=()=>{if(meaningIndex<meaningQuestions.length-1){setMeaningIndex(i=>i+1);setMeaningChoice("");setFeedback({kind:"idle"})}else nextStage()};
  const checkCloze=()=>{if(!currentKeyLine)return;const ok=clozeMode==="choice"?clozeChoice===currentKeyLine:normalize(typedLine)===normalize(currentKeyLine);if(ok){setFeedback({kind:"correct"});playSound("correct",soundOn)}else wrong(currentKeyLine)};
  const advanceCloze=()=>{if(clozeMode==="choice"){setClozeMode("type");setClozeChoice("");setFeedback({kind:"idle"});return}if(clozeIndex<keyLines.length-1){setClozeIndex(i=>i+1);setClozeMode("choice");setTypedLine("");setFeedback({kind:"idle"})}else{reward();setStage(4)}};

  return <main className="app-shell"><Header coins={coins} streak={Math.max(1,Math.ceil(completedProblems/3))} soundOn={soundOn} onSound={()=>setSoundOn(x=>!x)}/>
    {screen==="map"&&<><div className="unit-tabs">{UNITS.map((u,i)=><button className={activeUnit===i?"active":""} onClick={()=>setActiveUnit(i)} key={u.key}>{i+1}</button>)}</div><section className="hero-card"><div><span className="eyebrow">矿区 {activeUnit+1} · {unitProblems.length} 个矿点</span><h1>{unit.title}</h1><p>{unit.description}</p></div><div className="hero-orb"><span>⛏</span><small>{unit.icon}</small></div></section><div className="unit-progress"><span style={{width:`${completed.filter(x=>x.startsWith(unit.key)).length/(unitProblems.length+1)*100}%`}}/><b>{completed.filter(x=>x.startsWith(unit.key)).length}/{unitProblems.length+1}</b></div><section className="path">{[null,...unitProblems].map((p,index)=>{const key=`${unit.key}-${index===0?"intro":p?.id}`,done=completed.includes(key);return <div className={`path-row side-${index%3}`} key={key}><button className={`level-node ${done?"done":"current"}`} onClick={()=>openLesson(activeUnit,index)}><span>{done?"●":index===0?"📜":p?.id.replace("剑指 Offer ","O")}</span></button><span className="level-label">{index===0?"矿区指南":p?.title}</span>{p&&<small className="rank-label">TOP {p.rank} · +20 金币</small>}</div>})}</section>{activeUnit<UNITS.length-1&&<button className="next-unit" onClick={()=>setActiveUnit(x=>x+1)}><span className="unit-number">{String(activeUnit+2).padStart(2,"0")}</span><div><b>{UNITS[activeUnit+1].title}</b><small>{byTopic(UNITS[activeUnit+1].key).length} 个矿点等待开采</small></div><span>→</span></button>}</>}
    {screen==="library"&&<section className="library-view"><span className="eyebrow dark">CODETOP TOP 100</span><h1>黄金题库</h1><div className="search-box">⌕<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索题号或名称"/></div><div className="problem-list">{filtered.map(p=>{const ui=UNITS.findIndex(u=>u.key===p.topic),li=byTopic(p.topic).findIndex(x=>x.id===p.id)+1;return <button onClick={()=>openLesson(ui,li)} key={p.id}><span className="problem-rank">{p.rank}</span><div><b>LC {p.id} · {p.title}</b><small>{UNITS[ui].title} · {difficultyLabel(p.difficulty)} · 频次 {p.frequency}</small></div><span className={completed.includes(`${p.topic}-${p.id}`)?"mini-check complete":"mini-check"}>{completed.includes(`${p.topic}-${p.id}`)?"●":"→"}</span></button>})}</div></section>}
    {screen==="review"&&<section className="review-view"><span className="eyebrow dark">MINER LOG</span><h1>矿工日志</h1><div className="mastery-card"><div className="mastery-ring"><b>{completedProblems}</b><small>/100</small></div><div><h2>已开采题目</h2><p>每次正确复现，知识才真正变成你的金币。</p></div></div><h3>各矿区进度</h3><div className="review-units">{UNITS.map((u,i)=>{const count=completed.filter(x=>x.startsWith(u.key)&&!x.endsWith("intro")).length,total=byTopic(u.key).length;return <button key={u.key} onClick={()=>{setActiveUnit(i);setScreen("map")}}><span className="review-icon">⛏</span><div><b>{u.title}</b><span><i style={{width:`${count/total*100}%`}}/></span></div><small>{count}/{total}</small></button>})}</div></section>}

    {lesson&&<div className="lesson-page"><header className="lesson-header"><button onClick={closeLesson}>×</button><div className="lesson-progress"><span style={{width:`${lesson.levelIndex===0?100:(stage+1)*25}%`}}/></div><span className="coin-stat">● {coins}</span></header>{lesson.levelIndex===0?<section className="lesson-content intro-lesson"><span className="lesson-kicker">矿区 {lesson.unitIndex+1} · 入场指南</span><h2>{UNITS[lesson.unitIndex].title}</h2><div className="miner-scene"><span className="helmet">⛑</span><span className="pickaxe">⛏</span><i/><b>Au</b></div><p className="lead">{UNITS[lesson.unitIndex].description}</p><Statement problem={introExample}/><div className="concept-explain"><b>为什么这道题属于本矿区？</b><p>{UNITS[lesson.unitIndex].rule}</p><p>这道题要求处理的是：<strong>{introExample.title}</strong>。题目中的输入结构与目标，提示我们使用本单元的核心数据结构来保存中间状态，并避免重复计算。</p></div><h3>根据题干选出本主题的题</h3><p className="hint">选项包含完整题意，可多选，共 {introCorrect.length} 项。</p><div className="quiz-options statement-options">{introOptions.map(p=><button className={`${selectedQuiz.includes(p.id)?"selected":""} ${feedback.kind==="wrong"&&introCorrect.includes(p.id)?"revealed":""}`} onClick={()=>feedback.kind==="idle"&&setSelectedQuiz(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id])} key={p.id}><span>LC {p.id} · {p.title}</span><p>{p.statement}</p><i>{selectedQuiz.includes(p.id)?"✓":""}</i></button>)}</div><Feedback state={feedback} onRetry={()=>retry(()=>setSelectedQuiz([]))}/>{feedback.kind!=="wrong"&&<button className="primary sticky-action" onClick={feedback.kind==="correct"?closeLesson:checkIntro}>{feedback.kind==="correct"?"收下 20 金币":"检查答案"}<span>→</span></button>}{feedback.kind==="correct"&&<GoldBurst/>}</section>
    :problem&&<section className="lesson-content"><span className="lesson-kicker">TOP {problem.rank} · {difficultyLabel(problem.difficulty)} · 频次 {problem.frequency}</span><h2>LC {problem.id} · {problem.title}</h2>{stage<4&&<div className="stage-chips"><span className={stage===0?"active":""}>题解演示</span><span className={stage===1?"active":""}>代码排序</span><span className={stage===2?"active":""}>变量含义</span><span className={stage===3?"active":""}>代码挖矿</span></div>}
      {stage===0&&<><Statement problem={problem}/><h3>逐行运行演示</h3><p className="hint">每一步都同步展示变量、数据结构与被执行的代码行。</p><DemoVisual problem={problem} step={demoStep}/><div className="code-card">{codeLines.map((line,i)=><code className={i===activeCodeLine?"active":""} key={i}><em>{i+1}</em>{line}</code>)}</div><div className="demo-controls"><button onClick={()=>setDemoStep(x=>Math.max(0,x-1))}>←</button><button className="play" onClick={()=>setPlaying(x=>!x)}>{playing?"暂停":"▶ 播放"}</button><button onClick={()=>setDemoStep(x=>(x+1)%demoLength)}>→</button></div><div className="narration"><b>步骤 {demoStep+1}/{demoLength}</b><p>{problem.id==="3"?LC3_FRAMES[demoStep].message:explainLine(codeLines[activeCodeLine],problem.topic)}</p></div><button className="primary sticky-action" onClick={nextStage}>我看懂了，开始挖矿 <span>→</span></button></>}
      {stage===1&&<><h3>把核心代码排回正确顺序</h3><p className="hint">答错会显示正确顺序，但必须重新排列并答对才能继续。</p><div className="answer-slots">{orderAnswer.length?orderAnswer.map((line,i)=><button disabled={feedback.kind!=="idle"} onClick={()=>setOrderAnswer(v=>v.filter((_,j)=>j!==i))} key={`${line}-${i}`}><em>{i+1}</em><code>{line}</code></button>):<p>从下面依次选择代码行…</p>}</div><div className="line-bank">{shuffledLines.filter(line=>!orderAnswer.includes(line)).map((line,i)=><button disabled={feedback.kind!=="idle"} onClick={()=>setOrderAnswer(v=>[...v,line])} key={`${line}-${i}`}><code>{line}</code></button>)}</div><Feedback state={feedback} onRetry={()=>retry(()=>setOrderAnswer([]))}/>{feedback.kind!=="wrong"&&<button className="primary sticky-action" onClick={feedback.kind==="correct"?nextStage:checkOrder}>{feedback.kind==="correct"?"进入变量训练":"检查顺序"}<span>→</span></button>}</>}
      {stage===2&&currentMeaning&&<><div className="drill-counter">变量 {meaningIndex+1}/{meaningQuestions.length}</div><h3><code>{currentMeaning.variable}</code> 在这道题中是什么意思？</h3><div className="meaning-code"><code>{codeLines.find(x=>new RegExp(`\\b${currentMeaning.variable}\\b`).test(x))}</code></div><div className="quiz-options">{currentMeaning.options.map(option=><button disabled={feedback.kind!=="idle"} className={`${meaningChoice===option?"selected":""} ${feedback.kind==="wrong"&&option===currentMeaning.answer?"revealed":""}`} onClick={()=>setMeaningChoice(option)} key={option}>{option}<i>{meaningChoice===option?"✓":""}</i></button>)}</div><Feedback state={feedback} onRetry={()=>retry(()=>setMeaningChoice(""))}/>{feedback.kind!=="wrong"&&<button className="primary sticky-action" onClick={feedback.kind==="correct"?advanceMeaning:checkMeaning}>{feedback.kind==="correct"?(meaningIndex<meaningQuestions.length-1?"下一个变量":"进入代码训练"):"检查答案"}<span>→</span></button>}</>}
      {stage===3&&currentKeyLine&&<><div className="drill-counter">关键代码 {clozeIndex+1}/{keyLines.length} · {clozeMode==="choice"?"先认出来":"再默写"}</div><h3>{clozeMode==="choice"?"哪一行代码应该填进矿洞？":"不看选项，默写同一行代码"}</h3><p className="hint">每句关键代码都要先选择正确，再独立填写；至少完成三轮。</p><CodeCloze codeLines={codeLines} missing={currentKeyLine}/>{clozeMode==="choice"?<div className="quiz-options code-options">{getLineOptions(currentKeyLine,codeLines).map(option=><button disabled={feedback.kind!=="idle"} className={`${clozeChoice===option?"selected":""} ${feedback.kind==="wrong"&&option===currentKeyLine?"revealed":""}`} onClick={()=>setClozeChoice(option)} key={option}><code>{option.trim()}</code><i>{clozeChoice===option?"✓":""}</i></button>)}</div>:<textarea className="cloze-input" disabled={feedback.kind!=="idle"} value={typedLine} onChange={e=>setTypedLine(e.target.value)} placeholder="输入完整的一行 Python 代码" autoCapitalize="none" autoCorrect="off" spellCheck={false}/>}<Feedback state={feedback} onRetry={()=>retry(()=>clozeMode==="choice"?setClozeChoice(""):setTypedLine(""))}/>{feedback.kind!=="wrong"&&<button className="primary sticky-action" onClick={feedback.kind==="correct"?advanceCloze:checkCloze}>{feedback.kind==="correct"?(clozeMode==="choice"?"现在默写这一句":clozeIndex<keyLines.length-1?"下一句关键代码":"开采完成 · +20 金币"):(clozeMode==="choice"?"检查选择":"提交代码")}<span>→</span></button>}{feedback.kind==="correct"&&clozeMode==="type"&&clozeIndex===keyLines.length-1&&<GoldBurst/>}</>}
      {stage===4&&<div className="finish-card"><div className="gold-coin">●</div><span>开采成功</span><h3>获得 20 枚金币</h3><p>你已完成动画理解、代码排序、变量辨析，以及三句关键代码的选择与默写。</p><button className="primary" onClick={closeLesson}>返回矿区地图 <span>→</span></button><GoldBurst/></div>}
    </section>}</div>}
    {!lesson&&<nav className="bottom-nav"><button className={screen==="map"?"active":""} onClick={()=>setScreen("map")}><b>⌂</b><small>矿区</small></button><button className={screen==="library"?"active":""} onClick={()=>setScreen("library")}><b>▦</b><small>题库</small></button><button className={screen==="review"?"active":""} onClick={()=>setScreen("review")}><b>◎</b><small>日志</small></button></nav>}
  </main>
}

function CodeCloze({codeLines,missing}:{codeLines:string[];missing:string}){let hidden=false;return <div className="code-card cloze-card">{codeLines.map((line,i)=>{const isMissing=!hidden&&line===missing;if(isMissing)hidden=true;return <code className={isMissing?"missing":""} key={i}><em>{i+1}</em>{isMissing?<strong>（空缺：填写这一整句）</strong>:line}</code>})}</div>}
function GoldBurst(){return <div className="gold-burst" aria-hidden="true">{Array.from({length:18},(_,i)=><i style={{"--x":`${(i%9)*14-56}px`,"--delay":`${(i%5)*.05}s`} as React.CSSProperties} key={i}>●</i>)}</div>}
function rotate<T>(items:T[],n:number){if(!items.length)return items;return items.map((_,i)=>items[(i+n)%items.length])}
function normalize(s:string){return s.trim().replace(/\s+/g," ").replace(/\s*([,:()\[\]])\s*/g,"$1")}
function getMeaningQuestions(problem:Problem|null){if(!problem)return[];const special=problem.id==="3"?["right","ch","last","left","ans"]:problem.id==="1"?["seen","i","x","need","target"]:[];const tokens=problem.code.match(/[A-Za-z_][A-Za-z0-9_]*/g)??[];const variables=special.length?special:[...new Set(tokens)].filter(x=>!IGNORED.has(x)&&MEANINGS[x]).slice(0,Math.max(3,Math.min(5,tokens.length)));for(const fallback of ["current","answer","value","left","right"]){if(variables.length>=3)break;if(!variables.includes(fallback))variables.push(fallback)}return variables.slice(0,5).map((variable,index)=>{const answer=MEANINGS[variable]??`${variable} 保存算法当前阶段的中间状态`;const distractors=Object.values(MEANINGS).filter(x=>x!==answer).slice(index*3,index*3+3);return{variable,answer,options:rotate([answer,...distractors],(index+1)%4)}})}
function getKeyLines(problem:Problem|null,lines:string[]){if(problem?.id==="3")return[lines[4],lines[6],lines[7]];const body=lines.filter(x=>!x.trim().startsWith("class ")&&!x.trim().startsWith("def "));const scored=[...body].sort((a,b)=>lineScore(b)-lineScore(a));return scored.slice(0,Math.min(3,scored.length))}
function lineScore(line:string){const s=line.trim();return(s.startsWith("if ")?9:0)+(s.startsWith("while ")?8:0)+(s.startsWith("for ")?7:0)+(s.includes("=")?5:0)+(s.startsWith("return ")?3:0)-s.length/1000}
function getLineOptions(correct:string,lines:string[]){const candidates=lines.filter(x=>x!==correct&&!x.trim().startsWith("class ")&&!x.trim().startsWith("def ")).slice(0,3);while(candidates.length<3)candidates.push(correct.replace(/\+ 1/g,"- 1").replace(/max/g,"min")+` # 选项${candidates.length+1}`);return rotate([correct,...candidates],2)}
function explainLine(line:string|undefined,topic:TopicKey){const clean=line?.trim()??"";if(clean.startsWith("for "))return"进入一次有边界的遍历，循环变量切换到当前元素。";if(clean.startsWith("while "))return"只要条件成立就推进指针，并持续维护循环不变量。";if(clean.startsWith("if "))return"判断当前状态是否触发关键分支。";if(clean.startsWith("return "))return"状态已经收敛，返回最终答案。";if(clean.includes("="))return topic==="dp"?"用已经算出的子问题更新当前状态。":"更新当前变量，为下一步决策保存信息。";return"执行当前算法动作，并保持核心不变量。"}
