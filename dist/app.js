const levels = [
  { title:"Meet Middle C", sub:"Find your musical home", icon:"C", notes:["C4","D4","E4"], count:5, intro:"Find the note shown on the staff." },
  { title:"Step Up", sub:"C, D, and E", icon:"↗", notes:["C4","D4","E4"], count:6, intro:"Notes climb up one step at a time." },
  { title:"Five-Note Friend", sub:"C to G", icon:"✋", notes:["C4","D4","E4","F4","G4"], count:7, intro:"Meet all five notes under your right hand." },
  { title:"Treble Explorer", sub:"G to high C", icon:"𝄞", notes:["G4","A4","B4","C5"], count:7, intro:"Climb into the treble staff." },
  { title:"Left-Hand Lane", sub:"Low C to G", icon:"↙", notes:["C3","D3","E3","F3","G3"], count:7, intro:"Your left hand gets a turn." },
  { title:"Note Neighbors", sub:"Read without labels", icon:"⌁", notes:["C4","D4","E4","F4","G4","A4"], count:8, intro:"Use steps and skips to find note neighbors." },
  { title:"Mini Melody", sub:"Read a tiny tune", icon:"♫", notes:["C4","C4","G4","G4","A4","G4"], count:8, intro:"Put the notes together into a melody." },
  { title:"Twinkle Star", sub:"Trail celebration", icon:"★", notes:["C4","D4","E4","F4","G4","A4","B4","C5"], count:9, intro:"Show everything you learned — gently!" }
];

const badges = [
  {icon:"🌱",name:"First Sprout",hint:"Finish one level",test:p=>p.completed.length>=1},
  {icon:"🎯",name:"Careful Ears",hint:"Get 3 stars",test:p=>p.perfect>=1},
  {icon:"🗺️",name:"Trail Scout",hint:"Finish 3 levels",test:p=>p.completed.length>=3},
  {icon:"🎹",name:"Key Friend",hint:"Tap 30 notes",test:p=>p.totalNotes>=30},
  {icon:"🌟",name:"Note Reader",hint:"Finish 5 levels",test:p=>p.completed.length>=5},
  {icon:"🏆",name:"Twinkle Hero",hint:"Finish the trail",test:p=>p.completed.length>=8}
];

const defaults={tokens:0,completed:[],perfect:0,totalNotes:0};
let progress={...defaults,...JSON.parse(localStorage.getItem("notenest-progress")||"{}")};
let currentLevel=0, question=0, mistakes=0, sequence=[], locked=false, audioContext;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function save(){localStorage.setItem("notenest-progress",JSON.stringify(progress));renderHome()}
function show(id){$$('.screen').forEach(x=>x.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}

function renderHome(){
  $('#tokenCount').textContent=progress.tokens;
  $('#pathProgress').textContent=`${progress.completed.length} of 8 levels complete`;
  const unlocked=Math.min(progress.completed.length,7);
  $('#levelPath').innerHTML=levels.map((l,i)=>`<button class="level-card ${progress.completed.includes(i)?'done':''} ${i===unlocked&&!progress.completed.includes(i)?'current':''}" data-level="${i}" ${i>unlocked?'disabled':''} aria-label="Level ${i+1}: ${l.title}">
    <span class="level-state">${progress.completed.includes(i)?'✓':i===unlocked?'▶':'🔒'}</span><span class="level-icon">${l.icon}</span><b>${i+1}. ${l.title}</b><small>${l.sub}</small></button>`).join('');
  $$('.level-card:not(:disabled)').forEach(btn=>btn.addEventListener('click',()=>startLevel(+btn.dataset.level)));
  renderBadges();
}

function renderBadges(){
  const html=badges.map(b=>`<div class="badge ${b.test(progress)?'earned':''}"><span class="badge-medal">${b.icon}</span><span><b>${b.name}</b><small>${b.test(progress)?'Earned!':b.hint}</small></span></div>`).join('');
  $('#badgePreview').innerHTML=badges.slice(0,3).map(b=>`<div class="badge ${b.test(progress)?'earned':''}"><span class="badge-medal">${b.icon}</span><span><b>${b.name}</b><small>${b.test(progress)?'Earned!':b.hint}</small></span></div>`).join('');
  $('#allBadges').innerHTML=html;
}

function buildPiano(){
  const piano=$('#piano'); const white=['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5'];
  const keyboard=['','','','','','','','A','S','D','F','G','H','J','K'];
  piano.innerHTML=white.map((n,i)=>`<button class="white-key" data-note="${n}" aria-label="${pretty(n)}"><span class="key-letter">${keyboard[i]}</span><span class="key-label">${n.replace(/\d/,'')}</span></button>`).join('');
  const blacks=[1,2,4,5,6,8,9,11,12,13];
  blacks.forEach(after=>{const b=document.createElement('button');b.className='black-key';b.tabIndex=-1;b.setAttribute('aria-label','Black key');b.style.left=`calc(10px + ${(after/15)*100}% - 3.6%)`;piano.appendChild(b)});
  $$('.white-key').forEach(k=>{k.addEventListener('pointerdown',()=>press(k.dataset.note,k));});
}

function startLevel(i){
  currentLevel=i;question=0;mistakes=0;locked=false;
  const l=levels[i]; sequence=Array.from({length:l.count},(_,q)=>l.notes[q%l.notes.length]);
  if(i!==0) sequence=sequence.sort(()=>Math.random()-.5);
  $('#levelEyebrow').textContent=`LEVEL ${i+1} · ${l.title.toUpperCase()}`;
  $('#lessonHint').textContent=l.intro;
  $('#feedback').textContent=''; show('#lessonScreen'); loadQuestion();
}

function loadQuestion(){
  locked=false;$$('.white-key').forEach(k=>k.classList.remove('correct','active'));
  const note=sequence[question], name=pretty(note);
  $('#lessonTitle').innerHTML=`Can you find <em>${question===0&&currentLevel===0?'Middle C':name.replace(/\d/,'')}</em>?`;
  $('#staffLabel').textContent=currentLevel<2?`This is ${name}`:'Read this note';
  $('#questionCount').textContent=`${question+1} / ${sequence.length}`;
  $('#lessonProgressBar').style.width=`${(question/sequence.length)*100}%`;
  $('#feedback').className='feedback';$('#feedback').textContent='';
  positionNote(note);
}

function positionNote(note){
  const order=['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5'];
  const idx=order.indexOf(note), top=139-idx*7.15;
  $('#noteHead').style.top=`${top}px`;
  const ledger=$('#ledger');
  if(note==='C4'){ledger.style.display='block';ledger.style.top=`${top+10}px`} else if(['C3','D3','E3','F3','G3','A3','B3'].includes(note)){ledger.style.display='block';ledger.style.top=`${Math.min(top+10,165)}px`} else ledger.style.display='none';
}

function press(note,key){
  if(locked)return; playTone(note);progress.totalNotes++;
  key.classList.add('active');setTimeout(()=>key.classList.remove('active'),180);
  const target=sequence[question];
  if(note===target){
    locked=true;key.classList.add('correct');$('#feedback').className='feedback good';$('#feedback').textContent=mistakes?'Yes — you found it! 🌟':'Beautiful! That’s the one! 🌟';
    setTimeout(()=>{question++;question>=sequence.length?finishLevel():loadQuestion()},750);
  }else{
    mistakes++;$('#feedback').className='feedback try';
    const hint=target.startsWith('C')?'Find C just left of two black keys.':'Almost! Try a nearby white key.';
    $('#feedback').textContent=hint; setTimeout(()=>$('#feedback').classList.remove('try'),320);
  }
}

function playTone(note){
  audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
  const semis={C:-9,D:-7,E:-5,F:-4,G:-2,A:0,B:2}, letter=note[0],oct=+note[1];
  const frequency=440*Math.pow(2,(semis[letter]+(oct-4)*12)/12);
  const osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type='triangle';osc.frequency.value=frequency;gain.gain.setValueAtTime(.18,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.7);osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.7);
}

function finishLevel(){
  const stars=mistakes===0?3:mistakes<=3?2:1,reward=10+stars*5;
  if(!progress.completed.includes(currentLevel)){progress.completed.push(currentLevel);progress.tokens+=reward;if(stars===3)progress.perfect++}else progress.tokens+=5;
  save();$('#earnedTokens').textContent=progress.completed.includes(currentLevel)?reward:5;
  $('#resultStars').textContent='★ '.repeat(stars)+'☆ '.repeat(3-stars);$('#resultStars').setAttribute('aria-label',`${stars} stars earned`);
  $('#resultTitle').textContent=stars===3?'That was note-perfect!':stars===2?'Lovely learning!':'You kept going!';
  $('#resultMessage').textContent=stars===1?'Every try makes your music brain stronger. No lives lost, ever.':'Your music-reading superpower just got stronger.';
  $('#nextLevelButton').style.display=currentLevel<7?'inline-flex':'none';show('#resultScreen');
}

function pretty(n){return n==='C4'?'Middle C':`${n[0]}${n[1]}`}

buildPiano();renderHome();
$('#continueButton').addEventListener('click',()=>startLevel(Math.min(progress.completed.length,7)));
$('#nextLevelButton').addEventListener('click',()=>startLevel(Math.min(currentLevel+1,7)));
$$('[data-go-home]').forEach(b=>b.addEventListener('click',()=>show('#homeScreen')));
$('#profileButton').addEventListener('click',()=>$('#profileDialog').showModal());
$('#googleButton').addEventListener('click',()=>$('#profileDialog').showModal());
$('#viewAchievements').addEventListener('click',()=>$('#achievementDialog').showModal());
$$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$('#demoGoogle').addEventListener('click',()=>{alert('Google Sign-In is a planned production feature. This demo does not collect account data.');});
document.addEventListener('keydown',e=>{const map={a:'C4',s:'D4',d:'E4',f:'F4',g:'G4',h:'A4',j:'B4',k:'C5'};if(map[e.key.toLowerCase()]&&$('#lessonScreen').classList.contains('active')){const note=map[e.key.toLowerCase()],key=$(`.white-key[data-note="${note}"]`);press(note,key)}});
