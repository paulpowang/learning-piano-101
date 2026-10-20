import {midiPitch,staffY,scoreRows,scoreAccidentals} from './music.js';
import {translate,lessonEn,lessonZh,badgeEn,badgeZh,missionCopy,decorationCopy,songCopy} from './i18n.js';
import { notes, shortcuts, lessons, emptyProgress, normalizeProgress, tokenCount, isUnlocked, completeLesson, achievements, decorations, ownedDecorations, equippedDecorations, purchaseDecoration, toggleDecoration, lessonPhase, lessonSequence, songs, purchaseSong, completeSong } from './curriculum.js';

const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const SAVE_KEY = 'little-keys-progress-v2';
let storageAvailable = true;
let progress;
try { progress = normalizeProgress(JSON.parse(localStorage.getItem(SAVE_KEY)) || emptyProgress()); }
catch { progress = emptyProgress(); storageAvailable = false; }
let view = 'learn', session = null, audio = null, pendingTimer = null, lastFocus = null;
const held = new Set();
function save() {
  try {localStorage.setItem(SAVE_KEY,JSON.stringify(progress));storageAvailable=true;}
  catch {storageAvailable=false;toast(t('saveError'));}
  const footerElement=document.querySelector('footer');
  if(footerElement)footerElement.outerHTML=footer();
}
const icon = (name, size=22) => {
  const paths = {
    keys:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16m6-16v16M7 4v8h3V4m4 0v8h3V4"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
    star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.8 9.7l6.4-.9L12 3Z"/>',
    music:'<path d="M9 17V5l11-2v12M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2.5"/><ellipse cx="17" cy="16" rx="3" ry="2.5"/>',
    arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
    lock:'<rect x="6" y="10" width="12" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    sound:'<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    mute:'<path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
    sprout:'<path d="M12 21V11C6 12 3 8 3 3c6 0 9 2 9 8Zm0 4c0-7 3-10 9-10 0 6-3 10-9 10Z"/>',
    staff:'<path d="M2 5h20M2 9h20M2 13h20M2 17h20M2 21h20m12-9V2"/><ellipse cx="11" cy="13" rx="3" ry="2" fill="currentColor"/>',
    friends:'<circle cx="6" cy="10" r="3"/><circle cx="17" cy="8" r="3"/><path d="M1 21v-4a5 5 0 0 1 10 0v4m2-3v-3a4 4 0 0 1 8 0v3"/>',
    home:'<path d="m2 11 10-8 10 8M5 9v12h14V9m-10 12v-7h6v7"/>',
    search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7m-15-12h6m-3-3v6"/>',
    heart:'<path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
};
function bird(className='') {
  return `<svg class="bird ${className}" viewBox="0 0 220 205" fill="none" aria-hidden="true"><ellipse cx="115" cy="189" rx="62" ry="9" fill="#2c624b" opacity=".09"/><path d="m86 170-8 19m10-7-15 5m67-17 9 18m-10-5 16 4" stroke="#385846" stroke-width="5" stroke-linecap="round"/><path d="M54 104C23 69 26 46 39 35c7 19 20 27 34 27" fill="#7fa98b"/><path d="M51 106c-9-40 12-76 55-80 55-5 84 36 81 86-3 45-30 67-70 67-46 0-66-30-66-73Z" fill="#8ab59a"/><path d="M75 130c0-29 15-49 39-49 31 0 50 26 48 54-1 23-20 37-43 37-26 0-44-18-44-42Z" fill="#e7ecd6"/><path d="M56 103c-21 16-22 35-9 40 15 5 29-12 32-25" fill="#6d997e"/><path d="M178 99c20-9 30-6 28 5-2 12-15 23-29 24" fill="#6d997e"/><ellipse cx="96" cy="72" rx="5" ry="7" fill="#294d3c"/><ellipse cx="144" cy="72" rx="5" ry="7" fill="#294d3c"/><circle cx="96" cy="69" r="1.6" fill="white"/><circle cx="144" cy="69" r="1.6" fill="white"/><path d="m112 83 10-5 10 5-10 10-10-10Z" fill="#e9af5e"/><ellipse cx="82" cy="87" rx="10" ry="5" fill="#e9b4a0"/><ellipse cx="157" cy="87" rx="10" ry="5" fill="#e9b4a0"/><path d="m103 28-5-14m12 13 5-17m1 18 12-10" stroke="#6d997e" stroke-width="5" stroke-linecap="round"/><path d="m109 126 8 7 15-17" stroke="#6d997e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function drawNoteConnection() {
  const area=document.querySelector('.note-connection.guided');
  if(!area) return;
  const line=area.querySelector('.connection-path'), note=area.querySelector('.music-staff ellipse'), key=area.querySelector('[data-note="C4"]');
  const a=area.getBoundingClientRect(), n=note.getBoundingClientRect(), k=key.getBoundingClientRect();
  const x=n.x+n.width/2-a.x, y=n.bottom-a.y+4, endX=k.x+k.width/2-a.x, endY=k.top-a.y+16;
  const bendY=area.querySelector('.piano-shell').getBoundingClientRect().top-a.y-12;
  line.setAttribute('viewBox',`0 0 ${a.width} ${a.height}`);
  if(k.top<n.bottom){
    const gutter=area.querySelector('.staff-lesson').getBoundingClientRect().right-a.x+10;
    line.innerHTML=`<path d="M ${x+18} ${y-12} H ${gutter} V ${endY} H ${endX}"/><path class="connection-arrow" d="m ${endX-6} ${endY-5} 6 5-6 5"/>`;
  }else line.innerHTML=`<path d="M ${x+18} ${y-12} H ${x+45} V ${bendY} H ${endX} V ${endY}"/><path class="connection-arrow" d="m ${endX-5} ${endY-6} 5 6 5-6"/>`;
}
function sound(note,duration=1.2) {
  if (!progress.sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if(audio.state==='suspended') audio.resume().catch(()=>{});
    const pitch = midiPitch(note);
    const frequency=440*2**((pitch-69)/12), now=audio.currentTime;
    [1,2,3].forEach((partial,i)=>{
      const osc=audio.createOscillator(), gain=audio.createGain();
      osc.type='sine'; osc.frequency.value=frequency*partial;
      gain.gain.setValueAtTime(0,now); gain.gain.linearRampToValueAtTime([.23,.07,.025][i],now+.012); gain.gain.exponentialRampToValueAtTime(.001,now+duration);
      osc.connect(gain).connect(audio.destination); osc.start(now); osc.stop(now+duration+.05);
    });
  } catch { toast(t('audioError')); }
}
const t=(key,params)=>translate(progress.locale,key,params);
const copy=l=>l.song?songCopy[progress.locale][l.id]:(progress.locale==='zh-Hant'?lessonZh:lessonEn)[l.id-1];
const badgeCopy=a=>(progress.locale==='zh-Hant'?badgeZh:badgeEn)[achievements.indexOf(a)];
const decorationName=d=>decorationCopy[progress.locale][decorations.indexOf(d)];
const noteName=n=>n==='C4'?t('middleCLower'):n==='C5'?t('highC'):n.includes('#')?t('sharp',{note:n[0]}):n.includes('b')?t('flat',{note:n[0]}):n[0];
const soundButton=()=>`<button class="icon-button" data-action="sound" aria-label="${t(progress.sound?'mute':'unmute')}">${icon(progress.sound?'sound':'mute')}</button>`;
const languageControl=()=>`<label class="language-control"><span class="sr-only">${t('language')}</span><select data-language aria-label="${t('language')}"><option value="en" ${progress.locale==='en'?'selected':''}>English</option><option value="zh-Hant" ${progress.locale==='zh-Hant'?'selected':''}>繁體中文</option></select></label>`;
let performanceTimer=null,performancePlaying=false;
let freeBass=false;
const settingsButton=()=>`<button class="icon-button" data-action="settings" aria-label="${t('settings')}">${icon('keys')}</button>`;
let feedbackState=null, freeNote='C4', demoTimer=null, demoActive=false;
function header() {
  return `<header class="header"><a class="brand" href="#" data-view="learn" aria-label="${t('home')}"><span class="brand-icon">${icon('keys',26)}</span>little keys<span class="brand-dot">.</span></a><nav aria-label="${t('nav')}">${[['learn','map','adventure'],['songs','music','songs'],['free','keys','free'],['achievements','star','collection']].map(([v,i,k])=>`<button class="nav-item ${view===v?'active':''}" data-view="${v}">${icon(i,18)}<span>${t(k)}</span></button>`).join('')}</nav><div class="header-actions">${languageControl()}${soundButton()}${settingsButton()}<button class="token-pill" data-action="tokens" aria-label="${t('tokens',{n:tokenCount(progress)})}">${icon('star',18)} <b>${tokenCount(progress)}</b><span>token</span></button><button class="profile" data-action="account" aria-label="${t('profile')}">${icon('user',19)}</button></div></header>`;
}
function footer() {
  return `<footer><span>${icon('heart',14)} ${t('footer')}</span><button data-action="account">${t(storageAvailable?'saved':'unsaved')} <span class="status-dot ${storageAvailable?'':'warning'}"></span></button><button data-action="parents">${t('parents')} ${icon('arrow',14)}</button></footer>`;
}
function render() {
  const focusedNote=document.activeElement?.dataset.note;
  document.documentElement.lang=progress.locale;
  document.title=`Little Keys — ${t('welcome')}`;
  document.body.classList.toggle('lesson-mode',view==='lesson');
  document.body.classList.toggle('results-mode',view==='results');
  document.body.classList.toggle('extended-mode',view==='lesson'&&session?.lesson.id>8);
  document.body.classList.toggle('song-mode',view==='lesson'&&!!session?.lesson.song);
  document.body.classList.toggle('hide-shortcuts',!progress.showShortcuts);
  app.innerHTML=`${header()}<main id="main">${view==='learn'?dashboard():view==='free'?freePlay():view==='achievements'?collection():view==='songs'?songLibrary():view==='lesson'?lessonView():resultsView()}</main>${footer()}`;
  if(feedbackState&&document.querySelector('#feedback')&&!performancePlaying) updateFeedback();
  if(demoActive) highlightDemo();
  if(focusedNote)app.querySelector(`[data-note="${focusedNote}"]`)?.focus({preventScroll:true});
  requestAnimationFrame(()=>{drawNoteConnection();followScore();});
}
function decorationArt(d) {
  const art={
    lantern:'<path d="M36 24a14 14 0 0 1 28 0" stroke="#47536b" stroke-width="5" fill="none"/><rect x="29" y="28" width="42" height="53" rx="12" fill="#e9b338"/><path d="M50 41c-18 19-8 30 0 30s18-11 0-30" fill="#fff3b1"/><path d="M27 28h46M27 81h46" stroke="#47536b" stroke-width="6"/>',
    blueflowers:'<path d="M50 84V41" stroke="#356c46" stroke-width="6"/><g fill="#7052ca"><circle cx="50" cy="27" r="14"/><circle cx="32" cy="42" r="14"/><circle cx="39" cy="63" r="14"/><circle cx="62" cy="63" r="14"/><circle cx="68" cy="42" r="14"/></g><circle cx="50" cy="46" r="10" fill="#f6d660"/>',
    flowerpot:'<path d="M26 46h48L67 83H33Z" fill="#cb8c68"/><rect x="22" y="42" width="56" height="10" rx="4" fill="#e3aa83"/><path d="M50 43V22m0 13C25 37 28 13 50 29m0 5C73 35 76 13 50 27" stroke="#66916c" stroke-width="4" fill="#92b58a"/><circle cx="50" cy="17" r="11" fill="#e6bd59"/>',
    butterfly:'<path d="M49 47C19 4 3 39 30 53 1 69 29 95 49 58M51 47C81 4 97 39 70 53 99 69 71 95 51 58" fill="#b9a5d3" stroke="#9983b5" stroke-width="2"/><path d="M50 40v29m0-30-8-11m8 11 8-11" stroke="#60744e" stroke-width="4" stroke-linecap="round"/>',
    windmill:'<path d="M50 44v44" stroke="#8a7655" stroke-width="6"/><path d="M50 44 25 14H50Z" fill="#e5b965"/><path d="M50 44 80 19v25Z" fill="#93b79c"/><path d="M50 44 75 74H50Z" fill="#d69c95"/><path d="M50 44 20 69V44Z" fill="#afa2c8"/><circle cx="50" cy="44" r="5" fill="#fff9dc"/>',
    rainbow:'<path d="M14 73a36 36 0 0 1 72 0" fill="none" stroke="#d9978e" stroke-width="9"/><path d="M23 73a27 27 0 0 1 54 0" fill="none" stroke="#e6c473" stroke-width="9"/><path d="M32 73a18 18 0 0 1 36 0" fill="none" stroke="#96b79d" stroke-width="9"/><path d="M41 73a9 9 0 0 1 18 0" fill="none" stroke="#b7a4cb" stroke-width="9"/>',
    crown:'<path d="m18 31 17 17 15-27 15 27 17-17-9 43H27Z" fill="#e7c16a" stroke="#bd9a43" stroke-width="3"/><circle cx="50" cy="58" r="5" fill="#d29a8c"/><path d="M28 81h44" stroke="#bd9a43" stroke-width="5" stroke-linecap="round"/>'
  };
  return `<svg class="decoration-art" viewBox="0 0 100 100" aria-hidden="true">${art[d.id]}</svg>`;
}
function garden() {
  const equipped=equippedDecorations(progress);
  return `<section class="home-garden"><div class="eyebrow">${t('gardenTitle')}</div><div class="garden-scene">${bird('garden-friend')}${equipped.map(d=>`<span class="garden-item ${d.id}" data-decoration="${d.id}" role="img" aria-label="${decorationName(d)}">${decorationArt(d)}</span>`).join('')}</div><p>${t(equipped.length?'gardenDesc':'gardenEmpty')}</p><button class="secondary" data-view="achievements">${t('shopVisit')} →</button></section>`;
}
function dashboard() {
  const next=lessons.find(l=>!progress.completed.includes(l.id))||lessons.at(-1), allDone=progress.completed.length===lessons.length;
  return `<section class="welcome"><div><div class="eyebrow"><span class="tiny-sun">✳</span>${t('welcomeTag')}</div><h1>${t('welcome')}<span class="heading-spark">✧</span></h1><p>${t('welcomeDesc')}</p></div><div class="welcome-note">${t('noRush')} <span>↙</span></div></section>
  <div class="dashboard-grid"><section class="journey-column"><section class="hero"><div class="hero-copy"><span class="tag">${t(allDone?'doneTag':'nextTag')}</span><h2>${t(allDone?'heroDone':progress.completed.length?'heroContinue':'heroNew')}</h2><p>${t(allDone?'doneDesc':progress.completed.length?'nextDesc':'heroDesc',{title:copy(next).title})}</p><button class="primary" data-start="${next.id}">${t(allDone?'replay':progress.completed.length?'continue':'begin')} ${icon('arrow',18)}</button><div class="hero-meta">${icon('heart',14)} ${t('curiosity')}</div></div><div class="hero-art"><span class="floating-note n1">♪</span><span class="floating-note n2">♫</span><span class="art-spark">✦</span><div class="bird-bubble">${t('encouragement')}</div>${bird()}<div class="mini-piano">${[0,1,2,3,4,5,6].map(i=>`<i>${[0,1,3,4,5].includes(i)?'<b></b>':''}</i>`).join('')}</div><span class="art-flower">✳</span></div></section>
  <section class="journey"><div class="section-heading"><div><div class="eyebrow">${t('chapter')}</div><h2>${t('firstNotes')}</h2></div><span class="chapter-progress">${t('completed',{n:progress.completed.length,total:lessons.length})}</span></div><div class="progress-track"><span style="width:${progress.completed.length/lessons.length*100}%"></span></div><div class="lesson-grid">${lessons.map(l=>{
    const done=progress.completed.includes(l.id), unlocked=isUnlocked(l.id,progress), c=copy(l);
    return `${[9,13].includes(l.id)?`<div class="chapter-divider"><span class="eyebrow">${t(l.id===9?'chapter2':'chapter3')}</span><h2>${t(l.id===9?'nextNotes':'accidentals')}</h2></div>`:''}<button class="lesson-card ${done?'done':unlocked?'current':'locked'}" data-start="${l.id}" data-start-label="${t('startHere')}" ${unlocked?'':'disabled'}><div class="lesson-top"><span class="lesson-art ${l.color}">${icon(l.icon,26)}</span><span class="lesson-status">${done?icon('check',18):unlocked?'<span class="ready-dot"></span>':icon('lock',15)}</span></div><span class="lesson-number">${t('lessonNumber',{n:String(l.id).padStart(2,'0')})}</span><h3>${c.title}</h3><p>${c.subtitle}</p><div class="lesson-bottom"><span>${icon('star',13)} ${t('tokens',{n:l.reward})}</span><span>${t(done?'replay':unlocked?'play':'afterLesson',{n:l.id-1})} ${unlocked?icon('arrow',14):''}</span></div></button>`;
  }).join('')}</div></section></section>
  <aside class="sidebar">${garden()}<section class="progress-card"><div class="card-title">${t('wins')} ${icon('sprout',20)}</div><div class="wins"><div><span class="win-number">${progress.completed.length}<small> / ${lessons.length}</small></span><span>${t('explored')}</span></div><div class="token-medal">${icon('star',24)}</div></div><p>${t(progress.completed.length?'grow':'firstWin')}</p><div class="mini-stats"><span>${icon('star',17)}${t('tokens',{n:tokenCount(progress)})}</span><span>${icon('check',17)}${t('badgeCount',{n:achievements.filter(a=>a.earned(progress)).length})}</span></div></section><section class="buddy-card"><span class="eyebrow">${t('pipNote')}</span><div class="buddy-heading">${t('happyNotes')}</div><p>${t('pipQuote')}</p></section><button class="free-card" data-view="free"><span class="free-icon">${icon('music',24)}</span><h3>${t('freeTitle')}</h3><p>${t('freeShort')}</p><span>${t('explorePiano')} ${icon('arrow',17)}</span></button></aside></div><div class="bottom-note">${icon('heart',17)} ${t('gentle')}</div>`;
}
function activeOctave(){return view==='free'?(freeBass?3:4):session?.lesson.range==='bass'?3:session?.lesson.range==='high'?5:4;}
function playedNote(note){return note.replace(/\d/,d=>Number(d)+activeOctave()-4);}
function samePitch(a,b){return !!a&&!!b&&midiPitch(a)===midiPitch(b);}
function piano({labels=true,highlight=null}={}) {
  const pianoNotes=notes.map(playedNote);
  const black=[{note:'C#4',x:1,key:'w'},{note:'D#4',x:2,key:'e'},{note:'F#4',x:4,key:'t'},{note:'G#4',x:5,key:'y'},{note:'A#4',x:6,key:'u'}];
  return `<div class="piano-shell"><div class="piano-top"><span>LITTLE KEYS</span><span class="piano-light"></span></div><div class="piano" aria-label="${t('piano')}"><div class="white-keys">${pianoNotes.map((n,i)=>`<button class="piano-key white-key ${samePitch(highlight,n)?'hint-key':''}" data-note="${n}" aria-label="${t('playKey',{note:view==='free'?n:noteName(n)})}"><span class="note-label">${labels?n[0]:''}</span>${n==='C4'?'<i class="middle-c-dot"></i>':''}<kbd>${shortcuts[i].toUpperCase()}</kbd></button>`).join('')}</div>${black.map(b=>`<button class="piano-key black-key ${samePitch(highlight,playedNote(b.note))?'hint-key':''}" style="left:calc(${b.x*12.5}% - 3.7%)" data-note="${playedNote(b.note)}" aria-label="${t('playKey',{note:noteName(playedNote(b.note))})}"><kbd>${b.key.toUpperCase()}</kbd></button>`).join('')}</div></div><div class="keyboard-caption"><span><span class="green-dot"></span> ${t('middleC')}</span><span>${t('keyboardHelp')}</span></div>`;
}
function staff(note,reveal=true) {
  if(view==='lesson'&&session?.lesson.id>8)return extendedStaff(note,reveal);
  if(view==='free'&&freeBass)return bassStaff(note);
  const idx=notes.indexOf(note), y=144-idx*9;
  return `<svg class="music-staff" viewBox="0 0 460 192" role="img" aria-label="${reveal?t('staffName',{note:note==='C4'?t('middleCLower'):note}):t('staffHidden')}">${[54,72,90,108,126].map(y=>`<line x1="38" y1="${y}" x2="422" y2="${y}" stroke="#a9b7ac" stroke-width="1.4"/>`).join('')}<text x="46" y="125" font-size="108" font-family="Segoe UI Symbol, Noto Music, serif" fill="#375d49">𝄞</text>${idx===0?'<line x1="237" y1="144" x2="279" y2="144" stroke="#375d49" stroke-width="2"/>':''}<ellipse cx="258" cy="${y}" rx="12" ry="8.5" transform="rotate(-18 258 ${y})" fill="#386b54"/><line x1="269" y1="${y-2}" x2="269" y2="${y-55}" stroke="#386b54" stroke-width="2.7"/>${reveal?`<text x="258" y="181" text-anchor="middle" font-size="15" font-family="inherit" fill="#526b5c">${note==='C4'?t('middleC'):note[0]}</text>`:''}</svg>`;
}
function gardenMission(count=session.index) {
  const l=session.lesson,total=l.notes.length,phase=lessonPhase(l,session.index),start=phase.start,end=start+phase.length;
  const milestone=session.busy&&count===end;
  return `<div class="garden-mission ${session.busy?'bloom-celebration':''} ${milestone?'bed-complete':''} ${progress.equipped.map(id=>'with-'+id).join(' ')}" data-grown="${count}"><div class="mission-heading"><span>${l.song?copy(l).title:missionCopy[progress.locale][l.id-1]}</span><b>${t('blooms',{n:count,total})}</b></div><div class="phase-track">${l.stages.map((_,i)=>`<span class="${i<phase.phase?'done':i===phase.phase?'active':''}">${l.song?t('phrase',{n:i+1,total:l.stages.length}):t('phase'+i)}</span>`).join('')}</div><div class="garden-row"><div class="pip-companion">${bird('garden-pip')}${equippedDecorations(progress).map(d=>`<span class="lesson-decoration ${d.id}" data-equipped="${d.id}" aria-label="${decorationName(d)}">${decorationArt(d)}</span>`).join('')}</div><div class="garden-beds">${l.notes.slice(start,end).map((_,i)=>`<span class="garden-flower ${i+start<count?'bloomed':''} ${session.busy&&i+start===count-1?'new-bloom':''}" style="--petal:${progress.equipped.includes('blueflowers')?'#6652c5':progress.equipped.includes('flowerpot')?'#c73672':['#c47812','#c63b65','#7251c2'][i%3]}" aria-label="${t(i+start<count?'flower':'seed')}"><i class="flower-head">✿</i><i class="flower-stem"></i><i class="flower-ground"></i></span>`).join('')}</div><span class="bloom-burst" aria-hidden="true">${session.busy?'✦ +1 ✦':'☀'}</span></div><div class="garden-meter"><span style="width:${count/total*100}%"></span></div><div class="bloom-caption" aria-live="polite">${session.busy?t(milestone?'stageDone':'bloomPop'):l.song?t('phrase',{n:phase.phase+1,total:l.stages.length}):t('stageProgress',{n:phase.phase+1})}</div></div>`;
}
function lessonControls() {
  return `<div class="lesson-controls"><button class="secondary" data-action="demonstrate" ${session.busy?'disabled':''}>${icon('sound',17)} ${t('show')}</button><button class="secondary" data-action="hint" ${session.busy?'disabled':''}>${icon('help',17)} ${t('hint')}</button></div>`;
}
function lessonToolbar() {
  return `<div class="play-toolbar"><button class="text-button" data-action="leave">← ${t(session.lesson.song?'songs':'adventure')}</button><span>${session.lesson.song?t('songs'):t('lessonNumber',{n:String(session.lesson.id).padStart(2,'0')})}<b> · ${copy(session.lesson).title}</b></span><div class="toolbar-settings">${languageControl()}${soundButton()}${settingsButton()}</div></div>`;
}
function firstLessonView() {
  const phase=lessonPhase(session.lesson,session.index).phase,guided=phase===0||session.hint;
  return `<section class="play-page first-lesson">${lessonToolbar()}${gardenMission(session.index+(session.busy?1:0))}<div class="play-heading"><span class="eyebrow">${t('step',{n:session.index+1,total:session.lesson.notes.length})}</span><h1>${t('firstTitle'+phase)}</h1><p>${t('firstDesc'+phase)}</p></div><div class="note-connection ${guided?'guided':''}"><div class="staff-lesson">${staff('C4',guided)}<div class="ledger-explanation"><span class="ledger-example" aria-hidden="true">●</span><span>${t('ledger')}</span></div></div><svg class="connection-path" aria-hidden="true"></svg><div class="connection-caption">${t(guided?'same':'findC')}</div>${piano({labels:guided,highlight:guided?'C4':null})}</div><div id="feedback" class="feedback" role="status" aria-live="polite">${t('startFeedback')}</div>${lessonControls()}</section>`;
}
function lessonView() {
  const l=session.lesson,n=l.notes[session.index],phase=lessonPhase(l,session.index).phase;
  if(l.song)return songView();
  if(l.id===1)return firstLessonView();
  const labels=(l.labels&&phase===0)||session.hint;
  const description=session.hint?copy(l).tip:l.song?copy(l).intro:phase===0?copy(l).intro:t(phase===1?'phaseHint':'phaseMelody');
  return `<section class="play-page">${lessonToolbar()}${gardenMission(session.index+(session.busy?1:0))}<div class="play-heading"><span class="eyebrow">${t('step',{n:session.index+1,total:l.notes.length})}</span><h1>${labels?t(l.id>8?'playKey':'playFlower',{note:noteName(n)}):t('whichKey')}</h1><p>${description}</p>${l.range?`<span class="range-badge">${t(l.range==='bass'?'rangeBass':l.range==='high'?'rangeHigh':'rangeMiddle')}</span>`:''}</div><div class="learning-stage">${staff(n,labels)}</div><div id="feedback" class="feedback" role="status" aria-live="polite">${t('listening')}</div>${piano({labels,highlight:(l.guide&&phase===0)||session.hint?n:null})}${lessonControls()}</section>`;
}
function explorationDots() {return notes.map(n=>`<span class="${progress.explored.includes(n)?'explored':''}" title="${n}">${n[0]}</span>`).join('');}
function freePlay() {
  return `<section class="play-page"><div class="play-toolbar"><span class="eyebrow">${t('playground')}</span>${settingsButton()}</div><label class="range-control">${t('register')} <select data-register><option value="treble" ${freeBass?'':'selected'}>${t('trebleRange')}</option><option value="bass" ${freeBass?'selected':''}>${t('bassRange')}</option></select></label><p class="range-guide">${t(freeBass?'bassGuide':'singleHandGuide')}</p><div class="play-heading"><h1>${t('freeTitle')}<span class="heading-spark">♫</span></h1><p>${t('freeDesc')}</p></div><div class="free-staff" id="free-staff">${staff(freeNote)}</div><div id="feedback" class="feedback" role="status" aria-live="polite">${t('tryKey')}</div>${piano()}<div class="free-exploration"><span>${icon('sprout',18)} ${t('explorer')}</span><div id="exploration-dots">${explorationDots()}</div><small>${t('exploreEight')}</small></div><div class="pip-tip">${bird('small-bird')}<p><b>${t('ownMelody')}</b>${t('melodyTip')}</p></div></section>`;
}
function collection() {
  return `<section class="collection-page"><div class="eyebrow">${t('collectionTag')}</div><h1>${t('shop')}<span class="heading-spark">✧</span></h1><p>${t('shopGuide')}</p><div class="collection-banner"><div class="token-medal">${icon('star',32)}</div><div><h2>${t('wallet',{n:tokenCount(progress)})}</h2><p>${t('rewardDesc')}</p></div><button class="secondary" data-view="songs">${t('songs')} →</button></div>${garden()}<section class="treasures"><h2>${t('decorations')}</h2><div class="decoration-grid">${decorations.map(d=>{
    const owned=progress.purchased.includes(d.id),equipped=progress.equipped.includes(d.id),affordable=tokenCount(progress)>=d.price;
    return `<article class="decoration-card ${owned?'earned':'unearned'}" data-decoration="${d.id}">${decorationArt(d)}<h3>${decorationName(d)}</h3><p>${t('effect_'+d.id)}</p>${owned?`<button class="secondary" data-equip="${d.id}" aria-pressed="${equipped}">${t(equipped?'putAway':'equip')}</button><span>${t(equipped?'equipped':'already')}</span>`:`<button class="primary" data-buy="${d.id}" ${affordable?'':'disabled'}>${t('buy',{n:d.price})}</button>${affordable?'':`<span>${t('needTokens',{n:d.price-tokenCount(progress)})}</span>`}`}</article>`;
  }).join('')}</div></section><h2>${t('collectionTitle')}</h2><div class="badge-grid">${achievements.map(a=>`<article class="badge-card ${a.earned(progress)?'earned':'unearned'}"><div class="badge-art">${icon(a.icon,40)}</div><h3>${badgeCopy(a).name}</h3><p>${badgeCopy(a).description}</p><span>${icon(a.earned(progress)?'check':'lock',14)} ${t(a.earned(progress)?'earned':'waiting')}</span></article>`).join('')}</div><button class="primary" data-view="learn">${t('back')} ${icon('arrow',18)}</button></section>`;
}
function resultsView() {
  const l=session.lesson,next=l.song?null:lessons[l.id];
  return `<section class="results"><div class="result-overview"><div class="result-garden">${bird()}<div class="garden-finale ${l.song?'song-finale':''}" aria-label="${t('finishedGarden')}">${l.notes.map((_,i)=>`<span style="--delay:${Math.min(i*35,700)}ms">✿</span>`).join('')}</div></div><div class="eyebrow">${t('resultTag')}</div><h1>${t(l.song?'songComplete':'resultTitle')}</h1><p>${t('learned',{skill:copy(l).skill.toLowerCase()})}<br>${t('effort')}</p><button class="text-button result-details" data-action="result-details">${t('finishedGarden')} →</button></div><aside class="result-rewards" aria-label="${t('resultRewards')}"><div class="reward-row"><div>${icon('star',27)}<b>${session.firstCompletion?'+'+l.reward:t('already')}</b><span>${t(session.firstCompletion?'collected':'practice')}</span></div><div>${icon('check',27)}<b>${t('wallet',{n:tokenCount(progress)})}</b><span>${copy(l).title}</span></div></div><div class="new-badges">${session.newBadges.map(a=>`<span>${icon(a.icon,20)} ${t('newBadge',{name:badgeCopy(a).name})}</span>`).join('')}</div><div class="result-extras"><button class="secondary" data-view="songs">${t('songs')} →</button><button class="secondary" data-view="achievements">${t('shopVisit')} →</button>${l.song?`<button class="secondary" data-action="performance">${t(performancePlaying?'stopSong':'hearSong')}</button>`:''}</div></aside><div class="result-buttons">${next?`<button class="primary" data-start="${next.id}">${t('next')} ${icon('arrow',18)}</button>`:`<button class="primary" data-view="songs">${t('backSongs')} ${icon('music',18)}</button>`}<button class="secondary" data-view="learn">${t('back')}</button><button class="text-button" ${l.song?'data-song':'data-start'}="${l.id}">${t('replayLesson')}</button></div></section>`;
}
function toast(message) {const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),4000);}
function updateFeedback() {
  const el=document.querySelector('#feedback');if(!el||!feedbackState)return;
  const {key,note,success}=feedbackState;
  el.textContent=t(key,{note:note?noteName(note):''});el.className=`feedback${success?' success':''}`;
}
function feedback(key,note=null,success=false) {feedbackState={key,note,success};updateFeedback();}
function highlightDemo() {
  if(view!=='lesson'||!session)return;
  document.querySelector('.learning-stage')?.classList.add('note-sounding');
  document.querySelector('.note-connection')?.classList.add('note-sounding');
  [...document.querySelectorAll('[data-note]')].find(el=>samePitch(el.dataset.note,session.lesson.notes[session.index]))?.classList.add('note-sounding');
}
function stopDemo() {clearTimeout(demoTimer);demoActive=false;document.querySelectorAll('.note-sounding').forEach(el=>el.classList.remove('note-sounding'));}
function press(note) {
  if(dialog.open||!['lesson','free'].includes(view)||demoActive||performancePlaying)return;
  sound(note);
  const key=document.querySelector(`[data-note="${note}"]`);
  if(key){key.classList.add('pressed');setTimeout(()=>key.classList.remove('pressed'),200);}
  if(view==='free') {
    if(notes.includes(note)||freeBass) {
      const wasEarned=progress.explored.length===8;freeNote=note;
      if(notes.includes(note)){progress.explored=[...new Set([...progress.explored,note])];save();}
      document.querySelector('#free-staff').innerHTML=staff(note);
      feedback(note==='C4'?'freeC':'freeNote',note);
      document.querySelector('#exploration-dots').innerHTML=explorationDots();
      if(!wasEarned&&progress.explored.length===8)toast(t('explorerEarned'));
    }else feedback('freeSharp',note);
    return;
  }
  if(!session||session.busy)return;
  const target=session.lesson.notes[session.index];
  if(samePitch(note,target)) {
    if(session.lesson.song){
      session.previousIndex=session.index;session.index++;session.hint=false;session.misses=0;feedbackState={key:'songFlow',success:true};
      if(session.index===session.lesson.notes.length)finish();else render();
      return;
    }
    session.busy=true;
    feedbackState={key:(!session.lesson.song&&session.lesson.id===1?'firstSuccess'+lessonPhase(session.lesson,session.index).phase:'success'+session.index%3),success:true};
    render();highlightDemo();
    pendingTimer=setTimeout(()=>{
      session.index++;session.busy=false;session.hint=false;session.misses=0;feedbackState=null;
      if(session.index===session.lesson.notes.length)finish();else render();
    },750);
  }else {
    session.misses++;
    if(session.misses>=2){session.hint=true;feedbackState={key:'together',note:target};render();}
    else feedback('wrong');
  }
}
function finish() {
  const l=session.lesson,before=achievements.filter(a=>a.earned(progress));
  session.firstCompletion=!(l.song?progress.completedSongs:progress.completed).includes(l.id);
  progress=l.song?completeSong(progress,l.id):completeLesson(progress,l.id);save();
  session.newBadges=achievements.filter(a=>a.earned(progress)&&!before.includes(a));
  view='results';render();window.scrollTo({top:0,behavior:'instant'});
}
function start(id) {
  const lesson=lessons.find(l=>l.id===id);if(!lesson||!isUnlocked(id,progress))return;
  clearTimeout(pendingTimer);stopDemo();stopPerformance();feedbackState=null;
  session={lesson:{...lesson,notes:lessonSequence(lesson)},index:0,busy:false,hint:false,misses:0};
  view='lesson';render();window.scrollTo({top:0,behavior:'instant'});
}
function navigate(next) {
  clearTimeout(pendingTimer);stopDemo();stopPerformance();feedbackState=null;session=null;view=next;render();window.scrollTo({top:0,behavior:'instant'});
}
function modal(title,body) {
  lastFocus=document.activeElement;
  dialog.innerHTML=`<button class="dialog-close icon-button" data-action="close" aria-label="${t('close')}">${icon('close')}</button><h2 id="dialog-title">${title}</h2>${body}`;
  dialog.showModal();
}
function restoreDialogFocus(){
  if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
  else if(lastFocus?.dataset.action)document.querySelector(`${view==='lesson'?'.play-toolbar':'.header'} [data-action="${lastFocus.dataset.action}"]`)?.focus({preventScroll:true});
}
function closeModal() {dialog.close();restoreDialogFocus();}
function action(name) {
  if(name==='settings')return modal(t('settings'),`<label class="setting-option"><input type="checkbox" data-shortcuts ${progress.showShortcuts?'checked':''}> ${t('showShortcuts')}</label><p>${t('shortcutHelp')}</p><button class="secondary" data-action="close">${t('close')}</button>`);
  if(name==='result-details')return modal(t('finishedGarden'),document.querySelector('.result-garden').innerHTML);
  if(name==='performance')return playPerformance();
  if(name==='close'||name==='keep-playing')return closeModal();
  if(name==='sound'){progress.sound=!progress.sound;save();render();document.querySelector(`${view==='lesson'?'.play-toolbar':'.header'} [data-action="sound"]`)?.focus();return;}
  if(name==='demonstrate') {
    if(!session||session.busy)return;
    stopDemo();session.hint=true;
    feedbackState={key:'demo',note:session.lesson.notes[session.index]};demoActive=true;
    render();sound(session.lesson.notes[session.index]);
    demoTimer=setTimeout(()=>{stopDemo();document.querySelector('[data-action="demonstrate"]')?.focus();},800);
    return;
  }
  if(name==='hint') {
    if(!session||session.busy)return;
    session.hint=true;feedbackState={key:'hintFeedback',note:session.lesson.notes[session.index]};render();document.querySelector('[data-action="hint"]')?.focus();return;
  }
  if(name==='leave')return modal(t('breakTitle'),`<p>${t(storageAvailable?'leaveText':'leaveUnsaved')}</p><div class="dialog-buttons"><button class="primary" data-action="keep-playing">${t('keep')}</button><button class="secondary" data-action="leave-confirm">${t('back')}</button></div>`);
  if(name==='leave-confirm'){const destination=session?.lesson.song?'songs':'learn';closeModal();navigate(destination);return;}
  if(name==='tokens')return modal(t('tokensTitle'),`<div class="modal-medal">${icon('star',40)}</div><p>${t('tokensDesc',{n:tokenCount(progress)})}</p><p>${t('tokensRule')}</p><button class="primary" data-action="close">${t('lovely')}</button>`);
  if(name==='account')return modal(t('accountTitle'),`<div class="account-status">${icon('user',24)}<div><b>${t('guest')}</b><span>${t(storageAvailable?'browserSaved':'browserUnavailable')}</span></div></div><p>${t(storageAvailable?'accountSaved':'accountUnsaved')}</p><p class="small-text">${t('cloudLater')}</p><button class="secondary" data-action="close">${t('keepExploring')}</button>`);
  if(name==='parents')return modal(t('parentTitle'),`<p>${t('parentIntro')}</p><ul>${['parentLessons','parentGentle','parentHints','parentInputs'].map(k=>`<li>${t(k)}</li>`).join('')}</ul><p>${t('parentScope')}</p><p>${t('parentSave')}</p><button class="primary" data-action="close">${t('makeMusic')}</button>`);
}
document.addEventListener('change',e=>{
  if(e.target.matches('[data-shortcuts]')){progress.showShortcuts=e.target.checked;save();render();return;}
  if(e.target.matches('[data-register]')){freeBass=e.target.value==='bass';freeNote=freeBass?'C3':'C4';feedbackState=null;render();document.querySelector('[data-register]')?.focus();return;}
  if(!e.target.matches('[data-language]'))return;
  progress.locale=e.target.value==='zh-Hant'?'zh-Hant':'en';save();render();
  document.querySelector(`${view==='lesson'?'.play-toolbar':'.header'} [data-language]`)?.focus();
  document.querySelector('#toast').classList.remove('show');
});
document.addEventListener('click',e=>{
  const target=e.target.closest('button,a');if(!target||target.disabled)return;
  if(target.dataset.view){e.preventDefault();if(view==='lesson')modal(t('visit'),`<p>${t(storageAvailable?'leaveText':'leaveUnsaved')}</p><div class="dialog-buttons"><button class="primary" data-action="close">${t('keep')}</button><button class="secondary" data-destination="${target.dataset.view}">${t('leave')}</button></div>`);else navigate(target.dataset.view);}
  if(target.dataset.destination){closeModal();navigate(target.dataset.destination);}
  if(target.dataset.start)start(Number(target.dataset.start));
  if(target.dataset.song)startSong(target.dataset.song);
  if(target.dataset.buy)buyItem(target.dataset.buy);
  if(target.dataset.buySong)buyItem(target.dataset.buySong,true);
  if(target.dataset.confirmBuy)confirmPurchase(target.dataset.confirmBuy);
  if(target.dataset.confirmSong)confirmPurchase(target.dataset.confirmSong,true);
  if(target.dataset.equip){progress=toggleDecoration(progress,target.dataset.equip);save();render();document.querySelector('[data-equip="'+target.dataset.equip+'"]')?.focus({preventScroll:true});}
  if(target.dataset.action)action(target.dataset.action);
  if(target.dataset.note&&e.detail===0&&!dialog.open)press(target.dataset.note);
});
document.addEventListener('pointerdown',e=>{
  const key=e.target.closest('[data-note]');if(key&&!dialog.open){if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();key.focus({preventScroll:true});press(key.dataset.note);}
});
const keyMap=Object.fromEntries([...notes.map((n,i)=>[shortcuts[i],n]),['w','C#4'],['e','D#4'],['t','F#4'],['y','G#4'],['u','A#4']]);
let invalidLetterCount=0,keyboardTipShown=false;
document.addEventListener('keydown',e=>{
  if(dialog.open||e.ctrlKey||e.metaKey||e.altKey||!['lesson','free'].includes(view)||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const key=e.key.toLowerCase(),note=keyMap[key];
  if(note){invalidLetterCount=0;e.preventDefault();if(!e.repeat&&!held.has(key)){held.add(key);press(playedNote(note));}}
  if(!note&&!e.repeat&&!e.isComposing&&/^[a-z]$/.test(key)&&!progress.showShortcuts&&!keyboardTipShown&&!demoActive&&!performancePlaying){
    if(++invalidLetterCount>=2){keyboardTipShown=true;toast(t('keyboardTip'));}
  }
  // Native button activation must not repeatedly score while Enter/Space is held.
  if(e.repeat&&(e.key==='Enter'||e.key===' ')&&e.target.matches('[data-note]'))e.preventDefault();
});
document.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>held.clear());
document.addEventListener('visibilitychange',()=>{if(document.hidden)held.clear();});
dialog.addEventListener('close',restoreDialogFocus);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
window.addEventListener('resize',()=>{if(view==='lesson'&&session?.lesson.song)render();else drawNoteConnection();});
document.fonts?.ready.then(drawNoteConnection);
render();

function songLibrary() {
  return `<section class="collection-page song-library"><div class="eyebrow">${t('songTag')}</div><h1>${t('songs')} ♫</h1><p>${t('songsIntro')}</p><div class="collection-banner"><div class="token-medal">${icon('star',32)}</div><h2>${t('wallet',{n:tokenCount(progress)})}</h2></div><div class="song-grid">${songs.map((s,index)=>{
    const c=copy(s),owned=progress.purchasedSongs.includes(s.id),done=progress.completedSongs.includes(s.id),affordable=tokenCount(progress)>=s.price;
    return `${index===0||songs[index-1].category!==s.category?`<h2 class="song-group">${t('songGroup_'+(s.category||'basic'))}</h2>`:''}<article class="song-card ${owned?'owned-song':''}" data-song-card="${s.id}"><div class="song-art">${icon('music',40)}</div><h2>${c.title}</h2><p>${c.subtitle}</p>${s.category?`<p class="song-skill">${t('originalStudy',{n:s.recommendedLesson})}</p>`:''}<p>${t('songEdition',{n:s.notes.length})}</p><strong>${done?t('already'):t('songReward',{n:s.reward})}</strong><p>${c.intro}</p>${owned?`<span class="owned-label">${icon('check',16)} ${t('ownedLabel')}</span><button class="primary owned-play" data-song="${s.id}">${t('ownedSong')} →</button>`:`<button class="primary" data-buy-song="${s.id}" ${affordable?'':'disabled'}>${t('buy',{n:s.price})}</button>${affordable?'':`<small>${t('needTokens',{n:s.price-tokenCount(progress)})}</small>`}`}</article>`;
  }).join('')}</div><button class="secondary" data-view="learn">${t('back')}</button></section>`;
}

function extendedStaff(note,reveal) {
 const bass=session.lesson.clef==='bass',y=staffY(note,bass),ledgers=[];
 for(let line=94;line<=y;line+=10)ledgers.push(line);
 for(let line=34;line>=y;line-=10)ledgers.push(line);
 const accidental=note.includes('#')?'♯':note.includes('b')?'♭':session.lesson.naturals?'♮':'';
 return `<svg class="music-staff" data-written-note="${note}" viewBox="0 0 360 128" role="img" aria-label="${reveal?t(bass?'bassStaffName':'staffName',{note}):t(bass?'bassStaffHidden':'staffHidden')}">${[44,54,64,74,84].map(y=>`<line x1="20" x2="340" y1="${y}" y2="${y}" stroke="#637b69"/>`).join('')}<text x="25" y="84" font-size="62" fill="currentColor">${bass?'𝄢':'𝄞'}</text>${ledgers.map(y=>`<line x1="174" x2="206" y1="${y}" y2="${y}" stroke="currentColor"/>`).join('')}<text class="accidental" x="162" y="${y+6}" font-size="24" fill="currentColor">${accidental}</text><ellipse cx="190" cy="${y}" rx="8" ry="5" fill="currentColor"/><path d="M${y<64?182:198} ${y}v${y<64?30:-30}" stroke="currentColor" stroke-width="2"/>${reveal?`<text x="190" y="121" text-anchor="middle" font-size="14">${note}</text>`:''}</svg>`;
}
function bassStaff(note) {
  const y=staffY(note,true),ledger=y<44?`<line x1="174" x2="206" y1="${y}" y2="${y}" stroke="currentColor"/>`:'';
  return `<svg class="music-staff" viewBox="0 0 360 125" role="img" aria-label="${t('bassStaffName',{note})}">${[44,54,64,74,84].map(y=>`<line x1="20" x2="340" y1="${y}" y2="${y}" stroke="#637b69"/>`).join('')}<text x="25" y="82" font-size="58" fill="currentColor">𝄢</text>${ledger}${note.includes('#')?`<text x="165" y="${y+5}" font-size="18">♯</text>`:''}<ellipse cx="190" cy="${y}" rx="8" ry="5" fill="currentColor"/><path d="M182 ${y}v32" stroke="currentColor" stroke-width="2"/><text x="190" y="117" text-anchor="middle" font-size="14">${note}</text></svg>`;
}

function songScore() {
  const wide=window.innerWidth>600&&window.innerHeight>500,width=wide?720:360,beatsPerRow=wide?8:4;
  const rows=scoreRows(session.lesson,beatsPerRow),bass=session.lesson.clef==='bass',accidentals=scoreAccidentals(session.lesson);
  return `<div class="score-window" tabindex="0" role="region" aria-label="${t('scoreLabel')}">${rows.map((row,r)=>`<svg class="score-line music-staff" data-score-row="${r}" viewBox="0 0 ${width} 120" role="img" aria-label="${t('scoreLine',{n:r+1})}"><text x="12" y="18" font-size="12" fill="#40584b">${r+1}</text>${[44,54,64,74,84].map(y=>`<line x1="12" x2="${width-12}" y1="${y}" y2="${y}" stroke="#637b69"/>`).join('')}<text x="15" y="${bass?78:84}" font-size="${bass?48:62}" fill="#284d38">${bass?'𝄢':'𝄞'}</text>${r===0?'<text x="51" y="62" font-size="16" fill="#284d38">4</text><text x="51" y="79" font-size="16" fill="#284d38">4</text>':''}${row.map(({note,index,duration,beat})=>{
    const x=72+beat*(width-104)/beatsPerRow,y=staffY(note,bass),current=index===session.index;
    return `<g class="score-note ${index<session.index?'played':''} ${current?'current':''}" data-score-index="${index}" ${current?'aria-current="step"':''}>${current?`<g class="score-pip-hop" style="--hop-from:${row.some(n=>n.index===session.previousIndex)?(row.find(n=>n.index===session.previousIndex).beat-beat)*(width-104)/beatsPerRow:0}px"><svg class="score-pip" x="${x-13}" y="2" width="26" height="26" viewBox="0 0 220 205" aria-hidden="true">${bird().replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></g>`:index<session.index?`<text class="score-flower" x="${x}" y="24" text-anchor="middle" aria-hidden="true">✿</text>`:''}${y>=94?`<line x1="${x-13}" x2="${x+13}" y1="94" y2="94" stroke="currentColor"/>`:''}${y<=34?`<line x1="${x-13}" x2="${x+13}" y1="34" y2="34" stroke="currentColor"/>`:''}${accidentals[index]?`<text class="score-accidental" x="${x-20}" y="${y+6}" font-size="22" fill="currentColor">${accidentals[index]}</text>`:''}<ellipse cx="${x}" cy="${y}" rx="7" ry="5" transform="rotate(-18 ${x} ${y})" fill="${duration>=2?'#fffefa':'currentColor'}" stroke="currentColor" stroke-width="2"/>${duration<4?`<path d="M${y<64?x-6:x+6} ${y}v${y<64?30:-30}${duration<1?'q15 8 4 18':''}" fill="none" stroke="currentColor" stroke-width="2"/>`:''}${session.hint&&current?`<text x="${x}" y="117" text-anchor="middle" font-size="13">${note[0]}</text>`:''}</g>`;
  }).join('')}<path d="M${width-12} 44v40${wide?` M${72+4*(width-104)/8-18} 44v40`:''}" stroke="#40584b"/></svg>`).join('')}</div>`;
}

function followScore() {
  const pane=document.querySelector('.score-window'),current=pane?.querySelector('.current');
  if(!pane||!current)return;
  const row=current.closest('.score-line'),rowHeight=row.getBoundingClientRect().height;
  const firstRow=Math.floor(Number(row.dataset.scoreRow)/2)*2;
  pane.scrollTop=firstRow*rowHeight;
}

function songView() {
  const l=session.lesson;
  return `<section class="play-page song-player">${lessonToolbar()}<div class="song-heading"><h1>${copy(l).title}</h1><span>${t('verseProgress',{n:session.index<l.verseLength?1:2})}</span><p>${t('scoreGuide')}${l.range?` · ${t(l.range==='high'?'rangeHigh':l.range==='bass'?'rangeBass':'rangeMiddle')}`:''}</p></div><div class="garden-mission song-progress" data-grown="${session.index}"><div class="garden-meter"><span style="width:${session.index/l.notes.length*100}%"></span></div><span>${t('step',{n:session.index+1,total:l.notes.length})}</span></div><div class="learning-stage">${songScore()}</div><div id="feedback" class="feedback" role="status">${t(performancePlaying?'listeningSong':'songReady')}</div>${piano({labels:session.hint,highlight:session.hint?l.notes[session.index]:null})}<div class="lesson-controls"><button class="secondary" data-action="performance">${icon('sound',17)} ${t(performancePlaying?'stopSong':'listenFirst')}</button><button class="secondary" data-action="hint">${icon('help',17)} ${t('hint')}</button></div></section>`;
}

function startSong(id) {
  const song=songs.find(s=>s.id===id);if(!song||!progress.purchasedSongs.includes(id))return;
  clearTimeout(pendingTimer);stopDemo();stopPerformance();feedbackState=null;
  session={lesson:song,index:0,busy:false,hint:false,misses:0};
  view='lesson';render();window.scrollTo({top:0,behavior:'instant'});
}

function buyItem(id,isSong=false) {
  const item=(isSong?songs:decorations).find(d=>d.id===id);if(!item)return;
  if((isSong?progress.purchasedSongs:progress.purchased).includes(id))return;
  if(tokenCount(progress)<item.price){toast(t('shopUnavailable'));return;}
  const name=isSong?copy(item).title:decorationName(item);
  modal(t(isSong?'songBuyTitle':'buyTitle',{name}),`<p>${t(isSong?'songBuyDesc':'buyDesc',{price:item.price,reward:item.reward,balance:tokenCount(progress)-item.price})}</p>${isSong?'':`<p>${t('effect_'+id)}</p>`}<div class="dialog-buttons"><button class="primary" ${isSong?'data-confirm-song':'data-confirm-buy'}="${id}">${t('buyConfirm',{n:item.price})}</button><button class="secondary" data-action="close">${t('cancel')}</button></div>`);
}

function confirmPurchase(id,isSong=false) {
  const before=progress;
  progress=isSong?purchaseSong(progress,id):purchaseDecoration(progress,id);
  if(progress===before){closeModal();return;}
  save();closeModal();render();
  const selector=isSong?`[data-song="${id}"]`:`[data-equip="${id}"]`;
  document.querySelector(selector)?.focus({preventScroll:true});
  toast(t(isSong?'songPurchased':'bought',{name:isSong?'':decorationName(decorations.find(d=>d.id===id))}));
}

function stopPerformance() {
  clearTimeout(performanceTimer);performancePlaying=false;
}

function playPerformance() {
  if(performancePlaying){stopPerformance();render();return;}
  if(!session?.lesson.song)return;
  if(!progress.sound){progress.sound=true;save();}
  performancePlaying=true;render();
  const melody=session.lesson.notes;let i=0;
  const play=()=>{
    if(!performancePlaying)return;
    sound(melody[i],Math.max(.15,(session.lesson.beats[i]||1)*.45));i++;
    if(i<melody.length)performanceTimer=setTimeout(play,(session.lesson.beats[i-1]||1)*450);
    else performanceTimer=setTimeout(()=>{stopPerformance();if(view==='results'||view==='lesson')render();},(session.lesson.beats[i-1]||1)*450);
  };
  play();
}
