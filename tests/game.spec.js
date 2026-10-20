import { test, expect } from '@playwright/test';
import { lessons } from '../curriculum.js';

test('first lesson connects staff and key, demonstrates without scoring, then removes guidance', async ({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Let’s begin'}).click();
  await expect(page.locator('.music-staff')).toHaveAttribute('aria-label','Treble clef, middle C');
  await expect(page.locator('.ledger-explanation')).toContainText('below the five staff lines');
  await expect(page.locator('.connection-path path')).toHaveCount(2);
  await page.getByRole('button',{name:'Show me',exact:true}).click();
  await expect(page.locator('.note-connection')).toHaveClass(/note-sounding/);
  await expect(page.locator('[data-note="C4"]')).toHaveClass(/note-sounding/);
  await expect(page.locator('.token-pill b')).toHaveText('0');
  await expect(page.locator('.note-connection')).not.toHaveClass(/note-sounding/);
  await page.keyboard.press('s');
  await expect(page.locator('.note-connection')).not.toHaveClass(/note-sounding/);
  for(let j=0;j<2;j++){
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${j+1} OF 6`);
    await page.keyboard.press('a');
    await expect(page.locator('.note-connection')).toHaveClass(/note-sounding/);
  }
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 3 OF 6');
  await expect(page.locator('.note-connection')).not.toHaveClass(/guided/);
  await expect(page.locator('[data-note="C4"]')).not.toHaveClass(/hint-key/);
  await page.getByRole('button',{name:'A little hint'}).click();
  await expect(page.locator('.note-connection')).toHaveClass(/guided/);
  await page.keyboard.press('a');
  for(let j=3;j<6;j++){
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${j+1} OF 6`);
    await page.keyboard.press('a');
  }
  await expect(page.getByRole('heading',{name:'You made music!'})).toBeVisible();
  await expect(page.locator('.token-pill b')).toHaveText('10');
});

test('whole adventure, forgiving hints, rewards, replay and persistence', async ({ page }) => {
  test.setTimeout(200000);
  await page.clock.install();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('[data-start="2"]')).toBeDisabled();
  await page.getByRole('button',{name:'Let’s begin'}).click();
  await page.keyboard.press('s'); await page.keyboard.press('s');
  await expect(page.locator('[data-note="C4"]')).toHaveClass(/hint-key/);
  await expect(page.locator('#feedback')).toContainText('together');
  for (let i=0;i<lessons.length;i++) {
    const lesson=lessons[i];
    if(i>0) {
      await page.getByRole('button',{name:'Next little adventure'}).click();
    }
    for(let j=0;j<lesson.notes.length;j++) {
      await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${j+1} OF ${lesson.notes.length}`);
      const y=Number(await page.locator('.music-staff ellipse').getAttribute('cy'));
      const written=await page.locator('.music-staff').getAttribute('data-written-note');
      const target=written?written.replace('Bb','A#').replace('Db','C#'):['C4','D4','E4','F4','G4'][(144-y)/9];
      await page.locator('[data-note="'+target+'"]').click();await page.clock.runFor(800);
    }
    await expect(page.getByRole('heading',{name:'You made music!'})).toBeVisible();
  }
  await expect(page.locator('.token-pill b')).toHaveText('400');
  await page.getByRole('button',{name:'Back to my adventure',exact:true}).click();
  await page.reload();
  await expect(page.locator('.chapter-progress')).toHaveText('16 of 16 complete');
  await page.locator('.lesson-card[data-start="1"]').click();
  for(let j=0;j<6;j++) {
    await expect(page.locator('.play-heading .eyebrow')).toHaveText(`LITTLE STEP ${j+1} OF 6`);
    await page.keyboard.press('a');await page.clock.runFor(800);
  }
  await expect(page.getByText('Already earned')).toBeVisible();
  await expect(page.locator('.token-pill b')).toHaveText('400');
  expect(errors).toEqual([]);
});

test('free play, badge, audio, account disclosure, keyboard and responsive layout', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({width:1440,height:1100});
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Free play',exact:true}).click();
  for(const key of ['a','s','d','f','g','h','j','k']) await page.keyboard.press(key);
  await expect(page.locator('#exploration-dots .explored')).toHaveCount(8);
  await expect(page.locator('#free-staff svg')).toHaveAttribute('aria-label','Treble clef, C5');
  await page.getByRole('button',{name:'Mute sound'}).click();
  await expect(page.getByRole('button',{name:'Enable sound'})).toBeVisible();
  await page.getByRole('button',{name:'My collection'}).click();
  await expect(page.locator('.badge-card.earned h3')).toHaveText('Key explorer');
  await page.getByRole('button',{name:'Profile and saving'}).click();
  await expect(page.locator('#dialog')).toContainText('No account is needed');
  await expect(page.locator('#dialog')).toContainText('only in this browser');
  await expect(page.locator('.google-button')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#dialog')).not.toBeVisible();
  await page.getByRole('button',{name:'My adventure',exact:true}).click();
  for(const width of [375,768,1024]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  }
  await page.setViewportSize({width:375,height:850});
  await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Let’s begin'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
  await page.screenshot({path:'test-results/lesson-mobile.png',fullPage:true});
});

test('tablet touch activates a piano key exactly once', async ({ browser }) => {
  const context=await browser.newContext({viewport:{width:768,height:1024},hasTouch:true});
  const page=await context.newPage();
  await page.goto('http://localhost:5180');
  await page.getByRole('button',{name:'Let’s begin'}).tap();
  await page.locator('[data-note="C4"]').tap();
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 2 OF 6');
  await page.waitForTimeout(1000);
  await expect(page.locator('.play-heading .eyebrow')).toHaveText('LITTLE STEP 2 OF 6');
  await context.close();
});

test('unavailable storage and corrupted saves do not block learning', async ({ page }) => {
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});
  await page.goto('/');
  await expect(page.getByText('Progress is not being saved')).toBeVisible();
  await page.getByRole('button',{name:'Let’s begin'}).click();
  await expect(page.locator('.piano')).toBeVisible();
  await page.keyboard.press('a');
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','1');
});
