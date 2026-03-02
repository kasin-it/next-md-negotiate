import { createElement } from 'react';

const DEFAULT_MESSAGE =
  'This page is available as clean Markdown.\n' +
  'Re-request this URL with the header: Accept: text/markdown';

export interface LlmHintProps {
  message?: string;
}

export function LlmHint(props: LlmHintProps) {
  return createElement('script', {
    type: 'text/llms.txt',
    dangerouslySetInnerHTML: { __html: props.message ?? DEFAULT_MESSAGE },
  });
}
