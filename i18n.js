// All learner-facing copy lives here. Parameters are text, never user HTML.
const pairs = {
 keyboardTip:['Using a keyboard? Open Settings to show the key letters. You can also tap the piano.','正在使用電腦鍵盤嗎？到設定開啟按鍵字母，就能看到對應按鍵。也可以直接點琴鍵。'],
 songGroup_basic:['First melodies','入門旋律'],songGroup_high:['Higher treble melodies','高音旋律'],songGroup_bass:['Bass-clef melodies','低音旋律'],songGroup_accidentals:['Sharps, flats & naturals','升降與還原記號'],
 originalStudy:['Original practice tune · suggested after lesson {n}','原創練習曲・建議學完第 {n} 關'],

 bassStaffHidden:['A note on the bass staff. Use the hint to learn its name.','低音譜表上的一個音符。可使用提示查看音名。'],
 bassStaffName:['Bass clef, {note}','低音譜號，{note}'],
 ownedSong:['Owned · Play song','已擁有・彈奏曲子'], ownedLabel:['In your library','已加入你的曲庫'],
 chapter2:['CHAPTER 02 · HIGH & LOW','第二章・高音與低音'], chapter3:['CHAPTER 03 · SHARPS & FLATS','第三章・升音與降音'],
 nextNotes:['Explore more notes','探索更多音符'], accidentals:['A step between the keys','琴鍵間的小步伐'],
 flat:['{note} flat','降 {note}'],
 rangeMiddle:['C4–C5','C4–C5'],rangeHigh:['C5–C6 · higher octave','C5–C6・高八度'],rangeBass:['C3–C4 · bass clef','C3–C4・低音譜號'],

 settings:['Settings','設定'], showShortcuts:['Show computer keyboard letters','顯示電腦鍵盤按鍵字母'],
 shortcutHelp:['Hide the letters to focus on the music. Your keyboard still works.','隱藏字母後可以專注看譜，電腦鍵盤仍然能彈奏。'],
 scoreGuide:['Read ahead, play at your pace. The score follows you.','先看下一個音，按自己的步調彈奏，樂譜會跟著進度捲動。'],
 songEdition:['Two complete verses · {n} notes','完整旋律演奏兩遍・{n} 個音'],
 verseProgress:['Verse {n} / 2','第 {n}／2 遍'],
 scoreLabel:['Song score. Pip stands above your next note. Flowers mark notes you have played.','樂曲譜面。小鳥站在下一個音符上方，花朵代表已彈過的音。'],
 scoreLine:['Score line {n}','第 {n} 行樂譜'],
 songReady:['Play the note below Pip. No need to wait between notes.','彈奏小鳥下方的音，音與音之間不需要等待。'],
 songFlow:['Keep the melody flowing!','讓旋律繼續流動！'],
 listenFirst:['Listen to the tune','先聽完整旋律'],
 listeningSong:['Listen first, then play. Your progress stays here.','先聽旋律，再自己彈；演奏進度會保留。'],
 register:['Piano range','琴鍵音域'], trebleRange:['Middle / high · C4–C5','中高音・C4–C5'], bassRange:['Low · C3–C4','低音・C3–C4'],
 bassGuide:['Explore the bass clef: C3 is in the second space from the bottom. Use the same keys to hear an octave lower.','認識低音譜號：C3 在由下往上數的第二個線間。用相同按鍵，聽聽低八度的聲音。'],
 singleHandGuide:['Start with one hand: notice repeated notes, steps and jumps. You do not need to play chords.','先用單手練習：觀察重複音、相鄰音和跳進，不需要同時按和弦。'],

  resultRewards:['Your rewards','本次獎勵'],
  songs:['Song library','樂曲圖書館'], songTag:['YOUR NEXT MUSICAL ADVENTURE','下一段音樂旅程'],
  songsIntro:['Buy a whole tune with tokens. Finish it to earn more than you spent, then choose another. Play at your own pace.','用 token 買入整首練習曲，完成後賺回更多，再挑下一首。按自己的步調彈奏。'],
  songReward:['First finish: +{n} tokens','首次完成：＋{n} 枚 token'], songNotes:['{n} notes · {phrases} phrases','{n} 個音・{phrases} 個樂句'],
  playSong:['Play this song','彈奏這首曲子'], songBuyTitle:['Learn {name}?','學習《{name}》？'],
  songBuyDesc:['Spend {price} tokens to keep this song. Your first finish earns {reward} tokens. Replays are free; the reward is given once.','花費 {price} 枚 token 永久解鎖，首次完成獲得 {reward} 枚。重玩免費，獎勵只發放一次。'],
  phrase:['Phrase {n} of {total}','第 {n}／{total} 個樂句'], songComplete:['Song complete','樂曲完成'],
  backSongs:['Choose another song','挑選下一首曲子'], hearSong:['Hear the whole tune','聽聽完整旋律'], stopSong:['Stop playback','停止播放'],
  songHint:['Follow one note at a time. Ask for a hint whenever you need one.','一次看一個音符，需要時隨時使用提示。'],
  songPurchased:['Your song is ready to play!','曲子已解鎖，開始彈奏吧！'],
  phase0:['Follow along','跟著學'], phase1:['Find it yourself','自己找'], phase2:['Make music','彈出音樂'],
  stageProgress:['Round {n} of 3','第 {n}／3 段'], stageDone:['A whole flowerbed! Keep growing.','完成一整片花圃！繼續種下音樂。'],
  bloomPop:['+1 bloom!','＋1 朵花！'], phaseHint:['Try the note on your own. Hints are always here.','試著自己找到音符，隨時可以使用提示。'],
  phaseMelody:['Join the notes into a little tune. No need to hurry.','把音符連成小旋律，不需要趕拍子。'],
  shop:['Garden shop','花園商店'], wallet:['{n} tokens to spend','可使用 {n} 枚 token'],
  buy:['Buy · {n} tokens','購買・{n} 枚 token'], needTokens:['Need {n} more tokens','還差 {n} 枚 token'],
  putAway:['Put away','收起裝飾'], equip:['Use in my garden','放進花園'], equipped:['In garden & lessons','已用於花園與關卡'],
  buyTitle:['Bring {name} home?','把{name}帶回家？'], buyConfirm:['Spend {n} tokens','花費 {n} 枚 token'],
  buyDesc:['It costs {price} tokens. You will have {balance} left. It appears in your garden and during lessons.','需要 {price} 枚 token，購買後剩下 {balance} 枚。它會出現在花園和關卡中。'],
  cancel:['Maybe later','再想一下'], bought:['{name} is now in your garden!','{name}已放進你的花園！'],
  shopInvite:['Choose something for your garden','挑一件花園裝飾'], shopVisit:['Visit the garden shop','逛逛花園商店'],
  shopGuide:['Spend your lesson tokens on decorations. Each one changes your garden and reacts while you play. Put them away or bring them back whenever you like.','用通關獲得的 token 購買裝飾，改變花園，也讓它們陪你彈琴。隨時可以收起或重新擺放。'],
  effect_flowerpot:['Warm pink flowers bloom with every right note.','每彈對一個音，就開出暖粉色花朵。'],
  effect_butterfly:['A butterfly flutters when you grow a flower.','花朵盛開時，蝴蝶陪著飛舞。'],
  effect_windmill:['Your right notes set the windmill spinning.','彈對音符，讓風車轉起來。'],
  effect_rainbow:['A rainbow shines over each new bloom.','每次開花，彩虹就閃亮登場。'],
  effect_crown:['Pip wears your crown and celebrates with you.','Pip 戴上你的皇冠，陪你慶祝。'],
  effect_lantern:['A little lantern glows when you play correctly.','彈對音符時，小燈籠溫暖亮起。'],
  effect_blueflowers:['Choose blue blossoms instead of pink.','把花朵換成藍紫色，優先於粉色花盆。'],
  shopUnavailable:['Not enough tokens yet. Finish another lesson to earn more.','token 還不夠，完成下一個關卡就能繼續累積。'],
  home:['Little Keys home','Little Keys 首頁'], nav:['Main navigation','主要導覽'],
  adventure:['My adventure','我的學習旅程'], free:['Free play','自由彈奏'], collection:['My collection','我的收藏'],
  tokens:['{n} tokens','{n} 枚 token'], profile:['Profile and saving','個人進度與儲存'],
  language:['Language','語言'], mute:['Mute sound','關閉音效'], unmute:['Enable sound','開啟音效'],
  footer:['Little steps make beautiful music.','一步一步，彈出美好的音樂。'],
  saved:['Progress saved in this browser','進度僅儲存在此瀏覽器'], unsaved:['Progress is not being saved','目前無法儲存進度'], parents:['For grown-ups','給大人的說明'],
  welcomeTag:['A LITTLE PRACTICE. A LOT OF POSSIBILITY.','從一點點練習，發現音樂的可能'], welcome:['Your piano adventure','你的鋼琴學習旅程'], welcomeDesc:['Big musical dreams start with little keys.','從小小的琴鍵，開始認識音樂。'],
  noRush:['No rush. Just you & the music.','慢慢來，享受你和音樂的時光。'], nextTag:['YOUR NEXT LITTLE STEP','接下來的一小步'], doneTag:['LOOK HOW FAR YOU’VE COME','看看你已經學會了多少'],
  heroNew:['Every pianist starts with one note.','每位鋼琴家，都從一個音開始。'], heroContinue:['Keep the music growing.','讓音樂繼續成長。'], heroDone:['You’re a little pianist!','你已經是小小鋼琴家了！'],
  heroDesc:['Meet the piano, find your first key, and let’s make a little music together.','認識鋼琴，找到第一個琴鍵，一起彈出音樂。'], nextDesc:['Next up: {title} Let’s discover something new.','下一關：{title}。一起學點新東西。'], doneDesc:['Sixteen little steps. A whole new musical world.','完成十六個小步驟，打開音樂的新世界。'],
  begin:['Let’s begin','開始學習'], continue:['Continue adventure','繼續學習'], replay:['Play again','再玩一次'], play:['Let’s play','開始這一關'],
  curiosity:['No experience needed. Curiosity welcome.','不需要經驗，帶著好奇心就可以。'], encouragement:['You’ve got this!','你可以的！'], chapter:['CHAPTER 01','第一章'], firstNotes:['The first notes','認識最初的音符'], completed:['{n} of {total} complete','已完成 {n}／{total} 關'],
  lessonNumber:['LESSON {n}','第 {n} 關'], afterLesson:['After lesson {n}','完成第 {n} 關後開放'], startHere:['START HERE','從這裡開始'],
  wins:['Your little wins','你的學習成果'], explored:['lessons explored','已完成關卡'], grow:['Look at you grow! One little step at a time.','每次一小步，你正在進步！'], firstWin:['Your first little win is just a note away.','彈出第一個音，就是第一個小成就。'],
  badgeCount:['{n} badges earned','已獲得 {n} 個徽章'], pipNote:['A NOTE FROM PIP','PIP 的小提醒'], happyNotes:['Small steps. Happy notes.','慢慢學，開心彈。'], pipQuote:['Mistakes are just notes on the way to something wonderful. Let’s try together!','彈錯了也沒關係，我們一起再試試！'],
  freeTitle:['A little room to play','自由彈奏的小天地'], freeDesc:['Follow your curiosity. Every key has a sound to share.','跟著好奇心探索，每個琴鍵都有自己的聲音。'], freeShort:['No lessons, no rules. Just see what sounds good.','沒有題目，試試你喜歡的聲音。'], explorePiano:['Explore the piano','探索琴鍵'],
  gentle:['Made for little learners. No timers, no lost lives, just happy progress.','慢慢學習，不限時間、不扣分，享受每次進步。'],
  piano:['Piano keyboard','鋼琴鍵盤'], middleC:['Middle C','中央 C'], middleCLower:['middle C','中央 C'], highC:['High C','高音 C'], playKey:['Play {note}','彈奏 {note}'], sharp:['{note} sharp','升 {note}'],
  keyboardHelp:['Click, tap, or use your keyboard A–K','滑鼠點擊、觸控，或使用鍵盤 A–K'], staffName:['Treble clef, {note}','高音譜號，{note}'], staffHidden:['A note on the treble staff. Use the hint to learn its name.','高音譜表上的一個音符。可使用提示查看音名。'],
  blooms:['{n} / {total} blooms','已開花 {n}／{total} 朵'], flower:['Blooming flower','盛開的花朵'], seed:['Waiting seed','等待發芽的種子'],
  show:['Show me','示範給我看'], hint:['A little hint','給我提示'], step:['LITTLE STEP {n} OF {total}','第 {n}／{total} 個小步驟'],
  firstTitle0:['Wake the first little seed!','喚醒第一顆小種子！'], firstDesc0:['Play middle C. Its note and key light up together.','彈奏中央 C。音符和琴鍵會一起亮起。'],
  firstTitle1:['Help another flower bloom.','讓另一朵花也盛開。'], firstDesc1:['The guide is gone. Find C on its tiny line, then find its key.','連線藏起來了，先認出小加線上的 C，再找琴鍵。'],
  firstTitle2:['One last flower for Pip!','為 Pip 開出最後一朵花！'], firstDesc2:['Play two notes to finish your first little musical phrase.','再彈出兩個音，完成你的第一小段音樂。'],
  ledger:['C’s tiny line is below the five staff lines.','中央 C 的小加線，在五條線的下方。'], same:['Same note · Same sound · Same key','同一個音符・同一個聲音・同一個琴鍵'], findC:['Find C, just left of the two black keys.','找到兩個黑鍵左邊的 C。'],
  startFeedback:['Play a note to grow a flower. You can start right now!','彈出一個音，讓花朵成長。現在就可以開始！'], playFlower:['Play {note} to grow a flower.','彈奏 {note}，讓花朵盛開。'], whichKey:['Which key will make it bloom?','哪個琴鍵能讓花朵盛開？'], listening:['Pip’s listening! Match the note to its piano key.','Pip 在聽喔！找到音符對應的琴鍵。'],
  playground:['YOUR MUSICAL PLAYGROUND','你的音樂遊樂場'], tryKey:['Try a key and watch its note appear.','試著彈一個琴鍵，看看它的音符。'], explorer:['Key explorer','琴鍵探索家'], exploreEight:['Try all 8 white keys to earn a badge.','探索全部 8 個白鍵，就能獲得徽章。'], ownMelody:['Make your own little melody','創作自己的小旋律'], melodyTip:['Try C, D, E… then come back home to C. There’s no wrong answer here.','試試 C、D、E，再回到 C。這裡沒有錯誤答案。'],
  collectionTag:['LOOK AT YOU GROW','看見自己的進步'], collectionTitle:['A collection of little wins','收藏每一次小成就'], collectionDesc:['Every badge tells a story. This one is yours.','每個徽章，都記錄著你的學習旅程。'], happyTokens:['{n} happy little tokens','已累積 {n} 枚 token'], rewardDesc:['Earned by learning, one little lesson at a time.','每完成一個新關卡，就累積一份學習獎勵。'], earned:['You did it!','你做到了！'], waiting:['Waiting to bloom','等待綻放'], back:['Back to my adventure','回到學習旅程'],
  resultTag:['A LITTLE STEP. A BIG HIGH FIVE.','為這一小步，開心擊掌！'], resultTitle:['You made music!','你彈出音樂了！'], finishedGarden:['Your completed flower garden','你完成的小花園'], learned:['You can {skill}.','你已經學會：{skill}。'], effort:['Every try brought you a little further.','每次嘗試，都讓你向前了一點。'], already:['Already earned','已領取獎勵'], collected:['tokens collected','獲得 token'], practice:['Keep practicing for fun','歡迎繼續練習'], lessonComplete:['Lesson {n} complete','第 {n} 關完成'], newBadge:['New badge: {name}','新徽章：{name}'], next:['Next little adventure','前往下一關'], seeCollection:['See my collection','看看我的收藏'], replayLesson:['Play this lesson again','再玩一次這一關'], stretch:['A good time for a little stretch, too. Your piano will be here.','也可以伸個懶腰、休息一下，鋼琴會在這裡等你。'],
  gardenTitle:['Pip’s little garden','Pip 的小花園'], gardenDesc:['Your music earns tokens. Choose decorations in the shop, then bring them into your lessons.','學習獲得 token，在商店挑選裝飾，帶著它們一起彈琴。'], gardenEmpty:['Finish a lesson, then choose your first decoration in the shop.','完成第一關，就能去商店挑選第一件裝飾。'], unlockAt:['Unlock at {n} tokens','累積 {n} 枚 token 解鎖'], unlocked:['In your garden','已放進花園'], newDecoration:['New decoration: {name}','新裝飾：{name}'], decorations:['Garden treasures','花園寶藏'],
  saveError:['Your browser cannot save right now. You can still play!','此瀏覽器目前無法儲存，你仍然可以繼續玩！'], audioError:['Sound is unavailable in this browser. You can still play the lessons.','此瀏覽器目前無法播放聲音，你仍可繼續學習。'],
  freeC:['Middle C. A lovely place to start.','中央 C，開始學琴的好地方。'], freeNote:['{note}. A little note, a lot of possibilities.','{note}，一個音符也有許多可能。'], freeSharp:['That’s {note} — a sound to explore! The staff above shows your last white key.','這是{note}，試著聽聽它的聲音！上方譜面保留剛才的白鍵音符。'], explorerEarned:['New badge: Key explorer! You found all 8 white keys.','新徽章：琴鍵探索家！你找到了全部 8 個白鍵。'],
  firstSuccess0:['Pop! A flower! That key and note are both C.','開花了！這個琴鍵和音符都是 C。'], firstSuccess1:['Another bloom! C lives on that tiny line.','又開了一朵！C 就在那條小加線上。'], firstSuccess2:['You found it yourself! Pip’s garden is awake!','你自己找到了！Pip 的花園醒來了！'],
  success0:['Pop! You grew a flower!','開花了！你種出一朵花！'], success1:['Pip says: That’s the note!','Pip 說：就是這個音！'], success2:['Another happy little bloom!','又一朵開心的小花！'], wrong:['Good exploring! Try a neighboring key. You have all the time you need.','很棒的探索！試試旁邊的琴鍵，不用急。'], together:['Let’s find it together. Try the glowing {note} key.','我們一起找找看，試試亮起的 {note} 琴鍵。'], demo:['Watch them light up together. This note and this key both play {note}.','看看它們一起亮起。這個音符和琴鍵都代表 {note}。'], hintFeedback:['This is {note}. Follow the glowing key. Hints are always okay!','這是 {note}，試試亮起的琴鍵。隨時都可以使用提示！'],
  close:['Close dialog','關閉對話框'], breakTitle:['Take a little break?','想休息一下嗎？'], leaveText:['Your completed lessons and tokens are saved. This lesson will start from the beginning when you come back.','已完成的關卡與 token 已儲存，回來時會從這一關的開頭開始。'], leaveUnsaved:['Saving is unavailable. Leaving restarts this lesson; closing this page may lose your progress.','目前無法儲存。離開後這一關會重新開始；關閉頁面可能失去進度。'], keep:['Keep playing','繼續玩'], leave:['Leave this lesson','離開這一關'], visit:['Visit another room?','前往其他畫面嗎？'],
  tokensTitle:['Little tokens, big effort.','小小 token，記錄你的努力。'], tokensDesc:['You have {n} tokens to spend! Finish a new lesson to earn more. Hints and extra tries never reduce your reward.','你有 {n} 枚 token 可以使用！完成新關卡就能收集更多，提示與重試不會減少獎勵。'], tokensRule:['Each lesson gives tokens once. Spend them in the garden shop; using hints never costs tokens.','每關發放一次 token，可以在花園商店購物。使用提示不花費 token。'], lovely:['Lovely!','太好了！'], accountTitle:['Your little adventure','你的學習紀錄'], guest:['Playing as a guest','訪客模式'], browserSaved:['Saved only in this browser','僅儲存在此瀏覽器'], browserUnavailable:['Browser storage unavailable','瀏覽器無法儲存'], accountSaved:['Your lessons, badges, and tokens stay in this browser. Clearing browser data will remove them.','關卡、徽章與 token 僅保存在此瀏覽器。清除瀏覽器資料會移除這些紀錄。'], accountUnsaved:['You can play, but your progress may be lost when you close this page.','你可以繼續玩，但關閉頁面後可能失去進度。'], cloudLater:['No account is needed. Google sign-in and cross-device saving are planned for a future version.','不需要帳號即可遊玩。Google 登入與跨裝置儲存將留待後續版本。'], keepExploring:['Keep exploring','繼續探索'],
  parentTitle:['A gentle start to music','輕鬆開始認識音樂'], parentIntro:['For ages 6–9 and curious beginners: connect piano keys to the treble staff, one small idea at a time.','適合 6–9 歲與零基礎學習者，每次學一個小概念，建立琴鍵與高音譜表的連結。'], parentLessons:['16 lessons: first notes, higher notes, bass clef, and accidentals.','16 個關卡：入門旋律、更高音、低音譜號與升降記號。'], parentGentle:['No timers, lost lives, or penalties for mistakes.','不限時、不扣生命值，答錯沒有懲罰。'], parentHints:['Hints never reduce rewards.','使用提示不會減少獎勵。'], parentInputs:['Mouse, touch, and computer keyboard support.','支援滑鼠、觸控及電腦鍵盤。'], parentScope:['This chapter teaches pitch reading from C4 to G4. Songs introduce note lengths without timing scores; free play also offers a lower octave and bass clef.','本章學習 C4～G4 的音高與譜位，樂曲顯示音符長短但不評節奏分數；自由彈奏可探索低八度與低音譜號。'], parentSave:['Progress stays only in this browser. Cloud saving is not connected in this version.','進度僅存在此瀏覽器，此版本尚未連接雲端存檔。'], makeMusic:['Let’s make music','一起彈音樂吧']
};
export const dictionaries = Object.fromEntries(['en','zh-Hant'].map((locale,index)=>[locale,Object.fromEntries(Object.entries(pairs).map(([key,values])=>[key,values[index]]))]));
export function translate(locale,key,params={}) {
  const value=dictionaries[locale]?.[key] ?? dictionaries.en[key];
  if(value===undefined) throw new Error(`Missing translation: ${key}`);
  return value.replace(/\{(\w+)\}/g,(_,name)=>String(params[name] ?? ''));
}
export const lessonZh = [
  ['你好，鋼琴！','一個音符，一個琴鍵','中央 C 在五線譜下方的小加線上，亮起的琴鍵彈出的就是這個音。','譜面上：五線譜下方的小加線。琴鍵上：兩個黑鍵左邊的白鍵。兩者都是中央 C！','將中央 C 的音符對應到琴鍵'],
  ['三位小夥伴','認識 C、D、E','C、D、E 是鄰居！D 在兩個黑鍵中間，E 在它們右邊。琴鍵往右，音符也往上。','從 C 向右走一個白鍵是 D，再一個是 E。音符逐步升高，聲音也越來越高。','彈奏 C、D、E'],
  ['認識五線譜','五條線，音符的新家','這五條線叫五線譜。音符住在線上或線間，E 在最下面的第一線上。','從下往上數，第一條線上的音是 E。注意音符橢圓的位置。','在五線譜上找到 E'],
  ['C 和 D 的家','連結音符與琴鍵','中央 C 在下方的小加線上，D 在第一線下方的空間，E 就在第一線上。','C：下方小加線。D：第一線下方的空間。E：第一線。需要時隨時看提示。','辨認 C、D、E 的譜位'],
  ['再高一點點','認識 F、G','往上走吧！F 在第一個線間，G 在第二線。每升一步，琴鍵就向右移一個白鍵。','從下面開始：E 在線上，F 在線間，G 在下一條線上。','辨認到 G 的音符'],
  ['音符小偵探','讓音符帶路','你已經認識五個音了！現在藏起音名，看看音符位置，找到琴鍵，慢慢來。','先找第一線上的 E，再往上或往下數。按提示就能看到音名。','不靠音名提示讀譜'],
  ['你的第一段旋律','一次彈一個音','跟著音符，慢慢彈出這段小旋律。沒有倒數，也不需要跟上節拍。','聽聽音符先往下，再往上。你正在彈奏旋律！','讀譜並彈奏一段短旋律'],
  ['小小鋼琴家','第一場小演奏','一起慶祝吧！用 C、D、E、F、G 完成這段旋律，隨時都可以使用提示。','慢慢來很好。先找到音符在線上還是線間，再找到琴鍵。你可以的！','完成第一場小演奏']
].map(([title,subtitle,intro,tip,skill])=>({title,subtitle,intro,tip,skill}));
export const missionCopy = {
  en:['Wake Pip’s garden','Grow a rainbow garden','Plant a music meadow','Help the little buds bloom','Grow the tall flowers','Find the hidden blossoms','Grow a melody garden','Pip’s garden concert'],
  'zh-Hant':['喚醒 Pip 的花園','種出彩色花園','種一片音樂草地','幫小花苞開花','種出高高的花','尋找藏起來的花朵','種出旋律花園','Pip 的花園音樂會']
};
export const badgeZh = [
  ['第一小步','完成第一關'],['琴鍵探索家','在自由彈奏探索全部 8 個白鍵'],['五線譜好朋友','完成「認識五線譜」'],['音符小偵探','不靠音名提示完成讀譜關卡'],['旋律創作者','彈出第一段旋律'],['小小鋼琴家','完成第一章全部八關']
].map(([name,description])=>({name,description}));
export const decorationCopy={en:['Flowerpot','Butterfly','Windmill','Rainbow','Pip’s crown','Little lantern','Blue blossoms'],'zh-Hant':['花盆','蝴蝶','風車','彩虹','Pip 的皇冠','小燈籠','藍紫花朵']};

export const lessonEn = [
  {
    "title": "Hello, piano!",
    "subtitle": "One note, one piano key",
    "intro": "This note is middle C. It sits on a tiny line below the five staff lines. The green piano key plays this very same note.",
    "tip": "On the page: a note on a tiny line below the staff. On the piano: the white key just left of the two black keys. Both are middle C!",
    "skill": "Match middle C on the staff to its piano key"
  },
  {
    "title": "Three little friends",
    "subtitle": "Say hello to C, D & E",
    "intro": "C, D and E are neighbors! D is between the two black keys. E is just to their right.",
    "tip": "Walk one white key to the right: C, D, E. Each note sounds a little higher.",
    "skill": "Play C, D and E"
  },
  {
    "title": "Meet the music staff",
    "subtitle": "Five lines, a new home",
    "intro": "These five lines are called a staff. Notes live on lines or in spaces. E sits on the bottom line. The curly symbol is a treble clef.",
    "tip": "Count from the bottom. The first line is E. The note’s oval shows its position.",
    "skill": "Find E on the staff"
  },
  {
    "title": "A home for C & D",
    "subtitle": "Connect the dots",
    "intro": "Middle C sits below the staff on its own tiny line. D sits in the space just below the bottom line. E sits on that bottom line.",
    "tip": "C: tiny extra line. D: space below. E: bottom line. You can always ask for a hint.",
    "skill": "Read C, D and E"
  },
  {
    "title": "A little higher",
    "subtitle": "Make friends with F & G",
    "intro": "Let’s climb! F sits in the first space. G sits on the second line. Each step up moves one white key to the right.",
    "tip": "From the bottom: E on a line, F in a space, G on the next line.",
    "skill": "Read up to G"
  },
  {
    "title": "Note detective",
    "subtitle": "Let the notes guide you",
    "intro": "You know five notes! Now the note names are hidden. Look at where the note sits and find its piano key. Take all the time you need.",
    "tip": "Start with E on the bottom line, then count up or down. Tap “A little hint” to see the name.",
    "skill": "Read without note names"
  },
  {
    "title": "Your first melody",
    "subtitle": "One happy note at a time",
    "intro": "Play this little tune one note at a time. We’ll show you each note. There’s no timer — this is about reading, not rhythm yet.",
    "tip": "Listen to how the notes go down and then back up. You’re making a melody!",
    "skill": "Read a short melody"
  },
  {
    "title": "Little pianist",
    "subtitle": "Your very first recital",
    "intro": "Time for a little celebration! Read your way through this tune using C, D, E, F and G. Hints are always here for you.",
    "tip": "Slow is wonderful. Find the line or space, then find the key. You’ve got this.",
    "skill": "Complete your first recital"
  }
];
export const badgeEn = [
  {
    "name": "First little step",
    "description": "Finish your first lesson"
  },
  {
    "name": "Key explorer",
    "description": "Try all 8 white keys in Free Play"
  },
  {
    "name": "Staff buddy",
    "description": "Finish Meet the music staff"
  },
  {
    "name": "Note detective",
    "description": "Read notes without their names"
  },
  {
    "name": "Melody maker",
    "description": "Play your first melody"
  },
  {
    "name": "Little pianist",
    "description": "Complete your first piano adventure"
  }
];
export const songCopy = {
 en:{
  buns:{title:'Hot Cross Buns',subtitle:'A first complete tune · C D E',intro:'Three familiar notes make a whole tune. Read each phrase and play the complete melody twice.',skill:'play Hot Cross Buns from beginning to end',tip:'E is on the bottom line, D just below it, and C on its tiny ledger line.'},
  mary:{title:'Mary Had a Little Lamb',subtitle:'Four little phrases · C D E G',intro:'Follow the melody down and up. Read ahead on the score, then play the complete melody twice.',skill:'play Mary Had a Little Lamb from beginning to end',tip:'Start from E on the bottom line. G is on the second line.'},
  twinkle:{title:'Twinkle, Twinkle, Little Star',subtitle:'A full six-phrase tune · C D E F G A',intro:'Meet A: the space above G, and the next white key to its right. Hints help you find this new note.',skill:'play Twinkle, Twinkle, Little Star from beginning to end',tip:'A is in the second space from the bottom, one white key to the right of G.'}
 },
 'zh-Hant':{
  buns:{title:'熱十字麵包',subtitle:'第一首完整旋律・C D E',intro:'三個熟悉的音，就能彈出整首曲子。跟著譜面，把完整旋律彈奏兩遍。',skill:'從頭到尾彈完《熱十字麵包》',tip:'E 在第一線上，D 在第一線下方，C 在下方的小加線上。'},
  mary:{title:'瑪莉有隻小綿羊',subtitle:'四個小樂句・C D E G',intro:'跟著旋律往下、往上走，先看下一段樂譜，再把完整旋律彈奏兩遍。',skill:'從頭到尾彈完《瑪莉有隻小綿羊》',tip:'先找第一線上的 E，G 在第二線上。'},
  twinkle:{title:'小星星',subtitle:'完整六個樂句・C D E F G A',intro:'認識 A：它在 G 上方的線間，琴鍵是 G 右邊的下一個白鍵。隨時用提示找到新音符。',skill:'從頭到尾彈完《小星星》',tip:'A 在從下往上數的第二個線間，琴鍵是 G 右邊的白鍵。'}
 }
};

const furtherLessons={
 en:[
 ['Up to high C','A, B and C5','Above G, A is in a space, B on the middle line, and C5 in the next space. Move right on the white keys.','G is your starting point. Climb G, A, B, C, one white key at a time.','read A4, B4 and C5'],
 ['A higher octave','C5 to G5','The keyboard now begins at C5. D5 is on the fourth line, E5 in the top space, F5 on the top line, and G5 just above.','These keys sound an octave higher. Start at C5 and move right; G5 is just above the top line.','read C5 to G5'],
 ['Meet the bass clef','Low C, D and E','The bass clef gives the lines different notes. C3 is in the second space from the bottom; D3 is on the middle line.','Find C3 in the second space. Move up to D3 on the middle line and E3 in the next space.','read C3, D3 and E3 in bass clef'],
 ['A low melody','F3, G3 and A3','Keep climbing in bass clef: F3 is on the fourth line, G3 in the top space, A3 on the top line.','Start with E3 in the third space. Then F3, G3, A3 alternate line, space, line.','read a melody in bass clef'],
 ['One step higher','Meet the sharp ♯','A sharp raises a note by one semitone: the very next piano key, black or white. F♯ is the black key just right of F.','Keep the note on the F space; ♯ changes its sound. Play the black key between F and G.','find and play F sharp'],
 ['One step lower','Meet the flat ♭','A flat lowers a note by one semitone. B♭ is the black key just left of B, between A and B.','The note stays on the B line. The flat sign tells you to play one key lower.','find and play B flat'],
 ['Two names, one key','C♯ and D♭','C♯ moves one key up from C. D♭ moves one key down from D. On this piano they meet at the same black key.','The same black key can be written in two places: C with ♯, or D with ♭.','recognize C sharp and D flat as the same piano key'],
 ['Back to the white key','Meet the natural ♮','A natural cancels a sharp or flat. F♮ returns to F; B♮ returns to B. Here we show each note separately for practice.','On a full score an accidental normally lasts to the end of its measure for that pitch and octave. ♮ can cancel it sooner.','recognize sharps, flats and naturals']
 ],
 'zh-Hant':[
 ['走到高音 C','認識 A、B、C5','G 再往上，A 在線間，B 在中間的第三線，C5 在再上一個線間。琴鍵沿著白鍵向右走。','從熟悉的 G 出發，依序找到 A、B、C，每次向右一個白鍵。','辨認 A4、B4 與 C5'],
 ['再高一個八度','認識 C5～G5','這次琴鍵從 C5 開始。D5 在第四線，E5 在最高的線間，F5 在第五線，G5 在第五線上方。','整排琴鍵升高八度。從 C5 向右找，G5 就在最高一條線的上方。','辨認 C5～G5'],
 ['認識低音譜號','低音 C、D、E','換成低音譜號後，每條線代表的音不同。C3 在由下往上數第二個線間，D3 在中間的第三線。','先找第二線間的 C3，再向上找到第三線的 D3 與第三線間的 E3。','在低音譜表辨認 C3、D3、E3'],
 ['低音小旋律','認識 F3、G3、A3','在低音譜表繼續向上：F3 在第四線，G3 在最高的線間，A3 在第五線。','從第三線間的 E3 開始，F3、G3、A3 依序在線、間、線。','讀譜並彈奏低音旋律'],
 ['升高一小步','認識升記號 ♯','升記號讓音升高半音，也就是緊鄰的下一個琴鍵，可能是黑鍵或白鍵。升 F 是 F 右側的黑鍵。','音符仍寫在 F 的線間，♯ 改變它的音高。按 F 和 G 之間的黑鍵。','找到並彈奏升 F'],
 ['降低一小步','認識降記號 ♭','降記號讓音降低半音。降 B 是 B 左側、A 和 B 之間的黑鍵。','音符仍寫在 B 的線上，♭ 提醒你彈低半音的琴鍵。','找到並彈奏降 B'],
 ['同一琴鍵的兩個名字','升 C 與降 D','升 C 是 C 往上半音；降 D 是 D 往下半音。在這架鋼琴上，它們是同一個黑鍵。','同一黑鍵有兩種寫法：C 加 ♯，或 D 加 ♭。看看它們在譜上的位置有何不同。','認識升 C 與降 D 對應同一琴鍵'],
 ['回到原來的白鍵','認識還原記號 ♮','還原記號取消升降：F♮ 回到 F，B♮ 回到 B。這一關先逐音練習辨認。','在完整樂譜中，臨時升降記號通常影響同小節、同音高與八度的後續音；♮ 可以提早取消它。','辨認升、降與還原記號']
 ]
};
for(const locale of ['en','zh-Hant']){
 const list=locale==='en'?lessonEn:lessonZh;
 for(const [title,subtitle,intro,tip,skill] of furtherLessons[locale]){list.push({title,subtitle,intro,tip,skill});missionCopy[locale].push(title);}
}

const newSongNames={
 en:[['sky_steps','Steps in the Sky'],['cloud_dance','Cloud Dance'],['sunrise_song','Sunrise Song'],['sleepy_bear','Sleepy Bear'],['river_boat','River Boat'],['moon_garden','Moon Garden'],['sparkle_path','Sparkle Path'],['bluebird_swing','Bluebird Walk'],['secret_door','The Secret Door']],
 'zh-Hant':[['sky_steps','天空階梯'],['cloud_dance','雲朵之舞'],['sunrise_song','日出之歌'],['sleepy_bear','瞌睡小熊'],['river_boat','河上的小船'],['moon_garden','月光花園'],['sparkle_path','閃亮小徑'],['bluebird_swing','藍鳥散步'],['secret_door','祕密之門']]
};
for(const locale of ['en','zh-Hant'])for(const [i,[id,title]] of newSongNames[locale].entries()){
 const en=locale==='en',high=i<3,bass=i>=3&&i<6;
 const intro=high?(en?'An eight-measure tune in the higher octave, C5–G5. Look ahead as the melody climbs and returns.':'八小節的高音旋律，使用 C5～G5。先看下一個音，聽旋律升高又回來。'):bass?(en?'An eight-measure tune on the bass staff. The keyboard switches to C3–C4 for you.':'八小節的低音旋律，使用低音譜號，琴鍵會自動切換至 C3～C4。'):(en?'An eight-measure tune with accidentals. Watch the signs beside the notes; naturals return to the original pitch.':'八小節的升降音旋律。留意音符旁的記號，還原記號會讓音回到原來的音高。');
 songCopy[locale][id]={title,subtitle:en?'An original eight-measure study':'原創八小節練習曲',intro,skill:en?`play ${title} from beginning to end`:`從頭到尾彈完《${title}》`,tip:intro};
}
