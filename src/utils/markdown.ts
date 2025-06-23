import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

// Markdown parser instance
const md = new MarkdownIt({
  html: true,       // Enable HTML tags in source
  breaks: true,     // Convert '\n' in paragraphs into <br>
  linkify: true,    // Autoconvert URL-like text to links
});

/**
 * Parse markdown content and extract frontmatter
 * @param content - Raw markdown content with potential frontmatter
 * @returns Object with parsed content and metadata
 */
export function parseMarkdownContent(content: string | null) {
  if (!content) return { html: '', data: {} };

  try {
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    
    // Convert markdown to HTML
    const html = md.render(markdownContent);
    
    return { html, data };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Fallback: treat as plain text
    return { html: content.replace(/\n/g, '<br>'), data: {} };
  }
}

/**
 * Enhance HTML content for better display
 * - Add proper line breaks between text and images
 * - Wrap Flickr embeds for better styling
 * @param html - HTML content string
 * @returns Enhanced HTML string
 */
export function enhanceHTMLContent(html: string): string {
  if (!html) return '';

  let enhancedHtml = html;

  // Wrap Flickr embed codes with special styling class
  enhancedHtml = enhancedHtml.replace(
    /<a data-flickr-embed="true"[^>]*>[\s\S]*?<\/a><script[^>]*><\/script>/g,
    (match) => `<div class="media-embed flickr-embed-wrapper">${match}</div>`
  );

  // Add line breaks before and after image containers
  enhancedHtml = enhancedHtml.replace(
    /<div class="media-embed flickr-embed-wrapper">/g,
    '<br><div class="media-embed flickr-embed-wrapper">'
  );

  enhancedHtml = enhancedHtml.replace(
    /<\/div>/g,
    '</div><br>'
  );

  // Clean up multiple consecutive line breaks
  enhancedHtml = enhancedHtml.replace(/<br\s*\/?>\s*<br\s*\/?>/g, '<br>');

  return enhancedHtml;
}
