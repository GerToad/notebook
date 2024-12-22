import React, { useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { history } from "prosemirror-history";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import "prosemirror-view/style/prosemirror.css";

const colors = [
  { foreground: "#000000", background: "#FFFFFF" }, // Black on White
  { foreground: "#FFFFFF", background: "#000000" }, // White on Black
  { foreground: "#FF0000", background: "#FFFF00" }, // Red on Yellow
  { foreground: "#0000FF", background: "#00FFFF" }, // Blue on Cyan
];

function createColorDecoration(doc, paletteIndex) {
  const { foreground, background } = colors[paletteIndex % colors.length];
  const decorations = [];

  doc.descendants((node, pos) => {
    if (node.isTextblock) {
      decorations.push(
        Decoration.node(pos, pos + node.nodeSize, {
          style: `color: ${foreground}; background-color: ${background};`,
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

const colorDecorationPlugin = (paletteIndex = 0) =>
  new Plugin({
    state: {
      init(_, { doc }) {
        return createColorDecoration(doc, paletteIndex);
      },
      apply(tr, oldState, oldEditorState, newEditorState) {
        if (tr.docChanged) {
          return createColorDecoration(newEditorState.doc, paletteIndex);
        }
        return oldState;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

const Editor = ({ paletteIndex }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    const plugins = [history(), colorDecorationPlugin(paletteIndex)];

    const state = EditorState.create({
      schema: new Schema({
        nodes: schema.spec.nodes,
        marks: schema.spec.marks,
      }),
      plugins,
    });

    const view = new EditorView(editorRef.current, {
      state,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewRef.current) {
      const state = viewRef.current.state.reconfigure({
        plugins: [
          history(),
          colorDecorationPlugin(paletteIndex),
        ],
      });
      viewRef.current.updateState(state);
    }
  }, [paletteIndex]);

  return (
    <div
      ref={editorRef}
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        minHeight: "200px",
        padding: "10px",
      }}
    ></div>
  );
};

export default Editor;
