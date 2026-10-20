import {test,expect} from '@playwright/test';
import {songs} from '../curriculum.js';
test('all nine chapter songs can be bought, played, rewarded once and restored in purchase order',async({page})=>{
  await page.clock.install();
  await page.addInitScript(()=>{if(!localStorage.getItem('little-keys-progress-v2'))localStorage.setItem('little-keys-progress-v2',JSON.stringify({completed:Array.from({length:16},(_,i)=>i+1),sound:false}));});
  await page.goto('/');await page.locator('[data-view="songs"]').first().click();
  await expect(page.locator('.song-card')).toHaveCount(12);
  await expect(page.locator('.song-group')).toHaveCount(4);
  let balance=400;
  for(const song of songs.slice(3).reverse()){
    await page.locator(`[data-buy-song="${song.id}"]`).click();await page.locator(`[data-confirm-song="${song.id}"]`).click();
    balance-=song.price;await expect(page.locator('.token-pill b')).toHaveText(String(balance));
    await page.locator(`[data-song="${song.id}"]`).click();
    await expect(page.locator('.score-line').first()).toContainText(song.clef==='bass'?'𝄢':'𝄞');
    for(const [i,note] of song.notes.entries()){
      const physical=note.replace('Bb','A#').replace('Db','C#');
      await page.locator(`[data-note="${physical}"]`).click();
      if(i<song.notes.length-1)await expect(page.locator('.song-progress')).toHaveAttribute('data-grown',String(i+1));
    }
    balance+=song.reward;
    await expect(page.locator('.results')).toBeVisible();
    await expect(page.locator('.token-pill b')).toHaveText(String(balance));
    await page.locator('.result-buttons [data-view="songs"]').click();
  }
  await page.reload();await page.locator('[data-view="songs"]').first().click();
  await expect(page.locator('.owned-play')).toHaveCount(9);
  await expect(page.locator('.token-pill b')).toHaveText(String(balance));
  const song=songs.at(-1);await page.locator(`[data-song="${song.id}"]`).click();
  for(const note of song.notes)await page.locator(`[data-note="${note.replace('Bb','A#').replace('Db','C#')}"]`).click();
  await expect(page.locator('.token-pill b')).toHaveText(String(balance));
});

test('chapter song scores show accidentals, naturals and octave range in both languages and layouts',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('little-keys-progress-v2',JSON.stringify({completed:Array.from({length:16},(_,i)=>i+1),purchasedSongs:['secret_door','moon_garden','sky_steps'],sound:false})));
  for(const id of ['secret_door','moon_garden','sky_steps']){
    await page.goto('/');await page.locator('[data-view="songs"]').first().click();await page.locator(`[data-song="${id}"]`).click();
    if(id==='secret_door'){
      const signs=await page.locator('.score-accidental').allTextContents();
      expect(signs).toContain('♯');expect(signs).toContain('♭');expect(signs).toContain('♮');
    }
    for(const locale of ['en','zh-Hant']){
      await page.locator('.play-toolbar [data-language]').selectOption(locale);
      for(const size of [{width:1366,height:768},{width:375,height:667},{width:844,height:390}]){
        await page.setViewportSize(size);
        if(locale==='zh-Hant'&&size.width===1366)await page.screenshot({path:`test-results/new-song-${id}.png`});
        await expect.poll(async()=>{const box=await page.locator('.lesson-controls').boundingBox();return box?box.y+box.height:Infinity;}).toBeLessThanOrEqual(size.height);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
      }
    }
  }
});
