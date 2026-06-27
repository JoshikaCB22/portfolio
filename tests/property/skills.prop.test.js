/**
 * @jest-environment jsdom
 *
 * Property-based tests for the frontend skills rendering (Property 5 — frontend half).
 *
 * // Feature: personal-portfolio, Property 5: Skills grouping and field completeness
 */

'use strict';

const fc = require('fast-check');
const { renderSkillsSection, groupByCategory } = require('../../frontend/js/skills');

// Set up a minimal #skills-container in the jsdom body before each test
beforeEach(() => {
  document.body.innerHTML = '<div id="skills-container"></div>';
});

// ─── Property 5 (frontend half): Skills grouping and field completeness ──────
// For any list of skills, renderSkillsSection should produce exactly one
// container per distinct category value, and each skill must appear in the
// correct group.
//
// Validates: Requirements 4.1, 4.3

describe('Property 5 — Skills frontend grouping', () => {

  test(
    'produces exactly one category container per distinct category',
    () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name:        fc.string({ minLength: 1 }),
              category:    fc.string({ minLength: 1 }),
              proficiency: fc.constantFrom('Beginner', 'Intermediate', 'Expert'),
            }),
            { minLength: 1 }
          ),
          function (skills) {
            const container = document.getElementById('skills-container');
            renderSkillsSection(skills);

            const distinctCategories = [...new Set(skills.map(s => s.category))];
            const categoryDivs = container.querySelectorAll('.skills-category');

            expect(categoryDivs.length).toBe(distinctCategories.length);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test(
    'each skill appears in the container for its category',
    () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name:        fc.string({ minLength: 1 }),
              category:    fc.string({ minLength: 1 }),
              proficiency: fc.constantFrom('Beginner', 'Intermediate', 'Expert'),
            }),
            { minLength: 1 }
          ),
          function (skills) {
            document.body.innerHTML = '<div id="skills-container"></div>';
            renderSkillsSection(skills);

            const container = document.getElementById('skills-container');
            const categoryDivs = container.querySelectorAll('.skills-category');

            // Build a lookup: category heading text → inner HTML
            const categoryHtmlMap = {};
            categoryDivs.forEach(function (div) {
              const heading = div.querySelector('h3');
              if (heading) {
                categoryHtmlMap[heading.textContent] = div.innerHTML;
              }
            });

            // Every skill must appear in its category's container
            skills.forEach(function (skill) {
              const catHtml = categoryHtmlMap[skill.category];
              expect(catHtml).toBeDefined();
              expect(catHtml).toContain(skill.name);
            });
          }
        ),
        { numRuns: 100 }
      );
    }
  );
});

// ─── groupByCategory unit tests ──────────────────────────────────────────────
describe('groupByCategory helper', () => {
  test('groups skills by category correctly', () => {
    const skills = [
      { name: 'React',   category: 'Frontend',  proficiency: 'Expert' },
      { name: 'Node.js', category: 'Backend',   proficiency: 'Intermediate' },
      { name: 'CSS',     category: 'Frontend',  proficiency: 'Expert' },
    ];
    const grouped = groupByCategory(skills);
    expect(grouped['Frontend']).toHaveLength(2);
    expect(grouped['Backend']).toHaveLength(1);
  });

  test('returns empty object for empty array', () => {
    expect(groupByCategory([])).toEqual({});
  });
});
