import {test,expect} from '@playwright/test';
import {lessons} from '../curriculum.js';

for(const locale of ['en','zh-Hant'])for(const id of [1,16]){
  test(`completion actions need no scrolling: ${locale}, lesson ${id}`,async({page})=>{
    await page.addInitScript(({locale,id})=>localStorage.setItem('little-keys-progress-v2',JSON.stringify({
      completed:Array.from({length:id-1},(_,i)=>i+1),explored:[],sound:false,locale
    })),{locale,id});
    await page.clock.install();
    await page.goto('/');await page.locator(`.lesson-card[data-start="${id}"]`).click();
    const lesson=lessons[id-1];
    for(let i=0;i<lesson.notes.length;i++){
      await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown',String(i));
      await expect(page.locator('[data-action="hint"]')).toBeEnabled();
      await page.locator(`[data-note="${lesson.notes[i].replace('Bb','A#')}"]`).click();
      await page.clock.runFor(800);
    }
    await expect(page.locator('.results')).toBeVisible();
    await expect(page.locator('.result-extras')).toBeVisible();
    for(const size of [{width:1366,height:768},{width:768,height:1024},{width:1024,height:768},{width:375,height:667},{width:844,height:390}]){
      await page.setViewportSize(size);
      await page.evaluate(()=>window.scrollTo(0,0));
      const primary=page.locator('.result-buttons .primary');
      const box=await primary.boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y+box.height).toBeLessThanOrEqual(size.height);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x+box.width).toBeLessThanOrEqual(size.width);
      expect(await primary.evaluate(el=>{
        const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
      })).toBeTruthy();
      expect(await page.evaluate(()=>window.scrollY)).toBe(0);
      expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBeLessThanOrEqual(size.height);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
      if(size.width===375){
        await page.locator('[data-action="result-details"]').click();
        await expect(page.locator('#dialog')).toBeVisible();
        await expect(page.locator('#dialog .garden-finale span')).toHaveCount(lesson.notes.length);
        await page.keyboard.press('Escape');
        await expect(page.locator('[data-action="result-details"]')).toBeFocused();
      }
      if(id===16&&locale==='en'&&size.width===1366)await page.screenshot({path:'test-results/results-desktop.png'});
      if(id===1&&locale==='zh-Hant'&&size.width===375)await page.screenshot({path:'test-results/results-next-visible.png'});
    }
    await page.locator('.result-buttons .primary').click();
    if(id===1)await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','0');
    else await expect(page.locator('.song-library')).toBeVisible();
    await expect(page.locator('.result-buttons')).toHaveCount(0);
  });
}
