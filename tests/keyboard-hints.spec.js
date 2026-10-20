import {test,expect} from '@playwright/test';

test('letters default hidden; unsupported physical letters prompt once without changing progress',async({page})=>{
  await page.clock.install();await page.goto('/');
  await page.locator('[data-start="1"]').first().click();
  await expect(page.locator('.piano kbd').first()).toBeHidden();
  await page.locator('[data-note="D4"]').click();
  await expect(page.locator('#toast.show')).toHaveCount(0);
  await page.keyboard.down('z');await page.keyboard.down('z');await page.keyboard.up('z');
  await expect(page.locator('#toast.show')).toHaveCount(0);
  await page.keyboard.press('Control+x');
  await expect(page.locator('#toast.show')).toHaveCount(0);
  await page.keyboard.press('x');
  await expect(page.locator('#toast')).toContainText('Open Settings');
  await expect(page.locator('.garden-mission')).toHaveAttribute('data-grown','0');
  await expect(page.locator('.piano kbd').first()).toBeHidden();
  await page.clock.runFor(4100);await page.keyboard.press('z');await page.keyboard.press('x');
  await expect(page.locator('#toast.show')).toHaveCount(0);
  await page.locator('.play-toolbar [data-action="settings"]').click();
  await page.locator('[data-shortcuts]').check();
  await page.locator('#dialog [data-action="close"]').first().click();
  await expect(page.locator('.piano kbd').first()).toBeVisible();
  await page.reload();await page.locator('[data-view="free"]').first().click();
  await expect(page.locator('.piano kbd').first()).toBeVisible();
});
