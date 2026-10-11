# Kishore Saravanan — Portfolio

A single-page portfolio site: plain HTML, CSS, and JavaScript. No build step, no framework — Vercel can deploy it as-is.

## Files
- `index.html` — page content and structure
- `styles.css` — all styling (soft charcoal theme + light theme tokens)
- `script.js` — boot-sequence preloader, pale yellow bubble collision sim, theme toggle, nav highlighting, mobile menu, scroll reveal
- `favicon.svg` — the "KS" browser-tab icon
- `vercel.json` — tells Vercel this is a static site (no build command needed)
- `assets/kishore-saravanan-resume.pdf` — the resume served by the "Download resume" buttons
- `assets/certificates/` — the three certificate PDFs plus their JPG thumbnails, shown in the Credentials section

## Current version
- **Theme**: soft charcoal and white, with pale yellow bubbles that collide and throw sparks. A "Light" / "Dark" button in the top bar switches themes and remembers the choice.
- **Content**: matches the latest resume, including the GasGuard project, 260+ LeetCode problems, two hackathons, and updated skills.
- **Credentials**: resume plus three certificates (AI Automation with Claude, AI Fluency, Java Basic). The Coursera one has a Verify link.

## Updating the resume or a certificate later
Replace the PDF in `assets/` (keep the same file name), then `git add -A`, `git commit`, `git push`. Vercel redeploys automatically.

## Option A — Deploy via GitHub (recommended)
1. Create a new repository on GitHub (e.g. `kishore-portfolio`) and push these three files (plus `vercel.json`) to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kishore-portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is easiest).
3. Click **Add New → Project**, then **Import** your `kishore-portfolio` repo.
4. Framework Preset: choose **Other**. Leave Build Command and Output Directory blank.
5. Click **Deploy**. Vercel gives you a live URL like `kishore-portfolio.vercel.app` within a minute.
6. Every future `git push` to `main` auto-deploys a new version.

## Option B — Deploy via Vercel CLI (no GitHub needed)
1. Install the CLI once: `npm install -g vercel`
2. From inside this folder, run:
   ```bash
   vercel
   ```
3. Follow the prompts (log in, confirm project name, accept defaults). It deploys instantly and prints your live URL.
4. To push updates later, run `vercel --prod` from this folder.

## Customizing
- **Colors/fonts**: edit the `:root` variables at the top of `styles.css`.
- **Content**: all text lives directly in `index.html` — search for the section you want (`id="about"`, `id="projects"`, etc.).
- **Resume download button**: if you want a "Download Resume" button, drop a PDF into this folder (e.g. `resume.pdf`) and add:
  ```html
  <a href="resume.pdf" class="btn btn-ghost" download>Download resume</a>
  ```
  next to the existing buttons in the hero section of `index.html`.
- **Custom domain**: in the Vercel dashboard, open the project → Settings → Domains, and add your own domain if you buy one.
