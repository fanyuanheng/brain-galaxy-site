async (page) => {
  const results = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
    results.push(message);
  };
  await page.goto("http://127.0.0.1:5173");
  await page.evaluate(() => localStorage.removeItem("site-language"));
  await page.reload();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("heading", { level: 1 }).waitFor();
  check(
    (await page.locator("html").getAttribute("lang")) === "en",
    "English is the default language",
  );
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  check(
    (await page.locator("html").getAttribute("data-motion")) === "paused",
    "Global motion pause works",
  );
  await page.screenshot({ path: "output/playwright/desktop-hero.png" });
  await page
    .getByRole("button", { name: "Conventional computing", exact: true })
    .click();
  check(
    await page
      .getByRole("heading", { name: "A long journey for every calculation." })
      .isVisible(),
    "Conventional architecture explanation is visible",
  );
  await page.locator(".comparison").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .filter((a) => a.effect.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
  await page
    .locator(".comparison")
    .screenshot({ path: "output/playwright/architecture-conventional.png" });
  await page
    .getByRole("button", { name: "Compute-in-memory", exact: true })
    .click();
  check(
    await page
      .getByRole("heading", { name: "Less movement. More possibility." })
      .isVisible(),
    "Integrated architecture explanation is visible",
  );
  await page.locator(".comparison").evaluate(async (el) => {
    await Promise.all(
      el
        .getAnimations({ subtree: true })
        .filter((a) => a.effect.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
  await page
    .locator(".comparison")
    .screenshot({ path: "output/playwright/architecture-integrated.png" });
  await page.getByRole("tab", { name: "BIM1-Long 01", exact: true }).click();
  check(
    (await page.locator(".metric-content").innerText()).includes("90%"),
    "Long-sequence research tab changes the result",
  );
  await page.keyboard.press("End");
  check(
    (await page
      .getByRole("tab", { name: "BIM2-Memory 03" })
      .getAttribute("aria-selected")) === "true",
    "Keyboard End selects the memory tab",
  );
  check(
    (await page.getByRole("tabpanel").innerText()).includes(
      "Make room for the bigger picture.",
    ),
    "Memory panel content is correct",
  );
  await page.keyboard.press("ArrowLeft");
  check(
    (await page
      .getByRole("tab", { name: "BIM1-1.3B 02" })
      .getAttribute("aria-selected")) === "true",
    "Arrow keys switch research tabs",
  );
  check(
    (await page
      .getByRole("link", { name: "Read the research paper" })
      .getAttribute("href")) === "https://arxiv.org/abs/2510.04595",
    "Research links point to the source paper",
  );
  await page.getByRole("button", { name: "Explore memory models" }).click();
  check(
    (await page
      .getByRole("tab", { name: "BIM2-Memory 03" })
      .getAttribute("aria-selected")) === "true",
    "Technology card opens the matching research panel",
  );
  await page.getByRole("tab", { name: "BIM1-1.3B 02" }).click();
  check(
    (await page
      .getByRole("link", { name: "hello@braingalaxy.ai", exact: true })
      .getAttribute("href")) === "mailto:hello@braingalaxy.ai",
    "Contact opens the configured placeholder email address",
  );
  await page.locator(".desktop-nav").getByRole("link", { name: "Applications", exact: true }).click();
  check(
    (await page.locator("#applications article").count()) === 4 &&
      await page.getByRole("heading", { name: "Satellite edge AI", exact: true }).isVisible(),
    "Applications navigation reaches the four focus areas",
  );
  await page.locator("#applications").screenshot({ path: "output/playwright/desktop-applications.png" });
  check(
    (await page.getByRole("link", { name: "Talk about joining the team", exact: true }).getAttribute("href")) ===
      "mailto:hello@braingalaxy.ai?subject=Joining%20the%20team",
    "Team invitation opens a dedicated email subject",
  );
  await page.locator("#team").screenshot({ path: "output/playwright/desktop-team.png" });
  const missingAnchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (a) => !document.getElementById(a.getAttribute("href").slice(1)),
        )
        .map((a) => a.getAttribute("href")),
    );
  check(missingAnchors.length === 0, "All internal navigation targets exist");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "output/playwright/desktop-full.png",
    fullPage: true,
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow in English at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  check(await page.locator("#mobile-nav").isVisible(), "Mobile menu opens");
  await page.keyboard.press("Escape");
  check(
    (await page.locator("#mobile-nav").count()) === 0,
    "Escape closes the mobile menu",
  );
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Research", exact: true })
    .click();
  check(
    (await page.locator("#mobile-nav").count()) === 0,
    "Selecting a mobile link closes the menu",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "output/playwright/mobile-hero.png" });
  await page.screenshot({
    path: "output/playwright/mobile-full.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Switch to Simplified Chinese", exact: true })
    .click();
  check(
    (await page.locator("html").getAttribute("lang")) === "zh-CN",
    "Chinese toggle updates the document language",
  );
  check(
    (await page.getByRole("heading", { level: 1 }).innerText()).includes(
      "智能的未来",
    ),
    "Chinese hero copy is translated",
  );
  await page.reload();
  check(
    (await page.locator("html").getAttribute("lang")) === "zh-CN",
    "Language preference survives reload",
  );
  check(
    await page.getByRole("heading", { name: "卫星端侧 AI", exact: true }).isVisible() &&
      await page.getByRole("heading", { name: "脑机接口与医疗智能", exact: true }).isVisible() &&
      await page.getByRole("link", { name: "聊聊加入团队", exact: true }).isVisible(),
    "Applications and team invitation are translated into Chinese",
  );
  check(
    (await page.title()).includes("下一代高能效 AI") &&
      (await page.locator('meta[name="description"]').getAttribute("content")).includes("端侧"),
    "Chinese page metadata matches the updated positioning",
  );
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow in Chinese at ${width}px`,
    );
  }
  await page.locator("#applications").screenshot({ path: "output/playwright/desktop-chinese-applications.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#applications").screenshot({ path: "output/playwright/mobile-chinese-applications.png" });
  await page.locator("#team").screenshot({ path: "output/playwright/mobile-chinese-team.png" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.getByRole("button", { name: "打开菜单", exact: true }).click();
  await page.screenshot({ path: "output/playwright/mobile-chinese-menu.png" });
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "output/playwright/mobile-chinese-full.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const first = await page
    .locator("canvas")
    .evaluate((canvas) => canvas.toDataURL());
  await page.screenshot({
    path: "output/playwright/mobile-reduced-motion.png",
  });
  const second = await page
    .locator("canvas")
    .evaluate((canvas) => canvas.toDataURL());
  check(
    first === second,
    "Reduced-motion preference freezes the neural canvas",
  );
  check(
    (await page
      .locator(".signal-line")
      .evaluate((el) => getComputedStyle(el).animationName)) === "none",
    "Reduced motion disables CSS animations",
  );
  await page
    .getByRole("button", { name: "Switch to English", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  check(errors.length === 0, `No runtime errors: ${errors.join("; ")}`);
  return { passed: results.length, results };
}
