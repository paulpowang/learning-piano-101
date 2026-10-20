import {test,expect} from '@playwright/test';

const saveKey='little-keys-progress-v2';
const pitches=['C4','D4','E4','F4','G4'];
async function currentNote(page){
  return pitches[(144-Number(await page.locator('.music-staff ellipse').getAttribute('cy')))/9];
}
async function seed(page,completed=[1,2,3,4,5,6,7,8],locale='en'){
  await page.addInitScript(({saveKey,completed,locale})=>{
    if(!localStorage.getItem(saveKey))localStorage.setItem(saveKey,JSON.stringify({completed,explored:[],sound:false,locale}));
  },{saveKey,completed,locale});
}
test('language changes preserve question, mistakes, hint, feedback and pending reward',async({page})=>{
  await seed(page,[1,2,3,4,5]);await page.goto('/');
  await page.locator('.lesson-card[data-start="6"]').click();
  const target=await currentNote(page),wrong=pitches.find(n=>n!==target);
  await expect(page.locator('.music-staff')).toHaveAttribute('aria-label',/A note on the treble staff/);
  await expect(page.locator('.music-staff text')).toHaveCount(1);
  await expect(page.locator('.hint-key')).toHaveCount(0);
  expect(await page.locator('.note-label').allTextContents()).toEqual(Array(8).fill(''));
  await page.locator(`[data-note="${wrong}"]`).click();
  await page.locator('.play-toolbar [data-language]').selectOption('zh-Hant');
  await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant');
  expect(await currentNote(page)).toBe(target);
  await expect(page.locator('#feedback')).toContainText('很棒的探索');
  await page.locator(`[data-note="${wrong}"]`).click();
  await expect(page.locator('#feedback')).toContainText('我們一起');
  await expect(page.locator(`[data-note="${target}"]`)).toHaveClass(/hint-key/);
  await expect(page.locator('.music-staff text')).toHaveCount(2);
  await page.locator('.play-toolbar [data-language]').selectOption('en');
  await expect(page.locator('#feedback')).toContainText('together');
  await page.locator(`[data-note="${target}"]`).click();
  // Switch during the 500 ms success transition, not after it.
  await page.locator('.play-toolbar [data-language]').selectOption('zh-Hant');
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('第 2／18 個小步驟');
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
  await expect(page.locator('.hint-key')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant');
  await expect(page.locator('.token-pill b')).toHaveText('80');
});

test('demonstrations on later lessons light staff and key without scoring or unmuting',async({page})=>{
  await seed(page);await page.goto('/');await page.locator('.lesson-card[data-start="6"]').click();
  const target=await currentNote(page);
  await page.locator('[data-action="demonstrate"]').click();
  await expect(page.locator('.learning-stage')).toHaveClass(/note-sounding/);
  await expect(page.locator(`[data-note="${target}"]`)).toHaveClass(/note-sounding/);
  await page.locator(`[data-note="${target}"]`).click();
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','0');
  await expect(page.locator('.play-toolbar [data-action="sound"]')).toHaveAttribute('aria-label','Enable sound');
  await expect(page.locator('.learning-stage')).not.toHaveClass(/note-sounding/);
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 1 OF 18');
});

test('held keyboard input and native Enter do not score a second note',async({page})=>{
  await page.goto('/');await page.locator('[data-start="1"]').first().click();
  await page.keyboard.down('a');
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 2 OF 6');
  await page.keyboard.down('a');await page.waitForTimeout(600);
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
  await page.keyboard.up('a');
  await page.locator('[data-note="C4"]').focus();await page.keyboard.down('Enter');
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 3 OF 6');
  await expect(page.locator('[data-note="C4"]')).toBeFocused();
  await page.keyboard.down('Enter');await page.waitForTimeout(600);
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','2');
  await page.keyboard.up('Enter');
});

test('all decorations persist and all six badges can be earned; Chinese screens and dialogs translate',async({page})=>{
  await seed(page,undefined,'zh-Hant');await page.goto('/');
  await expect(page.locator('.garden-item')).toHaveCount(0);
  await page.locator('[data-view="free"]').first().click();
  for(const key of ['a','s','d','f','g','h','j','k'])await page.keyboard.press(key);
  await page.locator('[data-view="achievements"]').first().click();
  await expect(page.locator('.badge-card.earned')).toHaveCount(6);
  await expect(page.locator('.decoration-card.earned')).toHaveCount(0);
  await expect(page.locator('.collection-page')).toContainText('Pip 的皇冠');
  await page.locator('[data-action="account"]').first().click();
  await expect(page.locator('#dialog')).toContainText('僅儲存在此瀏覽器');
  await expect(page.getByRole('button',{name:'關閉對話框'})).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('[data-action="parents"]').click();
  await expect(page.locator('#dialog')).toContainText('每次學一個小概念');
  await page.keyboard.press('Escape');
  await page.locator('[data-action="tokens"]').click();
  await expect(page.locator('#dialog')).toContainText('160 枚 token');
});

test('Chinese completion earns tokens without automatically buying decorations',async({page})=>{
  await page.goto('/');await page.locator('.header [data-language]').selectOption('zh-Hant');
  await page.locator('[data-start="1"]').first().click();
  for(let i=0;i<6;i++){
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`第 ${i+1}／6 個小步驟`);
    await page.keyboard.press('a');
  }
  await expect(page.locator('.new-decoration')).toHaveCount(0);
  await expect(page.locator('.new-badges')).toContainText('新徽章：第一小步');
  await page.locator('.header [data-language]').selectOption('en');
  await expect(page.locator('.result-extras')).toContainText('Visit the garden shop');
  await page.locator('.text-button[data-start="1"]').click();
  for(let i=0;i<6;i++){
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${i+1} OF 6`);
    await page.keyboard.press('a');
  }
  await expect(page.locator('.results')).toBeVisible();
  await expect(page.locator('.new-decoration')).toHaveCount(0);
  await expect(page.locator('.new-badges span')).toHaveCount(0);
  await expect(page.locator('.token-pill b')).toHaveText('10');
});

test('storage write failures are disclosed without blocking play; corrupt JSON can recover',async({page})=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('quota');};});
  await page.goto('/');await page.locator('[data-view="free"]').first().click();await page.keyboard.press('a');
  await expect(page.locator('footer')).toContainText('Progress is not being saved');
  await page.locator('[data-action="account"]').first().click();await expect(page.locator('#dialog')).toContainText('may be lost');
  await page.keyboard.press('Escape');await page.locator('.header [data-language]').selectOption('zh-Hant');
  await expect(page.locator('footer')).toContainText('目前無法儲存');
});

test('malformed save still allows completion and replaces the corrupt data',async({page})=>{
  await page.goto('/');await page.evaluate(key=>localStorage.setItem(key,'{bad json'),saveKey);await page.reload();
  await page.locator('[data-start="1"]').first().click();
  for(let i=0;i<6;i++){
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${i+1} OF 6`);
    await page.keyboard.press('a');
  }
  await expect(page.locator('.results')).toBeVisible();await page.reload();
  await expect(page.locator('.token-pill b')).toHaveText('10');
  await expect(page.locator('footer')).toContainText('Progress saved in this browser');
});

test('Chinese touch layouts keep all eight lessons playable in portrait and landscape',async({browser})=>{
  const context=await browser.newContext({hasTouch:true,baseURL:'http://localhost:5180',reducedMotion:'reduce'});
  const page=await context.newPage();await seed(page,undefined,'zh-Hant');
  for(const size of [{width:768,height:1024},{width:1024,height:768},{width:844,height:390},{width:375,height:667}]){
    await page.setViewportSize(size);
    for(let id=1;id<=8;id++){
      await page.goto('/');await page.locator(`.lesson-card[data-start="${id}"]`).tap();
      for(const selector of ['.music-staff','.piano','.lesson-controls']){
        const b=await page.locator(selector).boundingBox();expect(b.y).toBeGreaterThanOrEqual(0);expect(b.y+b.height,`${selector} in lesson ${id} at ${size.width}`).toBeLessThanOrEqual(size.height);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
      if(id===1)await page.screenshot({path:`test-results/zh-lesson-${size.width}.png`});
    }
  }
  await page.goto('/');await page.locator('[data-start="1"]').first().tap();await page.locator('[data-note="C4"]').tap();
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('第 2／6 個小步驟');
  expect(await page.locator('.garden-flower.bloomed .flower-head').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await context.close();
});

test('staff positions and audio pitches agree for all taught notes',async({page})=>{
  await page.addInitScript(()=>{
    window.testFrequencies=[];
    window.AudioContext=class {
      state='running';currentTime=0;destination={};
      createOscillator(){return {frequency:{set value(n){window.testFrequencies.push(n);}},connect(){return {connect(){}};},start(){},stop(){}};}
      createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}
    };
  });
  await page.goto('/');await page.locator('[data-view="free"]').first().click();
  const midi=[60,62,64,65,67];
  for(let i=0;i<pitches.length;i++){
    await page.locator(`[data-note="${pitches[i]}"]`).click();
    await expect(page.locator('.music-staff ellipse')).toHaveAttribute('cy',String(144-9*i));
    const frequency=await page.evaluate(()=>window.testFrequencies.at(-3));
    expect(frequency).toBeCloseTo(440*2**((midi[i]-69)/12),5);
  }
});
