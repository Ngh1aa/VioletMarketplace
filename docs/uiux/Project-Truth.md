# Project Truth — Violet V4

## Project Config

- project_name: VioletMarketplace / Violet Parfumerie
- request_type: redesign_existing_website
- project_mode: interactive_prototype
- current_website: https://ngh1aa.github.io/VioletMarketplace/
- source_code_or_repo: https://github.com/Ngh1aa/VioletMarketplace
- working_branch: redesign/v4-reference-led-prompt-os
- industry: luxury niche-fragrance marketplace
- market: Vietnam-first, internationally inspired niche-fragrance audience
- languages: [vi]
- primary_business_goal: help shoppers confidently discover, sample and purchase a curated fragrance while preserving multi-house marketplace trust
- secondary_business_goals: make curation and house provenance credible; increase discovery-set/sample consideration; create a distinctive Violet brand world
- known_target_audience: fragrance-curious shoppers, niche-fragrance enthusiasts, gift buyers, users who know a mood/occasion but not perfumery vocabulary
- known_conversion_actions: explore fragrance; refine library; create Scent Portrait; view PDP; choose try-first/discovery; add full bottle; bag; checkout
- redesign_goal: make Violet feel like a credible high-end multi-house fragrance destination rather than a styled ecommerce prototype
- must_keep: Violet name and warm-violet identity; fictional maisons; Scent Portrait concept; static architecture; buyer/cart/checkout flow; system-reality honesty
- must_improve: media authority; structural page differentiation; homepage hierarchy; PLP merchandising; PDP commerce priority; maison discovery; sampling journey; curation credibility
- must_not_change: do not invent real payment/auth/AI; do not copy proprietary reference layouts/assets/copy; do not make mobile/tablet claims
- special_requirements: use Prompt OS 0–4; Prompt 1 no-code; Creative Director human visual veto; desktop first
- design_intelligence: AUTO, activated for Phase 1 because visual direction needs broader design-system calibration
- scope: desktop_only
- desktop_viewports: [1280x900, 1440x1000, 1600x1000]
- tablet_viewports: N/A_JUSTIFIED
- mobile_viewports: N/A_JUSTIFIED
- supported_browsers_if_known: [Chromium]
- brand_guideline: DESIGN-DIRECTION.md + docs/uiux/Operating-Profile.md
- brand_assets: current Violet wordmark/type/color system; remote prototype fragrance imagery is not final campaign art
- existing_sitemap: index.html, search.html, product.html, finder.html, cart.html, checkout.html plus seller/admin surfaces outside current buyer redesign
- existing_content: static HTML + data.js catalog + storefront-v3.js/app.js
- existing_documents: .uiux-profile.json, docs/uiux/Desktop-V3-Flow.md, Skill-Version-Lock.md
- reference_websites: Byredo, Le Labo, Frédéric Malle, Diptyque, Aesop, Nose Paris, Luckyscent, ZGO Perfumery
- tech_stack: vanilla HTML/CSS/JavaScript, GitHub Pages
- cms_backend/data_sources/external_services/authentication: NONE for buyer prototype
- personal_data_collected: none intentionally persisted by product; localStorage cart only
- analytics_stack: NONE
- deployment_target: GitHub Pages
- release_authorization: merge_and_deploy for this conversation only after Prompt 3 passes; production smoke required under Prompt 4

## Source precedence
User request → current repo/project truth → locked skills_UIUX → Prompt OS contracts → reference evidence → design intelligence → model prior.

## Baseline commit
Current `main`: `65667ec9422588e4cafaa31f6d096b13909dc51a`. Visual baseline is V3; the final cache-busting merge changed deployment plumbing only.
