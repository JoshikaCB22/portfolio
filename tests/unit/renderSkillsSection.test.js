/**
 * @jest-environment jsdom
 *
 * Unit tests for the renderSkillsSection frontend function.
 */

'use strict';

const { renderSkillsSection, proficiencyClass } = require('../../frontend/js/skills');

beforeEach(() => {
  document.body.innerHTML = '<div id="skills-container"></div>';
});

describe('renderSkillsSection — unit tests', () => {

  test('renders one category block per distinct category', () => {
    const skills = [
      { name: 'Java',      category: 'Backend',  proficiency: 'Expert' },
      { name: 'Spring',    category: 'Backend',  proficiency: 'Intermediate' },
      { name: 'React',     category: 'Frontend', proficiency: 'Beginner' },
    ];
    renderSkillsSection(skills);

    const container = document.getElementById('skills-container');
    const blocks = container.querySelectorAll('.skills-category');
    expect(blocks.length).toBe(2);
  });

  test('each skill name appears in the rendered output', () => {
    const skills = [
      { name: 'Node.js',   category: 'Backend',  proficiency: 'Expert' },
      { name: 'MySQL',     category: 'Database', proficiency: 'Intermediate' },
    ];
    renderSkillsSection(skills);

    const container = document.getElementById('skills-container');
    expect(container.innerHTML).toContain('Node.js');
    expect(container.innerHTML).toContain('MySQL');
  });

  test('renders proficiency badges with correct content', () => {
    const skills = [
      { name: 'Python', category: 'AI', proficiency: 'Expert' },
    ];
    renderSkillsSection(skills);

    const container = document.getElementById('skills-container');
    const badge = container.querySelector('.proficiency-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe('Expert');
    expect(badge.className).toContain('proficiency-badge--expert');
  });

  test('shows empty message when skills array is empty', () => {
    renderSkillsSection([]);
    const container = document.getElementById('skills-container');
    expect(container.innerHTML).toContain('No skills');
  });

  test('places each skill in the correct category block', () => {
    const skills = [
      { name: 'HTML',      category: 'Frontend', proficiency: 'Expert' },
      { name: 'MongoDB',   category: 'Database', proficiency: 'Intermediate' },
    ];
    renderSkillsSection(skills);

    const container = document.getElementById('skills-container');
    const blocks = container.querySelectorAll('.skills-category');

    const frontendBlock = Array.from(blocks).find(b =>
      b.querySelector('h3').textContent === 'Frontend'
    );
    const dbBlock = Array.from(blocks).find(b =>
      b.querySelector('h3').textContent === 'Database'
    );

    expect(frontendBlock.innerHTML).toContain('HTML');
    expect(dbBlock.innerHTML).toContain('MongoDB');
    // Cross-check: HTML should NOT be in Database block
    expect(dbBlock.innerHTML).not.toContain('HTML');
  });
});

describe('proficiencyClass helper', () => {
  test('returns expert class for Expert', () => {
    expect(proficiencyClass('Expert')).toBe('proficiency-badge--expert');
  });

  test('returns intermediate class for Intermediate', () => {
    expect(proficiencyClass('Intermediate')).toBe('proficiency-badge--intermediate');
  });

  test('returns beginner class for Beginner', () => {
    expect(proficiencyClass('Beginner')).toBe('proficiency-badge--beginner');
  });

  test('returns beginner class for unknown proficiency', () => {
    expect(proficiencyClass('Advanced')).toBe('proficiency-badge--beginner');
  });

  test('is case-insensitive', () => {
    expect(proficiencyClass('expert')).toBe('proficiency-badge--expert');
    expect(proficiencyClass('INTERMEDIATE')).toBe('proficiency-badge--intermediate');
  });
});
