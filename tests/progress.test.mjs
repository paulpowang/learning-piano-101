import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,songs,emptyProgress,normalizeProgress,completeLesson,tokenCount,isUnlocked,achievements,decorations,lessonSequence,lessonPhase,purchaseDecoration,toggleDecoration,purchaseSong,completeSong,earnedTokens} from '../curriculum.js';
import {dictionaries,translate,lessonEn,lessonZh,badgeEn,badgeZh,songCopy} from '../i18n.js';
const completedChapter=()=>lessons.slice(0,8).reduce((p,l)=>completeLesson(p,l.id),emptyProgress());
test('lesson rewards are once only; next lesson unlocks without spending tokens',()=>{
 let p=emptyProgress();assert.equal(isUnlocked(2,p),false);assert.equal(tokenCount(p),0);
 assert.deepEqual(completeLesson(p,8),p);assert.deepEqual(completeLesson(p,99),p);
 p=completeLesson(p,1);assert.equal(tokenCount(p),10);assert.equal(isUnlocked(2,p),true);
 assert.equal(tokenCount(completeLesson(p,1)),10);
 const full=completedChapter();assert.equal(earnedTokens(full),160);assert.equal(achievements.filter(a=>a.earned(full)).length,5);
});
test('shop spends once, equips purchases, refuses insufficient funds and unowned equipment',()=>{
 let p=completeLesson(emptyProgress(),1);
 assert.deepEqual(p.purchased,[]);assert.deepEqual(purchaseDecoration(p,'crown'),p);
 p=purchaseDecoration(p,'flowerpot');assert.equal(tokenCount(p),2);assert.deepEqual(p.equipped,['flowerpot']);
 assert.deepEqual(purchaseDecoration(p,'flowerpot'),p);assert.deepEqual(purchaseDecoration(p,'invalid'),p);
 assert.deepEqual(toggleDecoration(p,'rainbow'),p);
 p=toggleDecoration(p,'flowerpot');assert.deepEqual(p.equipped,[]);assert.equal(tokenCount(p),2);
 p=toggleDecoration(p,'flowerpot');assert.deepEqual(p.equipped,['flowerpot']);
 assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
});
test('a whole chapter can fund every decoration, without automatic purchases',()=>{
 let p=completedChapter();assert.deepEqual(p.purchased,[]);
 for(const d of decorations)p=purchaseDecoration(p,d.id);
 assert.equal(p.purchased.length,7);assert.equal(tokenCount(p),0);
});
test('song economy funds the next song and cannot duplicate rewards',()=>{
 let p=completeLesson(emptyProgress(),1);
 assert.deepEqual(completeSong(p,'buns'),p);assert.deepEqual(purchaseSong(p,'twinkle'),p);
 for(const song of songs.slice(0,3)){
  const before=tokenCount(p);p=purchaseSong(p,song.id);
  assert.equal(tokenCount(p),before-song.price);assert.deepEqual(purchaseSong(p,song.id),p);
  p=completeSong(p,song.id);assert.equal(tokenCount(p),before-song.price+song.reward);
  assert.deepEqual(completeSong(p,song.id),p);assert.deepEqual(normalizeProgress(p),p);
 }
 assert.equal(tokenCount(p),32);assert.equal(p.completedSongs.length,3);
});
test('saved data rejects invalid purchases, unearned completions and invalid equipment',()=>{
 const p=normalizeProgress({completed:[1,1,3,99,'2'],explored:['C4','C4','bad'],purchased:['crown','flowerpot','flowerpot'],equipped:['crown','flowerpot'],purchasedSongs:[],completedSongs:['twinkle']});
 assert.deepEqual(p.completed,[1]);assert.deepEqual(p.explored,['C4']);assert.deepEqual(p.purchased,['flowerpot']);assert.deepEqual(p.equipped,['flowerpot']);assert.equal(tokenCount(p),2);
 assert.deepEqual(p.completedSongs,[]);assert.deepEqual(normalizeProgress(null),emptyProgress());
 assert.equal(normalizeProgress({locale:'zh-Hant'}).locale,'zh-Hant');assert.equal(normalizeProgress({locale:'unknown'}).locale,'en');
});
test('three-stage lessons increase practice without shuffling introductions or melodies',()=>{
 assert.deepEqual(lessons.slice(0,8).map(l=>l.notes.length),[6,12,12,15,18,18,21,24]);
 for(const l of lessons.slice(0,8)){
  assert.equal(l.stages.length,3);assert.deepEqual(l.notes,l.stages.flat());
  const seq=lessonSequence(l,()=>0),first=l.stages[0].length,second=l.stages[1].length;
  assert.deepEqual(seq.slice(0,first),l.stages[0]);assert.deepEqual(seq.slice(first+second),l.stages[2]);
  assert.deepEqual([...seq].sort(),[...l.notes].sort());
  assert.equal(lessonPhase(l,first).phase,1);assert.equal(lessonPhase(l,first+second).phase,2);
  assert.ok(l.notes.every(n=>['C4','D4','E4','F4','G4'].includes(n)));
 }
});
test('whole songs contain all phrases and complete tune endings',()=>{
 assert.deepEqual(songs.slice(0,3).map(s=>s.notes.length),[34,52,84]);
 for(const s of songs){assert.deepEqual(s.stages.flat(),s.notes);assert.ok(['C3','C4','C5','F4'].includes(s.notes.at(-1)));assert.ok(s.reward>s.price);assert.equal(lessonPhase(s,s.notes.length-1).phase,s.stages.length-1);}
});
test('all UI, learning and song copy is bilingual and has matching parameters',()=>{
 assert.deepEqual(Object.keys(dictionaries.en),Object.keys(dictionaries['zh-Hant']));
 const params=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
 for(const key of Object.keys(dictionaries.en)){
  assert.ok(translate('en',key).length);assert.ok(translate('zh-Hant',key).length);
  assert.deepEqual(params(dictionaries.en[key]),params(dictionaries['zh-Hant'][key]),key);
 }
 assert.equal(lessonEn.length,16);assert.equal(lessonZh.length,16);assert.equal(badgeEn.length,6);assert.equal(badgeZh.length,6);
 for(const s of songs)assert.deepEqual(Object.keys(songCopy.en[s.id]),Object.keys(songCopy['zh-Hant'][s.id]));
});
