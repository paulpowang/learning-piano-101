import { test, expect } from '@playwright/test';

test('every lesson starts immediately and the piano and help fit the viewport',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('little-keys-progress-v2',JSON.stringify({completed:Array.from({length:16},(_,i)=>i+1),explored:[],sound:false})));
  for(const size of [{width:1366,height:768},{width:768,height:1024},{width:375,height:667},{width:390,height:844},{width:844,height:390}]){
    await page.setViewportSize(size);
    for(const id of Array.from({length:16},(_,i)=>i+1)){
      await page.goto('/');
      await page.locator(`.lesson-card[data-start="${id}"]`).click();
      await expect(page.locator('[data-action="ready"]')).toHaveCount(0);
      for(const selector of ['.music-staff','.piano','.lesson-controls']){
        const bounds=await page.locator(selector).boundingBox();
        expect(bounds.y,`${selector} top, lesson ${id}, ${size.width}`).toBeGreaterThanOrEqual(0);
        expect(bounds.y+bounds.height,`${selector} bottom, lesson ${id}, ${size.width}x${size.height}`).toBeLessThanOrEqual(size.height);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
      if(id===1&&[375,1366,844].includes(size.width)) await page.screenshot({path:`test-results/instant-play-${size.width}.png`});
    }
  }
});

test('first key starts the mission and mistakes never remove flowers',async({page})=>{
  await page.goto('/');await page.locator('[data-start="1"]').first().click();
  await page.keyboard.press('a');
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
  await expect(page.locator('.garden-flower.bloomed')).toHaveCount(1);
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 2 OF 6');
  await page.keyboard.press('s');
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
  await page.getByRole('button',{name:'Show me',exact:true}).click();
  await expect(page.locator('.garden-flower.bloomed')).toHaveCount(1);
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 2 OF 6');
});
