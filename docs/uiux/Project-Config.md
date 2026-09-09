# Violet V4 — Project Config

- project_name: `VioletMarketplace / Violet Parfumerie`
- request_type: `redesign_existing_website`
- project_mode: `interactive_prototype`
- current_website: `https://ngh1aa.github.io/VioletMarketplace/`
- source_code_or_repo: `https://github.com/Ngh1aa/VioletMarketplace`
- working_branch: `redesign/v4-reference-led`
- industry: curated niche fragrance ecommerce / multi-house perfumery
- market: Vietnam-first prototype with international niche-fragrance conventions
- languages: Vietnamese primary; controlled English fragrance/commerce terminology where it improves category clarity
- primary_business_goal: help shoppers confidently discover, sample and purchase a curated fragrance without marketplace overload
- secondary_business_goals: establish Violet as an expert multi-house curator; make houses and sampling first-class; increase meaningful progression from discovery to PDP to sample/full-bottle decision
- known_target_audience: fragrance-curious adults, niche-fragrance enthusiasts, gift buyers, and shoppers who know desired mood but not perfumery vocabulary
- known_conversion_actions: browse/refine fragrance; create Scent Portrait; open PDP; explore a maison; choose discovery/sample route; add full bottle; complete prototype checkout
- redesign_goal: make Violet feel like a credible high-end multi-house fragrance destination rather than a styled ecommerce prototype; product/media authority, house curation and sampling must carry the luxury signal
- must_keep: Violet name and core palette DNA; fictional maisons; Scent Portrait concept; honest prototype boundaries; vanilla HTML/CSS/JS architecture; localStorage cart; buyer routes and query URLs where possible; authenticity/curation/discovery positioning
- must_improve: visual art direction; homepage hierarchy; composition diversity; product-media coherence; PLP merchandising; PDP purchase hierarchy; sampling journey; maison identity; cross-page brand recognition; source ownership of CSS
- must_not_change: no fake AI; no real-payment claim; no fabricated live inventory/API/auth; seller/admin behavior outside buyer-storefront V4 scope unless shared chrome requires non-breaking adjustment
- special_requirements: apply user-provided Prompt OS 0→4; Phase 1 is no-code; desktop only; references are principles not surfaces; human visual veto before release
- design_intelligence: `AUTO`
- design_intelligence_notes: evaluate after production reference research; activate only if unresolved system-direction decision remains
- scope: `desktop_only`
- desktop_viewports: `[1280, 1440, 1600]`
- tablet_viewports: `N/A_JUSTIFIED`
- mobile_viewports: `N/A_JUSTIFIED`
- supported_browsers_if_known: `[Chromium]`
- brand_guideline: no formal external guideline; current Violet design files and project source are working brand truth
- brand_assets: typographic Violet wordmark; current palette/tokens; current prototype photography is replaceable prototype media
- existing_sitemap: source routes in repository
- existing_content: source HTML/JS/data
- reference_websites: Byredo, Le Labo, Frédéric Malle, Nose Paris, Luckyscent, ZGO Perfumery, Diptyque
- tech_stack: static HTML + CSS + vanilla JavaScript
- cms_backend: NONE
- data_sources: `data.js` mocked catalogue + localStorage state
- external_services: remote image hosts; GitHub Pages
- authentication: NONE
- personal_data_collected: prototype checkout form fields only; not sent to a backend
- analytics_stack: NONE
- deployment_target: GitHub Pages
- release_authorization: `merge_and_deploy` based on existing project authorization; release still requires Prompt 4 gates

## Classification

- Scope: buyer storefront whole-site redesign
- Type: substantial structural redesign
- Risk: medium — visual/commerce architecture and simulated commerce state; no live payment or account system
- Mode: interactive prototype

## Prompt OS

`Prompt 0 Project Config → Prompt 1 Research/Design Contract → Prompt 2 Implementation → Prompt 3 Final QA/Remediation → Prompt 4 Release/Production Smoke`

Phase 1 must not alter buyer UI code.