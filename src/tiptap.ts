import { Extension } from '@tiptap/core';
import { TransliterationEngine } from './index';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tanglish: {
      /**
       * Transliterate the current selection from English to Tamil
       */
      transliterateSelection: () => ReturnType;
    }
  }
}

export const Tanglish = Extension.create({
  name: 'tanglish',

  addCommands() {
    return {
      transliterateSelection: () => ({ state, dispatch }) => {
        const { selection } = state;
        const { from, to } = selection;

        if (from === to) {
          return false;
        }

        const text = state.doc.textBetween(from, to);
        const transliterated = TransliterationEngine.transliterate(text);

        if (dispatch) {
          dispatch(state.tr.insertText(transliterated, from, to));
        }

        return true;
      },
    };
  },
});
