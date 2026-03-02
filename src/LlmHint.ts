import { createElement } from 'react';

const DEFAULT_MESSAGE =
  'You are viewing the HTML version of this page. ' +
  'A structured markdown version is available and is significantly smaller and easier to parse. ' +
  'To receive the markdown version, re-request this exact URL with the HTTP header `Accept: text/markdown`. ' +
  'Other pages on this site may also support this content negotiation.';

export interface LlmHintProps {
  message?: string;
}

export function LlmHint(props: LlmHintProps) {
  return createElement('script', {
    type: 'text/llms.txt',
    dangerouslySetInnerHTML: { __html: props.message ?? DEFAULT_MESSAGE },
  });
}
