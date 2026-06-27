/**
 * @jest-environment jsdom
 *
 * Property-based tests for the frontend projects rendering.
 *
 * // Feature: personal-portfolio, Property 1: Project card render completeness
 */

'use strict';

const fc = require('fast-check');
const { renderProjectCard } = require('../../frontend/js/projects');

// ─── Property 1: Project card render completeness ────────────────────────────
// For any project object with title, description, tech_stack array, and at
// least one link, the rendered card must contain the title text, description
// text, each tech stack tag, and at least one <a> element.
//
// Validates: Requirements 2.4

describe('Property 1 — Project card render completeness', () => {
  test(
    'rendered card contains title, description, each tech tag, and at least one link',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            title:       fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            tech_stack:  fc.array(fc.string({ minLength: 1 })),
            repo_url:    fc.webUrl(),
          }),
          function (project) {
            const card = renderProjectCard(project);
            const html = card.outerHTML;

            // Title must appear in the rendered HTML
            expect(html).toContain(project.title);

            // Description must appear in the rendered HTML
            expect(html).toContain(project.description);

            // Each tech tag must appear in the card
            project.tech_stack.forEach(function (tag) {
              expect(html).toContain(tag);
            });

            // At least one anchor element (repo or demo link)
            const anchors = card.querySelectorAll('a');
            expect(anchors.length).toBeGreaterThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'rendered card with both repo and demo links contains two anchor elements',
    () => {
      fc.assert(
        fc.property(
          fc.record({
            title:       fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            tech_stack:  fc.array(fc.string({ minLength: 1 })),
            repo_url:    fc.webUrl(),
            demo_url:    fc.webUrl(),
          }),
          function (project) {
            const card = renderProjectCard(project);
            const anchors = card.querySelectorAll('a');
            expect(anchors.length).toBeGreaterThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});
