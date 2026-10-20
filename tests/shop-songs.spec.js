import {test,expect} from '@playwright/test';
import {songs} from '../curriculum.js';
const key='little-keys-progress-v2';
async function seed(page,data={completed:[1]}){
  await page.addInitScript(({key,data})=>{
    if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({completed:[],sound:false,locale:'en',...data}));
  },{key,data});
}
test('purchase confirmation, balance, equip and persistence; low funds never spend',async({page})=>{
  await seed(page);await page.goto('/');await page.locator('[data-view="achievements"]').first().click();
  await expect(page.locator('[data-buy="crown"]')).toBeDisabled();
  await page.locator('[data-buy="flowerpot"]').click();
  await expect(page.locator('#dialog')).toContainText('2 left');
  await page.locator('#dialog [data-action="close"]').last().click();
  await expect(page.locator('.token-pill b')).toHaveText('10');
  await page.locator('[data-buy="flowerpot"]').click();await page.locator('[data-confirm-buy="flowerpot"]').click();
  await expect(page.locator('.token-pill b')).toHaveText('2');
  await expect(page.locator('.garden-item.flowerpot')).toHaveCount(1);
  await page.locator('[data-equip="flowerpot"]').click();await expect(page.locator('.garden-item.flowerpot')).toHaveCount(0);
  await expect(page.locator('.token-pill b')).toHaveText('2');
  await page.locator('[data-equip="flowerpot"]').click();await page.reload();
  await expect(page.locator('.garden-item.flowerpot')).toHaveCount(1);
  await expect(page.locator('.token-pill b')).toHaveText('2');
  await page.locator('.lesson-card[data-start="1"]').click();
  await expect(page.locator('[data-equipped="flowerpot"]')).toHaveCount(1);
  await page.keyboard.press('a');await expect(page.locator('.garden-mission')).toHaveClass(/bloom-celebration/);
  await expect(page.locator('.bloom-caption')).toHaveText('+1 bloom!');
  await expect(page.locator('.new-bloom')).toHaveCount(1);
});

test('complete all three purchased songs, earn next entry, and replay without duplicate tokens',async({page})=>{
  test.setTimeout(120000);await page.clock.install();await seed(page);await page.goto('/');
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.locator('[data-view="songs"]').first().click();
  const balances=[14,22,32];
  for(const [index,song] of songs.slice(0,3).entries()){
    await page.locator(`[data-buy-song="${song.id}"]`).click();await page.locator(`[data-confirm-song="${song.id}"]`).click();
    await page.locator(`[data-song="${song.id}"]`).click();
    for(const [i,note] of song.notes.entries()){
      await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown',String(i));
      await page.locator(`[data-note="${note}"]`).click();await page.clock.runFor(800);
    }
    await expect(page.locator('.results h1')).toHaveText('Song complete');
    await expect(page.locator('.token-pill b')).toHaveText(String(balances[index]));
    if(song.id==='twinkle'){
      for(const locale of ['en','zh-Hant']){
        await page.locator('.header [data-language]').selectOption(locale);
        for(const size of [{width:1366,height:768},{width:768,height:1024},{width:375,height:667},{width:844,height:390}]){
          await page.setViewportSize(size);
          expect(await page.evaluate(()=>document.documentElement.scrollHeight),`${locale} ${size.width}`).toBeLessThanOrEqual(size.height);
          expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
        }
      }
      await page.locator('.header [data-language]').selectOption('en');
      await page.locator('[data-action="performance"]').click();
      await expect(page.locator('[data-action="performance"]')).toHaveText('Stop playback');
      await page.clock.runFor(500);
    }
    await page.locator('.result-buttons [data-view="songs"]').click();
  }
  await page.reload();await page.locator('[data-view="songs"]').first().click();
  await expect(page.locator('[data-buy-song]')).toHaveCount(9);
  await page.locator('[data-song="buns"]').click();
  for(const note of songs[0].notes){await page.locator(`[data-note="${note}"]`).click();await page.clock.runFor(800);}
  await expect(page.locator('.token-pill b')).toHaveText('32');
  await expect(page.locator('.results')).toContainText('Already earned');expect(errors).toEqual([]);
});

test('song and decoration purchases work in Chinese; full song layout remains usable',async({page})=>{
  await seed(page,{completed:[1,2,3,4,5,6,7,8],locale:'zh-Hant'});await page.goto('/');
  await page.locator('[data-view="songs"]').first().click();
  await page.locator('[data-buy-song="twinkle"]').click();await expect(page.locator('#dialog')).toContainText('首次完成獲得 30 枚');
  await page.locator('[data-confirm-song="twinkle"]').click();await page.locator('[data-song="twinkle"]').click();
  for(const size of [{width:1366,height:768},{width:768,height:1024},{width:375,height:667},{width:844,height:390}]){
    await page.setViewportSize(size);
    for(const selector of ['.piano','.score-window','.lesson-controls']){
      const box=await page.locator(selector).boundingBox();expect(box.y+box.height,`${selector} at ${size.width}`).toBeLessThanOrEqual(size.height);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});

test('strong contrast and heavier type on key reading surfaces',async({page})=>{
  await page.goto('/');
  const contrast=await page.locator('.welcome p').evaluate(el=>{
    const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
    const lum=c=>rgb(c).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const foreground=lum(getComputedStyle(el).color),background=lum(getComputedStyle(document.documentElement).backgroundColor);
    return (Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);
  });
  expect(contrast).toBeGreaterThan(4.5);
  expect(await page.locator('.welcome p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.locator('.welcome p').evaluate(e=>parseFloat(getComputedStyle(e).fontWeight))).toBeGreaterThanOrEqual(500);
});
