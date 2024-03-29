import { html, css, LitElement } from 'lit';

import { HOST_STYLES, FONT_STYLES } from './styles.js';
import { CONTENT } from './content.js';
import { removeLitComments } from './utils.js';

const STYLES = css`
  :host {
    overflow: scroll;
  }

  pre {
    margin: var(--spacer-4);
  }

  @media screen and (min-width: 1500px) {
    pre {
      margin: 0;
    }
  }
`;
const INDENT_SIZE = 4;

export class SourceEditor extends LitElement {
  static get styles() {
    return [HOST_STYLES, FONT_STYLES, STYLES];
  }

  updateSource() {
    const pre = this.renderRoot.querySelector('#source-editor');
    const content = removeLitComments(pre?.innerHTML ?? '');

    let source;
    try {
      source = JSON.parse(content);
    } catch (error) {
      return;
    }

    const event = new CustomEvent('source-changed', {
      detail: {
        source,
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  firstUpdated() {
    this.updateSource();
  }

  render() {
    return html`
      <pre id="source-editor" contenteditable="true" @keyup=${() => this.updateSource()}>
${JSON.stringify(CONTENT, null, INDENT_SIZE)}</pre
      >
    `;
  }
}

customElements.define('source-editor', SourceEditor);
