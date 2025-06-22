## Project Information

- **Compiler:** [Astro](https://astro.build/)
- **Compiler Configuration:** `/astro.config.mjs`
- **Project Root:** []
- **Production URL:** https://www.hogehoge.com/
- **CMS:** []
- **Design:** Tomoko Inoue
- **Date:** [2/2025]

## Stucture:

```

public
  └── assets
      └── images                        // images
src
  └── components                        // small components
      └── icons
          ├── Header.astro
          ...
  └── data                              // site data text content
      ├── areasList.json
      ├── companyProfile.json
      └── interviewsList.json
  └── layouts                           // base template for every pages
  └── pages                             // pages
      ├── dei
      ├── humanresource-development
      ├── humanresource-management
      ├── interview
      └── index.astro
  └── sections                          // pages sections
      ├── areas
      ├── home
      └── interview
  └── styles
  └── types
  └── utils

```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Copyright Notice

The design and content of this site are protected by copyright. Unauthorized use, reproduction, or distribution of any part of this website, including but not limited to
text, images, graphics, and code, is strictly prohibited without prior written permission from the site owner. All rights reserved.
