/**
 * @jest-environment jsdom
 *
 * Unit tests for the renderProjectCard frontend function.
 */

'use strict';

const { renderProjectCard } = require('../../frontend/js/projects');

describe('renderProjectCard — unit tests', () => {

  test('renders a card with all required fields', () => {
    const project = {
      title: 'My App',
      description: 'A cool application',
      tech_stack: ['React', 'Node.js'],
      repo_url: 'https://github.com/user/repo',
      demo_url: 'https://demo.example.com',
      image_url: 'https://example.com/image.png',
    };

    const card = renderProjectCard(project);

    expect(card.querySelector('h3').textContent).toBe('My App');
    expect(card.querySelector('.project-card__description').textContent).toBe('A cool application');
    expect(card.querySelectorAll('.tech-tag').length).toBe(2);
    expect(card.querySelector('[aria-label*="GitHub"]')).not.toBeNull();
    expect(card.querySelector('[aria-label*="demo"]')).not.toBeNull();
  });

  test('uses placeholder image when image_url is absent', () => {
    const project = {
      title: 'No Image Project',
      description: 'A project without an image',
      tech_stack: [],
    };

    const card = renderProjectCard(project);
    const img = card.querySelector('img');

    expect(img.src).toContain('placeholder.png');
  });

  test('renders no tech tags when tech_stack is empty', () => {
    const project = {
      title: 'Empty Stack',
      description: 'No tech stack',
      tech_stack: [],
      repo_url: 'https://github.com/user/repo',
    };

    const card = renderProjectCard(project);
    const tags = card.querySelectorAll('.tech-tag');

    expect(tags.length).toBe(0);
  });

  test('hides demo button when demo_url is absent', () => {
    const project = {
      title: 'No Demo',
      description: 'No live demo available',
      tech_stack: ['Python'],
      repo_url: 'https://github.com/user/repo',
    };

    const card = renderProjectCard(project);
    const links = card.querySelectorAll('a');

    // Only the GitHub link; no demo link
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('aria-label')).toMatch(/github/i);
  });

  test('very long description string does not break card structure', () => {
    const longDesc = 'x'.repeat(2000);
    const project = {
      title: 'Long Desc Project',
      description: longDesc,
      tech_stack: ['Java'],
      repo_url: 'https://github.com/user/repo',
    };

    const card = renderProjectCard(project);
    // Card structure is intact
    expect(card.querySelector('h3')).not.toBeNull();
    expect(card.querySelector('.project-card__description').textContent).toBe(longDesc);
  });

  test('renders placeholder image when image_url is provided but onerror fires', () => {
    const project = {
      title: 'Bad Image',
      description: 'Image will fail to load',
      tech_stack: [],
      image_url: 'https://broken.example.com/image.png',
    };

    const card = renderProjectCard(project);
    const img = card.querySelector('img');

    // Initially set to provided URL
    expect(img.src).toContain('broken.example.com');

    // Simulate onerror
    img.onerror();
    expect(img.src).toContain('placeholder.png');
  });

  test('tech stack handles non-array tech_stack gracefully', () => {
    const project = {
      title: 'No Array',
      description: 'tech_stack is not an array',
      tech_stack: null,
      repo_url: 'https://github.com/user/repo',
    };

    const card = renderProjectCard(project);
    const tags = card.querySelectorAll('.tech-tag');
    expect(tags.length).toBe(0);
  });
});
