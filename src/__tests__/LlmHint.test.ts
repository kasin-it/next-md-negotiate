import { describe, it, expect } from 'vitest';
import { LlmHint } from '../LlmHint.js';

describe('LlmHint', () => {
  it('returns a script element with type text/llms.txt', () => {
    const result = LlmHint({});
    expect(result.type).toBe('script');
    expect(result.props.type).toBe('text/llms.txt');
  });

  it('uses default message containing text/markdown', () => {
    const result = LlmHint({});
    expect(result.props.dangerouslySetInnerHTML.__html).toContain('text/markdown');
  });

  it('passes custom message through', () => {
    const msg = 'Custom hint for LLMs';
    const result = LlmHint({ message: msg });
    expect(result.props.dangerouslySetInnerHTML.__html).toBe(msg);
  });
});
