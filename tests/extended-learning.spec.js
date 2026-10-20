import {test,expect} from '@playwright/test';
test('Pip stays above the staff and leaves a flower; owned song has a distinct play action',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('little-keys-progress-v2',JSON.stringify({completed:[1,2],purchasedSongs:['buns'],sound:false})));
  await page.goto('/');await page.locator('[data-view="songs"]').first().click();
  const owned=page.locator('[data-song-card="buns"]'),buy=page.locator('[data-buy-song="mary"]');
  await expect(owned.locator('.owned-label')).toHaveText('In your library');
  expect(await owned.locator('.owned-play').evaluate(e=>getComputedStyle(e).backgroundColor)).not.toBe(await buy.evaluate(e=>getComputedStyle(e).backgroundColor));
  await owned.locator('[data-song]').click();
  await expect(page.locator('.note-cursor')).toHaveCount(0);
  await expect(page.locator('.score-pip')).toHaveCount(1);
  expect(await page.locator('.score-pip').evaluate(e=>Number(e.getAttribute('y'))+Number(e.getAttribute('height')))).toBeLessThan(44);
  await page.locator('[data-note="E4"]').click();
  await expect(page.locator('.score-flower')).toHaveCount(1);
  await expect(page.locator('[data-score-index="1"] .score-pip')).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({path:'test-results/pip-score.png'});
});

test('new chapters teach sharp, flat, enharmonic and natural notes with matching physical keys',async({page})=>{
  await page.clock.install();
  await page.addInitScript(()=>localStorage.setItem('little-keys-progress-v2',JSON.stringify({completed:Array.from({length:16},(_,i)=>i+1),sound:false,locale:'zh-Hant'})));
  for(const [id,key,sign] of [[13,'t','♯'],[14,'u','♭'],[15,'w','♭'],[16,'f','♮']]){
    await page.goto('/');await page.locator(`.lesson-card[data-start="${id}"]`).click();
    const first={13:'f',14:'j',15:'w',16:'t'}[id];
    await page.keyboard.press(first);await page.clock.runFor(800);
    await expect(page.locator('.accidental')).toHaveText(sign);
    await page.keyboard.press(key);await page.clock.runFor(800);
    await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','2');
  }
  for(const [id,note,clef] of [[10,'C5','𝄞'],[11,'C3','𝄢']]){
    await page.goto('/');await page.locator(`.lesson-card[data-start="${id}"]`).click();
    await expect(page.locator('.music-staff')).toContainText(clef);
    await expect(page.locator(`[data-note="${note}"]`)).toBeVisible();
    await page.keyboard.press('a');await page.clock.runFor(800);
    await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
  }
  for(const size of [{width:375,height:667},{width:844,height:390}]){
    await page.setViewportSize(size);
    for(let id=9;id<=16;id++){
      await page.goto('/');await page.locator(`.lesson-card[data-start="${id}"]`).click();
      const b=await page.locator('.lesson-controls').boundingBox();expect(b.y+b.height).toBeLessThanOrEqual(size.height);
    }
  }
});
